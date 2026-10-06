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

  /* Logo em imagem. Quando preenchida, ela substitui o nome e o slogan em
     texto: é a logo oficial do cliente, e não uma imitação feita em CSS.
     `largura` é em pixels, na barra lateral.

     O ideal é um SVG, que fica perfeito em qualquer tela. Este PNG tem fundo
     transparente e é o mesmo das telas de login e cadastro, em cerca de
     quatro vezes o tamanho de exibição, para não borrar em tela de alta
     densidade. */
  logo: 'img/logo-maluzices-horizontal.png',
  logoLargura: 186,

  /* Usados só quando não há logo em imagem: o nome vira texto e esta letra
     vira o desenho abaixo. */
  simboloViewBox: '0 0 12 26',
  simbolo: '<ellipse cx="6" cy="5" rx="4" ry="4.5"></ellipse><path d="M6 10v15"></path>',

  /* Marcadores trocados na hora de abrir a conversa:
     {cliente} {itens} {total} {situacao} */
  mensagemWhatsapp: 'Oi {cliente}, aqui é do {marca}. Seu pedido ({itens}), no valor de {total}, está {situacao}.',

  rodape: 'Protótipo funcional do sistema. Os cálculos de custo, CMV e preço sugerido são reais; '
        + 'os dados são de exemplo e ficam só na memória do navegador, então recarregar a página '
        + 'volta ao estado inicial.'
};

/**
 * O bloco da marca na barra lateral.
 *
 * Com `logo` preenchida, é a imagem e nada mais: pôr o nome em texto embaixo
 * de uma logo que já traz o nome é repetir a mesma informação duas vezes, em
 * dois desenhos diferentes.
 *
 * Sem ela, o nome vira texto e a letra de destaque vira o desenho.
 */
export function marcaEmHtml() {
  const { nome, slogan, logo, logoLargura, destaque, simbolo, simboloViewBox } = marca;

  if (logo) {
    return `<img src="${logo}" alt="${nome}${slogan ? ', ' + slogan : ''}" `
         + `style="width:${logoLargura}px" class="marca-logo">`;
  }

  const corte = destaque ? nome.indexOf(destaque) : -1;
  const desenho = simbolo
    ? `<svg class="colher-i" viewBox="${simboloViewBox}" aria-hidden="true">${simbolo}</svg>`
    : '';
  const escrito = corte >= 0 && desenho
    ? nome.slice(0, corte) + desenho + nome.slice(corte + destaque.length)
    : nome;

  return `<div class="marca-nome">${escrito}</div>`
       + (slogan ? `<div class="marca-tag">${slogan.toUpperCase()}</div>` : '');
}
