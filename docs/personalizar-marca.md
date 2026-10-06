# Personalizar o sistema para um cliente

O sistema é o mesmo para todos. O que muda de cliente para cliente está em
**dois arquivos**, e em mais nenhum. Não existe nome de cliente escrito no
meio do código das telas.

Tempo estimado: 15 a 30 minutos, dependendo de o cliente ter manual de marca
ou só uma logo.

---

## 1. O nome e os textos

Arquivo: `prototipo/js/marca.js`

| Campo | O que é | Exemplo |
| --- | --- | --- |
| `nome` | Nome que aparece na barra lateral e no título da aba | `Maluzices` |
| `logo` | Caminho da imagem da logo. Quando preenchido, substitui o nome e o slogan em texto | `img/logo-oliva.png` |
| `logoLargura` | Largura da logo na barra lateral, em pixels | `186` |
| `destaque` | Só sem logo: letra do nome que vira desenho | `i` |
| `slogan` | Linha abaixo do nome, quando não há logo | `cozinha saudável` |
| `simbolo` | Só sem logo: o desenho que substitui a letra, em SVG | a colher |
| `simboloViewBox` | A área do desenho | `0 0 12 26` |
| `mensagemWhatsapp` | Texto que já vem escrito ao abrir a conversa | usa `{marca}` |
| `rodape` | Linha do rodapé das telas | |

**Cliente sem símbolo no logotipo:** deixe `destaque` e `simbolo` vazios. O
nome aparece inteiro, em texto, e nada quebra.

**Cliente com logo pronta:** ponha o arquivo em `prototipo/img/` e aponte
`logo` para ele. A logo substitui o nome e o slogan: repetir o nome em texto
embaixo de uma logo que já traz o nome é mostrar a mesma informação duas
vezes, em dois desenhos diferentes.

**Formato da logo:** peça o **SVG** à designer do cliente. Ele fica perfeito
em qualquer tela e em qualquer tamanho. PNG serve, mas exporte com pelo menos
três vezes a largura de exibição, senão borra em tela de alta densidade.

**Cor da logo:** escolha a versão que contrasta com o fundo da barra lateral.
Barra clara pede a versão escura da logo; barra escura pede a versão clara.

---

## 2. As cores e as fontes

Arquivo: `prototipo/css/estilos.css`, bloco `:root` no topo

As cores têm nome pelo papel que cumprem, não pela aparência. Trocar o valor
de uma delas muda todos os lugares onde aquele papel aparece.

| Variável | Papel |
| --- | --- |
| `--verde` | Ações, navegação ativa, positivo |
| `--verde-escuro` | Identidade, títulos de maior destaque |
| `--verde-suave` | Bordas, trilhos de barra, superfícies de apoio |
| `--verde-fundo` | Áreas secundárias |
| `--creme` | Áreas secundárias quentes |
| `--fundo` | Fundo geral da aplicação |
| `--branco` | Cartões e áreas de conteúdo |
| `--laranja` | Atenção, gastos, destaques financeiros |
| `--laranja-suave` | Fundo de aviso e de selo de atenção |
| `--erro` | Erro e cancelamento, e nada mais |
| `--informacao` | Em andamento, informativo |
| `--texto` / `--texto-suave` | Texto principal e secundário |

As fontes são `--fonte-titulo`, `--fonte-texto` e `--fonte-slogan`, no mesmo
bloco. Trocar exige também trocar o endereço do Google Fonts em
`prototipo/index.html`, linha 10.

### Cuidados ao trocar cor

- **Contraste.** Texto sobre fundo precisa continuar legível. A barra lateral
  usa `--verde-escuro` de fundo com texto claro: um verde-escuro claro demais
  derruba a leitura inteira.
- **Não troque o papel.** Se a marca do cliente é laranja, a tentação é pôr
  laranja em `--verde`. Isso faz botão de ação e aviso de gasto virarem a
  mesma cor. Prefira usar a cor da marca em `--verde-escuro`, que é
  identidade, e manter uma cor de ação distinta.
- **Vermelho é só erro.** Não use `--erro` para dar destaque a nada.
- **Gráficos.** As variáveis `--g-*` derivam das cores acima. Se a marca do
  cliente tem só um tom, os três do gráfico ficam parecidos: aí vale abrir
  claridades diferentes do mesmo tom em vez de inventar uma cor nova.

---

## 3. Conferir antes de entregar

- Abra todas as telas do menu. A logo do cliente aparece na barra lateral e
  o nome no título da aba.
- Veja a barra lateral no celular: ela vira uma faixa no topo, e uma logo
  larga demais empurra o menu para baixo.
- Abra um pedido e clique no ícone do WhatsApp. A mensagem tem que citar o
  nome do cliente.
- Olhe a tela inicial em tela larga e no celular.
- Rode `python3 ferramentas/carimbar-versao.py` antes de publicar, senão o
  navegador de quem já usou o sistema continua servindo o visual antigo.
