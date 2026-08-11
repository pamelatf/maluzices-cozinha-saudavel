/**
 * Reagrupa os casos de teste por endpoint e troca o identificador de todos.
 *
 * O esquema anterior agrupava por operação, com prefixos como AUTH, CRIA e
 * SIST. O novo agrupa por endpoint, com um prefixo por rota:
 *
 *   AUTH       /auth/login             test/auth.login.test.js
 *   PEDIDOS    /pedidos                test/pedidos.test.js
 *   PEDIDO-ID  /pedidos/{id}           test/pedidos.id.test.js
 *   RESUMO     /pedidos/resumo         test/pedidos.resumo.test.js
 *   STATUS     /pedidos/{id}/status    test/pedidos.status.test.js
 *   HEALTH     /health                 test/health.test.js
 *   GERAL      todos os endpoints      test/geral.test.js
 *   CARGA      carga e concorrência    k6, fora da suíte do mocha
 *
 * Dentro de cada grupo a numeração segue a operação, começando pela principal
 * do endpoint, para os `describe` de cada arquivo saírem contíguos. Em PEDIDOS,
 * por exemplo, o POST ocupa de 01 a 22 e o GET de 23 a 30.
 *
 * O identificador novo não sai de uma tabela escrita à mão: ele é calculado a
 * partir do endpoint, do método e da ordem da linha na planilha. Como esses
 * três não mudam quando o script roda, o cálculo dá o mesmo resultado em toda
 * execução, e o script pode ser repetido sem gerar identificador diferente.
 *
 * Nenhuma issue é criada ou apagada. Elas mantêm número, histórico,
 * comentários e rótulos. Só o título e o corpo mudam.
 *
 * Três fases, todas em simulação até você acrescentar --executar:
 *
 *   node scripts/reagruparPorEndpoint.js --csv
 *       Reescreve docs/matriz_vader_cozinha_v3.0.csv e
 *       docs/backlog_pos_entrega.csv com os identificadores, os grupos e os
 *       arquivos previstos novos, preservando os identificadores anteriores.
 *       Grava também docs/mapa_ids_endpoint.json.
 *
 *   node scripts/reagruparPorEndpoint.js --issues
 *       Renomeia as issues dos 126 casos e reescreve o corpo delas.
 *
 *   node scripts/reagruparPorEndpoint.js --rotulos
 *       Garante o rótulo "backlog pós-entrega" nas issues fora do escopo,
 *       inclusive nas que foram recriadas à mão e nasceram sem rótulo.
 *
 * Sem fase indicada, roda as três, nesta ordem.
 *
 * Pré-requisitos: gh instalado e autenticado, Node 18 ou superior.
 *
 * O caminho do cards-criados.json é obrigatório e vem por variável de
 * ambiente. É dele que sai o número de cada issue, e exigi-lo explicitamente
 * evita que o script saia procurando issues por título e encoste em alguma de
 * defeito por engano:
 *
 *   CAMINHO_CARDS=/c/projetos/maluzices-cozinha-saudavel.wiki/cards-criados.json \
 *     node scripts/reagruparPorEndpoint.js --csv --executar
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
const CAMINHO_MAPA =
  process.env.CAMINHO_MAPA || path.join(RAIZ, 'docs', 'mapa_ids_endpoint.json');
const CAMINHO_CARDS = process.env.CAMINHO_CARDS || '';

const BASE_WIKI = `https://github.com/${REPOSITORIO}/wiki`;
const ROTULO_BACKLOG = 'backlog pós-entrega';
const PAUSA_MS = Number(process.env.PAUSA_MS || 900);

const argumentos = process.argv.slice(2);
const EXECUTAR = argumentos.includes('--executar');

const fases = {
  csv: argumentos.includes('--csv'),
  issues: argumentos.includes('--issues'),
  rotulos: argumentos.includes('--rotulos'),
};
if (!fases.csv && !fases.issues && !fases.rotulos) {
  fases.csv = true;
  fases.issues = true;
  fases.rotulos = true;
}

// ---------------------------------------------------------------------------
// Regra de agrupamento
// ---------------------------------------------------------------------------

const PREFIXO_POR_ENDPOINT = {
  '/auth/login': 'AUTH',
  '/pedidos': 'PEDIDOS',
  '/pedidos/{id}': 'PEDIDO-ID',
  '/pedidos/resumo': 'RESUMO',
  '/pedidos/{id}/status': 'STATUS',
  '/health': 'HEALTH',
};

/**
 * Ordem das operações dentro de cada grupo. A principal do endpoint vem
 * primeiro, e os verbos não permitidos ficam no fim, porque são a borda e não
 * o comportamento esperado da rota.
 */
const ORDEM_DE_METODO = {
  AUTH: ['POST', 'GET'],
  PEDIDOS: ['POST', 'GET', 'PUT'],
  'PEDIDO-ID': ['GET', 'PATCH', 'DELETE', 'PUT'],
  RESUMO: ['GET', 'DELETE'],
  STATUS: ['PATCH', 'POST', 'PUT', 'OTHER'],
  HEALTH: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  // GERAL fica de fora de propósito. Os casos transversais não pertencem a uma
  // operação, e ordená-los por método separaria os três de token dos três de
  // postura do sistema. A ordem deles é a da planilha, que já os agrupa por
  // assunto.
  GERAL: [],
};

const ARQUIVO_POR_GRUPO = {
  AUTH: 'test/auth.login.test.js',
  PEDIDOS: 'test/pedidos.test.js',
  'PEDIDO-ID': 'test/pedidos.id.test.js',
  RESUMO: 'test/pedidos.resumo.test.js',
  STATUS: 'test/pedidos.status.test.js',
  HEALTH: 'test/health.test.js',
  GERAL: 'test/geral.test.js',
  CARGA: 'k6/carga.js',
};

const ENDPOINT_POR_GRUPO = {
  AUTH: '/auth/login',
  PEDIDOS: '/pedidos',
  'PEDIDO-ID': '/pedidos/{id}',
  RESUMO: '/pedidos/resumo',
  STATUS: '/pedidos/{id}/status',
  HEALTH: '/health',
  GERAL: 'Todos os endpoints',
  CARGA: 'Carga e concorrência',
};

/**
 * Os três casos de carga não entram no grupo do endpoint que exercitam.
 * Eles rodam com k6, não com o mocha, então um identificador PEDIDOS neles
 * apontaria para um arquivo de teste onde nunca vão aparecer. O grupo é
 * reconhecido pelo prefixo PERF do identificador anterior.
 */
const GRUPO_DE_CARGA = 'CARGA';

/**
 * Issues que existem no repositório mas não estão no cards-criados.json,
 * porque foram abertas depois, à mão. A #135 é o antigo CRIT-57.1 reaberto:
 * a issue original foi apagada por engano e o rascunho virou issue nova.
 */
const NUMEROS_EXTRAS = {
  'CRIT-57.1': [135],
};

const VADER = {
  V: 'Verbo HTTP',
  A: 'Autenticação e autorização',
  D: 'Dados de entrada',
  E: 'Erros e exceções',
  R: 'Resposta e contrato',
};

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
  const registros = linhas
    .filter((l) => l.some((c) => c.trim() !== ''))
    .map((l) => Object.fromEntries(cabecalho.map((nome, i) => [nome, (l[i] || '').trim()])));
  return { cabecalho, registros };
}

function escreverCsv(cabecalho, registros) {
  const escapar = (valor) => {
    const texto = valor == null ? '' : String(valor);
    return /[;"\n\r]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
  };
  const linhas = [cabecalho.map(escapar).join(';')];
  for (const registro of registros) {
    linhas.push(cabecalho.map((nome) => escapar(registro[nome])).join(';'));
  }
  // BOM preservado: o Excel em português depende dele para ler os acentos.
  return `﻿${linhas.join('\n')}\n`;
}

function exigir(caminho, descricao) {
  if (!caminho || !fs.existsSync(caminho)) {
    console.error(`${descricao} não encontrado: ${caminho || '(não informado)'}`);
    if (descricao.includes('cards')) {
      console.error('Informe o caminho na variável de ambiente CAMINHO_CARDS.');
    }
    process.exit(1);
  }
  return caminho;
}

/** Todos os identificadores por que a linha já passou, do atual ao original. */
function identificadoresAnteriores(registro, colunaAnterior) {
  const lista = [registro.ID, ...(registro[colunaAnterior] || '').split(',')];
  return [...new Set(lista.map((p) => p.trim()).filter(Boolean))];
}

// ---------------------------------------------------------------------------
// Cálculo dos identificadores novos
// ---------------------------------------------------------------------------

function grupoDe(registro) {
  // Decidido pelo identificador atual da linha, e não pelo histórico dela.
  // Quatro casos do escopo trazem um PERF na coluna de identificador anterior,
  // herdado da unificação, e olhar o histórico os jogaria em CARGA por engano.
  if (/^(PERF|CARGA)-/.test(registro.ID)) {
    return GRUPO_DE_CARGA;
  }
  const endpoint = registro.Endpoint || '';
  if (endpoint.startsWith('Todos')) {
    return 'GERAL';
  }
  const prefixo = PREFIXO_POR_ENDPOINT[endpoint];
  if (!prefixo) {
    throw new Error(`Endpoint sem grupo definido: "${endpoint}" na linha ${registro.ID}.`);
  }
  return prefixo;
}

/**
 * Atribui um identificador novo a cada linha das duas planilhas.
 *
 * A matriz é numerada primeiro e o backlog continua de onde ela parou, para o
 * escopo da entrega ocupar os números baixos de cada grupo. A ordem dentro do
 * grupo é a operação, e dentro da operação a posição original na planilha.
 */
function calcular(linhasMatriz, linhasBacklog) {
  const contador = {};
  const paraNovo = new Map();
  const porNovo = new Map();
  // A planilha é reescrita a partir deste mapa, e não de uma busca pelo ID.
  // Prefixos como STAT existem no esquema velho e no novo, então buscar por
  // identificador poderia casar com a linha errada.
  const porRegistro = new Map();
  const ambiguos = new Set();

  const numerar = (linhas, colunaAnterior) => {
    const grupos = new Map();
    linhas.forEach((registro, indice) => {
      const anteriores = identificadoresAnteriores(registro, colunaAnterior);
      const grupo = grupoDe(registro);
      if (!grupos.has(grupo)) {
        grupos.set(grupo, []);
      }
      grupos.get(grupo).push({ registro, indice, anteriores });
    });

    for (const [grupo, itens] of grupos) {
      const ordem = ORDEM_DE_METODO[grupo] || [];
      itens.sort((a, b) => {
        const posicao = (item) => {
          const lugar = ordem.indexOf(item.registro['Método']);
          return lugar === -1 ? ordem.length : lugar;
        };
        return posicao(a) - posicao(b) || a.indice - b.indice;
      });

      for (const item of itens) {
        contador[grupo] = (contador[grupo] || 0) + 1;
        const idNovo = `${grupo}-${String(contador[grupo]).padStart(2, '0')}`;
        item.idNovo = idNovo;
        item.grupo = grupo;
        for (const anterior of item.anteriores) {
          if (paraNovo.has(anterior) && paraNovo.get(anterior) !== idNovo) {
            ambiguos.add(anterior);
          }
          paraNovo.set(anterior, idNovo);
        }
        porNovo.set(idNovo, item);
        porRegistro.set(item.registro, item);
      }
    }
  };

  numerar(linhasMatriz, 'ID anterior');
  numerar(linhasBacklog, 'Origem');

  return { paraNovo, porNovo, porRegistro, contador, ambiguos };
}

// ---------------------------------------------------------------------------
// Corpo da issue
// ---------------------------------------------------------------------------

function ancora(idNovo, titulo) {
  return `${idNovo} — ${titulo}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function corpo(caso, idNovo, anteriores, doBacklog) {
  const linhas = [];

  if (doBacklog) {
    linhas.push('> Caso fora do escopo da entrega. Fica registrado para ser');
    linhas.push('> especificado e automatizado depois, e não conta no fechamento.');
    linhas.push('');
  }

  const arquivo = caso['Arquivo previsto'] || caso['Arquivo sugerido'] || '';
  const historico = anteriores.filter((id) => id !== idNovo);

  linhas.push('| Campo | Valor |');
  linhas.push('|---|---|');
  linhas.push(`| Item de teste | \`${caso['Método']} ${caso.Endpoint}\` |`);
  linhas.push(`| Severidade | ${caso.Severidade} |`);
  linhas.push(
    `| Heurística | ${caso.VADER ? `VADER ${caso.VADER} — ${VADER[caso.VADER] || ''}`.trim() : 'Não classificado'} |`,
  );
  linhas.push(`| Arquivo previsto | \`${arquivo}\` |`);
  if (historico.length > 0) {
    linhas.push(`| Identificadores anteriores | ${historico.join(', ')} |`);
  }
  if (caso.Veredicto) {
    linhas.push(`| Veredicto da última execução | ${caso.Veredicto} |`);
  }
  linhas.push('');

  const secao = (titulo, texto) => {
    if (texto) {
      linhas.push(`### ${titulo}`, '', texto, '');
    }
  };

  secao('Objetivo', caso['Descrição']);
  secao('Ação', caso['Ação']);
  if (caso.Dados) {
    linhas.push('### Dados', '', `\`\`\`\n${caso.Dados}\n\`\`\``, '');
  }
  secao('Resultado esperado', caso['Resultado esperado']);
  secao('Lacuna de contrato', caso['Lacuna de contrato']);
  secao('Pendência antes de executar', caso['Pendência']);
  secao('Nota', caso.Nota);
  secao('Motivo de ter ficado fora da entrega', caso['Motivo da saída']);
  secao('Observação da execução', caso['Observações da execução']);
  if (caso.Comando) {
    linhas.push('### Como executar', '', `\`\`\`bash\n${caso.Comando}\n\`\`\``, '');
  }

  linhas.push('---', '');
  if (doBacklog) {
    linhas.push(
      'Caso gerado a partir de `docs/backlog_pos_entrega.csv`. Ele não aparece ' +
        'na página 07 da wiki, que cobre apenas os 96 casos da entrega.',
    );
  } else {
    linhas.push(
      `Especificação completa em [${idNovo} na wiki](${BASE_WIKI}/07-Casos-de-teste-da-API#${ancora(idNovo, caso['Título'])}).`,
    );
    linhas.push('');
    linhas.push(
      'Card gerado a partir de `docs/matriz_vader_cozinha_v3.0.csv`. ' +
        'A matriz é a fonte; esta issue é uma vista dela.',
    );
  }

  return linhas.join('\n');
}

// ---------------------------------------------------------------------------
// gh
// ---------------------------------------------------------------------------

function gh(args, silencioso = false) {
  return execFileSync('gh', args, {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    // Issue apagada faz o gh escrever um erro de GraphQL na saída de erro.
    // Aqui isso é resultado esperado, não falha, então o ruído é abafado.
    stdio: silencioso ? ['ignore', 'pipe', 'ignore'] : ['ignore', 'pipe', 'inherit'],
  }).trim();
}

function esperar(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/** Devolve os dados da issue, ou null se ela não existir mais. */
function verIssue(numero) {
  try {
    return JSON.parse(
      gh(
        ['issue', 'view', String(numero), '--repo', REPOSITORIO, '--json', 'number,title,state,labels'],
        true,
      ),
    );
  } catch {
    return null;
  }
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

// ---------------------------------------------------------------------------
// Fase: planilhas
// ---------------------------------------------------------------------------

function reescreverPlanilha(caminho, cabecalho, linhas, colunaAnterior, colunaArquivo, calculo) {
  let alteradas = 0;

  for (const registro of linhas) {
    const item = calculo.porRegistro.get(registro);
    if (!item) {
      continue;
    }

    const idNovo = item.idNovo;
    const grupo = item.grupo;
    const historico = item.anteriores.filter((id) => id !== idNovo);

    if (registro.ID !== idNovo) {
      alteradas += 1;
    }
    registro.ID = idNovo;
    registro[colunaAnterior] = historico.join(', ');
    if (Object.prototype.hasOwnProperty.call(registro, 'Grupo')) {
      registro.Grupo = grupo;
    }
    if (colunaArquivo && ARQUIVO_POR_GRUPO[grupo]) {
      registro[colunaArquivo] = ARQUIVO_POR_GRUPO[grupo];
    }
    if (registro.Comando) {
      // O comando cita o identificador dentro do --grep. Reescrever a partir
      // do grupo evita depender de qual identificador antigo estava lá.
      registro.Comando = `npx mocha --grep "${idNovo}"`;
    }
  }

  if (EXECUTAR) {
    fs.writeFileSync(caminho, escreverCsv(cabecalho, linhas), 'utf8');
  }
  return alteradas;
}

function faseCsv(matriz, backlog, calculo) {
  console.log('Planilhas:');

  const naMatriz = reescreverPlanilha(
    CAMINHO_MATRIZ, matriz.cabecalho, matriz.registros, 'ID anterior', 'Arquivo previsto', calculo,
  );
  const noBacklog = reescreverPlanilha(
    CAMINHO_BACKLOG, backlog.cabecalho, backlog.registros, 'Origem', 'Arquivo sugerido', calculo,
  );

  const mapa = Object.fromEntries([...calculo.paraNovo.entries()].sort());
  if (EXECUTAR) {
    fs.writeFileSync(CAMINHO_MAPA, `${JSON.stringify(mapa, null, 2)}\n`, 'utf8');
  }

  const marca = EXECUTAR ? '' : '[simulação] ';
  console.log(`  ${marca}${naMatriz} linhas de ${path.basename(CAMINHO_MATRIZ)}`);
  console.log(`  ${marca}${noBacklog} linhas de ${path.basename(CAMINHO_BACKLOG)}`);
  console.log(`  ${marca}${Object.keys(mapa).length} equivalências em ${path.basename(CAMINHO_MAPA)}`);
}

// ---------------------------------------------------------------------------
// Fase: issues
// ---------------------------------------------------------------------------

function montarAlvos(calculo, cards, idsDoBacklog) {
  const alvos = [];
  const semCaso = [];

  for (const [idAntigo, card] of Object.entries(cards)) {
    const idNovo = calculo.paraNovo.get(idAntigo);
    if (!idNovo) {
      semCaso.push(idAntigo);
      continue;
    }
    const numeros = new Set([card.numero, ...(NUMEROS_EXTRAS[idAntigo] || [])]);
    for (const numero of numeros) {
      alvos.push({
        idAntigo,
        idNovo,
        numero,
        item: calculo.porNovo.get(idNovo),
        doBacklog: idsDoBacklog.has(idNovo),
      });
    }
  }

  if (semCaso.length > 0) {
    console.warn(`Aviso: sem linha nas planilhas: ${semCaso.join(', ')}`);
  }
  alvos.sort((a, b) => a.numero - b.numero);
  return alvos;
}

function faseIssues(alvos) {
  console.log('\nTítulos e corpos das issues:');

  let renomeadas = 0;
  let jaCertas = 0;
  let ausentes = 0;
  const repetidos = new Map();

  for (const [indice, alvo] of alvos.entries()) {
    const posicao = `${String(indice + 1).padStart(3, ' ')}/${alvos.length}`;
    const caso = alvo.item.registro;
    const tituloNovo = `${alvo.idNovo} — ${caso['Título']}`;

    if (!EXECUTAR) {
      console.log(`${posicao} [simulação] #${alvo.numero}  ${alvo.idAntigo} -> ${alvo.idNovo}`);
      continue;
    }

    const atual = verIssue(alvo.numero);
    if (!atual) {
      ausentes += 1;
      console.log(`${posicao} #${alvo.numero} não existe mais, pulando (${alvo.idAntigo}).`);
      continue;
    }

    if (!repetidos.has(alvo.idNovo)) {
      repetidos.set(alvo.idNovo, []);
    }
    repetidos.get(alvo.idNovo).push(alvo.numero);

    if (atual.title === tituloNovo) {
      jaCertas += 1;
      console.log(`${posicao} #${alvo.numero} já está com o título novo.`);
      continue;
    }

    gh([
      'issue', 'edit', String(alvo.numero),
      '--repo', REPOSITORIO,
      '--title', tituloNovo,
      '--body', corpo(caso, alvo.idNovo, alvo.item.anteriores, alvo.doBacklog),
    ]);
    renomeadas += 1;
    console.log(`${posicao} #${alvo.numero} ${alvo.idAntigo} -> ${alvo.idNovo}`);
    esperar(PAUSA_MS);
  }

  if (EXECUTAR) {
    console.log(
      `  ${renomeadas} renomeadas, ${jaCertas} já estavam certas, ` +
        `${ausentes} ${ausentes === 1 ? 'não existe mais' : 'não existem mais'}.`,
    );
    for (const [idNovo, numeros] of repetidos) {
      if (numeros.length > 1) {
        console.warn(
          `  atenção: ${idNovo} ficou em mais de uma issue: ${numeros.map((n) => `#${n}`).join(', ')}. ` +
            'Feche a que sobrou à mão.',
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Fase: rótulo do backlog
// ---------------------------------------------------------------------------

function faseRotulos(alvos) {
  console.log('\nRótulo do backlog:');

  const doBacklog = alvos.filter((a) => a.doBacklog);

  if (!EXECUTAR) {
    console.log(`  [simulação] o rótulo "${ROTULO_BACKLOG}" seria conferido em ${doBacklog.length} issues.`);
    return;
  }

  try {
    gh([
      'label', 'create', ROTULO_BACKLOG,
      '--repo', REPOSITORIO,
      '--color', '5319e7',
      '--description', 'Caso fora do escopo da entrega de 15/08, retomado depois',
      '--force',
    ]);
  } catch (erro) {
    console.warn(`  aviso ao criar o rótulo: ${erro.message.split('\n')[0]}`);
  }

  let aplicados = 0;
  let jaTinham = 0;

  for (const alvo of doBacklog) {
    const atual = verIssue(alvo.numero);
    if (!atual) {
      continue;
    }
    if ((atual.labels || []).some((r) => r.name === ROTULO_BACKLOG)) {
      jaTinham += 1;
      continue;
    }
    gh(['issue', 'edit', String(alvo.numero), '--repo', REPOSITORIO, '--add-label', ROTULO_BACKLOG]);
    aplicados += 1;
    console.log(`  #${alvo.numero} recebeu o rótulo.`);
    esperar(PAUSA_MS);
  }

  console.log(`  ${aplicados} rotuladas, ${jaTinham} já tinham.`);
}

// ---------------------------------------------------------------------------
// Execução
// ---------------------------------------------------------------------------

function principal() {
  exigir(CAMINHO_MATRIZ, 'Matriz');
  exigir(CAMINHO_BACKLOG, 'Backlog');
  exigir(CAMINHO_CARDS, 'Registro de cards');

  const matriz = lerCsv(fs.readFileSync(CAMINHO_MATRIZ, 'utf8'));
  const backlog = lerCsv(fs.readFileSync(CAMINHO_BACKLOG, 'utf8'));
  const cards = JSON.parse(fs.readFileSync(CAMINHO_CARDS, 'utf8'));

  const calculo = calcular(matriz.registros, backlog.registros);
  const idsDoBacklog = new Set(
    backlog.registros.map((r) => calculo.porRegistro.get(r)?.idNovo).filter(Boolean),
  );

  console.log(`Repositório: ${REPOSITORIO}`);
  console.log(`Escopo: ${matriz.registros.length} casos · Backlog: ${backlog.registros.length} casos`);
  console.log(
    `Grupos: ${Object.entries(calculo.contador).map(([g, n]) => `${g} ${n}`).join(', ')}`,
  );
  console.log(`Modo: ${EXECUTAR ? 'EXECUÇÃO' : 'simulação, nada será alterado'}\n`);

  const total = matriz.registros.length + backlog.registros.length;
  const distintos = new Set(calculo.porNovo.keys()).size;
  if (distintos !== total) {
    console.error(`Erro: ${total} casos geraram ${distintos} identificadores. Há colisão.`);
    process.exit(1);
  }

  if (calculo.ambiguos.size > 0) {
    console.warn(
      `Aviso: identificadores reaproveitados entre o esquema velho e o novo: ` +
        `${[...calculo.ambiguos].join(', ')}. Não afeta a renomeação, que localiza ` +
        `a issue pelo identificador CRIT original, único por caso.\n`,
    );
  }

  if (fases.issues || fases.rotulos) {
    conferirAmbiente();
  }

  // A fase de planilha roda antes das de issue de propósito: o corpo da issue
  // cita o arquivo previsto e o comando, que só ficam certos depois dela.
  if (fases.csv) {
    faseCsv(matriz, backlog, calculo);
  }

  if (fases.issues || fases.rotulos) {
    const alvos = montarAlvos(calculo, cards, idsDoBacklog);
    if (fases.issues) {
      faseIssues(alvos);
    }
    if (fases.rotulos) {
      faseRotulos(alvos);
    }
  }

  if (!EXECUTAR) {
    console.log('\nNada foi alterado. Repita o comando com --executar para aplicar.');
  }
}

principal();
