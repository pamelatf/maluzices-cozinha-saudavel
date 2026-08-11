/**
 * Gera o checklist visual de execução a partir da matriz da entrega.
 *
 * Saída: docs/checklist_vader_cozinha_v3.0.html
 *
 * O arquivo é autossuficiente: abre no navegador sem servidor, sem internet e
 * sem dependência. O progresso, os veredictos e as observações ficam no
 * localStorage do navegador, e saem em CSV pelo botão "Exportar evidências".
 *
 * Uso, a partir da raiz do repositório:
 *
 *   node scripts/gerarChecklist.js
 *
 * Sem dependências. Node 18 ou superior.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');
const CAMINHO_MATRIZ =
  process.env.CAMINHO_MATRIZ || path.join(RAIZ, 'docs', 'matriz_vader_cozinha_v3.0.csv');
const CAMINHO_SAIDA =
  process.env.CAMINHO_SAIDA || path.join(RAIZ, 'docs', 'checklist_vader_cozinha_v3.0.html');

const GRUPOS = {
  AUTH: '/auth/login',
  PEDIDOS: '/pedidos',
  'PEDIDO-ID': '/pedidos/{id}',
  RESUMO: '/pedidos/resumo',
  STATUS: '/pedidos/{id}/status',
  HEALTH: '/health',
  GERAL: 'Todos os endpoints',
  CARGA: 'Carga e concorrência',
};

// ---------------------------------------------------------------------------
// Matriz
// ---------------------------------------------------------------------------

function lerCsv(texto) {
  const semBom = texto.charCodeAt(0) === 0xfeff ? texto.slice(1) : texto;
  const linhas = [];
  let campo = '';
  let linha = [];
  let dentroDeAspas = false;

  for (let i = 0; i < semBom.length; i += 1) {
    const caractere = semBom[i];
    if (dentroDeAspas) {
      if (caractere === '"') {
        if (semBom[i + 1] === '"') {
          campo += '"';
          i += 1;
        } else {
          dentroDeAspas = false;
        }
      } else {
        campo += caractere;
      }
      continue;
    }
    if (caractere === '"') {
      dentroDeAspas = true;
    } else if (caractere === ';') {
      linha.push(campo);
      campo = '';
    } else if (caractere === '\n') {
      linha.push(campo);
      linhas.push(linha);
      linha = [];
      campo = '';
    } else if (caractere !== '\r') {
      campo += caractere;
    }
  }
  if (campo !== '' || linha.length > 0) {
    linha.push(campo);
    linhas.push(linha);
  }

  const cabecalho = linhas.shift().map((c) => c.trim());
  return linhas
    .filter((l) => l.some((c) => c.trim() !== ''))
    .map((l) => Object.fromEntries(cabecalho.map((nome, i) => [nome, (l[i] || '').trim()])));
}

/** Normaliza o método para as classes de cor do CSS. */
function metodoDoCaso(caso) {
  const metodo = (caso['Método'] || '').toUpperCase();
  return ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(metodo) ? metodo : 'OTHER';
}

// ---------------------------------------------------------------------------
// HTML
// ---------------------------------------------------------------------------

/**
 * O JSON vai embutido numa tag script. Sem escapar a sequência `</`, o
 * navegador encerra o bloco antes da hora e a página não renderiza. O
 * JSON.parse aceita o escape normalmente.
 */
function jsonSeguro(valor) {
  return JSON.stringify(valor, null, 0).replace(/<\//g, '<\\/');
}

function montarHtml(casos) {
  const dados = casos.map((caso) => ({
    id: caso.ID,
    grupo: caso.Grupo,
    arquivo: caso['Arquivo previsto'],
    endpoint: caso.Endpoint,
    metodo: metodoDoCaso(caso),
    vader: caso.VADER,
    severidade: caso.Severidade,
    titulo: caso['Título'],
    descricao: caso['Descrição'],
    acao: caso['Ação'],
    dadosEntrada: caso.Dados,
    esperado: caso['Resultado esperado'],
    lacuna: caso['Lacuna de contrato'],
    pendencia: caso['Pendência'],
    nota: caso.Nota,
    comando: caso.Comando,
    veredictoCi: caso.Veredicto,
    observacaoCi: caso['Observações da execução'],
  }));

  const total = dados.length;
  const criticos = dados.filter((c) => c.severidade === 'Crítica').length;
  const executados = dados.filter((c) => c.veredictoCi).length;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Checklist VADER · API de Pedidos da Cozinha de Comida Saudável</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f1117;
    --surface: #181c27;
    --surface2: #1e2336;
    --border: #2a3050;
    --accent: #5b8dee;
    --green: #3ecf8e;
    --yellow: #f5a623;
    --red: #e85b5b;
    --text: #e2e8f0;
    --text-muted: #6b7fa3;
    --text-dim: #8899bb;
    --mono: 'JetBrains Mono', monospace;
    --sans: 'Inter', sans-serif;
    --radius: 8px;
  }

  body {
    font-family: var(--sans);
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    padding: 24px 16px 60px;
  }

  header {
    max-width: 980px;
    margin: 0 auto 32px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 24px;
  }

  .header-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .logo {
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.15em;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  h1 { font-size: 22px; font-weight: 600; line-height: 1.2; }
  h1 span { color: var(--text-muted); font-weight: 400; }

  /* Largura travada: sem isso o rótulo do filtro alarga o bloco, o cabeçalho
     estoura os 980px e o contador cai para baixo do título. */
  .progress-block { text-align: right; flex-shrink: 0; max-width: 210px; }
  .progress-count {
    font-family: var(--mono);
    font-size: 28px;
    font-weight: 600;
    color: var(--green);
    line-height: 1;
  }
  .progress-label { font-size: 11px; color: var(--text-muted); margin-top: 2px; letter-spacing: 0.05em; line-height: 1.5; }
  .filtro-ativo { display: block; color: var(--accent); }

  .progress-bar-wrap {
    margin-top: 16px;
    background: var(--surface2);
    border-radius: 4px;
    height: 6px;
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--green));
    border-radius: 4px;
    transition: width 0.4s ease;
    width: 0%;
  }

  .stats-wrap { margin-top: 18px; display: flex; flex-direction: column; gap: 10px; }
  .stats-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
  .stats-title {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.12em;
    color: var(--text-muted);
    text-transform: uppercase;
    width: 74px;
    flex-shrink: 0;
  }
  .cat-stat { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-muted); }
  .cat-dot { width: 8px; height: 8px; border-radius: 50%; }

  .controls { display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; align-items: center; }

  .btn {
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 500;
    padding: 7px 14px;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--text-dim);
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn:hover { background: var(--border); color: var(--text); }
  .btn.danger { border-color: #3a1e1e; color: var(--red); }
  .btn.danger:hover { background: #2a1010; }
  .btn.primary { border-color: #1a3555; color: var(--accent); }
  .btn.primary:hover { background: #0d1e35; }

  .filter-group { display: flex; gap: 6px; flex-wrap: wrap; margin-left: auto; }
  .filter-btn {
    font-size: 11px;
    font-weight: 500;
    padding: 5px 12px;
    border-radius: 20px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    font-family: var(--sans);
    transition: all 0.15s;
  }
  .filter-btn:hover { border-color: var(--accent); color: var(--accent); }
  .filter-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }

  .main { max-width: 980px; margin: 0 auto; }

  .file-section {
    margin-bottom: 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .file-section:hover { border-color: #3a4570; }

  .file-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: var(--surface);
    cursor: pointer;
    user-select: none;
    transition: background 0.15s;
  }
  .file-header:hover { background: var(--surface2); }
  .file-path { font-family: var(--mono); font-size: 13px; font-weight: 600; color: var(--accent); flex: 1; }
  .file-desc { font-size: 11px; color: var(--text-muted); }
  .file-count { font-family: var(--mono); font-size: 11px; color: var(--text-muted); white-space: nowrap; }
  .file-progress { font-family: var(--mono); font-size: 11px; color: var(--green); white-space: nowrap; }
  .file-chevron { color: var(--text-muted); font-size: 12px; transition: transform 0.2s; }
  .file-section.open .file-chevron { transform: rotate(90deg); }

  .file-body { display: none; border-top: 1px solid var(--border); }
  .file-section.open .file-body { display: block; }

  .case-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
    cursor: pointer;
  }
  .case-item:last-child { border-bottom: none; }
  .case-item:hover { background: var(--surface2); }
  .case-item.done { background: #0d1a14; }
  .case-item.done:hover { background: #0f1f18; }
  .case-item.hidden { display: none; }
  .file-section.hidden { display: none; }
  .vazio {
    max-width: 980px;
    margin: 0 auto;
    padding: 40px 16px;
    text-align: center;
    color: var(--text-muted);
    font-size: 13px;
  }
  .vazio.hidden { display: none; }

  .case-check {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 2px solid var(--border);
    flex-shrink: 0;
    margin-top: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }
  .case-item.done .case-check { background: var(--green); border-color: var(--green); }
  .case-check-tick { display: none; color: #0d1a14; font-size: 11px; font-weight: 700; }
  .case-item.done .case-check-tick { display: block; }

  .case-content { flex: 1; min-width: 0; }
  .case-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 5px; }
  .case-id { font-family: var(--mono); font-size: 10px; font-weight: 600; color: var(--text-dim); flex-shrink: 0; }

  .method-badge {
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 4px;
    flex-shrink: 0;
  }
  .method-GET    { background: #0d2e1a; color: #3ecf8e; border: 1px solid #1a4a2e; }
  .method-POST   { background: #1a2a0d; color: #9ecf3e; border: 1px solid #2e4a1a; }
  .method-PUT    { background: #2a1a0d; color: #cfac3e; border: 1px solid #4a2e1a; }
  .method-DELETE { background: #2a0d0d; color: #cf5b5b; border: 1px solid #4a1a1a; }
  .method-PATCH  { background: #1a0d2a; color: #a05bcf; border: 1px solid #2e1a4a; }
  .method-OTHER  { background: #1a1a2a; color: #7b8ec4; border: 1px solid #2a2a4a; }

  .heur-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 10px;
    flex-shrink: 0;
    font-family: var(--mono);
  }
  .vader-V { background: #0d1e35; color: #5b8dee; border: 1px solid #1a3555; }
  .vader-A { background: #2a1a0a; color: #e8a85b; border: 1px solid #4a2a10; }
  .vader-D { background: #0a1a2a; color: #5bc8e8; border: 1px solid #103a4a; }
  .vader-E { background: #2a0a0a; color: #e85b5b; border: 1px solid #4a1010; }
  .vader-R { background: #0a2a0a; color: #5be888; border: 1px solid #104a20; }

  .sev-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 10px;
    flex-shrink: 0;
  }
  .sev-Critica { background: #2a0a10; color: #f07c95; border: 1px solid #4a1020; }
  .sev-Alta    { background: #2a170d; color: #e8975b; border: 1px solid #4a2a1a; }
  .sev-Media   { background: #2a220a; color: var(--yellow); border: 1px solid #4a3a10; }

  .ci-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 10px;
    flex-shrink: 0;
    font-family: var(--mono);
  }
  .ci-Passou { background: #0d2e1a; color: var(--green); border: 1px solid #1a4a2e; }
  .ci-Falhou { background: #2a0d0d; color: var(--red); border: 1px solid #4a1a1a; }

  .pend-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 10px;
    background: #2a220a;
    color: var(--yellow);
    border: 1px solid #4a3a10;
    flex-shrink: 0;
  }

  .case-title { font-size: 13px; font-weight: 500; color: var(--text); line-height: 1.4; }
  .case-item.done .case-title { color: var(--text-muted); text-decoration: line-through; }

  .case-details {
    display: none;
    margin-top: 10px;
    padding: 12px;
    background: var(--bg);
    border-radius: 6px;
    border: 1px solid var(--border);
  }
  .case-item.expanded .case-details { display: block; }

  .detail-row {
    display: grid;
    grid-template-columns: 118px 1fr;
    gap: 6px 12px;
    margin-bottom: 8px;
    align-items: start;
  }
  .detail-row:last-child { margin-bottom: 0; }
  .detail-label {
    font-size: 10px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding-top: 1px;
  }
  .detail-value { font-size: 12px; color: var(--text-dim); line-height: 1.5; }
  .detail-value code {
    font-family: var(--mono);
    font-size: 11px;
    background: var(--surface2);
    padding: 2px 6px;
    border-radius: 4px;
    color: var(--accent);
    display: inline-block;
  }
  .detail-value.warn { color: var(--yellow); }

  .result-input {
    width: 100%;
    min-height: 44px;
    resize: vertical;
    font-family: var(--sans);
    font-size: 12px;
    line-height: 1.5;
    color: var(--text);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 7px 9px;
    transition: border-color 0.15s;
  }
  .result-input:focus { outline: none; border-color: var(--accent); }
  .result-input::placeholder { color: var(--text-muted); }

  .verdict-group { display: flex; gap: 6px; flex-wrap: wrap; }
  .verdict-btn {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    font-family: var(--sans);
  }
  .verdict-btn:hover { border-color: var(--text-dim); color: var(--text); }
  .verdict-btn.sel-passou { background: #0d2e1a; border-color: #1a4a2e; color: var(--green); }
  .verdict-btn.sel-falhou { background: #2a0d0d; border-color: #4a1a1a; color: var(--red); }
  .verdict-btn.sel-lacuna { background: #2a220a; border-color: #4a3a10; color: var(--yellow); }
  .verdict-btn.sel-bloqueado { background: #1a1a2a; border-color: #2a2a4a; color: var(--text-dim); }

  .result-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #7c5be8;
    flex-shrink: 0;
    display: none;
  }
  .case-item.has-result .result-dot { display: inline-block; }

  .expand-hint { font-size: 10px; color: var(--text-muted); margin-top: 4px; opacity: 0.6; }
  .case-item.expanded .expand-hint { display: none; }

  .saved-notice {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--green);
    color: #0d1a14;
    font-size: 11px;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 6px;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }
  .saved-notice.show { opacity: 1; }

  footer {
    max-width: 980px;
    margin: 32px auto 0;
    padding-top: 20px;
    border-top: 1px solid var(--border);
    font-size: 11px;
    color: var(--text-muted);
    line-height: 1.7;
  }
</style>
</head>
<body>

<header>
  <div class="header-top">
    <div>
      <div class="logo">VADER · escopo da entrega</div>
      <h1>API de Pedidos da Cozinha de Comida Saudável <span>/ Checklist de execução</span></h1>
    </div>
    <div class="progress-block">
      <div class="progress-count" id="prog-count">0/${total}</div>
      <div class="progress-label" id="prog-label">casos validados</div>
    </div>
  </div>

  <div class="progress-bar-wrap"><div class="progress-bar-fill" id="prog-bar"></div></div>

  <div class="stats-wrap">
    <div class="stats-row"><span class="stats-title">VADER</span><span id="stats-vader" style="display:flex;gap:10px;flex-wrap:wrap"></span></div>
    <div class="stats-row"><span class="stats-title">Severidade</span><span id="stats-sev" style="display:flex;gap:10px;flex-wrap:wrap"></span></div>
  </div>

  <div class="controls">
    <button class="btn" onclick="expandAll()">Expandir tudo</button>
    <button class="btn" onclick="collapseAll()">Recolher tudo</button>
    <button class="btn primary" onclick="exportarCsv()">Exportar evidências</button>
    <button class="btn danger" onclick="confirmReset()">Zerar progresso</button>
    <div class="filter-group">
      <button class="filter-btn active" data-filtro="all" onclick="setFilter('all')">Todos</button>
      <button class="filter-btn" data-filtro="pending" onclick="setFilter('pending')">Pendentes</button>
      <button class="filter-btn" data-filtro="done" onclick="setFilter('done')">Feitos</button>
      <button class="filter-btn" data-filtro="critica" onclick="setFilter('critica')">Críticos</button>
      <button class="filter-btn" data-filtro="automatizado" onclick="setFilter('automatizado')">Automatizados</button>
      <button class="filter-btn" data-filtro="blocked" onclick="setFilter('blocked')">Bloqueados</button>
    </div>
  </div>
</header>

<main class="main" id="main"></main>
<div class="vazio hidden" id="vazio"></div>

<footer>
  ${total} casos do escopo da entrega, sendo ${criticos} de severidade Crítica, derivados da heurística VADER a partir do contrato openapi.yaml 2.1.0.
  ${executados} já foram executados no workflow de integração contínua, e o veredicto de cada um aparece no cartão.
  Gerado por scripts/gerarChecklist.js a partir de docs/matriz_vader_cozinha_v3.0.csv. Os 30 casos fora do recorte estão em docs/backlog_pos_entrega.csv.
  O progresso, os veredictos e as observações ficam salvos apenas neste navegador.
</footer>

<div class="saved-notice" id="saved-notice">Salvo</div>

<script id="dados" type="application/json">
${jsonSeguro(dados)}
</script>

<script>
const DATA = JSON.parse(document.getElementById('dados').textContent);
const TOTAL = DATA.length;

const STORAGE_KEY = 'cozinha_vader_done';
const RESULTS_KEY = 'cozinha_vader_results';
const VERDICT_KEY = 'cozinha_vader_verdicts';

const VADER_COLORS = { V: '#5b8dee', A: '#e8a85b', D: '#5bc8e8', E: '#e85b5b', R: '#5be888' };
const VADER_LABELS = { V: 'V Verbo', A: 'A Auth', D: 'D Dados', E: 'E Erros', R: 'R Respostas' };
const SEV_COLORS = { 'Crítica': '#f07c95', 'Alta': '#e8975b', 'Média': '#f5a623' };
const VERDICTS = ['Passou', 'Falhou', 'Lacuna', 'Bloqueado'];

function ler(chave, padrao) {
  try { return JSON.parse(localStorage.getItem(chave) || padrao); }
  catch (e) { return JSON.parse(padrao); }
}
function gravar(chave, valor) {
  try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) { /* modo privado */ }
}

let done = new Set(ler(STORAGE_KEY, '[]'));
let results = ler(RESULTS_KEY, '{}');
let verdicts = ler(VERDICT_KEY, '{}');
/**
 * Os filtros se acumulam e valem juntos: com "críticos" e "automatizados"
 * ligados, sobra a interseção dos dois. Conjunto vazio significa sem filtro.
 */
let filtrosAtivos = new Set();

const FILTRO_ROTULOS = {
  pending: 'pendentes',
  done: 'feitos',
  critica: 'críticos',
  automatizado: 'automatizados',
  blocked: 'bloqueados',
};

/**
 * Filtros que respondem à mesma pergunta e não podem valer ao mesmo tempo.
 * Um caso é feito ou pendente; ligar os dois devolveria lista vazia sempre,
 * então ligar um desliga o outro em vez de zerar a tela.
 */
const EXCLUSIVOS = [['pending', 'done']];

function aviso() {
  const n = document.getElementById('saved-notice');
  n.classList.add('show');
  clearTimeout(n._t);
  n._t = setTimeout(() => n.classList.remove('show'), 1200);
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function idSeguro(texto) { return String(texto).replace(/[^a-zA-Z0-9]/g, '_'); }
function semAcento(texto) { return String(texto || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); }

function saveResult(id, textarea) {
  const valor = textarea.value;
  if (valor && valor.trim()) results[id] = valor; else delete results[id];
  gravar(RESULTS_KEY, results);
  textarea.closest('.case-item').classList.toggle('has-result', !!(valor && valor.trim()));
  aviso();
}

function setVerdict(id, valor, botao) {
  if (verdicts[id] === valor) delete verdicts[id]; else verdicts[id] = valor;
  gravar(VERDICT_KEY, verdicts);
  botao.parentElement.querySelectorAll('.verdict-btn').forEach((b) => {
    b.className = 'verdict-btn' + (verdicts[id] === b.dataset.valor ? ' sel-' + b.dataset.valor.toLowerCase() : '');
  });
  aviso();
}

function toggleCase(id, el) {
  if (done.has(id)) done.delete(id); else done.add(id);
  el.classList.toggle('done', done.has(id));
  gravar(STORAGE_KEY, [...done]);
  aviso();
  updateProgress();
}

function toggleDetails(el, e) {
  if (e.target.closest('.case-check') || e.target.closest('.verdict-btn') || e.target.tagName === 'TEXTAREA') return;
  el.classList.toggle('expanded');
}

function expandAll() { document.querySelectorAll('.file-section').forEach((e) => e.classList.add('open')); }
function collapseAll() { document.querySelectorAll('.file-section').forEach((e) => e.classList.remove('open')); }

function setFilter(f) {
  if (f === 'all') {
    filtrosAtivos.clear();
  } else if (filtrosAtivos.has(f)) {
    filtrosAtivos.delete(f);
  } else {
    for (const par of EXCLUSIVOS) {
      if (par.includes(f)) par.forEach((outro) => filtrosAtivos.delete(outro));
    }
    filtrosAtivos.add(f);
  }

  document.querySelectorAll('.filter-btn').forEach((b) => {
    const alvo = b.dataset.filtro;
    const ligado = alvo === 'all' ? filtrosAtivos.size === 0 : filtrosAtivos.has(alvo);
    b.classList.toggle('active', ligado);
  });

  updateProgress();
}

/**
 * Único lugar que decide se um caso entra no filtro. O DOM e os totalizadores
 * leem daqui, senão a lista mostra um recorte e os números mostram outro.
 */
function noFiltro(caso, f) {
  const feito = done.has(caso.id);
  if (f === 'done') return feito;
  if (f === 'pending') return !feito;
  if (f === 'blocked') return !!caso.pendencia;
  if (f === 'critica') return caso.severidade === 'Crítica';
  if (f === 'automatizado') return !!caso.veredictoCi;
  return true;
}

function visiveis() {
  return DATA.filter((c) => [...filtrosAtivos].every((f) => noFiltro(c, f)));
}

function applyFilter() {
  const dentro = new Set(visiveis().map((c) => c.id));
  document.querySelectorAll('.case-item').forEach((el) => {
    el.classList.toggle('hidden', !dentro.has(el.dataset.id));
  });
  // Grupo sem nenhum caso no filtro sai da tela inteiro, em vez de virar um
  // cabeçalho vazio anunciando "0 casos".
  document.querySelectorAll('.file-section').forEach((secao) => {
    const total = secao.querySelectorAll('.case-item').length;
    const ocultos = secao.querySelectorAll('.case-item.hidden').length;
    secao.classList.toggle('hidden', total > 0 && total === ocultos);
  });
}

function updateProgress() {
  // Tudo abaixo é contado sobre o recorte do filtro, não sobre a matriz
  // inteira. Com "Críticos" ligado, 0/24 quer dizer nenhum dos 24 críticos,
  // e o rótulo diz qual recorte está valendo para o número não ser lido
  // como se a matriz tivesse encolhido.
  const dentro = visiveis();
  const count = dentro.filter((c) => done.has(c.id)).length;
  const total = dentro.length;

  document.getElementById('prog-count').textContent = count + '/' + total;
  document.getElementById('prog-bar').style.width =
    (total === 0 ? 0 : count / total * 100).toFixed(1) + '%';
  // A ordem é a dos botões, e não a ordem em que foram clicados, para o
  // rótulo ler igual sempre que a mesma combinação estiver ligada.
  const rotulos = Object.keys(FILTRO_ROTULOS)
    .filter((f) => filtrosAtivos.has(f))
    .map((f) => FILTRO_ROTULOS[f]);
  document.getElementById('prog-label').innerHTML = rotulos.length === 0
    ? 'casos validados'
    : 'casos validados<span class="filtro-ativo">' + rotulos.join(' + ') + '</span>';

  // Sem nenhum caso no recorte, as duas linhas de estatística ficariam só
  // com os títulos VADER e SEVERIDADE e nenhum número ao lado, parecendo
  // defeito. Somem junto com a lista.
  const estatisticas = document.querySelector('.stats-wrap');
  if (estatisticas) estatisticas.style.display = total === 0 ? 'none' : '';

  const vazio = document.getElementById('vazio');
  if (vazio) {
    vazio.classList.toggle('hidden', total > 0);
    vazio.textContent = 'Nenhum caso combina com ' + (rotulos.length > 1
      ? 'a combinação ' + rotulos.join(' + ') + '.'
      : 'este filtro.');
  }

  const montar = (campo, cores, rotulos, alvo) => {
    const feitos = {}; const totais = {};
    dentro.forEach((c) => {
      const chave = c[campo];
      if (!chave) return;
      totais[chave] = (totais[chave] || 0) + 1;
      if (done.has(c.id)) feitos[chave] = (feitos[chave] || 0) + 1;
    });
    document.getElementById(alvo).innerHTML = Object.keys(rotulos)
      .filter((l) => totais[l])
      .map((l) => '<span class="cat-stat"><span class="cat-dot" style="background:' + cores[l] + '"></span>'
        + '<span style="color:' + cores[l] + '">' + rotulos[l] + '</span>'
        + '<span>&nbsp;' + (feitos[l] || 0) + '/' + totais[l] + '</span></span>')
      .join('');
  };

  montar('vader', VADER_COLORS, VADER_LABELS, 'stats-vader');
  montar('severidade', SEV_COLORS, { 'Crítica': 'Crítica', 'Alta': 'Alta', 'Média': 'Média' }, 'stats-sev');

  gruposOrdenados().forEach((grupo) => {
    const casos = dentro.filter((c) => c.grupo === grupo);
    const feitos = casos.filter((c) => done.has(c.id)).length;
    const chave = idSeguro(grupo);

    const contador = document.getElementById('cont-' + chave);
    if (contador) contador.textContent = casos.length + (casos.length === 1 ? ' caso' : ' casos');

    const el = document.getElementById('prog-' + chave);
    if (el) {
      el.textContent = casos.length > 0 && feitos === casos.length
        ? 'Completo'
        : feitos + '/' + casos.length;
    }
  });

  applyFilter();
}

function confirmReset() {
  if (!confirm('Zerar todo o progresso, os veredictos e as observações registradas? Essa ação não pode ser desfeita.')) return;
  done.clear(); results = {}; verdicts = {};
  gravar(STORAGE_KEY, []); gravar(RESULTS_KEY, {}); gravar(VERDICT_KEY, {});
  render();
}

function exportarCsv() {
  const cabecalho = ['id', 'grupo', 'arquivo', 'endpoint', 'metodo', 'vader', 'severidade', 'titulo',
    'veredicto_ci', 'validado', 'veredicto', 'observado'];
  const escapar = (v) => {
    const texto = String(v == null ? '' : v);
    return /[;"\\n]/.test(texto) ? '"' + texto.replace(/"/g, '""') + '"' : texto;
  };
  const linhas = DATA.map((c) => [
    c.id, c.grupo, c.arquivo, c.endpoint, c.metodo, c.vader, c.severidade, c.titulo,
    c.veredictoCi || '',
    done.has(c.id) ? 'sim' : 'nao',
    verdicts[c.id] || '',
    results[c.id] || ''
  ].map(escapar).join(';'));

  const conteudo = '\\uFEFF' + [cabecalho.join(';'), ...linhas].join('\\r\\n');
  const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'evidencias_execucao_cozinha.csv';
  link.click();
  URL.revokeObjectURL(link.href);
}

const GRUPOS = ${jsonSeguro(GRUPOS)};

/**
 * A ordem das seções é a da declaração de GRUPOS, que segue o caminho do
 * endpoint, e não a ordem em que os grupos aparecem na matriz. Grupo que
 * apareça na matriz sem estar declarado vai para o fim, em vez de sumir.
 */
function gruposOrdenados() {
  const presentes = new Set(DATA.map((c) => c.grupo));
  return Object.keys(GRUPOS).filter((g) => presentes.has(g))
    .concat([...presentes].filter((g) => !Object.prototype.hasOwnProperty.call(GRUPOS, g)));
}

function render() {
  const main = document.getElementById('main');
  main.innerHTML = '';

  gruposOrdenados().forEach((grupo) => {
    const casos = DATA.filter((c) => c.grupo === grupo);
    const chave = idSeguro(grupo);

    const secao = document.createElement('div');
    secao.className = 'file-section';
    secao.innerHTML =
      '<div class="file-header" onclick="this.parentElement.classList.toggle(\\'open\\')">'
      + '<span class="file-path">' + escapeHtml(grupo) + '</span>'
      + '<span class="file-desc">' + escapeHtml(GRUPOS[grupo] || '') + '</span>'
      + '<span class="file-count" id="cont-' + chave + '">' + casos.length + ' casos</span>'
      + '<span class="file-progress" id="prog-' + chave + '">0/' + casos.length + '</span>'
      + '<span class="file-chevron">&#9654;</span>'
      + '</div><div class="file-body"></div>';

    const corpo = secao.querySelector('.file-body');

    casos.forEach((c) => {
      const feito = done.has(c.id);
      const temResultado = !!(results[c.id] && results[c.id].trim());
      const bloqueado = !!c.pendencia;

      const item = document.createElement('div');
      item.className = 'case-item' + (feito ? ' done' : '') + (temResultado ? ' has-result' : '');
      item.dataset.id = c.id;
      item.dataset.blocked = bloqueado ? '1' : '0';
      item.dataset.severidade = c.severidade;
      item.dataset.ci = c.veredictoCi || '';

      const linha = (rotulo, valor, classe) => valor
        ? '<div class="detail-row"><span class="detail-label">' + rotulo + '</span>'
          + '<span class="detail-value' + (classe ? ' ' + classe : '') + '">' + valor + '</span></div>'
        : '';

      const botoes = VERDICTS.map((v) => {
        const sel = verdicts[c.id] === v ? ' sel-' + v.toLowerCase() : '';
        return '<button class="verdict-btn' + sel + '" data-valor="' + v + '" '
          + 'onclick="event.stopPropagation(); setVerdict(\\'' + c.id + '\\', \\'' + v + '\\', this)">' + v + '</button>';
      }).join('');

      item.innerHTML =
        '<div class="case-check" onclick="event.stopPropagation(); toggleCase(\\'' + c.id + '\\', this.closest(\\'.case-item\\'))">'
        + '<span class="case-check-tick">&#10003;</span></div>'
        + '<div class="case-content">'
        + '<div class="case-top">'
        + '<span class="case-id">' + c.id + '</span>'
        + '<span class="method-badge method-' + c.metodo + '">' + (c.metodo === 'OTHER' ? 'VÁRIOS' : c.metodo) + '</span>'
        + (c.vader ? '<span class="heur-badge vader-' + c.vader + '" title="VADER">' + c.vader + '</span>' : '')
        + '<span class="sev-badge sev-' + semAcento(c.severidade) + '">' + c.severidade + '</span>'
        + (c.veredictoCi ? '<span class="ci-badge ci-' + c.veredictoCi + '" title="Última execução no CI">CI ' + c.veredictoCi + '</span>' : '')
        + (bloqueado ? '<span class="pend-badge">bloqueado</span>' : '')
        + '<span class="result-dot" title="Observação registrada"></span>'
        + '<span class="case-title">' + escapeHtml(c.titulo) + '</span>'
        + '</div>'
        + '<div class="case-details">'
        + linha('Endpoint', '<code>' + escapeHtml(c.endpoint) + '</code>')
        + linha('Arquivo', '<code>' + escapeHtml(c.arquivo) + '</code>')
        + linha('Descrição', escapeHtml(c.descricao))
        + linha('Ação', escapeHtml(c.acao))
        + linha('Dados', '<code>' + escapeHtml(c.dadosEntrada) + '</code>')
        + linha('Esperado', escapeHtml(c.esperado))
        + linha('Lacuna', escapeHtml(c.lacuna), 'warn')
        + linha('Pendência', escapeHtml(c.pendencia), 'warn')
        + linha('Nota', escapeHtml(c.nota))
        + linha('Última execução', c.veredictoCi ? escapeHtml(c.veredictoCi + '. ' + (c.observacaoCi || '')) : '')
        + linha('Comando', '<code>' + escapeHtml(c.comando) + '</code>')
        + '<div class="detail-row"><span class="detail-label">Veredicto</span>'
        + '<span class="detail-value"><span class="verdict-group">' + botoes + '</span></span></div>'
        + '<div class="detail-row"><span class="detail-label">Obtido</span>'
        + '<span class="detail-value"><textarea class="result-input" placeholder="Registre o status e o corpo observados na execução deste caso..." '
        + 'onclick="event.stopPropagation()" oninput="saveResult(\\'' + c.id + '\\', this)">'
        + escapeHtml(results[c.id] || '') + '</textarea></span></div>'
        + '</div>'
        + '<div class="expand-hint">Clique para ver detalhes</div>'
        + '</div>';

      item.addEventListener('click', (e) => toggleDetails(item, e));
      corpo.appendChild(item);
    });

    main.appendChild(secao);
  });

  updateProgress();
}

render();
</script>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Execução
// ---------------------------------------------------------------------------

function principal() {
  if (!fs.existsSync(CAMINHO_MATRIZ)) {
    console.error(`Matriz não encontrada em ${CAMINHO_MATRIZ}.`);
    process.exit(1);
  }

  const casos = lerCsv(fs.readFileSync(CAMINHO_MATRIZ, 'utf8'));
  fs.writeFileSync(CAMINHO_SAIDA, montarHtml(casos), 'utf8');

  const porGrupo = casos.reduce((acc, c) => ({ ...acc, [c.Grupo]: (acc[c.Grupo] || 0) + 1 }), {});
  console.log(`${casos.length} casos lidos de ${path.basename(CAMINHO_MATRIZ)}.`);
  console.log(`Grupos: ${Object.entries(porGrupo).map(([g, n]) => `${g} ${n}`).join(', ')}.`);
  console.log(`Com veredicto do CI: ${casos.filter((c) => c.Veredicto).length}.`);
  console.log(`Gerado: ${CAMINHO_SAIDA}`);
}

principal();
