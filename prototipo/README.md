# Protótipo do módulo financeiro

Protótipo navegável do módulo financeiro do Maluzices: ficha técnica, custo por
porção, CMV e precificação. É uma aplicação estática, sem build e sem back-end,
publicada no GitHub Pages.

## O que é real e o que é de mentira

Real:

- O cálculo de custo, CMV e preço sugerido, em `js/calculo.js`
- A resolução de sub-receitas: o frango desfiado tem ficha própria e vira insumo
  nas fichas que o usam, com o preço por quilo saindo do custo da própria ficha
- As interações: mudar a quantidade de um insumo, mudar o preço de um insumo,
  mudar um parâmetro na configuração e aplicar preços em lote recalculam tudo

De mentira:

- Os dados, que são de exemplo e vivem só na memória do navegador
- Faturamento e contas a receber do painel, que no sistema viriam dos pedidos

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
  css/estilos.css   paleta e tipografia da marca, iguais às de web/
  js/calculo.js     motor de cálculo, sem dependência de tela
  js/dados.js       dados de exemplo
  js/app.js         telas e eventos
```

`calculo.js` não depende do navegador, de propósito: ele pode ser importado
direto por uma suíte de testes.
