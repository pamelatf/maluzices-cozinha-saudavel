/**
 * Base do Maluzices, convertida da planilha de ficha técnica.
 *
 * ESTE ARQUIVO É GERADO. Não edite à mão: rode
 *   python3 ferramentas/converter-planilha.py <planilha>.xlsx
 *
 * Insumos: 163 | Fichas: 73 | Vendáveis: 12
 */

export const categorias = [
  {
    "id": "caldos",
    "nome": "Caldos",
    "metaCmv": 0.3133,
    "ativa": true
  },
  {
    "id": "paes",
    "nome": "Pães",
    "metaCmv": 0.185,
    "ativa": true
  },
  {
    "id": "salgados-assados",
    "nome": "Salgados assados",
    "metaCmv": 0.246,
    "ativa": true
  },
  {
    "id": "salgados-fritos",
    "nome": "Salgados fritos",
    "metaCmv": 0.17,
    "ativa": true
  },
  {
    "id": "sanduiches",
    "nome": "Sanduíches",
    "metaCmv": 0.3,
    "ativa": true
  },
  {
    "id": "bebidas",
    "nome": "Bebidas",
    "metaCmv": 0.3,
    "ativa": true
  },
  {
    "id": "massas-e-bases",
    "nome": "Massas e bases",
    "metaCmv": 0.2,
    "ativa": true
  },
  {
    "id": "outros",
    "nome": "Outros",
    "metaCmv": 0.3,
    "ativa": true
  }
];

export const fornecedores = [
  {
    "id": "ademir",
    "nome": "Ademir",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "ares",
    "nome": "Ares",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "ares-da-natureza",
    "nome": "Ares da Natureza",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "argentina",
    "nome": "Argentina",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "cacau-show",
    "nome": "Cacau Show",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "cantina",
    "nome": "Cantina",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "cantina-da-fruta",
    "nome": "Cantina da Fruta",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "cedro",
    "nome": "Cedro",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "cipra",
    "nome": "Cipra",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "cometa",
    "nome": "Cometa",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "equi",
    "nome": "Equi",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "equilibrium",
    "nome": "Equilibrium",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "farmacia",
    "nome": "Farmacia",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "feirinha",
    "nome": "Feirinha",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "fruteira",
    "nome": "Fruteira",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "ingredientes-online",
    "nome": "Ingredientes Online",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "marcon-atacado-beltrao",
    "nome": "Marcon Atacado Beltrao",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "marcon-atadaco-beltrao",
    "nome": "Marcon Atadaco Beltrao",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "melo",
    "nome": "Melo",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "mercado-livre",
    "nome": "Mercado Livre",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "oraganicos-e-cia",
    "nome": "Oraganicos e Cia",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "oraganicos-e-cia-beltrao",
    "nome": "Oraganicos e Cia Beltrao",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "organicos-e-cia",
    "nome": "Organicos e Cia",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "peperina",
    "nome": "Peperina",
    "telefone": "",
    "email": "",
    "ativa": true
  },
  {
    "id": "rafa",
    "nome": "Rafa",
    "telefone": "",
    "email": "",
    "ativa": true
  }
];

export const unidades = [
  {
    "id": "quilo",
    "nome": "Quilo",
    "sigla": "kg",
    "conversao": "base do cálculo",
    "ativa": true
  },
  {
    "id": "litro",
    "nome": "Litro",
    "sigla": "L",
    "conversao": "1 L tratado como 1 kg",
    "ativa": true
  },
  {
    "id": "unidade",
    "nome": "Unidade",
    "sigla": "un",
    "conversao": "peso por unidade a informar",
    "ativa": true
  }
];

export const insumos = [
  {
    "id": "alho-descascado",
    "nome": "Alho Descascado",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.88,
    "preco": 20.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "alho-poro",
    "nome": "Alho-poró",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.9,
    "preco": 50.0,
    "fornecedor": "Feirinha",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "amaranto-em-flocos",
    "nome": "Amaranto em Flocos",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 23.0,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "amendoas-em-castanha",
    "nome": "Amendoas em Castanha",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.9,
    "preco": 62.0,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "amendoim",
    "nome": "Amendoim",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 5.3,
    "fornecedor": "Cedro",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "aveia",
    "nome": "Aveia",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 16.9,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "azeite-de-oliva",
    "nome": "Azeite de Oliva",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 20.0,
    "fornecedor": "Argentina",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "banana-sem-casca",
    "nome": "Banana sem Casca",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.62,
    "preco": 10.0,
    "fornecedor": "Cantina da Fruta",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "banana-com-casca",
    "nome": "Banana com Casca",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 6.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "bicarbonato-se-sodio",
    "nome": "Bicarbonato Se Sódio",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 5.44,
    "fornecedor": "Organicos e Cia",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "brocolis",
    "nome": "Brócolis",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 30.0,
    "fornecedor": "Fruteira",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "cacau-em-po",
    "nome": "Cacau em Pó",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 67.5,
    "fornecedor": "Equilibrium",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "canela-em-po",
    "nome": "Canela em Pó",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 27.0,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "carne-moida",
    "nome": "Carne Moida",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 60.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "castanha-do-para-inteira",
    "nome": "Castanha do Pará Inteira",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 94.9,
    "fornecedor": "Equilibrium",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "cebola-sem-casca",
    "nome": "Cebola sem Casca",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.84,
    "preco": 6.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "cenoura-com-casca",
    "nome": "Cenoura com Casca",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 7.9,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "chia",
    "nome": "Chia",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 34.89,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "cafe-soluvel",
    "nome": "Café Solúvel",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.9,
    "preco": 200.0,
    "fornecedor": "Cacau Show",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "chocolate-planalto-70",
    "nome": "Chocolate Planalto 70%",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 64.0,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "caldo-de-frango",
    "nome": "Caldo de Frango",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 10.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "coco-em-flocos-grandes-torrado",
    "nome": "Coco em Flocos Grandes Torrado",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 38.9,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "coco-em-flocos-sem-acucar",
    "nome": "Coco em Flocos sem Açúcar",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 33.9,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "beterraba-em-po",
    "nome": "Beterraba em Pó",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 63.52,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "creme-para-quiche",
    "nome": "Creme para Quiche",
    "unidade": "kg",
    "pesoBruto": 0.5,
    "pesoLiquido": 0.5,
    "preco": 14.6668,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true,
    "fichaId": "creme-para-quiche"
  },
  {
    "id": "curcuma-em-po",
    "nome": "Curcuma em Pó",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 11.0,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "curry",
    "nome": "Curry",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 9.54,
    "fornecedor": "Equilibrium",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "salsao",
    "nome": "Salsão",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.9,
    "preco": 24.0,
    "fornecedor": "Equilibrium",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "batata-asterix",
    "nome": "Batata Asterix",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.85,
    "preco": 8.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "farinha-de-amendoas",
    "nome": "Farinha de Amêndoas",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 65.0,
    "fornecedor": "Equi",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "farinha-de-arroz",
    "nome": "Farinha de Arroz",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 7.49,
    "fornecedor": "Equi",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "couve-flor-cozida",
    "nome": "Couve-flor Cozida",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 10.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "flor-de-sal",
    "nome": "Flor de Sal",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 45.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "farinha-de-coco",
    "nome": "Farinha de Coco",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 22.5,
    "fornecedor": "Equi",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "fecula-de-batata",
    "nome": "Fécula de Batata",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 15.0,
    "fornecedor": "Equi",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "feijao-azuki",
    "nome": "Feijão Azuki",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 11.8,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "fermento-biologico-seco",
    "nome": "Fermento Biologico Seco",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 14.9,
    "fornecedor": "Marcon Atacado Beltrao",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "fermento-quimico",
    "nome": "Fermento Químico",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 55.96,
    "fornecedor": "Cedro",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "pao-roberta",
    "nome": "Pão Roberta",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 9.34,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true,
    "fichaId": "pao-roberta"
  },
  {
    "id": "frango-desfiado-com-molho-de-tomate",
    "nome": "Frango Desfiado com Molho de Tomate",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.0,
    "preco": 34,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true,
    "fichaId": "frango-desfiado-com-molho-de-to"
  },
  {
    "id": "frango-desfiado",
    "nome": "Frango Desfiado",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.5,
    "preco": 22.2528,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true,
    "fichaId": "frango-desfiado"
  },
  {
    "id": "coxao-mole",
    "nome": "Coxão Mole",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.85,
    "preco": 53.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "fuba-fino",
    "nome": "Fubá Fino",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 2.89,
    "fornecedor": "Cedro",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "gergelim-branco",
    "nome": "Gergelim Branco",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 48.85,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "gergelim-preto",
    "nome": "Gergelim Preto",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 41.42,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "goiabada-cascao",
    "nome": "Goiabada Cascão",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 6.3,
    "fornecedor": "Marcon Atadaco Beltrao",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "goma-xantana",
    "nome": "Goma Xantana",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 36.86,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "grao-de-bico-cozido",
    "nome": "Grão de Bico Cozido",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 15.0,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "milho-em-conserva",
    "nome": "Milho em Conserva",
    "unidade": "kg",
    "pesoBruto": 0.2,
    "pesoLiquido": 0.2,
    "preco": 24.64,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "laranja",
    "nome": "Laranja",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.94,
    "preco": 2.99,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "leite-de-amendoim",
    "nome": "Leite de Amendoim",
    "unidade": "L",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 3.0612,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true,
    "fichaId": "leite-de-amendoim"
  },
  {
    "id": "leite-de-arroz",
    "nome": "Leite de Arroz",
    "unidade": "L",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 1.5306,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true,
    "fichaId": "leite-de-arroz"
  },
  {
    "id": "leite-de-coco-menin",
    "nome": "Leite de Coco Menin",
    "unidade": "L",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 21.4,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "leite-de-coco-de-vidro",
    "nome": "Leite de Coco de Vidro",
    "unidade": "L",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 16.0,
    "fornecedor": "Cedro",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "leite-de-coco-em-po-sabor-verde",
    "nome": "Leite de Coco em Pó Sabor Verde",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 63.7,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "lemon-pepper",
    "nome": "Lemon Pepper",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 19.04,
    "fornecedor": "Equi",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "linhaca-dourada",
    "nome": "Linhaça Dourada",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 28.75,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "louro",
    "nome": "Louro",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 44.55,
    "fornecedor": "Organicos e Cia",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "maca-com-casca-e-sem-semente",
    "nome": "Maçã com Casca e sem Semente",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 3.5,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "mandioca-cozida",
    "nome": "Mandioca Cozida",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 7.5,
    "fornecedor": "Feirinha",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "mandioquinha",
    "nome": "Mandioquinha",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.75,
    "preco": 11.9,
    "fornecedor": "Cantina da Fruta",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "manjericao",
    "nome": "Manjericao",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.87,
    "preco": 22.5,
    "fornecedor": "Ademir",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "manteiga-farbom",
    "nome": "Manteiga Farbom",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 14.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "manteiga-sem-sal",
    "nome": "Manteiga sem Sal",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 9.0,
    "fornecedor": "Feirinha",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "massa-para-quiche",
    "nome": "Massa para Quiche",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 14.0501,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "massa-para-torta-doce",
    "nome": "Massa para Torta Doce",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.97,
    "preco": 18.64,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "mix-sem-gluten-c-goma-xantana",
    "nome": "Mix sem Glúten C/ Goma Xantana",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 16.0746,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "molho-de-tomate",
    "nome": "Molho de Tomate",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 11.3219,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "nata-feirinha",
    "nome": "Nata Feirinha",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 35.0,
    "fornecedor": "Feirinha",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "noz-moscada",
    "nome": "Noz-moscada",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 105.0,
    "fornecedor": "Oraganicos e Cia",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "oleo-de-coco",
    "nome": "Óleo de Coco",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 45.0,
    "fornecedor": "Mercado Livre",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "farinha-de-arroz-integral",
    "nome": "Farinha de Arroz Integral",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 9.5,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "ora-pro-nobis",
    "nome": "Ora-pro-nóbis",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 10.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "ovos",
    "nome": "Ovos",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.0,
    "preco": 15.0,
    "fornecedor": "Cantina da Fruta",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "paprica-defumada",
    "nome": "Páprica Defumada",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 54.9,
    "fornecedor": "Organicos e Cia",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "pimenta-do-reino",
    "nome": "Pimenta-do-reino",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 25.16,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "polvilho-azedo",
    "nome": "Polvilho Azedo",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 5.0,
    "fornecedor": "Cedro",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "polvilho-doce",
    "nome": "Polvilho Doce",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 12.0,
    "fornecedor": "Cedro",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "psyllium",
    "nome": "Psyllium",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 54.4,
    "fornecedor": "Equi",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "quinoa-em-flocos",
    "nome": "Quinoa em Flocos",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 30.5,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "quinoa-em-graos",
    "nome": "Quinoa em Grãos",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 30.5,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "ricota",
    "nome": "Ricota",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 35.0,
    "fornecedor": "Cometa",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "sal-temperado-maluzices",
    "nome": "Sal Temperado Maluzices",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 3.73,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "sal-integral",
    "nome": "Sal Integral",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 5.0,
    "fornecedor": "Cedro",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "salsinha",
    "nome": "Salsinha",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.83,
    "preco": 22.5,
    "fornecedor": "Ademir",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "semente-de-abobora",
    "nome": "Semente de Abóbora",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 78.9,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "semente-de-girassol",
    "nome": "Semente de Girassol",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 34.06,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "semente-de-motarda",
    "nome": "Semente de Motarda",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 18.36,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "suco-de-limao",
    "nome": "Suco de Limão",
    "unidade": "L",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 9.9,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "tamara-sem-caroco",
    "nome": "Tamara sem Caroço",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 25.0,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "tamara-sem-caroco-cozida",
    "nome": "Tamara sem Caroço Cozida",
    "unidade": "kg",
    "pesoBruto": 0.15,
    "pesoLiquido": 0.22,
    "preco": 25.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "tomate-para-molho",
    "nome": "Tomate para Molho",
    "unidade": "kg",
    "pesoBruto": 11.1,
    "pesoLiquido": 8.44,
    "preco": 8.0,
    "fornecedor": "Melo",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "xylitol",
    "nome": "Xylitol",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 59.0,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "zestes-de-laranja",
    "nome": "Zestes de Laranja",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.05,
    "preco": 4.0,
    "fornecedor": "Feirinha",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "agua",
    "nome": "Água",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 1.5,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "acucar-demerara",
    "nome": "Açucar Demerara",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 6.0,
    "fornecedor": "Cedro",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "frango-cru",
    "nome": "Frango Cru",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 16.0,
    "fornecedor": "Rafa",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "alecrim",
    "nome": "Alecrim",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 10.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "gengibre-cru",
    "nome": "Gengibre Cru",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 19.99,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "farinha-de-trigo-integral",
    "nome": "Farinha de Trigo Integral",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 4.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "acucar-mascavo",
    "nome": "Açúcar Mascavo",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 9.0,
    "fornecedor": "Equi",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "batata-doce-crua-sem-casca",
    "nome": "Batata Doce Crua sem Casca",
    "unidade": "kg",
    "pesoBruto": 2.367,
    "pesoLiquido": 2.039,
    "preco": 5.69,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "batata-doce-cozida-no-vapor",
    "nome": "Batata Doce Cozida No Vapor",
    "unidade": "kg",
    "pesoBruto": 2.039,
    "pesoLiquido": 1.917,
    "preco": 12.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "oregano-seco",
    "nome": "Orégano Seco",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 25.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "mel-de-abelha",
    "nome": "Mel de Abelha",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.97,
    "preco": 15.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "farinha-de-grao-de-bico",
    "nome": "Farinha de Grão-de-bico",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 36.8,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "pasta-de-amendoim",
    "nome": "Pasta de Amendoim",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 30.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "aveia-em-flocos-grossos",
    "nome": "Aveia em Flocos Grossos",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 18.26,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "ganache-70-com-leite-de-coco",
    "nome": "Ganache 70 com Leite de Coco",
    "unidade": "kg",
    "pesoBruto": 0.3,
    "pesoLiquido": 0.29,
    "preco": 8.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "leite-de-amendoa-de-cx",
    "nome": "Leite de Amendoa de Cx",
    "unidade": "L",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 10.8,
    "fornecedor": "Peperina",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "amido-de-milho",
    "nome": "Amido de Milho",
    "unidade": "kg",
    "pesoBruto": 0.5,
    "pesoLiquido": 0.49,
    "preco": 4.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "creme-patissiere",
    "nome": "Creme Patissiere",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.83,
    "preco": 13.7,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "morangos-frescos-sem-folha",
    "nome": "Morangos Frescos sem Folha",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.97,
    "preco": 25.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "geleia-de-morando",
    "nome": "Geleia de Morando",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.53,
    "preco": 7.45,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "cumaru",
    "nome": "Cumaru",
    "unidade": "kg",
    "pesoBruto": 0.015,
    "pesoLiquido": 0.015,
    "preco": 105.8,
    "fornecedor": "Cipra",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "abacaxi-sem-casca",
    "nome": "Abacaxi sem Casca",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.63,
    "preco": 4.0,
    "fornecedor": "Cantina",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "tomilho",
    "nome": "Tomilho",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 20.0,
    "fornecedor": "Feirinha",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "geleia-de-amoras-silvestres",
    "nome": "Geleia de Amoras Silvestres",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.47,
    "preco": 15.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "abobora-cabotia",
    "nome": "Abobora Cabotia",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.97,
    "preco": 6.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "acucar-de-coco",
    "nome": "Açúcar de Coco",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.97,
    "preco": 26.2,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "requeiju",
    "nome": "Requeiju",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.18,
    "preco": 16.77,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true,
    "fichaId": "requeiju"
  },
  {
    "id": "feijao-fradinho",
    "nome": "Feijão Fradinho",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.0,
    "preco": 8.9,
    "fornecedor": "Oraganicos e Cia Beltrao",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "castanha-de-caju",
    "nome": "Castanha de Caju",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 69.9,
    "fornecedor": "Ares da Natureza",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "avela-torrada",
    "nome": "Avelã Torrada",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.88,
    "preco": 90.0,
    "fornecedor": "Ares da Natureza",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "levedura-nutricional",
    "nome": "Levedura Nutricional",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 149.9,
    "fornecedor": "Mercado Livre",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "alho-cru",
    "nome": "Alho Cru",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.88,
    "preco": 24.99,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "maionese-verde",
    "nome": "Maionese Verde",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.134,
    "preco": 6.06,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true,
    "fichaId": "maionese-verde"
  },
  {
    "id": "pao-para-sanduiche",
    "nome": "Pão-para Sanduiche",
    "unidade": "un",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.0,
    "preco": 1.1125,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "nozes-pecan",
    "nome": "Nozes Pecan",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 70.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "alface",
    "nome": "Alface",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.79,
    "preco": 5.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "vinagre-de-maca",
    "nome": "Vinagre de Maçã",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.0,
    "preco": 37.55,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "massa-de-pizza-vegana",
    "nome": "Massa de Pizza Vegana",
    "unidade": "un",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.0,
    "preco": 0.9532,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "goma-agar",
    "nome": "Goma Agar",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 69.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "chocolate-sicao-meio-amargo",
    "nome": "Chocolate Sicao Meio Amargo",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 34.5,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "chocolate-sicao-branco",
    "nome": "Chocolate Sicao Branco",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 33.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "chocolate-branco-divine-vegano-zero-acuc",
    "nome": "Chocolate Branco Divine Vegano Zero Açúcar",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 70.0,
    "fornecedor": "Ares",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "matcha",
    "nome": "Matcha",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 326.0,
    "fornecedor": "Mercado Livre",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "baunilha-em-pasta",
    "nome": "Baunilha em Pasta",
    "unidade": "kg",
    "pesoBruto": 0.2,
    "pesoLiquido": 0.198,
    "preco": 42.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "chocolate-80-ares",
    "nome": "Chocolate 80% Ares",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 55.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "abobrinha-crua",
    "nome": "Abobrinha Crua",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 2.49,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "leite-de-soja",
    "nome": "Leite de Soja",
    "unidade": "L",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 6.29,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "lecitina-de-soja-em-po",
    "nome": "Lecitina de Soja em Pó",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 101.35,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "manteiga-de-cacau",
    "nome": "Manteiga de Cacau",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 87.9,
    "fornecedor": "Ingredientes Online",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "lecitina-de-soja-liquida",
    "nome": "Lecitina de Soja Liquida",
    "unidade": "kg",
    "pesoBruto": 0.9,
    "pesoLiquido": 0.88,
    "preco": 28.08,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "cremor-de-tartaro",
    "nome": "Cremor de Tártaro",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 120.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "manteiga-vegana",
    "nome": "Manteiga Vegana",
    "unidade": "kg",
    "pesoBruto": 0.8,
    "pesoLiquido": 0.8,
    "preco": 25.2831,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true,
    "fichaId": "manteiga-vegana"
  },
  {
    "id": "pao-funcional-levissima-p-1-sanduiche",
    "nome": "Pão Funcional Levissima P 1 Sanduiche",
    "unidade": "un",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.0,
    "preco": 5.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "tomate-para-sanduba",
    "nome": "Tomate para Sanduba",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.0,
    "preco": 6.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "shoyu",
    "nome": "Shoyu",
    "unidade": "L",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.0,
    "preco": 30.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "probiotico",
    "nome": "Probiotico",
    "unidade": "un",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.0,
    "preco": 1.33,
    "fornecedor": "Farmacia",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "batata-monalisa-in-natura",
    "nome": "Batata Monalisa In Natura",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.8,
    "preco": 6.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "creme-pata-quiche-vegan",
    "nome": "Creme Pata Quiche Vegan",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 17.2616,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "tomate-cereja",
    "nome": "Tomate Cereja",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 20.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "gorgonzola",
    "nome": "Gorgonzola",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 40.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "beterraba",
    "nome": "Beterraba",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.9,
    "preco": 5.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "creme-de-castanha",
    "nome": "Creme de Castanha",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.0,
    "preco": 27.66,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true,
    "fichaId": "creme-de-castanha"
  },
  {
    "id": "recheio-de-carne-para-esfira",
    "nome": "Recheio de Carne para Esfira",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.0,
    "preco": 60.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "massa-de-esfira",
    "nome": "Massa de Esfira",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.0,
    "preco": 14.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true,
    "fichaId": "massa-esfira"
  },
  {
    "id": "mix-de-legumes-fruteira",
    "nome": "Mix de Legumes Fruteira",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.0,
    "preco": 40.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "pure-de-batatas",
    "nome": "Purê de Batatas",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.0,
    "preco": 12.199,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true,
    "fichaId": "pure-de-batatas"
  },
  {
    "id": "mix-de-sementes-para-pao",
    "nome": "Mix de Sementes para Pão",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 1.0,
    "preco": 45.9219,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true,
    "fichaId": "mix-de-sementes-p-pao"
  },
  {
    "id": "chuchu",
    "nome": "Chuchu",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.95,
    "preco": 7.0,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true
  },
  {
    "id": "mix-sem-gluten-cris-gutierrez",
    "nome": "Mix sem Glúten Cris Gutierrez",
    "unidade": "kg",
    "pesoBruto": 1.0,
    "pesoLiquido": 0.98,
    "preco": 10.22,
    "fornecedor": "",
    "cotacao": "",
    "ativo": true,
    "fichaId": "mix-sem-gluten-cris-gutierrez"
  }
];

export const fichas = [
  {
    "id": "mix-sem-gluten-cris-gutierrez",
    "nome": "Mix sem Gluten Cris Gutierrez",
    "categoriaId": "massas-e-bases",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "farinha-de-arroz",
        "quantidade": 0.4
      },
      {
        "insumoId": "fecula-de-batata",
        "quantidade": 0.1
      },
      {
        "insumoId": "polvilho-doce",
        "quantidade": 0.1
      },
      {
        "insumoId": "goma-xantana",
        "quantidade": 0.012
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 6.2636,
    "custoReceitaPlanilha": 6.2636,
    "vendavel": false,
    "ativo": true,
    "insumoGemeoId": "mix-sem-gluten-cris-gutierrez",
    "rendimentoKg": 0.6129,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "pastelzinho-de-festa",
    "nome": "Pastelzinho de Festa",
    "categoriaId": "salgados-fritos",
    "rendimento": 25.0,
    "ingredientes": [
      {
        "insumoId": "mix-sem-gluten-cris-gutierrez",
        "quantidade": 0.25
      },
      {
        "insumoId": "psyllium",
        "quantidade": 0.004
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.006
      },
      {
        "insumoId": "acucar-demerara",
        "quantidade": 0.01
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.01
      },
      {
        "insumoId": "agua",
        "quantidade": 0.1
      },
      {
        "insumoId": "ovos",
        "quantidade": 0.08
      },
      {
        "insumoId": "recheio-de-carne-para-esfira",
        "quantidade": 0.3
      }
    ],
    "tempoPreparo": "40 min",
    "custoPorcaoPlanilha": 0.9141,
    "custoReceitaPlanilha": 22.852,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "coxinha-de-festa",
    "nome": "Coxinha de Festa",
    "categoriaId": "salgados-fritos",
    "rendimento": 25.0,
    "ingredientes": [
      {
        "insumoId": "mix-sem-gluten-cris-gutierrez",
        "quantidade": 0.15
      },
      {
        "insumoId": "pure-de-batatas",
        "quantidade": 0.45
      },
      {
        "insumoId": "caldo-de-frango",
        "quantidade": 0.2
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.01
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.02
      }
    ],
    "tempoPreparo": "40 min",
    "custoPorcaoPlanilha": 0.3827,
    "custoReceitaPlanilha": 9.5667,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "empadinha-de-frango",
    "nome": "Empadinha de Frango",
    "categoriaId": "salgados-assados",
    "rendimento": 25.0,
    "ingredientes": [
      {
        "insumoId": "massa-para-quiche",
        "quantidade": 0.5
      },
      {
        "insumoId": "frango-desfiado-com-molho-de-tomate",
        "quantidade": 0.25
      }
    ],
    "tempoPreparo": "40 min",
    "custoPorcaoPlanilha": 0.6267,
    "custoReceitaPlanilha": 15.6684,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "empadinha-de-carne",
    "nome": "Empadinha de Carne",
    "categoriaId": "salgados-assados",
    "rendimento": 25.0,
    "ingredientes": [
      {
        "insumoId": "massa-para-quiche",
        "quantidade": 0.5
      },
      {
        "insumoId": "recheio-de-carne-para-esfira",
        "quantidade": 0.25
      }
    ],
    "tempoPreparo": "40 min",
    "custoPorcaoPlanilha": 0.899,
    "custoReceitaPlanilha": 22.4746,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "torta-salgada-de-frango",
    "nome": "Torta Salgada de Frango",
    "categoriaId": "salgados-assados",
    "rendimento": 7.0,
    "ingredientes": [
      {
        "insumoId": "ovos",
        "quantidade": 0.2
      },
      {
        "insumoId": "farinha-de-arroz",
        "quantidade": 0.15
      },
      {
        "insumoId": "agua",
        "quantidade": 0.15
      },
      {
        "insumoId": "fermento-quimico",
        "quantidade": 0.01
      },
      {
        "insumoId": "frango-desfiado-com-molho-de-tomate",
        "quantidade": 0.35
      },
      {
        "insumoId": "aveia",
        "quantidade": 0.1
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.005
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.075
      }
    ],
    "tempoPreparo": "40 min",
    "custoPorcaoPlanilha": 2.8823,
    "custoReceitaPlanilha": 20.176,
    "vendavel": true,
    "ativo": true,
    "precoPraticado": 15.0,
    "metaCmv": 0.2,
    "tamanhoPorcao": "130g"
  },
  {
    "id": "cracker-sem-gluten",
    "nome": "Cracker sem Glúten",
    "categoriaId": "salgados-assados",
    "rendimento": 3.0,
    "ingredientes": [
      {
        "insumoId": "farinha-de-arroz-integral",
        "quantidade": 0.15
      },
      {
        "insumoId": "polvilho-doce",
        "quantidade": 0.065
      },
      {
        "insumoId": "psyllium",
        "quantidade": 0.015
      },
      {
        "insumoId": "acucar-demerara",
        "quantidade": 0.01
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.005
      },
      {
        "insumoId": "goma-xantana",
        "quantidade": 0.0005
      },
      {
        "insumoId": "fermento-biologico-seco",
        "quantidade": 0.01
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.03
      },
      {
        "insumoId": "ovos",
        "quantidade": 0.05
      },
      {
        "insumoId": "agua",
        "quantidade": 0.1
      },
      {
        "insumoId": "alecrim",
        "quantidade": 0.004
      },
      {
        "insumoId": "gergelim-branco",
        "quantidade": 0.02
      },
      {
        "insumoId": "chia",
        "quantidade": 0.04
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 2.446,
    "custoReceitaPlanilha": 7.338,
    "vendavel": true,
    "ativo": true,
    "precoPraticado": 12.0,
    "metaCmv": 0.2,
    "tamanhoPorcao": "120g"
  },
  {
    "id": "patinho-acebolado-de-vegetais-a",
    "nome": "Patinho Acebolado com Vegetais Assados",
    "categoriaId": "outros",
    "rendimento": 10.0,
    "ingredientes": [
      {
        "insumoId": "coxao-mole",
        "quantidade": 1.2
      },
      {
        "insumoId": "cebola-sem-casca",
        "quantidade": 0.1
      },
      {
        "insumoId": "brocolis",
        "quantidade": 0.65
      },
      {
        "insumoId": "cenoura-com-casca",
        "quantidade": 0.65
      },
      {
        "insumoId": "batata-monalisa-in-natura",
        "quantidade": 1.0
      },
      {
        "insumoId": "alho-cru",
        "quantidade": 0.01
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.1
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 11.1193,
    "custoReceitaPlanilha": 111.1932,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "frango-com-chuchu-e-molho-branc",
    "nome": "Frango com Molho Chuchu e Molho Branco e Arroz com Sementes",
    "categoriaId": "massas-e-bases",
    "rendimento": 10.0,
    "ingredientes": [
      {
        "insumoId": "frango-cru",
        "quantidade": 1.2
      },
      {
        "insumoId": "cebola-sem-casca",
        "quantidade": 0.1
      },
      {
        "insumoId": "chuchu",
        "quantidade": 0.65
      },
      {
        "insumoId": "creme-de-castanha",
        "quantidade": 0.65
      },
      {
        "insumoId": "alho-cru",
        "quantidade": 0.01
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.1
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 4.5831,
    "custoReceitaPlanilha": 45.8308,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "caldo-de-cabotia",
    "nome": "Caldo de Cabotia",
    "categoriaId": "caldos",
    "rendimento": 9.0,
    "ingredientes": [
      {
        "insumoId": "caldo-de-frango",
        "quantidade": 2.0
      },
      {
        "insumoId": "abobora-cabotia",
        "quantidade": 1.0
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.02
      },
      {
        "insumoId": "pimenta-do-reino",
        "quantidade": 0.005
      },
      {
        "insumoId": "curry",
        "quantidade": 0.01
      },
      {
        "insumoId": "noz-moscada",
        "quantidade": 0.005
      },
      {
        "insumoId": "frango-desfiado",
        "quantidade": 0.45
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 5.2765,
    "custoReceitaPlanilha": 47.4888,
    "vendavel": true,
    "ativo": true,
    "precoPraticado": 18.0,
    "metaCmv": 0.3,
    "tamanhoPorcao": "400g"
  },
  {
    "id": "caldo-de-batata-doce",
    "nome": "Caldo de Batata Doce",
    "categoriaId": "caldos",
    "rendimento": 9.0,
    "ingredientes": [
      {
        "insumoId": "caldo-de-frango",
        "quantidade": 2.0
      },
      {
        "insumoId": "batata-doce-crua-sem-casca",
        "quantidade": 1.0
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.02
      },
      {
        "insumoId": "pimenta-do-reino",
        "quantidade": 0.005
      },
      {
        "insumoId": "curry",
        "quantidade": 0.01
      },
      {
        "insumoId": "noz-moscada",
        "quantidade": 0.005
      },
      {
        "insumoId": "frango-desfiado",
        "quantidade": 0.45
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 5.3232,
    "custoReceitaPlanilha": 47.9085,
    "vendavel": true,
    "ativo": true,
    "precoPraticado": 18.0,
    "metaCmv": 0.3,
    "tamanhoPorcao": "400g"
  },
  {
    "id": "caldo-de-legumes-e-frango",
    "nome": "Caldo de Legumes e Frango",
    "categoriaId": "caldos",
    "rendimento": 9.0,
    "ingredientes": [
      {
        "insumoId": "caldo-de-frango",
        "quantidade": 2.0
      },
      {
        "insumoId": "batata-monalisa-in-natura",
        "quantidade": 0.25
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.02
      },
      {
        "insumoId": "pimenta-do-reino",
        "quantidade": 0.005
      },
      {
        "insumoId": "curry",
        "quantidade": 0.01
      },
      {
        "insumoId": "noz-moscada",
        "quantidade": 0.005
      },
      {
        "insumoId": "frango-desfiado",
        "quantidade": 0.45
      },
      {
        "insumoId": "brocolis",
        "quantidade": 0.25
      },
      {
        "insumoId": "cenoura-com-casca",
        "quantidade": 0.25
      },
      {
        "insumoId": "chuchu",
        "quantidade": 0.25
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 6.1034,
    "custoReceitaPlanilha": 54.9304,
    "vendavel": true,
    "ativo": true,
    "precoPraticado": 18.0,
    "metaCmv": 0.34,
    "tamanhoPorcao": "400g"
  },
  {
    "id": "sanduba-de-frango",
    "nome": "Sanduba de Pao-nobis, Frango e Requeiju",
    "categoriaId": "paes",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "creme-de-castanha",
        "quantidade": 0.01
      },
      {
        "insumoId": "pao-para-sanduiche",
        "quantidade": 1.0
      },
      {
        "insumoId": "frango-desfiado-com-molho-de-tomate",
        "quantidade": 0.05
      },
      {
        "insumoId": "alface",
        "quantidade": 0.02
      },
      {
        "insumoId": "tomate-para-sanduba",
        "quantidade": 0.015
      }
    ],
    "tempoPreparo": "MODO DE PREPARO",
    "custoPorcaoPlanilha": 3.3114,
    "custoReceitaPlanilha": 3.3114,
    "vendavel": true,
    "ativo": true,
    "precoPraticado": 17.0,
    "metaCmv": 0.2,
    "tamanhoPorcao": "180g"
  },
  {
    "id": "esfira-de-carne",
    "nome": "Esfira de Carne",
    "categoriaId": "salgados-assados",
    "rendimento": 15.0,
    "ingredientes": [
      {
        "insumoId": "recheio-de-carne-para-esfira",
        "quantidade": 1.2
      },
      {
        "insumoId": "massa-de-esfira",
        "quantidade": 1.36
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 6.1932,
    "custoReceitaPlanilha": 92.898,
    "vendavel": true,
    "ativo": true,
    "precoPraticado": 18.0,
    "metaCmv": 0.35,
    "tamanhoPorcao": "125g"
  },
  {
    "id": "escondidinho-de-carne",
    "nome": "Escondidinho de Carne",
    "categoriaId": "outros",
    "rendimento": 10.0,
    "ingredientes": [
      {
        "insumoId": "recheio-de-carne-para-esfira",
        "quantidade": 1.5
      },
      {
        "insumoId": "pure-de-batatas",
        "quantidade": 1.5
      },
      {
        "insumoId": "creme-de-castanha",
        "quantidade": 0.5
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 12.4247,
    "custoReceitaPlanilha": 124.2474,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "escondidinho-de-frango",
    "nome": "Escondidinho de Carne",
    "categoriaId": "outros",
    "rendimento": 10.0,
    "ingredientes": [
      {
        "insumoId": "frango-desfiado-com-molho-de-tomate",
        "quantidade": 1.5
      },
      {
        "insumoId": "pure-de-batatas",
        "quantidade": 1.5
      },
      {
        "insumoId": "creme-de-castanha",
        "quantidade": 0.5
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 8.3411,
    "custoReceitaPlanilha": 83.4107,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "quiche-de-frango",
    "nome": "Quiche de Frango",
    "categoriaId": "salgados-assados",
    "rendimento": 10.0,
    "ingredientes": [
      {
        "insumoId": "massa-para-quiche",
        "quantidade": 0.6
      },
      {
        "insumoId": "frango-desfiado-com-molho-de-tomate",
        "quantidade": 0.3
      },
      {
        "insumoId": "creme-de-castanha",
        "quantidade": 0.5
      },
      {
        "insumoId": "brocolis",
        "quantidade": 0.2
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 3.923,
    "custoReceitaPlanilha": 39.2302,
    "vendavel": true,
    "ativo": true,
    "precoPraticado": 17.0,
    "metaCmv": 0.24,
    "tamanhoPorcao": "160g"
  },
  {
    "id": "quiche-de-brocolis",
    "nome": "Quiche de Brócolis",
    "categoriaId": "salgados-assados",
    "rendimento": 10.0,
    "ingredientes": [
      {
        "insumoId": "massa-para-quiche",
        "quantidade": 0.6
      },
      {
        "insumoId": "alho-poro",
        "quantidade": 0.1
      },
      {
        "insumoId": "creme-de-castanha",
        "quantidade": 0.5
      },
      {
        "insumoId": "brocolis",
        "quantidade": 0.4
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 3.9601,
    "custoReceitaPlanilha": 39.6013,
    "vendavel": true,
    "ativo": true,
    "precoPraticado": 17.0,
    "metaCmv": 0.24,
    "tamanhoPorcao": "160g"
  },
  {
    "id": "pao-de-mandioquinha",
    "nome": "Pão de Mandioquinha",
    "categoriaId": "paes",
    "rendimento": 16.0,
    "ingredientes": [
      {
        "insumoId": "mandioquinha",
        "quantidade": 1.0
      },
      {
        "insumoId": "polvilho-doce",
        "quantidade": 0.6
      },
      {
        "insumoId": "polvilho-azedo",
        "quantidade": 0.4
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.25
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.02
      },
      {
        "insumoId": "curcuma-em-po",
        "quantidade": 0.01
      },
      {
        "insumoId": "alecrim",
        "quantidade": 0.003
      },
      {
        "insumoId": "agua",
        "quantidade": 0.15
      }
    ],
    "tempoPreparo": "2HR",
    "custoPorcaoPlanilha": 1.9371,
    "custoReceitaPlanilha": 30.993,
    "vendavel": true,
    "ativo": true,
    "precoPraticado": 12.0,
    "metaCmv": 0.17,
    "tamanhoPorcao": "150g"
  },
  {
    "id": "coxinha-de-batata-doce",
    "nome": "Coxinha Massa Trad",
    "categoriaId": "salgados-fritos",
    "rendimento": 19.0,
    "ingredientes": [
      {
        "insumoId": "frango-desfiado-com-molho-de-tomate",
        "quantidade": 0.75
      },
      {
        "insumoId": "linhaca-dourada",
        "quantidade": 0.5
      },
      {
        "insumoId": "batata-doce-cozida-no-vapor",
        "quantidade": 2.039
      },
      {
        "insumoId": "ovos",
        "quantidade": 0.1
      },
      {
        "insumoId": "agua",
        "quantidade": 0.15
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 3.5749,
    "custoReceitaPlanilha": 67.9231,
    "vendavel": true,
    "ativo": true,
    "precoPraticado": 20.0,
    "metaCmv": 0.17,
    "tamanhoPorcao": "180g"
  },
  {
    "id": "creme-de-castanha",
    "nome": "Catupiry de Castanha",
    "categoriaId": "caldos",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "castanha-de-caju",
        "quantidade": 0.2
      },
      {
        "insumoId": "agua",
        "quantidade": 0.4
      },
      {
        "insumoId": "levedura-nutricional",
        "quantidade": 0.015
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.005
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 17.1974,
    "custoReceitaPlanilha": 17.1974,
    "vendavel": false,
    "ativo": true,
    "insumoGemeoId": "creme-de-castanha",
    "rendimentoKg": 0.6217,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "pao-roberta",
    "nome": "Pão Roberta",
    "categoriaId": "paes",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "farinha-de-arroz",
        "quantidade": 0.1
      },
      {
        "insumoId": "farinha-de-arroz-integral",
        "quantidade": 0.1
      },
      {
        "insumoId": "amido-de-milho",
        "quantidade": 0.07
      },
      {
        "insumoId": "polvilho-doce",
        "quantidade": 0.07
      },
      {
        "insumoId": "fecula-de-batata",
        "quantidade": 0.05
      },
      {
        "insumoId": "acucar-demerara",
        "quantidade": 0.04
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.005
      },
      {
        "insumoId": "fermento-biologico-seco",
        "quantidade": 0.01
      },
      {
        "insumoId": "fermento-quimico",
        "quantidade": 0.007
      },
      {
        "insumoId": "goma-xantana",
        "quantidade": 0.005
      },
      {
        "insumoId": "ovos",
        "quantidade": 0.1
      },
      {
        "insumoId": "agua",
        "quantidade": 0.25
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.03
      },
      {
        "insumoId": "mix-de-sementes-para-pao",
        "quantidade": 0.045
      }
    ],
    "tempoPreparo": "20 min",
    "custoPorcaoPlanilha": 9.2328,
    "custoReceitaPlanilha": 9.2328,
    "vendavel": false,
    "ativo": true,
    "insumoGemeoId": "pao-roberta",
    "rendimentoKg": 0.9885,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "pao-caseiro",
    "nome": "Pão Roberta",
    "categoriaId": "paes",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "aveia",
        "quantidade": 0.08
      },
      {
        "insumoId": "fecula-de-batata",
        "quantidade": 0.08
      },
      {
        "insumoId": "farinha-de-arroz",
        "quantidade": 0.075
      },
      {
        "insumoId": "polvilho-doce",
        "quantidade": 0.065
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.007
      },
      {
        "insumoId": "goma-xantana",
        "quantidade": 0.005
      },
      {
        "insumoId": "fermento-quimico",
        "quantidade": 0.001
      },
      {
        "insumoId": "ovos",
        "quantidade": 0.165
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.04
      },
      {
        "insumoId": "psyllium",
        "quantidade": 0.004
      },
      {
        "insumoId": "agua",
        "quantidade": 0.165
      },
      {
        "insumoId": "acucar-demerara",
        "quantidade": 0.025
      },
      {
        "insumoId": "fermento-biologico-seco",
        "quantidade": 0.004
      }
    ],
    "tempoPreparo": "20 min",
    "custoPorcaoPlanilha": 8.2597,
    "custoReceitaPlanilha": 8.2597,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "pao-lowcarb",
    "nome": "Pão Low Carb",
    "categoriaId": "paes",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "ovos",
        "quantidade": 0.21
      },
      {
        "insumoId": "agua",
        "quantidade": 0.16
      },
      {
        "insumoId": "acucar-demerara",
        "quantidade": 0.007
      },
      {
        "insumoId": "castanha-de-caju",
        "quantidade": 0.16
      },
      {
        "insumoId": "farinha-de-amendoas",
        "quantidade": 0.08
      },
      {
        "insumoId": "farinha-de-coco",
        "quantidade": 0.02
      },
      {
        "insumoId": "psyllium",
        "quantidade": 0.01
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.004
      },
      {
        "insumoId": "fermento-biologico-seco",
        "quantidade": 0.004
      },
      {
        "insumoId": "goma-xantana",
        "quantidade": 0.002
      },
      {
        "insumoId": "fermento-quimico",
        "quantidade": 0.004
      }
    ],
    "tempoPreparo": "20 min",
    "custoPorcaoPlanilha": 21.5553,
    "custoReceitaPlanilha": 21.5553,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "recheio-de-carne",
    "nome": "Recheio de Carne",
    "categoriaId": "massas-e-bases",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "coxao-mole",
        "quantidade": 1.0
      },
      {
        "insumoId": "cebola-sem-casca",
        "quantidade": 0.15
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 63.4244,
    "custoReceitaPlanilha": 63.4244,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "pure-de-batatas",
    "nome": "Purê de Batatas",
    "categoriaId": "massas-e-bases",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "batata-monalisa-in-natura",
        "quantidade": 1.0
      },
      {
        "insumoId": "creme-de-castanha",
        "quantidade": 0.1
      },
      {
        "insumoId": "noz-moscada",
        "quantidade": 0.003
      },
      {
        "insumoId": "levedura-nutricional",
        "quantidade": 0.01
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.005
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 12.199,
    "custoReceitaPlanilha": 12.199,
    "vendavel": false,
    "ativo": true,
    "insumoGemeoId": "pure-de-batatas",
    "rendimentoKg": 1.0,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "massa-esfira",
    "nome": "Massa de Esfira",
    "categoriaId": "salgados-assados",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "farinha-de-arroz-integral",
        "quantidade": 0.32
      },
      {
        "insumoId": "polvilho-doce",
        "quantidade": 0.3
      },
      {
        "insumoId": "linhaca-dourada",
        "quantidade": 0.14
      },
      {
        "insumoId": "psyllium",
        "quantidade": 0.032
      },
      {
        "insumoId": "acucar-demerara",
        "quantidade": 0.032
      },
      {
        "insumoId": "goma-xantana",
        "quantidade": 0.008
      },
      {
        "insumoId": "fermento-biologico-seco",
        "quantidade": 0.008
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.012
      },
      {
        "insumoId": "ovos",
        "quantidade": 0.2
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.04
      },
      {
        "insumoId": "vinagre-de-maca",
        "quantidade": 0.02
      },
      {
        "insumoId": "agua",
        "quantidade": 0.25
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 18.3297,
    "custoReceitaPlanilha": 18.3297,
    "vendavel": false,
    "ativo": true,
    "insumoGemeoId": "massa-de-esfira",
    "rendimentoKg": 1.3093,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "massa-de-quiche",
    "nome": "Massa Low Carb para Quiche",
    "categoriaId": "salgados-assados",
    "rendimento": 20.0,
    "ingredientes": [
      {
        "insumoId": "mix-sem-gluten-c-goma-xantana",
        "quantidade": 0.33
      },
      {
        "insumoId": "farinha-de-grao-de-bico",
        "quantidade": 0.145
      },
      {
        "insumoId": "fuba-fino",
        "quantidade": 0.145
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.11
      },
      {
        "insumoId": "agua",
        "quantidade": 0.26
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.01
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 0.7025,
    "custoReceitaPlanilha": 14.0501,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "massa-mini-pizza",
    "nome": "Massa Mini Pizza",
    "categoriaId": "massas-e-bases",
    "rendimento": 9.0,
    "ingredientes": [
      {
        "insumoId": "mix-sem-gluten-c-goma-xantana",
        "quantidade": 0.18
      },
      {
        "insumoId": "fermento-biologico-seco",
        "quantidade": 0.005
      },
      {
        "insumoId": "acucar-demerara",
        "quantidade": 0.01
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.005
      },
      {
        "insumoId": "ovos",
        "quantidade": 0.05
      },
      {
        "insumoId": "psyllium",
        "quantidade": 0.01
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.01
      },
      {
        "insumoId": "agua",
        "quantidade": 0.075
      },
      {
        "insumoId": "molho-de-tomate",
        "quantidade": 0.05
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 0.5915,
    "custoReceitaPlanilha": 5.3233,
    "vendavel": true,
    "ativo": true,
    "precoPraticado": 3.0,
    "metaCmv": 0.2,
    "tamanhoPorcao": ""
  },
  {
    "id": "granola-salgada",
    "nome": "Granola Salgada",
    "categoriaId": "salgados-assados",
    "rendimento": 4.0,
    "ingredientes": [
      {
        "insumoId": "gergelim-branco",
        "quantidade": 0.1
      },
      {
        "insumoId": "aveia",
        "quantidade": 0.15
      },
      {
        "insumoId": "linhaca-dourada",
        "quantidade": 0.15
      },
      {
        "insumoId": "semente-de-abobora",
        "quantidade": 0.15
      },
      {
        "insumoId": "lemon-pepper",
        "quantidade": 0.02
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.03
      },
      {
        "insumoId": "semente-de-girassol",
        "quantidade": 0.2
      },
      {
        "insumoId": "gergelim-preto",
        "quantidade": 0.1
      },
      {
        "insumoId": "chia",
        "quantidade": 0.1
      }
    ],
    "tempoPreparo": "MODO DE PREPARO",
    "custoPorcaoPlanilha": 9.9516,
    "custoReceitaPlanilha": 39.8064,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "mix-de-sementes-p-pao",
    "nome": "Mix de Sementes para Pão",
    "categoriaId": "paes",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "gergelim-branco",
        "quantidade": 0.15
      },
      {
        "insumoId": "linhaca-dourada",
        "quantidade": 0.2
      },
      {
        "insumoId": "semente-de-abobora",
        "quantidade": 0.2
      },
      {
        "insumoId": "semente-de-girassol",
        "quantidade": 0.25
      },
      {
        "insumoId": "gergelim-preto",
        "quantidade": 0.1
      },
      {
        "insumoId": "chia",
        "quantidade": 0.1
      }
    ],
    "tempoPreparo": "MODO DE PREPARO",
    "custoPorcaoPlanilha": 45.9219,
    "custoReceitaPlanilha": 45.9219,
    "vendavel": false,
    "ativo": true,
    "insumoGemeoId": "mix-de-sementes-para-pao",
    "rendimentoKg": 1.0,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "granola-salgada-30g",
    "nome": "Granola Salgada",
    "categoriaId": "salgados-assados",
    "rendimento": 25.0,
    "ingredientes": [
      {
        "insumoId": "gergelim-branco",
        "quantidade": 0.1
      },
      {
        "insumoId": "aveia",
        "quantidade": 0.15
      },
      {
        "insumoId": "linhaca-dourada",
        "quantidade": 0.15
      },
      {
        "insumoId": "semente-de-abobora",
        "quantidade": 0.15
      },
      {
        "insumoId": "lemon-pepper",
        "quantidade": 0.02
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.03
      },
      {
        "insumoId": "semente-de-girassol",
        "quantidade": 0.2
      },
      {
        "insumoId": "gergelim-preto",
        "quantidade": 0.1
      },
      {
        "insumoId": "chia",
        "quantidade": 0.1
      }
    ],
    "tempoPreparo": "MODO DE PREPARO",
    "custoPorcaoPlanilha": 1.5923,
    "custoReceitaPlanilha": 39.8064,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "pao-func-sanduiche",
    "nome": "Pão Sanduiche",
    "categoriaId": "paes",
    "rendimento": 12.0,
    "ingredientes": [
      {
        "insumoId": "farinha-de-arroz",
        "quantidade": 0.15
      },
      {
        "insumoId": "farinha-de-arroz-integral",
        "quantidade": 0.15
      },
      {
        "insumoId": "amido-de-milho",
        "quantidade": 0.105
      },
      {
        "insumoId": "polvilho-doce",
        "quantidade": 0.105
      },
      {
        "insumoId": "fecula-de-batata",
        "quantidade": 0.075
      },
      {
        "insumoId": "acucar-demerara",
        "quantidade": 0.06
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.005
      },
      {
        "insumoId": "fermento-biologico-seco",
        "quantidade": 0.015
      },
      {
        "insumoId": "fermento-quimico",
        "quantidade": 0.01
      },
      {
        "insumoId": "goma-xantana",
        "quantidade": 0.005
      },
      {
        "insumoId": "ovos",
        "quantidade": 0.15
      },
      {
        "insumoId": "agua",
        "quantidade": 0.4
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.075
      },
      {
        "insumoId": "mix-de-sementes-para-pao",
        "quantidade": 0.045
      }
    ],
    "tempoPreparo": "20 min",
    "custoPorcaoPlanilha": 1.1125,
    "custoReceitaPlanilha": 13.3504,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "empada-de-frango",
    "nome": "Empada de Frango",
    "categoriaId": "salgados-assados",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "frango-desfiado-com-molho-de-tomate",
        "quantidade": 0.04
      },
      {
        "quantidade": 0.02,
        "fichaId": "creme-de-castanha"
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 1.36,
    "custoReceitaPlanilha": 1.36,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "torta-de-frango-sem-ovos",
    "nome": "Torta de Frango sem Ovos",
    "categoriaId": "salgados-assados",
    "rendimento": 20.0,
    "ingredientes": [
      {
        "insumoId": "frango-desfiado-com-molho-de-tomate",
        "quantidade": 0.35
      },
      {
        "insumoId": "farinha-de-grao-de-bico",
        "quantidade": 0.11
      },
      {
        "insumoId": "mix-sem-gluten-c-goma-xantana",
        "quantidade": 0.33
      },
      {
        "insumoId": "agua",
        "quantidade": 0.5
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.05
      },
      {
        "insumoId": "fermento-quimico",
        "quantidade": 0.01
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 1.1916,
    "custoReceitaPlanilha": 23.8324,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "requeiju",
    "nome": "Requeiju",
    "categoriaId": "massas-e-bases",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "castanha-de-caju",
        "quantidade": 0.2
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.05
      },
      {
        "insumoId": "oregano-seco",
        "quantidade": 0.001
      },
      {
        "insumoId": "levedura-nutricional",
        "quantidade": 0.01
      },
      {
        "insumoId": "agua",
        "quantidade": 0.6
      },
      {
        "insumoId": "sal-temperado-maluzices",
        "quantidade": 0.003
      },
      {
        "insumoId": "pimenta-do-reino",
        "quantidade": 0.001
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 17.8293,
    "custoReceitaPlanilha": 17.8293,
    "vendavel": false,
    "ativo": true,
    "insumoGemeoId": "requeiju",
    "rendimentoKg": 1.0632,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "mussarela-de-caju",
    "nome": "Mussarela de Caju",
    "categoriaId": "massas-e-bases",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "castanha-de-caju",
        "quantidade": 0.07
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.05
      },
      {
        "insumoId": "goma-agar",
        "quantidade": 0.01
      },
      {
        "insumoId": "levedura-nutricional",
        "quantidade": 0.02
      },
      {
        "insumoId": "agua",
        "quantidade": 0.7
      },
      {
        "insumoId": "sal-temperado-maluzices",
        "quantidade": 0.005
      },
      {
        "insumoId": "pimenta-do-reino",
        "quantidade": 0.001
      },
      {
        "insumoId": "polvilho-doce",
        "quantidade": 0.03
      },
      {
        "insumoId": "suco-de-limao",
        "quantidade": 0.01
      }
    ],
    "tempoPreparo": "40 min",
    "custoPorcaoPlanilha": 11.4163,
    "custoReceitaPlanilha": 11.4163,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "manteiga-vegana",
    "nome": "Manteiga Vegana",
    "categoriaId": "massas-e-bases",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "leite-de-soja",
        "quantidade": 0.2
      },
      {
        "insumoId": "lecitina-de-soja-em-po",
        "quantidade": 0.008
      },
      {
        "insumoId": "manteiga-de-cacau",
        "quantidade": 0.25
      }
    ],
    "tempoPreparo": "10 min",
    "custoPorcaoPlanilha": 25.2831,
    "custoReceitaPlanilha": 25.2831,
    "vendavel": false,
    "ativo": true,
    "insumoGemeoId": "manteiga-vegana",
    "rendimentoKg": 1.0,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "massa-de-pizza",
    "nome": "Massa de Pizza",
    "categoriaId": "massas-e-bases",
    "rendimento": 4.0,
    "ingredientes": [
      {
        "insumoId": "agua",
        "quantidade": 0.1
      },
      {
        "insumoId": "mandioca-cozida",
        "quantidade": 0.4
      },
      {
        "insumoId": "fermento-biologico-seco",
        "quantidade": 0.01
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.005
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.02
      }
    ],
    "tempoPreparo": "40 min",
    "custoPorcaoPlanilha": 0.9532,
    "custoReceitaPlanilha": 3.8129,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "creme-para-quiche",
    "nome": "Massa Low Carb para Quiche",
    "categoriaId": "salgados-assados",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "ovos",
        "quantidade": 0.2
      },
      {
        "insumoId": "nata-feirinha",
        "quantidade": 0.3
      },
      {
        "insumoId": "pimenta-do-reino",
        "quantidade": 0.002
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.005
      },
      {
        "insumoId": "noz-moscada",
        "quantidade": 0.005
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 14.6668,
    "custoReceitaPlanilha": 14.6668,
    "vendavel": false,
    "ativo": true,
    "insumoGemeoId": "creme-para-quiche",
    "rendimentoKg": 1.0,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "creme-para-quiche-vegan",
    "nome": "Massa Low Carb para Quiche",
    "categoriaId": "salgados-assados",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "castanha-de-caju",
        "quantidade": 0.2
      },
      {
        "insumoId": "agua",
        "quantidade": 0.8
      },
      {
        "insumoId": "pimenta-do-reino",
        "quantidade": 0.005
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.01
      },
      {
        "insumoId": "noz-moscada",
        "quantidade": 0.005
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.05
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 17.2616,
    "custoReceitaPlanilha": 17.2616,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "massa-base-para-pao",
    "nome": "Massa Base para Pao",
    "categoriaId": "paes",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "fecula-de-batata",
        "quantidade": 0.08
      },
      {
        "insumoId": "farinha-de-arroz",
        "quantidade": 0.12
      },
      {
        "insumoId": "polvilho-doce",
        "quantidade": 0.04
      },
      {
        "insumoId": "farinha-de-grao-de-bico",
        "quantidade": 0.1
      },
      {
        "insumoId": "goma-xantana",
        "quantidade": 0.005
      },
      {
        "insumoId": "psyllium",
        "quantidade": 0.01
      },
      {
        "insumoId": "fermento-biologico-seco",
        "quantidade": 0.005
      },
      {
        "insumoId": "agua",
        "quantidade": 0.4
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.06
      },
      {
        "insumoId": "acucar-demerara",
        "quantidade": 0.03
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.008
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 9.3056,
    "custoReceitaPlanilha": 9.3056,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "focacciaa",
    "nome": "Focaccia de Tomate e Alecrim",
    "categoriaId": "paes",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "fecula-de-batata",
        "quantidade": 0.07
      },
      {
        "insumoId": "farinha-de-arroz",
        "quantidade": 0.06
      },
      {
        "insumoId": "polvilho-doce",
        "quantidade": 0.035
      },
      {
        "insumoId": "farinha-de-grao-de-bico",
        "quantidade": 0.025
      },
      {
        "insumoId": "goma-xantana",
        "quantidade": 0.002
      },
      {
        "insumoId": "psyllium",
        "quantidade": 0.006
      },
      {
        "insumoId": "fermento-biologico-seco",
        "quantidade": 0.003
      },
      {
        "insumoId": "agua",
        "quantidade": 0.2
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.04
      },
      {
        "insumoId": "acucar-demerara",
        "quantidade": 0.02
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.002
      },
      {
        "insumoId": "alecrim",
        "quantidade": 0.002
      },
      {
        "insumoId": "tomate-cereja",
        "quantidade": 0.1
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 6.7584,
    "custoReceitaPlanilha": 6.7584,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "maionese-verde",
    "nome": "Maionese Verde",
    "categoriaId": "massas-e-bases",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "semente-de-girassol",
        "quantidade": 0.2
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.05
      },
      {
        "insumoId": "alho-cru",
        "quantidade": 0.003
      },
      {
        "insumoId": "levedura-nutricional",
        "quantidade": 0.005
      },
      {
        "insumoId": "agua",
        "quantidade": 0.6
      },
      {
        "insumoId": "sal-temperado-maluzices",
        "quantidade": 0.005
      },
      {
        "insumoId": "pimenta-do-reino",
        "quantidade": 0.001
      },
      {
        "insumoId": "suco-de-limao",
        "quantidade": 0.03
      },
      {
        "insumoId": "salsinha",
        "quantidade": 0.03
      }
    ],
    "tempoPreparo": "15 min",
    "custoPorcaoPlanilha": 10.9338,
    "custoReceitaPlanilha": 10.9338,
    "vendavel": false,
    "ativo": true,
    "insumoGemeoId": "maionese-verde",
    "rendimentoKg": 1.8043,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "molho-oriental",
    "nome": "Molho Oriental",
    "categoriaId": "massas-e-bases",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "pasta-de-amendoim",
        "quantidade": 0.25
      },
      {
        "insumoId": "suco-de-limao",
        "quantidade": 0.05
      },
      {
        "insumoId": "gengibre-cru",
        "quantidade": 0.01
      },
      {
        "insumoId": "agua",
        "quantidade": 0.12
      },
      {
        "insumoId": "shoyu",
        "quantidade": 0.05
      }
    ],
    "tempoPreparo": "15 min",
    "custoPorcaoPlanilha": 10.0523,
    "custoReceitaPlanilha": 10.0523,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "porcao-requeiju",
    "nome": "Requeiju",
    "categoriaId": "massas-e-bases",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "requeiju",
        "quantidade": 0.04
      }
    ],
    "tempoPreparo": "MODO DE PREPARO",
    "custoPorcaoPlanilha": 0.5685,
    "custoReceitaPlanilha": 0.5685,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "porcao-maionese-verde",
    "nome": "Maionese Verde",
    "categoriaId": "massas-e-bases",
    "rendimento": 2.0,
    "ingredientes": [
      {
        "insumoId": "maionese-verde",
        "quantidade": 0.05
      }
    ],
    "tempoPreparo": "MODO DE PREPARO",
    "custoPorcaoPlanilha": 0.1336,
    "custoReceitaPlanilha": 0.2672,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "suco-nobis",
    "nome": "Suco-nóbis",
    "categoriaId": "bebidas",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "ora-pro-nobis",
        "quantidade": 0.001
      },
      {
        "insumoId": "gengibre-cru",
        "quantidade": 0.005
      },
      {
        "insumoId": "suco-de-limao",
        "quantidade": 0.001
      },
      {
        "insumoId": "abacaxi-sem-casca",
        "quantidade": 0.05
      },
      {
        "insumoId": "agua",
        "quantidade": 0.29
      }
    ],
    "tempoPreparo": "5 min",
    "custoPorcaoPlanilha": 0.8869,
    "custoReceitaPlanilha": 0.8869,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "batida-nuts",
    "nome": "Batida de Nuts",
    "categoriaId": "bebidas",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "pasta-de-amendoim",
        "quantidade": 0.01
      },
      {
        "insumoId": "agua",
        "quantidade": 0.1
      },
      {
        "insumoId": "canela-em-po",
        "quantidade": 0.001
      },
      {
        "insumoId": "aveia",
        "quantidade": 0.015
      },
      {
        "insumoId": "banana-sem-casca",
        "quantidade": 0.1
      }
    ],
    "tempoPreparo": "5 min",
    "custoPorcaoPlanilha": 2.3583,
    "custoReceitaPlanilha": 2.3583,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "sanduba-veg",
    "nome": "Sanduba Veg",
    "categoriaId": "sanduiches",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "maionese-verde",
        "quantidade": 0.025
      },
      {
        "quantidade": 0.08,
        "fichaId": "pao-nobis"
      },
      {
        "insumoId": "cenoura-com-casca",
        "quantidade": 0.03
      },
      {
        "insumoId": "alface",
        "quantidade": 0.02
      },
      {
        "insumoId": "requeiju",
        "quantidade": 0.02
      }
    ],
    "tempoPreparo": "MODO DE PREPARO",
    "custoPorcaoPlanilha": 0.7863,
    "custoReceitaPlanilha": 0.7863,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "sanduba-violeta",
    "nome": "Sanduba Violeta",
    "categoriaId": "sanduiches",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "maionese-verde",
        "quantidade": 0.025
      },
      {
        "insumoId": "tomate-para-sanduba",
        "quantidade": 0.03
      },
      {
        "insumoId": "alface",
        "quantidade": 0.02
      }
    ],
    "tempoPreparo": "MODO DE PREPARO",
    "custoPorcaoPlanilha": 0.4402,
    "custoReceitaPlanilha": 0.4402,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "pao-de-q",
    "nome": "Pão de Q?",
    "categoriaId": "paes",
    "rendimento": 10.0,
    "ingredientes": [
      {
        "insumoId": "batata-monalisa-in-natura",
        "quantidade": 0.6
      },
      {
        "insumoId": "polvilho-doce",
        "quantidade": 0.3
      },
      {
        "insumoId": "polvilho-azedo",
        "quantidade": 0.3
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.17
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.016
      },
      {
        "insumoId": "cebola-sem-casca",
        "quantidade": 0.08
      },
      {
        "insumoId": "salsinha",
        "quantidade": 0.01
      },
      {
        "insumoId": "agua",
        "quantidade": 0.2
      },
      {
        "insumoId": "chia",
        "quantidade": 0.03
      }
    ],
    "tempoPreparo": "2HR",
    "custoPorcaoPlanilha": 1.5581,
    "custoReceitaPlanilha": 15.5814,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "burger-de-grao-de-bico-e-bete",
    "nome": "Pão de Q?",
    "categoriaId": "paes",
    "rendimento": 12.0,
    "ingredientes": [
      {
        "insumoId": "grao-de-bico-cozido",
        "quantidade": 1.0
      },
      {
        "insumoId": "aveia",
        "quantidade": 0.2
      },
      {
        "insumoId": "beterraba",
        "quantidade": 0.1
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.03
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.02
      },
      {
        "insumoId": "cebola-sem-casca",
        "quantidade": 0.1
      },
      {
        "insumoId": "salsinha",
        "quantidade": 0.01
      },
      {
        "insumoId": "agua",
        "quantidade": 0.1
      },
      {
        "insumoId": "alho-cru",
        "quantidade": 0.01
      },
      {
        "insumoId": "paprica-defumada",
        "quantidade": 0.01
      },
      {
        "insumoId": "farinha-de-arroz",
        "quantidade": 0.2
      }
    ],
    "tempoPreparo": "2HR",
    "custoPorcaoPlanilha": 1.963,
    "custoReceitaPlanilha": 23.5555,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "nuggets-de-frango-e-linhaca",
    "nome": "Nuggets",
    "categoriaId": "salgados-fritos",
    "rendimento": 9.87,
    "ingredientes": [
      {
        "insumoId": "frango-cru",
        "quantidade": 1.7
      },
      {
        "insumoId": "cebola-sem-casca",
        "quantidade": 0.2
      },
      {
        "insumoId": "sal-temperado-maluzices",
        "quantidade": 0.015
      },
      {
        "insumoId": "pimenta-do-reino",
        "quantidade": 0.002
      },
      {
        "insumoId": "linhaca-dourada",
        "quantidade": 0.325
      },
      {
        "insumoId": "ovos",
        "quantidade": 0.05
      },
      {
        "insumoId": "agua",
        "quantidade": 0.15
      },
      {
        "insumoId": "gengibre-cru",
        "quantidade": 0.005
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 4.0439,
    "custoReceitaPlanilha": 39.913,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "croquete-de-batata-e-frango",
    "nome": "Croquete de Batata e Frango",
    "categoriaId": "salgados-fritos",
    "rendimento": 10.0,
    "ingredientes": [
      {
        "insumoId": "batata-asterix",
        "quantidade": 0.75
      },
      {
        "insumoId": "frango-desfiado",
        "quantidade": 0.5
      },
      {
        "insumoId": "cebola-sem-casca",
        "quantidade": 0.15
      },
      {
        "insumoId": "alho-cru",
        "quantidade": 0.005
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.015
      },
      {
        "insumoId": "curry",
        "quantidade": 0.01
      },
      {
        "insumoId": "alecrim",
        "quantidade": 0.003
      },
      {
        "insumoId": "louro",
        "quantidade": 0.003
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 3.0867,
    "custoReceitaPlanilha": 30.8669,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "croquete-de-carne-e-cabotia",
    "nome": "Croquete de Batata e Frango",
    "categoriaId": "salgados-fritos",
    "rendimento": 47.0,
    "ingredientes": [
      {
        "insumoId": "abobora-cabotia",
        "quantidade": 0.3
      },
      {
        "insumoId": "carne-moida",
        "quantidade": 0.6
      },
      {
        "insumoId": "cebola-sem-casca",
        "quantidade": 0.15
      },
      {
        "insumoId": "alho-cru",
        "quantidade": 0.005
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.015
      },
      {
        "insumoId": "curry",
        "quantidade": 0.01
      },
      {
        "insumoId": "alecrim",
        "quantidade": 0.003
      },
      {
        "insumoId": "louro",
        "quantidade": 0.003
      },
      {
        "insumoId": "amaranto-em-flocos",
        "quantidade": 0.15
      },
      {
        "insumoId": "aveia",
        "quantidade": 0.06
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 0.9758,
    "custoReceitaPlanilha": 45.8608,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "empadinha-veg",
    "nome": "Empadinha Veg",
    "categoriaId": "salgados-assados",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "quantidade": 0.02,
        "fichaId": "massa-de-quiche"
      },
      {
        "insumoId": "requeiju",
        "quantidade": 0.01
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 0.1421,
    "custoReceitaPlanilha": 0.1421,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "torta-low-carb-de-brocolis-e-ri",
    "nome": "Torta Low Carb de Brocolis e Ricota",
    "categoriaId": "salgados-assados",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "ovos",
        "quantidade": 0.6
      },
      {
        "insumoId": "aveia",
        "quantidade": 0.08
      },
      {
        "insumoId": "polvilho-azedo",
        "quantidade": 0.06
      },
      {
        "insumoId": "fermento-quimico",
        "quantidade": 0.02
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.001
      },
      {
        "insumoId": "brocolis",
        "quantidade": 0.6
      },
      {
        "insumoId": "ricota",
        "quantidade": 0.3
      },
      {
        "insumoId": "curry",
        "quantidade": 0.001
      },
      {
        "insumoId": "salsinha",
        "quantidade": 0.001
      }
    ],
    "tempoPreparo": "40 min",
    "custoPorcaoPlanilha": 41.5314,
    "custoReceitaPlanilha": 41.5314,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "pao-de-forma-low-carb",
    "nome": "Pão de Forma Low Carb",
    "categoriaId": "paes",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "ovos",
        "quantidade": 0.3
      },
      {
        "insumoId": "psyllium",
        "quantidade": 0.07
      },
      {
        "insumoId": "farinha-de-amendoas",
        "quantidade": 0.2
      },
      {
        "insumoId": "fermento-biologico-seco",
        "quantidade": 0.01
      },
      {
        "insumoId": "agua",
        "quantidade": 0.2
      },
      {
        "insumoId": "semente-de-girassol",
        "quantidade": 0.01
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.005
      }
    ],
    "tempoPreparo": "40 min",
    "custoPorcaoPlanilha": 22.4822,
    "custoReceitaPlanilha": 22.4822,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "pao-de-sementes",
    "nome": "Pão de Sementes",
    "categoriaId": "paes",
    "rendimento": 8.0,
    "ingredientes": [
      {
        "insumoId": "psyllium",
        "quantidade": 0.2
      },
      {
        "insumoId": "semente-de-abobora",
        "quantidade": 0.04
      },
      {
        "insumoId": "semente-de-girassol",
        "quantidade": 0.04
      },
      {
        "insumoId": "chia",
        "quantidade": 0.02
      },
      {
        "insumoId": "fermento-quimico",
        "quantidade": 0.005
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.005
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.015
      },
      {
        "insumoId": "ovos",
        "quantidade": 0.3
      },
      {
        "insumoId": "agua",
        "quantidade": 0.1
      }
    ],
    "tempoPreparo": "30 min",
    "custoPorcaoPlanilha": 2.6939,
    "custoReceitaPlanilha": 21.5515,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "pao-de-milho",
    "nome": "Pão de Milho",
    "categoriaId": "paes",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "milho-em-conserva",
        "quantidade": 0.2
      },
      {
        "insumoId": "fuba-fino",
        "quantidade": 0.06
      },
      {
        "insumoId": "polvilho-doce",
        "quantidade": 0.06
      },
      {
        "insumoId": "farinha-de-arroz",
        "quantidade": 0.12
      },
      {
        "insumoId": "fermento-biologico-seco",
        "quantidade": 0.008
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.003
      },
      {
        "insumoId": "oleo-de-coco",
        "quantidade": 0.03
      },
      {
        "insumoId": "ovos",
        "quantidade": 0.1
      },
      {
        "insumoId": "acucar-demerara",
        "quantidade": 0.01
      },
      {
        "insumoId": "agua",
        "quantidade": 0.2
      }
    ],
    "tempoPreparo": "30 min",
    "custoPorcaoPlanilha": 10.1386,
    "custoReceitaPlanilha": 10.1386,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "pao-nobis",
    "nome": "Pão-nóbis",
    "categoriaId": "paes",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "ovos",
        "quantidade": 0.15
      },
      {
        "insumoId": "aveia",
        "quantidade": 0.09
      },
      {
        "insumoId": "polvilho-doce",
        "quantidade": 0.09
      },
      {
        "insumoId": "fermento-biologico-seco",
        "quantidade": 0.01
      },
      {
        "insumoId": "grao-de-bico-cozido",
        "quantidade": 0.15
      },
      {
        "insumoId": "farinha-de-arroz",
        "quantidade": 0.135
      },
      {
        "insumoId": "sal-integral",
        "quantidade": 0.005
      },
      {
        "insumoId": "goma-xantana",
        "quantidade": 0.001
      },
      {
        "insumoId": "agua",
        "quantidade": 0.1
      },
      {
        "insumoId": "ora-pro-nobis",
        "quantidade": 0.1
      },
      {
        "insumoId": "semente-de-girassol",
        "quantidade": 0.01
      }
    ],
    "tempoPreparo": "1HR",
    "custoPorcaoPlanilha": 9.968,
    "custoReceitaPlanilha": 9.968,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "quiche-de-ricota-e-alho-poro",
    "nome": "Quiche Ricota, Ora-pro-nóbis e Alho-poró",
    "categoriaId": "salgados-assados",
    "rendimento": 8.0,
    "ingredientes": [
      {
        "insumoId": "ricota",
        "quantidade": 0.35
      },
      {
        "insumoId": "brocolis",
        "quantidade": 0.35
      },
      {
        "quantidade": 0.5,
        "fichaId": "massa-de-quiche"
      },
      {
        "insumoId": "creme-para-quiche",
        "quantidade": 0.5
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 3.8608,
    "custoReceitaPlanilha": 30.886,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "copy-of-quiche-de-ricota-e-alho",
    "nome": "Quiche Ricota, Ora-pro-nóbis e Espinafre",
    "categoriaId": "salgados-assados",
    "rendimento": 8.0,
    "ingredientes": [
      {
        "insumoId": "ora-pro-nobis",
        "quantidade": 0.15
      },
      {
        "quantidade": 0.4,
        "fichaId": "massa-de-quiche"
      },
      {
        "insumoId": "creme-para-quiche",
        "quantidade": 0.5
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 1.108,
    "custoReceitaPlanilha": 8.864,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "quiche-vegan-broc-e-cebola-roxa",
    "nome": "Quiche Ricota, Ora-pro-nóbis e Alho-poró",
    "categoriaId": "salgados-assados",
    "rendimento": 8.0,
    "ingredientes": [
      {
        "insumoId": "creme-pata-quiche-vegan",
        "quantidade": 0.5
      },
      {
        "insumoId": "brocolis",
        "quantidade": 0.3
      },
      {
        "insumoId": "cebola-sem-casca",
        "quantidade": 0.1
      },
      {
        "quantidade": 0.8,
        "fichaId": "massa-de-quiche"
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 2.4091,
    "custoReceitaPlanilha": 19.273,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "quiche-tomate-e-manj-vegan",
    "nome": "Quiche Ricota, Ora-pro-nóbis e Alho-poró",
    "categoriaId": "salgados-assados",
    "rendimento": 10.0,
    "ingredientes": [
      {
        "insumoId": "creme-para-quiche",
        "quantidade": 0.5
      },
      {
        "insumoId": "tomate-cereja",
        "quantidade": 0.7
      },
      {
        "insumoId": "manjericao",
        "quantidade": 0.03
      },
      {
        "quantidade": 0.75,
        "fichaId": "massa-de-quiche"
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 2.2846,
    "custoReceitaPlanilha": 22.8461,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "quiche-de-frango-e-tomate",
    "nome": "Massa Low Carb para Quiche",
    "categoriaId": "salgados-assados",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "frango-desfiado-com-molho-de-tomate",
        "quantidade": 0.35
      },
      {
        "insumoId": "cenoura-com-casca",
        "quantidade": 0.15
      },
      {
        "quantidade": 0.5,
        "fichaId": "massa-de-quiche"
      },
      {
        "insumoId": "creme-para-quiche",
        "quantidade": 0.5
      }
    ],
    "tempoPreparo": "1H",
    "custoPorcaoPlanilha": 20.4426,
    "custoReceitaPlanilha": 20.4426,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "leite-de-amendoim",
    "nome": "Leite de Amendoim",
    "categoriaId": "bebidas",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "agua",
        "quantidade": 2.0
      }
    ],
    "tempoPreparo": "MODO DE PREPARO",
    "custoPorcaoPlanilha": 3.0612,
    "custoReceitaPlanilha": 3.0612,
    "vendavel": false,
    "ativo": true,
    "insumoGemeoId": "leite-de-amendoim",
    "rendimentoKg": 1.0,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "leite-de-arroz",
    "nome": "Leite de Arroz Integral",
    "categoriaId": "bebidas",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "agua",
        "quantidade": 1.0
      }
    ],
    "tempoPreparo": "MODO DE PREPARO",
    "custoPorcaoPlanilha": 1.5306,
    "custoReceitaPlanilha": 1.5306,
    "vendavel": false,
    "ativo": true,
    "insumoGemeoId": "leite-de-arroz",
    "rendimentoKg": 1.0,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "molho-de-tomate-assado",
    "nome": "Molho de Tomate Assado",
    "categoriaId": "massas-e-bases",
    "rendimento": 5.0,
    "ingredientes": [
      {
        "insumoId": "tomate-para-molho",
        "quantidade": 5.0
      },
      {
        "insumoId": "cebola-sem-casca",
        "quantidade": 0.25
      },
      {
        "insumoId": "alho-cru",
        "quantidade": 0.025
      },
      {
        "insumoId": "louro",
        "quantidade": 0.01
      },
      {
        "insumoId": "azeite-de-oliva",
        "quantidade": 0.05
      }
    ],
    "tempoPreparo": "MODO DE PREPARO",
    "custoPorcaoPlanilha": 11.3219,
    "custoReceitaPlanilha": 56.6095,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "mix-sem-gluten-c-xantana",
    "nome": "Mix sem Gluten C/ Xantana",
    "categoriaId": "massas-e-bases",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "farinha-de-arroz",
        "quantidade": 0.538
      },
      {
        "insumoId": "fecula-de-batata",
        "quantidade": 0.288
      },
      {
        "insumoId": "polvilho-doce",
        "quantidade": 0.288
      },
      {
        "insumoId": "farinha-de-arroz-integral",
        "quantidade": 0.4
      },
      {
        "insumoId": "goma-xantana",
        "quantidade": 0.004
      }
    ],
    "tempoPreparo": "MODO DE PREPARO",
    "custoPorcaoPlanilha": 16.0746,
    "custoReceitaPlanilha": 16.0746,
    "vendavel": false,
    "ativo": true,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "frango-desfiado-com-molho-de-to",
    "nome": "Frango Desfiado com Molho de Tomate",
    "categoriaId": "massas-e-bases",
    "rendimento": 1.0,
    "ingredientes": [
      {
        "insumoId": "frango-desfiado",
        "quantidade": 1.069
      },
      {
        "insumoId": "molho-de-tomate",
        "quantidade": 0.5
      }
    ],
    "tempoPreparo": "MODO DE PREPARO",
    "custoPorcaoPlanilha": 53.353,
    "custoReceitaPlanilha": 53.353,
    "vendavel": false,
    "ativo": true,
    "insumoGemeoId": "frango-desfiado-com-molho-de-tomate",
    "rendimentoKg": 1.5692,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  },
  {
    "id": "frango-desfiado",
    "nome": "Frango Desfiado",
    "categoriaId": "massas-e-bases",
    "rendimento": 2.0,
    "ingredientes": [
      {
        "insumoId": "frango-cru",
        "quantidade": 2.0
      },
      {
        "insumoId": "agua",
        "quantidade": 2.5
      },
      {
        "insumoId": "louro",
        "quantidade": 0.01
      },
      {
        "insumoId": "alecrim",
        "quantidade": 0.01
      },
      {
        "insumoId": "cenoura-com-casca",
        "quantidade": 0.1
      },
      {
        "insumoId": "cebola-sem-casca",
        "quantidade": 0.15
      },
      {
        "insumoId": "salsao",
        "quantidade": 0.05
      },
      {
        "insumoId": "alho-poro",
        "quantidade": 0.1
      }
    ],
    "tempoPreparo": "MODO DE PREPARO",
    "custoPorcaoPlanilha": 22.2528,
    "custoReceitaPlanilha": 44.5057,
    "vendavel": false,
    "ativo": true,
    "insumoGemeoId": "frango-desfiado",
    "rendimentoKg": 2.0,
    "precoPraticado": 0,
    "tamanhoPorcao": ""
  }
];

/* Comprados por metro e usados como embalagem, fora da lista de insumos. */
export const materiaisDeEmbalagem = [
  {
    "nome": "Papel Manteiga",
    "preco": 2.99,
    "unidade": "M"
  },
  {
    "nome": "Pael Aluminio",
    "preco": 3.95,
    "unidade": "M"
  }
];
