/**
 * Recria os rótulos das issues de caso depois da transferência entre
 * repositórios.
 *
 * A transferência do GitHub **descarta** os rótulos que não existem no
 * repositório de destino, em vez de criá-los. Como o repositório da aplicação
 * não tinha rótulo nenhum além dos nove padrão, as 126 issues de caso
 * chegaram lá sem severidade, sem letra VADER e sem a marca de backlog.
 *
 * Nada disso se perdeu, porque o rótulo nunca foi a fonte: a severidade e a
 * letra VADER de cada caso estão na matriz, o recorte de backlog está no
 * backlog_pos_entrega.csv, e o cards-criados.json liga cada caso ao número da
 * issue. Este script refaz os rótulos a partir dos três.
 *
 * Duas fases, ambas em simulação até você acrescentar --executar:
 *
 *   node scripts/restaurarRotulos.js --criar
 *       Cria os dez rótulos com a cor e a descrição originais.
 *
 *   node scripts/restaurarRotulos.js --aplicar
 *       Aplica em cada issue os rótulos que ela deveria ter.
 *
 * Sem fase indicada, roda as duas, nesta ordem.
 *
 * O script confere os rótulos atuais de cada issue antes de agir e pula as que
 * já estão certas, então pode ser interrompido e rodado de novo.
 *
 * O que ele não faz: os rótulos das suas quatro issues de defeito, como
 * seguranca, contrato e prioridade. Esses não derivam de nenhum arquivo, e
 * qual issue levava qual só você sabe. São quatro, e o script lista os
 * números delas no fim para você reaplicar à mão.
 *
 * Pré-requisitos: gh instalado e autenticado, Node 18 ou superior.
 *
 *   CAMINHO_CARDS=/c/projetos/maluzices-cozinha-saudavel.wiki/cards-criados.json \
 *     node scripts/restaurarRotulos.js
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

// ---------------------------------------------------------------------------
// Configuração
// ---------------------------------------------------------------------------

const REPOSITORIO = process.env.REPOSITORIO || 'pamelatf/maluzices-cozinha-saudavel';
const RAIZ = path.join(__dirname, '..');

const CAMINHO_MATRIZ =
  process.env.CAMINHO_MATRIZ || path.join(RAIZ, 'docs', 'matriz_vader_cozinha_v3.0.csv');
const CAMINHO_BACKLOG =
  process.env.CAMINHO_BACKLOG || path.join(RAIZ, 'docs', 'backlog_pos_entrega.csv');
const CAMINHO_CARDS =
  process.env.CAMINHO_CARDS || path.join(RAIZ, 'docs', 'cards-criados.json');

const PAUSA_MS = Number(process.env.PAUSA_MS || 700);

const argumentos = process.argv.slice(2);
const EXECUTAR = argumentos.includes('--executar');

const fases = {
  criar: argumentos.includes('--criar'),
  aplicar: argumentos.includes('--aplicar'),
};
if (!fases.criar && !fases.aplicar) {
  fases.criar = true;
  fases.aplicar = true;
}

const ROTULO_BACKLOG = 'backlog pós-entrega';

/** Cor e descrição de cada rótulo, iguais às do repositório antigo. */
const DEFINICOES = [
  { nome: 'severidade: Crítica', cor: 'b60205', descricao: 'Severidade Crítica' },
  { nome: 'severidade: Alta', cor: 'd93f0b', descricao: 'Severidade Alta' },
  { nome: 'severidade: Média', cor: 'fbca04', descricao: 'Severidade Média' },
  { nome: 'severidade: Baixa', cor: 'c2e0c6', descricao: 'Severidade Baixa' },
  { nome: 'VADER: V', cor: '1d76db', descricao: 'VADER V — Verbo HTTP' },
  { nome: 'VADER: A', cor: '1d76db', descricao: 'VADER A — Autenticação e autorização' },
  { nome: 'VADER: D', cor: '1d76db', descricao: 'VADER D — Dados de entrada' },
  { nome: 'VADER: E', cor: '1d76db', descricao: 'VADER E — Erros e exceções' },
  { nome: 'VADER: R', cor: '1d76db', descricao: 'VADER R — Resposta e contrato' },
  {
    nome: ROTULO_BACKLOG,
    cor: '5319e7',
    descricao: 'Caso fora do escopo da entrega de 15/08, retomado depois',
  },
];

// ---------------------------------------------------------------------------
// CSV
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

function exigir(caminho, descricao) {
  if (!caminho || !fs.existsSync(caminho)) {
    console.error(`${descricao} não encontrado: ${caminho || '(não informado)'}`);
    process.exit(1);
  }
  return caminho;
}

// ---------------------------------------------------------------------------
// gh
// ---------------------------------------------------------------------------

function gh(args, silencioso = false) {
  const erro = silencioso === 'capturar' ? 'pipe' : silencioso ? 'ignore' : 'inherit';
  return execFileSync('gh', args, {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    stdio: ['ignore', 'pipe', erro],
  }).trim();
}

function esperar(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function verIssue(numero) {
  try {
    return JSON.parse(
      gh(['issue', 'view', String(numero), '--repo', REPOSITORIO, '--json', 'number,title,labels'], true),
    );
  } catch {
    return null;
  }
}

function conferirAmbiente() {
  try {
    gh(['auth', 'status'], true);
  } catch {
    const mensagem = 'GitHub CLI ausente ou não autenticado. Rode gh auth login.';
    if (EXECUTAR) {
      throw new Error(mensagem);
    }
    console.warn(`Aviso: ${mensagem}\n`);
  }
}

// ---------------------------------------------------------------------------
// Que rótulos cada caso deveria ter
// ---------------------------------------------------------------------------

/**
 * O cards-criados.json é indexado pelo identificador original, no formato
 * CRIT-NN.N, enquanto as planilhas usam o identificador atual e guardam os
 * anteriores numa coluna. A ligação entre os dois é feita por essa coluna.
 */
function montarAlvos(matriz, backlog, cards) {
  const alvos = [];
  const semIssue = [];

  const registrar = (linhas, colunaAnterior, doBacklog) => {
    for (const caso of linhas) {
      const identificadores = [
        caso.ID,
        ...(caso[colunaAnterior] || '').split(',').map((p) => p.trim()).filter(Boolean),
      ];
      const chave = identificadores.find((id) => cards[id]);
      if (!chave) {
        semIssue.push(caso.ID);
        continue;
      }

      const rotulos = [];
      if (caso.Severidade) {
        rotulos.push(`severidade: ${caso.Severidade}`);
      }
      if (caso.VADER) {
        rotulos.push(`VADER: ${caso.VADER}`);
      }
      if (doBacklog) {
        rotulos.push(ROTULO_BACKLOG);
      }

      alvos.push({ id: caso.ID, numero: cards[chave].numero, rotulos });
    }
  };

  registrar(matriz, 'ID anterior', false);
  registrar(backlog, 'Origem', true);

  if (semIssue.length > 0) {
    console.warn(`Aviso: sem issue conhecida para ${semIssue.length} casos: ${semIssue.slice(0, 6).join(', ')}`);
  }
  alvos.sort((a, b) => a.numero - b.numero);
  return alvos;
}

// ---------------------------------------------------------------------------
// Fases
// ---------------------------------------------------------------------------

function faseCriar() {
  console.log('Rótulos:');

  if (!EXECUTAR) {
    for (const def of DEFINICOES) {
      console.log(`  [simulação] ${def.nome.padEnd(22)} #${def.cor}`);
    }
    return;
  }

  let criados = 0;
  for (const def of DEFINICOES) {
    try {
      // --force cria ou atualiza, então serve tanto para o rótulo que não
      // existe quanto para o que existe com a cor errada.
      gh([
        'label', 'create', def.nome,
        '--repo', REPOSITORIO,
        '--color', def.cor,
        '--description', def.descricao,
        '--force',
      ], true);
      criados += 1;
      console.log(`  ${def.nome}`);
    } catch (erro) {
      console.warn(`  falhou em ${def.nome}: ${(erro.stderr || erro.message).toString().split('\n')[0]}`);
    }
  }
  console.log(`  ${criados} de ${DEFINICOES.length} no lugar.`);
}

function faseAplicar(alvos) {
  console.log(`\nRótulos por issue (${alvos.length} casos):`);

  if (!EXECUTAR) {
    for (const alvo of alvos.slice(0, 8)) {
      console.log(`  [simulação] #${alvo.numero}  ${alvo.id.padEnd(13)} ${alvo.rotulos.join(', ')}`);
    }
    if (alvos.length > 8) {
      console.log(`  ... e mais ${alvos.length - 8}.`);
    }
    const minutos = Math.ceil((alvos.length * (PAUSA_MS + 1200)) / 60000);
    console.log(`  Tempo estimado: cerca de ${minutos} minutos.`);
    return;
  }

  let aplicados = 0;
  let jaCertos = 0;
  let ausentes = 0;
  const falhas = [];

  for (const [indice, alvo] of alvos.entries()) {
    const posicao = `${String(indice + 1).padStart(3, ' ')}/${alvos.length}`;

    const atual = verIssue(alvo.numero);
    if (!atual) {
      ausentes += 1;
      console.log(`${posicao} #${alvo.numero} não existe, pulando (${alvo.id}).`);
      continue;
    }

    const tem = new Set((atual.labels || []).map((r) => r.name));
    const faltando = alvo.rotulos.filter((r) => !tem.has(r));
    if (faltando.length === 0) {
      jaCertos += 1;
      continue;
    }

    try {
      gh([
        'issue', 'edit', String(alvo.numero),
        '--repo', REPOSITORIO,
        '--add-label', faltando.join(','),
      ], 'capturar');
      aplicados += 1;
      console.log(`${posicao} #${alvo.numero} ${alvo.id.padEnd(13)} ${faltando.join(', ')}`);
    } catch (erro) {
      const motivo = (erro.stderr || erro.message || '').toString().split('\n')[0];
      falhas.push(`#${alvo.numero}: ${motivo}`);
      console.warn(`${posicao} falhou em #${alvo.numero}: ${motivo}`);
    }
    esperar(PAUSA_MS);
  }

  console.log(`\n${aplicados} rotuladas, ${jaCertos} já estavam certas, ${ausentes} não existem.`);
  if (falhas.length > 0) {
    console.warn('Falhas:');
    for (const falha of falhas) {
      console.warn(`  ${falha}`);
    }
  }
}

/**
 * As issues de defeito não saem de planilha nenhuma. O script as localiza pelo
 * título para você saber onde reaplicar os rótulos à mão.
 */
function listarDefeitos(alvos) {
  const dosCasos = new Set(alvos.map((a) => a.numero));
  let issues;
  try {
    issues = JSON.parse(
      gh(['issue', 'list', '--repo', REPOSITORIO, '--state', 'all', '--limit', '500', '--json', 'number,title,labels'], true),
    );
  } catch {
    return;
  }

  const defeitos = issues.filter((i) => !dosCasos.has(i.number));
  if (defeitos.length === 0) {
    return;
  }

  console.log('\nIssues que não são de caso, para você rotular à mão:');
  for (const issue of defeitos.sort((a, b) => a.number - b.number)) {
    const tem = (issue.labels || []).map((r) => r.name).join(', ') || 'sem rótulo';
    console.log(`  #${issue.number}  ${issue.title.slice(0, 62)}`);
    console.log(`        tem hoje: ${tem}`);
  }
}

// ---------------------------------------------------------------------------
// Execução
// ---------------------------------------------------------------------------

function principal() {
  exigir(CAMINHO_MATRIZ, 'Matriz');
  exigir(CAMINHO_BACKLOG, 'Backlog');
  exigir(CAMINHO_CARDS, 'Registro de cards');
  conferirAmbiente();

  const matriz = lerCsv(fs.readFileSync(CAMINHO_MATRIZ, 'utf8'));
  const backlog = lerCsv(fs.readFileSync(CAMINHO_BACKLOG, 'utf8'));
  const cards = JSON.parse(fs.readFileSync(CAMINHO_CARDS, 'utf8'));

  const alvos = montarAlvos(matriz, backlog, cards);

  console.log(`Repositório: ${REPOSITORIO}`);
  console.log(`Casos: ${matriz.length} no escopo, ${backlog.length} no backlog`);
  console.log(`Modo: ${EXECUTAR ? 'EXECUÇÃO' : 'simulação, nada será alterado'}\n`);

  if (fases.criar) {
    faseCriar();
  }
  if (fases.aplicar) {
    faseAplicar(alvos);
    if (EXECUTAR) {
      listarDefeitos(alvos);
    }
  }

  if (!EXECUTAR) {
    console.log('\nNada foi alterado. Repita o comando com --executar para aplicar.');
  }
}

principal();
