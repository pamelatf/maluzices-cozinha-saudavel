# API de Pedidos da Cozinha de Comida Saudável

API REST em Node.js com TypeScript, com suíte de testes automatizados no mesmo repositório e aplicação web para acompanhamento operacional. O foco principal deste projeto é a qualidade de software e a validação de comportamento, com a API e a interface web desenvolvidas por mim aplicando os conhecimentos adquiridos nos módulos da Mentoria 2.0 do Júlio de Lima.

O projeto vai além do caminho feliz: cobre autenticação, regras de negócio, validação de contrato, verbos não documentados, erros de domínio e cenários de saúde da aplicação. A suíte automatizada foi pensada como parte essencial do resultado, e não como complemento secundário.

## Sobre o projeto

A aplicação simula o fluxo de atendimento de uma cozinha de comida saudável. Uma atendente registra o pedido do cliente e acompanha o preparo até a entrega, passando pelos status `RECEBIDO`, `EM_PREPARO`, `PRONTO` e `ENTREGUE`, com `CANCELADO` disponível em qualquer ponto antes da entrega.

Além disso, a API também registra a complexidade do ciclo real de uma operação: validação de entrada, regras de transição de status, autenticação de acesso, tratamento de erros e consistência entre endpoints.

Este repositório reúne os três pilares fundamentais do projeto:

- API funcional e documentada
- aplicação web para operação visual
- suíte de testes orientada à qualidade e à rastreabilidade

## Objetivo principal

O objetivo principal do projeto é demonstrar capacidade de:

- desenvolver APIs REST robustas em Node.js e TypeScript
- aplicar regras de negócio e validação em camadas
- montar uma interface web funcional para operação do sistema
- pensar em qualidade como parte do desenvolvimento, e não como etapa final
- automatizar testes de API para validar contratos, fluxos e regressões

Em outras palavras, o projeto foi construído com foco em qualidade de software e em evidência de comportamento, e isso é o que define a identidade do repositório.

## Estrutura do repositório

```text
cozinha/
├── src/                            API em TypeScript
│   ├── domain/                     regras de negócio e estados do pedido
│   ├── errors/                     tratamento de erros
│   ├── middlewares/                autenticação e verbos permitidos
│   ├── repositories/               acesso ao banco com Prisma
│   ├── routes/                     rotas, schemas e validação com Zod
│   ├── routing/                    mapeamento de rotas
│   ├── services/                   lógica de aplicação e orquestração
│   └── server.ts                  bootstrap da API
├── web/                            aplicação front-end em React
│   ├── src/
│   ├── package.json
│   ├── vite.config.*
│   └── README.md
├── prisma/                         schema e seeds do banco
│   ├── schema.prisma
│   ├── seed.ts
│   └── seedUsuario.ts
├── config/                         configuração e ambiente
│   ├── ambiente.js
│   └── config.example.json
├── fixtures/                       corpos e respostas esperadas em testes
├── helpers/                        suporte para autenticação e execução
├── docs/                           regras, matriz e apoio documental
│   ├── matriz_vader_cozinha_v3.0.csv
│   ├── backlog_pos_entrega.csv
│   ├── REGRAS-DE-NEGOCIO.md
│   ├── checklist_vader_cozinha_v3.0.html
│   ├── mapa_endpoint.md
│   └── Como funciona o workflow testes-api.md
├── defeitos/                       registro local dos achados, no padrão ISO/IEC/IEEE 29119-3
├── scripts/                        utilitários e automações auxiliares
├── test/                           suíte de testes automatizados da API
├── .github/workflows/              CI e validação automatizada
├── openapi.yaml                    contrato OpenAPI da API
├── openapi.json                    export JSON do contrato
├── README.md                      documentação do projeto
├── package.json                   dependências e scripts da API
├── tsconfig.json
├── LICENSE
├── projeto.json
└── docs/
```

## Tecnologias

### Aplicação

- Node.js 20+
- TypeScript
- Express 4
- Prisma ORM
- MySQL 8
- Zod
- Swagger UI

### Front-end

- React 18
- Vite
- TypeScript
- CSS personalizado

### Testes e qualidade

- Mocha 11
- Chai 6
- Supertest 7
- Mochawesome 8
- ESLint
- GitHub Actions

## Fluxo de negócio

A API trabalha com o ciclo de vida do pedido:

```text
RECEBIDO -> EM_PREPARO -> PRONTO -> ENTREGUE
   │            │            │
   └────────────┴────────────┴────-> CANCELADO
```

### Funcionalidades principais

- autenticação e geração de token
- criação de pedidos
- listagem com filtro por status
- consulta de pedido por id
- edição parcial de pedido
- avanço e retrocesso de status
- cancelamento de pedido
- resumo por status
- health check da aplicação e da dependência do banco
- respostas para rota inexistente e método não permitido

## Qualidade de software e testes

Este projeto foi pensado em uma abordagem de qualidade de software real, não apenas como entrega funcional.

A suíte de testes cobre cenários de:

- autenticação e autorização
- dados inválidos
- regras de negócio e transições de status
- validação de contrato e resposta HTTP
- erros da aplicação e da infraestrutura
- verbos não documentados e rotas inexistentes
- saúde do sistema e dependência de banco

A estratégia de testes foi guiada pela análise do contrato OpenAPI e pela heurística VADER, o que torna a execução mais rica e alinhada com cenários de regressão e risco real.

### Estado atual da automação

| Métrica | Valor |
|---|---|
| Casos na matriz da entrega | 96 |
| Casos automatizados | 64 (66,7%) |
| Casos críticos automatizados | 23 de 24 |
| Casos com veredicto na última execução de CI | 63 de 64 |
| Casos passando | 58 |
| Casos falhando de propósito, reproduzindo achado registrado | 5 |
| Achados registrados (defeitos e lacunas) | 13 |

As 5 falhas atuais não são ruído de automação: cada uma comprova, com teste
automatizado, um achado já registrado como Issue no repositório — o detalhe
caso a caso está na página [Defeitos encontrados](https://github.com/pamelatf/maluzices-cozinha-saudavel/wiki/09-Defeitos-encontrados)
da wiki.

## Documentação e rastreabilidade

A documentação do projeto está organizada em várias camadas:

- [openapi.yaml](openapi.yaml): contrato da API
- [docs/REGRAS-DE-NEGOCIO.md](docs/REGRAS-DE-NEGOCIO.md): regras e decisões do domínio
- [docs/matriz_vader_cozinha_v3.0.csv](docs/matriz_vader_cozinha_v3.0.csv): casos de teste e rastreabilidade
- [docs/backlog_pos_entrega.csv](docs/backlog_pos_entrega.csv): casos fora do escopo da entrega
- [docs/checklist_vader_cozinha_v3.0.html](docs/checklist_vader_cozinha_v3.0.html): checklist visual de execução
- [wiki do projeto](https://github.com/pamelatf/maluzices-cozinha-saudavel/wiki): visão mais ampla da API, do plano de testes e dos defeitos identificados

Essa organização permite que cada cenário de teste tenha origem, contexto e evidência clara, o que é essencial para um projeto focado em garantia de qualidade.

## Estrutura de testes do repositório

A parte de testes está organizada com foco em clareza e manutenção:

- `test/`: arquivos por contexto e endpoint
- `fixtures/`: payloads de erro e dados esperados
- `helpers/`: utilitários de autenticação e suporte
- `docs/`: matriz de casos, regras e evidências de execução
- `scripts/`: ferramentas para manutenção da documentação e rastreabilidade

Esse tipo de organização é parte importante da proposta do projeto, porque reflete uma abordagem de QA e garantia de qualidade aplicada desde a concepção do sistema.

## Regras de negócio relevantes

- todo pedido nasce em `RECEBIDO`
- o valor total é calculado no servidor
- todas as rotas de negócio exigem `Authorization: Bearer <token>`
- `POST /auth/login` e `GET /health` são públicos
- transições inválidas retornam erro de negócio
- métodos não suportados em rotas existentes respondem `405` com header `Allow`
- rotas inexistentes respondem `404`
- o contrato e a implementação não são sempre idênticos, e isso é registrado como lacuna de contrato e evidência de comportamento

## Práticas de qualidade aplicadas

Algumas decisões importantes do projeto foram:

- configuração centralizada para ambiente e acesso à API
- credenciais fora do código
- fixtures para respostas esperadas em erro
- organização dos testes por endpoint e comportamento
- identificação clara dos casos por nome
- rastreabilidade entre matriz, execução e evidência
- relatórios gerados por Mochawesome para revisão e avaliação

## Pré-requisitos

- Node.js 20 ou superior
- npm
- MySQL 8 rodando localmente

## Instalação e execução local

### 1. Clonar o repositório

```bash
git clone https://github.com/pamelatf/maluzices-cozinha-saudavel.git
cd maluzices-cozinha-saudavel
```

### 2. Criar o banco

```bash
mysql -u root -p < scripts/criar-banco.sql
```

### 3. Configurar as variáveis de ambiente

```bash
cp .env.example .env
```

Exemplo de configuração:

```env
DATABASE_URL="mysql://root:sua_senha@localhost:3306/cozinha_pedidos"
PORT=2000
JWT_SECRET=um_segredo_longo_e_seguro
BASE_URL=http://localhost:2000
USUARIO=pamela
SENHA=1234
```

### 4. Instalar dependências

```bash
npm install
```

### 5. Criar as tabelas

```bash
npm run db:migrate
```

### 6. Popular dados iniciais

```bash
npm run db:seed
npm run seed
```

### 7. Subir a API

```bash
npm run dev
```

A API fica disponível em `http://localhost:2000` e a documentação Swagger em `http://localhost:2000/docs`.

### 8. Subir a aplicação web

```bash
cd web
npm install
npm run dev
```

## Scripts disponíveis

### API

| Script | Descrição |
|---|---|
| `npm run dev` | sobe a API em modo desenvolvimento |
| `npm run build` | compila o TypeScript |
| `npm start` | executa a versão compilada |
| `npm test` | executa a suíte de testes |
| `npm run db:migrate` | aplica as migrations do Prisma |
| `npm run db:seed` | popula o banco com pedidos de exemplo |
| `npm run seed` | cria o usuário de autenticação |
| `npm run lint` | executa o ESLint |

### Web

| Script | Descrição |
|---|---|
| `cd web && npm run dev` | inicia o painel de operação |
| `cd web && npm run build` | gera a build de produção |
| `cd web && npm run preview` | visualiza a build |

## Execução dos testes

Com a API já em execução, a suíte pode ser rodada completa ou por cenário:

```bash
npm test
```

Arquivo específico:

```bash
npx mocha test/auth.login.test.js
```

Caso isolado por identificador:

```bash
npx mocha --grep "AUTH-01"
```

Grupo por prefixo:

```bash
npx mocha --grep "HEALTH-"
```

Listar sem executar:

```bash
npx mocha --dry-run
```

## Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/login` | autenticação |
| `POST` | `/pedidos` | criação de pedido |
| `GET` | `/pedidos` | listagem com filtro por status |
| `GET` | `/pedidos/resumo` | resumo por status |
| `GET` | `/pedidos/{id}` | busca por id |
| `PATCH` | `/pedidos/{id}` | edição |
| `PATCH` | `/pedidos/{id}/status` | avanço/retrocesso |
| `DELETE` | `/pedidos/{id}` | cancelamento |
| `GET` | `/health` | verificação da API e do banco |

## Portfólio e trajetória

Este projeto representa uma etapa importante da minha evolução como analista de qualidade e desenvolvedora, e foi construído aplicando os conhecimentos adquiridos nos módulos da Mentoria 2.0 do Júlio de Lima.

Durante esse processo, trabalhei com:

- desenvolvimento de API em Node.js e TypeScript
- arquitetura e organização do código
- regras de negócio e validação de requisitos
- documentação de contrato e comportamento
- testes automatizados e análise de regressão
- interface web para operação e acompanhamento

A combinação de backend, front-end e garantia de qualidade em um único projeto mostra a forma como tenho abordado desenvolvimento e validação de software: com foco em comportamento, clareza e evidência.

## Contribuição

O projeto pode ser usado como referência de estudo, evolução técnica e apresentação profissional. Sugestões, melhorias e pull requests são bem-vindos.

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

Pamela T. F.
GitHub: [@pamelatf](https://github.com/pamelatf)
Linkedin: Pâmela Tábata Fagundes da Silva - (https://www.linkedin.com/in/pamelatfagundes/)

Versão do contrato: 2.1.0
Última atualização: 2026-08-15