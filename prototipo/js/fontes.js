/**
 * Seletor de fontes. É temporário: existe só para escolher a dupla do
 * sistema vendo ela nas telas de verdade, e sai quando a decisão for tomada.
 *
 * Página de amostra engana. Toda fonte é bonita em 72px escrevendo uma
 * frase solta. O que decide aqui é outra coisa: como ela se comporta nos
 * números grandes dos indicadores e numa tabela de 25 linhas repetindo
 * R$ 1.790,77. Por isso o seletor troca a fonte no protótipo inteiro em vez
 * de mostrar um cartãozinho de exemplo.
 *
 * As fontes são carregadas sob demanda, uma dupla por vez: carregar as
 * dezesseis de uma vez deixaria a abertura da página lenta por causa de uma
 * tela que vai ser removida.
 */

export const DUPLAS = [
  {
    id: 'atual',
    nome: 'A atual',
    descricao: 'Delicada e elegante, com números finos.',
    titulo: "'Cormorant Garamond', Georgia, serif",
    texto: "'Jost', system-ui, sans-serif",
    google: 'Cormorant+Garamond:wght@400;500;600&family=Jost:wght@200;300;400;500'
  },
  {
    id: 'fraunces',
    nome: 'Fraunces e Inter',
    descricao: 'Serifa macia e artesanal. A mais próxima de marca de comida feita à mão.',
    titulo: "'Fraunces', Georgia, serif",
    texto: "'Inter', system-ui, sans-serif",
    google: 'Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@300;400;500;600'
  },
  {
    id: 'young',
    nome: 'Young Serif e Work Sans',
    descricao: 'Encorpada e rústica. Peso forte, bem de cozinha.',
    titulo: "'Young Serif', Georgia, serif",
    texto: "'Work Sans', system-ui, sans-serif",
    google: 'Young+Serif&family=Work+Sans:wght@300;400;500;600'
  },
  {
    id: 'dm',
    nome: 'DM Serif e DM Sans',
    descricao: 'Mesma família. Moderna, redonda e amigável.',
    titulo: "'DM Serif Display', Georgia, serif",
    texto: "'DM Sans', system-ui, sans-serif",
    google: 'DM+Serif+Display&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600'
  },
  {
    id: 'playfair',
    nome: 'Playfair e Source Sans',
    descricao: 'Editorial clássica, de revista. Contraste alto nos títulos.',
    titulo: "'Playfair Display', Georgia, serif",
    texto: "'Source Sans 3', system-ui, sans-serif",
    google: 'Playfair+Display:wght@400;500;600&family=Source+Sans+3:wght@300;400;500;600'
  },
  {
    id: 'lora',
    nome: 'Lora e Karla',
    descricao: 'Calorosa e muito legível. A mais segura para tabela longa.',
    titulo: "'Lora', Georgia, serif",
    texto: "'Karla', system-ui, sans-serif",
    google: 'Lora:wght@400;500;600&family=Karla:wght@300;400;500;600'
  },
  {
    id: 'instrument',
    nome: 'Instrument Serif e Inter',
    descricao: 'Contemporânea e enxuta. Título marcante, resto discreto.',
    titulo: "'Instrument Serif', Georgia, serif",
    texto: "'Inter', system-ui, sans-serif",
    google: 'Instrument+Serif&family=Inter:wght@300;400;500;600'
  },
  {
    id: 'epilogue',
    nome: 'Epilogue, sem serifa',
    descricao: 'Sem serifa nenhuma. Direta e atual, menos romântica.',
    titulo: "'Epilogue', system-ui, sans-serif",
    texto: "'Epilogue', system-ui, sans-serif",
    google: 'Epilogue:wght@300;400;500;600;700'
  }
];

const CHAVE = 'maluzices-fonte';

function carregar(dupla) {
  const id = `fonte-${dupla.id}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${dupla.google}&display=swap`;
  document.head.appendChild(link);
}

export function aplicarDupla(id) {
  const dupla = DUPLAS.find((d) => d.id === id) || DUPLAS[0];
  carregar(dupla);
  document.documentElement.style.setProperty('--fonte-titulo', dupla.titulo);
  document.documentElement.style.setProperty('--fonte-texto', dupla.texto);
  try { localStorage.setItem(CHAVE, dupla.id); } catch (e) { /* navegador privado */ }
  return dupla;
}

export function duplaEscolhida() {
  try { return localStorage.getItem(CHAVE) || 'atual'; } catch (e) { return 'atual'; }
}

export function montarSeletor() {
  const atual = duplaEscolhida();
  if (atual !== 'atual') aplicarDupla(atual);

  const caixa = document.createElement('div');
  caixa.className = 'sel-fontes';
  caixa.innerHTML = `
    <button class="sel-puxador" aria-expanded="false">Fontes</button>
    <div class="sel-painel" hidden>
      <p class="sel-nota">Clique para ver a dupla aplicada no sistema inteiro. A escolha fica salva neste navegador.</p>
      ${DUPLAS.map((d) => `
        <button class="sel-opcao ${d.id === atual ? 'ativa' : ''}" data-dupla="${d.id}">
          <span class="sel-amostra" style="font-family:${d.titulo}">${d.nome}</span>
          <span class="sel-numero" style="font-family:${d.titulo}">R$ 1.790,77</span>
          <span class="sel-desc" style="font-family:${d.texto}">${d.descricao}</span>
        </button>`).join('')}
    </div>`;
  document.body.appendChild(caixa);

  const puxador = caixa.querySelector('.sel-puxador');
  const painel = caixa.querySelector('.sel-painel');

  puxador.addEventListener('click', () => {
    const aberto = !painel.hidden;
    painel.hidden = aberto;
    puxador.setAttribute('aria-expanded', String(!aberto));
    // as amostras só ficam honestas depois que a fonte carrega
    if (aberto) return;
    DUPLAS.forEach(carregar);
  });

  caixa.addEventListener('click', (evento) => {
    const opcao = evento.target.closest('[data-dupla]');
    if (!opcao) return;
    aplicarDupla(opcao.dataset.dupla);
    caixa.querySelectorAll('.sel-opcao').forEach((b) => b.classList.remove('ativa'));
    opcao.classList.add('ativa');
  });
}
