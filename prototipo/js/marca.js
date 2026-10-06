/**
 * A marca do cliente, num lugar só.
 *
 * O sistema é o mesmo para todo mundo; o que muda de cliente para cliente é
 * o que está aqui e as cores do bloco :root em css/estilos.css. Personalizar
 * uma instalação é mexer nesses dois lugares, e em mais nenhum: nenhuma tela
 * tem o nome do cliente escrito no meio do código.
 *
 * O passo a passo está em docs/personalizar-marca.md.
 */

export const marca = {
  /* O nome que aparece na barra lateral e no título da aba. `destaque` é a
     letra trocada pelo desenho, e fica vazio em quem não tem esse recurso
     no logotipo. */
  nome: 'Maluzices',
  destaque: 'i',

  slogan: 'cozinha saudável',

  /* Desenho que substitui a letra em destaque. Vazio = sem substituição, e
     o nome aparece inteiro, em texto. O viewBox é estreito de propósito:
     o desenho ocupa o lugar de uma letra, não de um ícone. */
  simboloViewBox: '0 0 12 26',
  simbolo: '<ellipse cx="6" cy="5" rx="4" ry="4.5"></ellipse><path d="M6 10v15"></path>',

  /* Marcadores trocados na hora de abrir a conversa:
     {cliente} {itens} {total} {situacao} */
  mensagemWhatsapp: 'Oi {cliente}, aqui é do {marca}. Seu pedido ({itens}), no valor de {total}, está {situacao}.',

  rodape: 'Protótipo funcional do sistema. Os cálculos de custo, CMV e preço sugerido são reais; '
        + 'os dados são de exemplo e ficam só na memória do navegador, então recarregar a página '
        + 'volta ao estado inicial.'
};

/** O nome com a letra de destaque virando desenho, para a barra lateral. */
export function nomeDaMarcaEmHtml() {
  const { nome, destaque, simbolo, simboloViewBox } = marca;
  if (!destaque || !simbolo) return nome;

  const corte = nome.indexOf(destaque);
  if (corte < 0) return nome;

  const desenho = `<svg class="colher-i" viewBox="${simboloViewBox}" aria-hidden="true">${simbolo}</svg>`;
  return nome.slice(0, corte) + desenho + nome.slice(corte + destaque.length);
}

/** Texto com {marca} resolvido, para não repetir o nome por aí. */
export function comNomeDaMarca(texto) {
  return String(texto).replace(/\{marca\}/g, marca.nome);
}
