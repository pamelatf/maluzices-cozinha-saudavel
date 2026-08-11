/**
 * Remove do repositório as famílias de rótulo que deixaram de valer.
 *
 * As issues de caso nasceram com cinco famílias, criadas pelo criar-cards.js:
 *
 *   severidade: X    Crítica, Alta, Média, Baixa
 *   VADER: X         V, A, D, E, R
 *   POISED: X        P, O, I, S, E, D
 *   endpoint: X      /pedidos/{id}/status e companhia
 *   resultado: X     Passou, Falhou
 *
 * Três saem:
 *
 *   POISED     a entrega passou a usar só VADER. O rótulo classifica por uma
 *              heurística que não é mais aplicada.
 *   endpoint   virou repetição depois do reagrupamento. O identificador já é
 *              o endpoint: STATUS-12 é /pedidos/{id}/status. E é a família de
 *              texto mais longo, a que mais atrapalha a leitura da lista.
 *   resultado  nenhum script mantém esse rótulo em dia desde que o
 *              criar-cards.js foi aposentado. Ele congela o veredicto de uma
 *              execução antiga e vira mentira na próxima. O veredicto de
 *              verdade está no corpo da issue e na matriz.
 *
 * Duas ficam, porque filtram o que o título não diz:
 *
 *   severidade  é o corte da entrega, e não dá para deduzir do identificador.
 *   VADER       é a heurística que sustenta a matriz.
 *
 * Com --minimo, severidade e VADER também saem, e sobra só o rótulo
 * "backlog pós-entrega" nas issues de caso.
 *
 * Rótulo que não pertence a nenhuma dessas famílias nunca é tocado. É o que
 * protege os seus: bug, melhoria, seguranca, contrato e prioridade.
 *
 * Apagar a definição do rótulo já o remove de todas as issues de uma vez, o
 * que faz este script ser questão de segundos, e não de minutos.
 *
 * Uso:
 *   node scripts/limparRotulos.js              simulação, não apaga nada
 *   node scripts/limparRotulos.js --executar   apaga
 *   node scripts/limparRotulos.js --minimo     inclui severidade e VADER no corte
 *
 * Pré-requisitos: gh instalado e autenticado, Node 18 ou superior.
 */

'use strict';

const { execFileSync } = require('node:child_process');

// ---------------------------------------------------------------------------
// Configuração
// ---------------------------------------------------------------------------

const REPOSITORIO = process.env.REPOSITORIO || 'pamelatf/cozinha-tests';

const argumentos = process.argv.slice(2);
const EXECUTAR = argumentos.includes('--executar');
const MINIMO = argumentos.includes('--minimo');

/** Famílias que saem. O prefixo é comparado no começo do nome do rótulo. */
const FAMILIAS_REMOVIDAS = ['POISED: ', 'endpoint: ', 'resultado: '];

/** Famílias que ficam, e que só saem com --minimo. */
const FAMILIAS_OPCIONAIS = ['severidade: ', 'VADER: '];

/** Rótulos avulsos que ficam sempre, mesmo sem pertencer a família nenhuma. */
const SEMPRE_MANTIDOS = ['backlog pós-entrega'];

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

function conferirAmbiente() {
  try {
    gh(['auth', 'status'], true);
    return true;
  } catch {
    const mensagem = 'GitHub CLI ausente ou não autenticado. Rode gh auth login.';
    if (EXECUTAR) {
      throw new Error(mensagem);
    }
    console.warn(`Aviso: ${mensagem}\n`);
    return false;
  }
}

function listarRotulos() {
  const bruto = gh([
    'label', 'list', '--repo', REPOSITORIO, '--limit', '200', '--json', 'name,description,color',
  ]);
  return JSON.parse(bruto || '[]');
}

/** Quantas issues ainda usam o rótulo. Serve para o relatório da simulação. */
function contarUsos(nome) {
  try {
    const bruto = gh([
      'issue', 'list', '--repo', REPOSITORIO, '--state', 'all',
      '--label', nome, '--limit', '400', '--json', 'number',
    ], true);
    return JSON.parse(bruto || '[]').length;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Classificação
// ---------------------------------------------------------------------------

function familiaDe(nome, familias) {
  return familias.find((prefixo) => nome.startsWith(prefixo)) || null;
}

function classificar(rotulos) {
  const remover = [];
  const manter = [];
  const preservar = [];

  const paraCortar = MINIMO
    ? [...FAMILIAS_REMOVIDAS, ...FAMILIAS_OPCIONAIS]
    : FAMILIAS_REMOVIDAS;

  for (const rotulo of rotulos) {
    const familia = familiaDe(rotulo.name, paraCortar);
    if (familia) {
      remover.push({ ...rotulo, familia });
      continue;
    }
    if (
      SEMPRE_MANTIDOS.includes(rotulo.name)
      || familiaDe(rotulo.name, [...FAMILIAS_REMOVIDAS, ...FAMILIAS_OPCIONAIS])
    ) {
      manter.push(rotulo);
      continue;
    }
    // Não pertence a nenhuma família conhecida, então é rótulo seu. O script
    // não decide sobre esses: só lista, para você ver que não encostou neles.
    preservar.push(rotulo);
  }

  return { remover, manter, preservar };
}

// ---------------------------------------------------------------------------
// Execução
// ---------------------------------------------------------------------------

function principal() {
  const autenticado = conferirAmbiente();

  console.log(`Repositório: ${REPOSITORIO}`);
  console.log(`Corte: ${MINIMO ? 'mínimo, só sobra o backlog' : 'padrão, mantém severidade e VADER'}`);
  console.log(`Modo: ${EXECUTAR ? 'EXECUÇÃO' : 'simulação, nada será apagado'}\n`);

  if (!autenticado) {
    console.error('Sem o gh autenticado não dá para listar os rótulos. Parando aqui.');
    process.exit(1);
  }

  const rotulos = listarRotulos();
  const { remover, manter, preservar } = classificar(rotulos);

  console.log(`Rótulos no repositório: ${rotulos.length}\n`);

  console.log(`A remover (${remover.length}):`);
  if (remover.length === 0) {
    console.log('  nenhum, o repositório já está limpo.');
  }
  for (const rotulo of remover) {
    const usos = contarUsos(rotulo.name);
    const quantas = usos === null ? 'uso desconhecido' : `${usos} issues`;
    console.log(`  ${rotulo.name.padEnd(38)} ${quantas}`);
  }

  console.log(`\nA manter (${manter.length}):`);
  for (const rotulo of manter) {
    console.log(`  ${rotulo.name}`);
  }

  console.log(`\nSeus, intocados (${preservar.length}):`);
  for (const rotulo of preservar) {
    console.log(`  ${rotulo.name}`);
  }

  if (!EXECUTAR) {
    console.log('\nNada foi apagado. Repita o comando com --executar para aplicar.');
    return;
  }

  console.log('\nApagando:');
  let apagados = 0;
  const falhas = [];

  for (const rotulo of remover) {
    try {
      gh(['label', 'delete', rotulo.name, '--repo', REPOSITORIO, '--yes'], true);
      apagados += 1;
      console.log(`  ${rotulo.name}`);
    } catch (erro) {
      falhas.push(rotulo.name);
      console.warn(`  falhou em ${rotulo.name}: ${erro.message.split('\n')[0]}`);
    }
  }

  console.log(`\n${apagados} de ${remover.length} apagados.`);
  if (falhas.length > 0) {
    console.warn(`Não apagados: ${falhas.join(', ')}. Rode de novo ou apague pela interface.`);
  }
  console.log('Apagar a definição remove o rótulo de todas as issues, então não há segunda passada.');
}

principal();
