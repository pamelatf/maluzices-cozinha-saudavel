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
 * Cada dupla carrega só quando a linha dela aparece na tela. Com quase
 * trinta duplas, carregar todas de uma vez travaria a abertura do painel por
 * causa de uma tela que vai ser removida.
 */

const google = (familias) => `https://fonts.googleapis.com/css2?family=${familias}&display=swap`;

export const GRUPOS = [
  {
    nome: 'Clássicas e calorosas',
    nota: 'Serifa no título. Conversam com o oliva e o terracota da marca.',
    duplas: [
      {
        id: 'atual', nome: 'A atual',
        descricao: 'Cormorant Garamond e Jost. Delicada e elegante, com números finos.',
        titulo: "'Cormorant Garamond', Georgia, serif", texto: "'Jost', system-ui, sans-serif",
        css: google('Cormorant+Garamond:wght@400;500;600&family=Jost:wght@200;300;400;500')
      },
      {
        id: 'fraunces', nome: 'Fraunces e Inter',
        descricao: 'Serifa macia e artesanal. A mais próxima de marca de comida feita à mão.',
        titulo: "'Fraunces', Georgia, serif", texto: "'Inter', system-ui, sans-serif",
        css: google('Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@300;400;500;600')
      },
      {
        id: 'young', nome: 'Young Serif e Work Sans',
        descricao: 'Encorpada e rústica. Peso forte, bem de cozinha.',
        titulo: "'Young Serif', Georgia, serif", texto: "'Work Sans', system-ui, sans-serif",
        css: google('Young+Serif&family=Work+Sans:wght@300;400;500;600')
      },
      {
        id: 'dm', nome: 'DM Serif e DM Sans',
        descricao: 'Mesma família. Moderna, redonda e amigável.',
        titulo: "'DM Serif Display', Georgia, serif", texto: "'DM Sans', system-ui, sans-serif",
        css: google('DM+Serif+Display&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600')
      },
      {
        id: 'playfair', nome: 'Playfair e Source Sans',
        descricao: 'Editorial clássica, de revista. Contraste alto nos títulos.',
        titulo: "'Playfair Display', Georgia, serif", texto: "'Source Sans 3', system-ui, sans-serif",
        css: google('Playfair+Display:wght@400;500;600&family=Source+Sans+3:wght@300;400;500;600')
      },
      {
        id: 'lora', nome: 'Lora e Karla',
        descricao: 'Calorosa e muito legível. A mais segura para tabela longa.',
        titulo: "'Lora', Georgia, serif", texto: "'Karla', system-ui, sans-serif",
        css: google('Lora:wght@400;500;600&family=Karla:wght@300;400;500;600')
      },
      {
        id: 'instrument', nome: 'Instrument Serif e Inter',
        descricao: 'Contemporânea e enxuta. Título marcante, resto discreto.',
        titulo: "'Instrument Serif', Georgia, serif", texto: "'Inter', system-ui, sans-serif",
        css: google('Instrument+Serif&family=Inter:wght@300;400;500;600')
      },
      {
        id: 'epilogue', nome: 'Epilogue',
        descricao: 'Sem serifa nas duas. Direta e atual, menos romântica.',
        titulo: "'Epilogue', system-ui, sans-serif", texto: "'Epilogue', system-ui, sans-serif",
        css: google('Epilogue:wght@300;400;500;600;700')
      }
    ]
  },
  {
    nome: 'Modernas e técnicas',
    nota: 'Sem serifa. Deixam o sistema com cara de produto digital, mais frio que a paleta.',
    duplas: [
      {
        id: 'grotesk-inter', nome: 'Space Grotesk e Inter',
        descricao: 'Moderno, tech e limpo.',
        titulo: "'Space Grotesk', system-ui, sans-serif", texto: "'Inter', system-ui, sans-serif",
        css: google('Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600')
      },
      {
        id: 'grotesk-plex', nome: 'Space Grotesk e IBM Plex Sans',
        descricao: 'Técnico, sofisticado e voltado para engenharia.',
        titulo: "'Space Grotesk', system-ui, sans-serif", texto: "'IBM Plex Sans', system-ui, sans-serif",
        css: google('Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600')
      },
      {
        id: 'manrope-inter', nome: 'Manrope e Inter',
        descricao: 'Moderno, leve e amigável.',
        titulo: "'Manrope', system-ui, sans-serif", texto: "'Inter', system-ui, sans-serif",
        css: google('Manrope:wght@400;500;600;700&family=Inter:wght@300;400;500;600')
      },
      {
        id: 'plex-mono', nome: 'IBM Plex Sans e IBM Plex Mono',
        descricao: 'Identidade de API e dev. Mono no corpo inteiro: veja como fica a tabela.',
        titulo: "'IBM Plex Sans', system-ui, sans-serif", texto: "'IBM Plex Mono', ui-monospace, monospace",
        css: google('IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@300;400;500')
      },
      {
        id: 'grotesk-mono', nome: 'Space Grotesk e IBM Plex Mono',
        descricao: 'Experimental e tecnológico. Mono no corpo inteiro.',
        titulo: "'Space Grotesk', system-ui, sans-serif", texto: "'IBM Plex Mono', ui-monospace, monospace",
        css: google('Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500')
      },
      {
        id: 'sora-inter', nome: 'Sora e Inter',
        descricao: 'Moderno e futurista.',
        titulo: "'Sora', system-ui, sans-serif", texto: "'Inter', system-ui, sans-serif",
        css: google('Sora:wght@400;500;600;700&family=Inter:wght@300;400;500;600')
      },
      {
        id: 'sora-manrope', nome: 'Sora e Manrope',
        descricao: 'Moderno, arredondado e amigável.',
        titulo: "'Sora', system-ui, sans-serif", texto: "'Manrope', system-ui, sans-serif",
        css: google('Sora:wght@400;500;600;700&family=Manrope:wght@300;400;500;600')
      },
      {
        id: 'dmsans-grotesk', nome: 'DM Sans e Space Grotesk',
        descricao: 'Minimalista e contemporâneo.',
        titulo: "'DM Sans', system-ui, sans-serif", texto: "'Space Grotesk', system-ui, sans-serif",
        css: google('DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Space+Grotesk:wght@300;400;500')
      },
      {
        id: 'jakarta-grotesk', nome: 'Plus Jakarta Sans e Space Grotesk',
        descricao: 'Moderno e elegante.',
        titulo: "'Plus Jakarta Sans', system-ui, sans-serif", texto: "'Space Grotesk', system-ui, sans-serif",
        css: google('Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500')
      },
      {
        id: 'jakarta-mono', nome: 'Plus Jakarta Sans e IBM Plex Mono',
        descricao: 'Produto digital com tecnologia. Mono no corpo inteiro.',
        titulo: "'Plus Jakarta Sans', system-ui, sans-serif", texto: "'IBM Plex Mono', ui-monospace, monospace",
        css: google('Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500')
      },
      {
        id: 'outfit-inter', nome: 'Outfit e Inter',
        descricao: 'Moderno e visualmente leve.',
        titulo: "'Outfit', system-ui, sans-serif", texto: "'Inter', system-ui, sans-serif",
        css: google('Outfit:wght@400;500;600;700&family=Inter:wght@300;400;500;600')
      },
      {
        id: 'outfit-plex', nome: 'Outfit e IBM Plex Sans',
        descricao: 'Limpo e tecnológico.',
        titulo: "'Outfit', system-ui, sans-serif", texto: "'IBM Plex Sans', system-ui, sans-serif",
        css: google('Outfit:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600')
      },
      {
        id: 'archivo-grotesk', nome: 'Archivo e Space Grotesk',
        descricao: 'Mais sério e profissional.',
        titulo: "'Archivo', system-ui, sans-serif", texto: "'Space Grotesk', system-ui, sans-serif",
        css: google('Archivo:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500')
      },
      {
        id: 'archivo-mono', nome: 'Archivo e IBM Plex Mono',
        descricao: 'Técnico e direto. Mono no corpo inteiro.',
        titulo: "'Archivo', system-ui, sans-serif", texto: "'IBM Plex Mono', ui-monospace, monospace",
        css: google('Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500')
      },
      {
        id: 'urbanist-inter', nome: 'Urbanist e Inter',
        descricao: 'Moderno e mais descontraído.',
        titulo: "'Urbanist', system-ui, sans-serif", texto: "'Inter', system-ui, sans-serif",
        css: google('Urbanist:wght@400;500;600;700&family=Inter:wght@300;400;500;600')
      },
      {
        id: 'syne-inter', nome: 'Syne e Inter',
        descricao: 'Autoral e diferente. A mais fora da curva da lista.',
        titulo: "'Syne', system-ui, sans-serif", texto: "'Inter', system-ui, sans-serif",
        css: google('Syne:wght@400;500;600;700&family=Inter:wght@300;400;500;600')
      },
      {
        id: 'syne-plex', nome: 'Syne e IBM Plex Sans',
        descricao: 'Criativo com técnico.',
        titulo: "'Syne', system-ui, sans-serif", texto: "'IBM Plex Sans', system-ui, sans-serif",
        css: google('Syne:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600')
      },
      {
        id: 'bricolage-inter', nome: 'Bricolage Grotesque e Inter',
        descricao: 'Personalidade forte no título, legibilidade boa no resto.',
        titulo: "'Bricolage Grotesque', system-ui, sans-serif", texto: "'Inter', system-ui, sans-serif",
        css: google('Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=Inter:wght@300;400;500;600')
      },
      {
        id: 'general-inter', nome: 'General Sans e Inter',
        descricao: 'Minimalista e sofisticado. Esta vem da Fontshare, não do Google Fonts.',
        titulo: "'General Sans', system-ui, sans-serif", texto: "'Inter', system-ui, sans-serif",
        css: 'https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap',
        extra: google('Inter:wght@300;400;500;600')
      },
      {
        id: 'lexend-grotesk', nome: 'Lexend e Space Grotesk',
        descricao: 'Moderno, acessível e tecnológico. A Lexend foi desenhada para leitura fácil.',
        titulo: "'Lexend', system-ui, sans-serif", texto: "'Space Grotesk', system-ui, sans-serif",
        css: google('Lexend:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500')
      }
    ]
  }
];

export const DUPLAS = GRUPOS.flatMap((g) => g.duplas);

const CHAVE = 'maluzices-fonte';

function carregar(dupla) {
  [dupla.css, dupla.extra].filter(Boolean).forEach((href, n) => {
    const id = `fonte-${dupla.id}-${n}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  });
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
      <p class="sel-nota">${DUPLAS.length} duplas. Clique para ver aplicada no sistema inteiro. A escolha fica salva neste navegador.</p>
      ${GRUPOS.map((g) => `
        <div class="sel-grupo">${g.nome}</div>
        <p class="sel-grupo-nota">${g.nota}</p>
        ${g.duplas.map((d) => `
          <button class="sel-opcao ${d.id === atual ? 'ativa' : ''}" data-dupla="${d.id}">
            <span class="sel-amostra" style="font-family:${d.titulo}">${d.nome}</span>
            <span class="sel-numero" style="font-family:${d.titulo}">R$ 1.790,77</span>
            <span class="sel-desc" style="font-family:${d.texto}">${d.descricao}</span>
          </button>`).join('')}`).join('')}
    </div>`;
  document.body.appendChild(caixa);

  const puxador = caixa.querySelector('.sel-puxador');
  const painel = caixa.querySelector('.sel-painel');

  /* As amostras carregam em fila, na ordem da lista, uma a cada 120 ms.
     De uma vez seriam quase sessenta downloads de fonte no mesmo instante,
     e por rolagem as duplas do meio nunca carregariam quando alguém pula
     direto para o fim do painel. Em fila, as de cima ficam prontas primeiro
     e nenhuma fica para trás. */
  let fila = null;
  function carregarEmFila() {
    if (fila) return;
    let i = 0;
    fila = setInterval(() => {
      if (i >= DUPLAS.length) { clearInterval(fila); return; }
      carregar(DUPLAS[i]);
      i += 1;
    }, 120);
  }

  puxador.addEventListener('click', () => {
    const aberto = !painel.hidden;
    painel.hidden = aberto;
    puxador.setAttribute('aria-expanded', String(!aberto));
    if (!aberto) carregarEmFila();
  });

  caixa.addEventListener('click', (evento) => {
    const opcao = evento.target.closest('[data-dupla]');
    if (!opcao) return;
    aplicarDupla(opcao.dataset.dupla);
    caixa.querySelectorAll('.sel-opcao').forEach((b) => b.classList.remove('ativa'));
    opcao.classList.add('ativa');
  });
}
