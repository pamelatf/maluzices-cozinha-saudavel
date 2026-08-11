/**
 * Transfere as issues do cozinha-tests para o repositório da aplicação.
 *
 * A transferência do GitHub preserva título, corpo, comentários, autor, data e
 * estado, e deixa um redirecionamento no endereço antigo. É melhor que recriar,
 * que perderia o histórico e mudaria a autoria.
 *
 * Duas coisas mudam no destino e precisam ser tratadas depois:
 *
 *   O número. A issue #42 na origem vira outro número no destino, porque lá já
 *   existe uma sequência própria. Por isso o script grava o mapa de número
 *   antigo para novo e reescreve o cards-criados.json.
 *
 *   Os rótulos. O GitHub cria no destino os rótulos que não existirem lá, mas
 *   sem a cor e a descrição originais. Confira depois da migração.
 *
 * O progresso é gravado a cada issue transferida, e não no fim. Se o processo
 * cair no meio, o que já foi feito não se perde e a próxima execução continua
 * de onde parou.
 *
 * Uso:
 *   node scripts/migrarIssues.js              simulação, não transfere nada
 *   node scripts/migrarIssues.js --executar   transfere
 *   node scripts/migrarIssues.js --mapa       só reescreve o cards-criados.json
 *
 * Pré-requisitos:
 *   - gh instalado e autenticado, com acesso de escrita nos dois repositórios
 *   - Node 18 ou superior
 *
 * O caminho do cards-criados.json é obrigatório, e é dele que sai a ligação
 * entre caso de teste e número de issue:
 *
 *   CAMINHO_CARDS=/c/projetos/cozinha-tests.wiki/cards-criados.json \
 *     node scripts/migrarIssues.js
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

// ---------------------------------------------------------------------------
// Configuração
// ---------------------------------------------------------------------------

const ORIGEM = process.env.ORIGEM || 'pamelatf/cozinha-tests';
const DESTINO = process.env.DESTINO || 'pamelatf/maluzices-cozinha-saudavel';

const RAIZ = path.join(__dirname, '..');
const CAMINHO_CARDS = process.env.CAMINHO_CARDS || '';
const CAMINHO_PROGRESSO =
  process.env.CAMINHO_PROGRESSO || path.join(RAIZ, 'docs', 'issues-migradas.json');
const CAMINHO_CARDS_NOVO =
  process.env.CAMINHO_CARDS_NOVO || path.join(RAIZ, 'docs', 'cards-criados.json');

// A transferência é mais pesada que uma edição comum, e o GitHub tem limite
// secundário para escrita em sequência. Dois segundos entre uma e outra.
const PAUSA_MS = Number(process.env.PAUSA_MS || 2000);

/**
 * Casos cujo número no cards-criados.json não vale mais. O CRIT-57.1 está lá
 * como #91, que foi apagada por engano e reaberta como #135. Sem esta correção
 * o caso ficaria sem número novo depois da migração.
 */
const NUMERO_CORRIGIDO = {
  'CRIT-57.1': 135,
};

const argumentos = process.argv.slice(2);
const EXECUTAR = argumentos.includes('--executar');
const SO_MAPA = argumentos.includes('--mapa');

// ---------------------------------------------------------------------------
// gh
// ---------------------------------------------------------------------------

function gh(args, silencioso = false) {
  return execFileSync('gh', args, {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    stdio: silencioso ? ['ignore', 'pipe', 'ignore'] : ['ignore', 'pipe', 'inherit'],
  }).trim();
}

function esperar(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
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

function listarIssues(repositorio) {
  const bruto = gh([
    'issue', 'list', '--repo', repositorio, '--state', 'all', '--limit', '500',
    '--json', 'number,title,state',
  ]);
  return JSON.parse(bruto || '[]').sort((a, b) => a.number - b.number);
}

/** Extrai o número novo do endereço que o gh imprime após a transferência. */
function numeroDaUrl(url) {
  const encontrado = /\/issues\/(\d+)\s*$/.exec(url.trim());
  return encontrado ? Number(encontrado[1]) : null;
}

// ---------------------------------------------------------------------------
// Progresso
// ---------------------------------------------------------------------------

function lerProgresso() {
  if (!fs.existsSync(CAMINHO_PROGRESSO)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(CAMINHO_PROGRESSO, 'utf8'));
}

function gravarProgresso(progresso) {
  fs.mkdirSync(path.dirname(CAMINHO_PROGRESSO), { recursive: true });
  fs.writeFileSync(CAMINHO_PROGRESSO, `${JSON.stringify(progresso, null, 2)}\n`, 'utf8');
}

// ---------------------------------------------------------------------------
// Mapa de cards
// ---------------------------------------------------------------------------

/**
 * Reescreve o cards-criados.json com os números do destino. O que liga um
 * arquivo ao outro é o número antigo, que é a única coisa em comum entre eles.
 */
function reescreverCards(progresso) {
  if (!CAMINHO_CARDS || !fs.existsSync(CAMINHO_CARDS)) {
    console.warn('Aviso: cards-criados.json não encontrado, o mapa não foi reescrito.');
    return;
  }

  const cards = JSON.parse(fs.readFileSync(CAMINHO_CARDS, 'utf8'));
  const novo = {};
  const semCorrespondencia = [];

  for (const [id, card] of Object.entries(cards)) {
    const numeroAntigo = NUMERO_CORRIGIDO[id] || card.numero;
    const numeroNovo = progresso[String(numeroAntigo)];
    if (!numeroNovo) {
      semCorrespondencia.push(`${id} (#${numeroAntigo})`);
      continue;
    }
    novo[id] = {
      numero: numeroNovo,
      url: `https://github.com/${DESTINO}/issues/${numeroNovo}`,
      numeroAnterior: numeroAntigo,
    };
  }

  if (!EXECUTAR && !SO_MAPA) {
    console.log(`\n[simulação] ${Object.keys(novo).length} entradas seriam reescritas no mapa.`);
    return;
  }

  fs.mkdirSync(path.dirname(CAMINHO_CARDS_NOVO), { recursive: true });
  fs.writeFileSync(CAMINHO_CARDS_NOVO, `${JSON.stringify(novo, null, 2)}\n`, 'utf8');
  console.log(`\nMapa gravado em ${CAMINHO_CARDS_NOVO} com ${Object.keys(novo).length} entradas.`);

  if (semCorrespondencia.length > 0) {
    console.warn(
      `  ${semCorrespondencia.length} casos ficaram sem número novo: ${semCorrespondencia.join(', ')}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Execução
// ---------------------------------------------------------------------------

function principal() {
  conferirAmbiente();

  const progresso = lerProgresso();

  console.log(`Origem:  ${ORIGEM}`);
  console.log(`Destino: ${DESTINO}`);
  console.log(`Modo: ${EXECUTAR ? 'EXECUÇÃO' : 'simulação, nada será transferido'}\n`);

  if (SO_MAPA) {
    console.log(`Reescrevendo o mapa a partir de ${Object.keys(progresso).length} transferências já registradas.`);
    reescreverCards(progresso);
    return;
  }

  const issues = listarIssues(ORIGEM);
  const pendentes = issues.filter((i) => !progresso[String(i.number)]);

  console.log(`Issues na origem: ${issues.length}`);
  console.log(`Já transferidas: ${Object.keys(progresso).length}`);
  console.log(`A transferir: ${pendentes.length}\n`);

  if (pendentes.length === 0) {
    console.log('Nada a fazer. Reescrevendo só o mapa.');
    reescreverCards(progresso);
    return;
  }

  if (!EXECUTAR) {
    for (const issue of pendentes.slice(0, 10)) {
      console.log(`  [simulação] #${issue.number}  ${issue.title.slice(0, 70)}`);
    }
    if (pendentes.length > 10) {
      console.log(`  ... e mais ${pendentes.length - 10}.`);
    }
    const minutos = Math.ceil((pendentes.length * (PAUSA_MS + 1500)) / 60000);
    console.log(`\nTempo estimado: cerca de ${minutos} minutos.`);
    reescreverCards(progresso);
    console.log('\nNada foi transferido. Repita o comando com --executar para aplicar.');
    return;
  }

  let transferidas = 0;
  const falhas = [];

  for (const [indice, issue] of pendentes.entries()) {
    const posicao = `${String(indice + 1).padStart(3, ' ')}/${pendentes.length}`;
    try {
      const saida = gh(['issue', 'transfer', String(issue.number), DESTINO], true);
      const numeroNovo = numeroDaUrl(saida);
      if (!numeroNovo) {
        falhas.push(`#${issue.number} (resposta inesperada: ${saida.slice(0, 60)})`);
        console.warn(`${posicao} #${issue.number} transferida, mas sem número novo legível.`);
      } else {
        progresso[String(issue.number)] = numeroNovo;
        // Gravado a cada issue, de propósito: uma queda no meio não perde o
        // que já foi feito, e o número novo só existe nesta resposta.
        gravarProgresso(progresso);
        transferidas += 1;
        console.log(`${posicao} #${issue.number} -> #${numeroNovo}`);
      }
    } catch (erro) {
      falhas.push(`#${issue.number}: ${erro.message.split('\n')[0]}`);
      console.warn(`${posicao} falhou em #${issue.number}`);
    }
    esperar(PAUSA_MS);
  }

  console.log(`\n${transferidas} de ${pendentes.length} transferidas.`);
  if (falhas.length > 0) {
    console.warn('Falhas:');
    for (const falha of falhas) {
      console.warn(`  ${falha}`);
    }
    console.warn('Rode de novo: o script pula o que já foi transferido.');
  }

  reescreverCards(progresso);
}

principal();
