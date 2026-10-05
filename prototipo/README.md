# Protótipo do sistema

Protótipo navegável do sistema do Maluzices, publicado no GitHub Pages. É uma
aplicação estática, sem build e sem back-end.

É uma página só, com menu lateral fixo, e duas áreas:

- **Painel de pedidos**, o quadro por situação. Veio do antigo
  `web/painel-maluzices.html` e virou uma seção da aplicação; os estilos dele
  ficam em `css/pedidos.css`, escopados em `.pedidos-escopo` porque reusam
  nomes de classe do financeiro. O front em React de `web/` segue sendo a
  versão de produção dessa tela.
- **Visão geral**: o painel de abertura, com indicadores do período, evolução
  mensal, gastos por categoria, faturamento por dia da semana, produtos
  vendidos e situação dos pedidos.
- **Módulo financeiro**: ficha técnica, margem por produto, precificação,
  insumos, custos e configurações.

## O que é real e o que é de mentira

Real:

- O cálculo de custo, CMV e preço sugerido, em `js/calculo.js`
- A resolução de sub-receitas: o frango desfiado tem ficha própria e vira insumo
  nas fichas que o usam, com o preço por quilo saindo do custo da própria ficha
- Os indicadores da visão geral, em `js/indicadores.js`, que derivam das mesmas
  vendas e custos que as outras telas usam. Os gastos de um mês na visão geral
  são a soma dos lançamentos daquele mês na tela de Custos
- As interações: mudar a quantidade de um insumo, mudar o preço de um insumo,
  mudar um parâmetro na configuração e aplicar preços em lote recalculam tudo

De mentira:

- Os dados, que são de exemplo e vivem só na memória do navegador. O histórico
  de vendas é gerado em `js/dados.js`, de forma determinística, a partir dos
  produtos do catálogo

## O que o protótipo não inventa

As telas mostram só o que sai da base. Nada de número estimado pelo sistema,
nem gráfico sobre dado que ninguém mediu. Por isso saíram daqui o histórico de
preço de insumo, que o sistema não guarda, e os valores de contas a receber,
que não existem no domínio.

Gráfico só na visão geral. As demais telas são tabela e texto, porque são telas
de consulta e de lançamento, onde o número exato vale mais que a forma.

## Como o cálculo funciona

```
fator de correção     = peso líquido / peso bruto do insumo
peso bruto necessário = quantidade da receita / fator de correção
custo do ingrediente  = peso bruto necessário * preço por quilo
custo da receita      = soma dos ingredientes
custo por porção      = custo da receita / rendimento * (1 + perda) + embalagem
preço sugerido        = custo por porção / meta de CMV, arredondado
CMV real              = custo por porção / preço praticado
```

A meta de CMV vem, nesta ordem, do produto, da categoria dele, ou do parâmetro
padrão.

## Rodar localmente

Qualquer servidor estático serve. Os arquivos usam módulos ES, então abrir o
`index.html` direto pelo sistema de arquivos não funciona.

```bash
cd prototipo
python3 -m http.server 8777
# abra http://localhost:8777
```

## Estrutura

```
prototipo/
  index.html        casca da aplicação
  modelo-custos.csv modelo para a importação de custos
  img/              marca e ícones
  css/estilos.css   paleta e tipografia da marca, iguais às de web/
  css/pedidos.css   estilos do painel de pedidos, escopados
  js/calculo.js     motor de cálculo, sem dependência de tela
  js/indicadores.js indicadores da visão geral, também sem tela
  js/graficos.js    gráficos em SVG, devolvem marcação pronta
  js/dados.js       dados de exemplo e geração do histórico
  js/pedidos.js     painel de pedidos: marcação, regras de situação e validação
  js/app.js         telas, rotas e eventos
```

Os gráficos são SVG escrito à mão, sem biblioteca: o protótipo não tem build
nem dependência, e qualquer biblioteca traria um visual próprio que teria de
ser desfeito para seguir a identidade da marca.

`calculo.js` e `indicadores.js` não dependem do navegador, de propósito: podem
ser importados direto por uma suíte de testes.
