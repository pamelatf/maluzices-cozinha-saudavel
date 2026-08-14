const { expect } = require('chai');
const { api } = require('../config/ambiente');
const { obterToken } = require('../helpers/autenticacao');
const naoAutenticado = require('../fixtures/naoAutenticado.json');
const criarPedido = require('../fixtures/criarPedido.json');
const casosCamposObrigatorios = require('../fixtures/casosCamposObrigatorios.json');
const casosQuantidadeInvalida = require('../fixtures/casosQuantidadeInvalida.json');
const { removerCampo } = require('../helpers/removerCampo');
const casosPrecoInvalido = require('../fixtures/casosPrecoInvalido.json');
const casosPrecoDecimal = require('../fixtures/casosPrecoDecimal.json');


describe('/PEDIDOS', () => {

    const verbosNaoDocumentados = [
        { metodo: 'post', endpoint: '/pedidos' },
        { metodo: 'get', endpoint: '/pedidos' },
        { metodo: 'get', endpoint: '/pedidos/resumo' },
        { metodo: 'get', endpoint: '/pedidos/{id}' },
        { metodo: 'patch', endpoint: '/pedidos/{id}' },
        { metodo: 'delete', endpoint: '/pedidos/{id}' },
        { metodo: 'patch', endpoint: '/pedidos/{id}/status' }
    ];

    describe('Endpoints protegidos retornam 401 sem token', () => {

        verbosNaoDocumentados.forEach(({ metodo, endpoint }) => {

            it(`PEDIDOS-01 — ${metodo.toUpperCase()} retorna não autorizado no endpoint ${endpoint}`, async () => {

                const resposta = await api[metodo](endpoint);

                expect(resposta.status).to.equal(401);
                expect(resposta.body.erro).to.deep.equal(naoAutenticado);

            });

        });

    });


    describe('Endpoints de pedidos autenticados', () => {

        let token;

        beforeEach(async () => {
            token = await obterToken();
        });


        it('PEDIDOS-02 — Criação válida com múltiplos itens nasce em RECEBIDO', async () => {

            const valorEsperado = criarPedido.itens.reduce(
                (total, item) => total + item.quantidade * item.precoUnitario,
                0
            );

            const resposta = await api
                .post('/pedidos')
                .set('Authorization', `Bearer ${token}`)
                .send(criarPedido);

            expect(resposta.status).to.equal(201);
            expect(resposta.body.status).to.equal('RECEBIDO');
            expect(resposta.body.valorTotal).to.equal(valorEsperado);

        });


        it('PEDIDOS-03 — valorTotal enviado no corpo precisa ser ignorado pelo servidor', async () => {

            const valorTotalEsperado = criarPedido.itens.reduce(
                (total, item) => total + (item.quantidade * item.precoUnitario),
                0
            );

            const pedidoComValorTotal = {
                ...criarPedido,
                valorTotal: 0.01
            };

            const resposta = await api
                .post('/pedidos')
                .set('Authorization', `Bearer ${token}`)
                .send(pedidoComValorTotal);

            expect(resposta.status).to.equal(201);
            expect(resposta.body.valorTotal).to.equal(valorTotalEsperado);

        });


        casosCamposObrigatorios.forEach(caso => {

            if (caso.campo) {

                it(`${caso.id} — ${caso.nome} (${caso.campo})`, async () => {

                    const bodyPedido = removerCampo(
                        criarPedido,
                        caso.campo
                    );

                    const resposta = await api
                        .post('/pedidos')
                        .set('Authorization', `Bearer ${token}`)
                        .send(bodyPedido);

                    expect(resposta.status).to.equal(400);
                    expect(resposta.body.erro.codigo).to.equal('VALIDACAO');

                    expect(resposta.body.erro.detalhes)
                        .to.satisfy(detalhes =>
                            detalhes.some(detalhe =>
                                detalhe.campo === caso.campo
                            )
                        );

                });

            }

            if (caso.campos) {

                caso.campos.forEach(campo => {

                    it(`${caso.id} — ${caso.nome} (${campo})`, async () => {

                        const bodyPedido = removerCampo(
                            criarPedido,
                            campo
                        );

                        const resposta = await api
                            .post('/pedidos')
                            .set('Authorization', `Bearer ${token}`)
                            .send(bodyPedido);

                        expect(resposta.status).to.equal(400);
                        expect(resposta.body.erro.codigo).to.equal('VALIDACAO');

                        expect(resposta.body.erro.detalhes)
                            .to.satisfy(detalhes =>
                                detalhes.some(detalhe =>
                                    detalhe.campo === campo
                                )
                            );

                    });

                });

            }

        });


        it('PEDIDOS-07 — Quantidade 1, o mínimo declarado, é aceita na criação', async () => {

            const pedido = {
                ...criarPedido,
                itens: [
                    {
                        ...criarPedido.itens[0],
                        quantidade: 1
                    },
                    ...criarPedido.itens.slice(1)
                ]
            };

            const resposta = await api
                .post('/pedidos')
                .set('Authorization', `Bearer ${token}`)
                .send(pedido);

            expect(resposta.status).to.equal(201);
            expect(resposta.body.itens[0].quantidade).to.equal(1);

        });


        casosQuantidadeInvalida.forEach(caso => {

            it(`PEDIDOS-08 — Quantidade ${caso.descricao} (${caso.valor}) devolve 400`, async () => {

                const pedido = {
                    ...criarPedido,
                    itens: [
                        {
                            ...criarPedido.itens[0],
                            quantidade: caso.valor
                        },
                        ...criarPedido.itens.slice(1)
                    ]
                };

                const resposta = await api
                    .post('/pedidos')
                    .set('Authorization', `Bearer ${token}`)
                    .send(pedido);

                expect(resposta.status).to.equal(400);
                expect(resposta.body.erro.codigo).to.equal('VALIDACAO');

                expect(resposta.body.erro.detalhes)
                    .to.satisfy(detalhes =>
                        detalhes.some(detalhe =>
                            detalhe.campo === 'itens[0].quantidade' ||
                            detalhe.campo === 'itens.0.quantidade'
                        )
                    );

            });

        });


        it('PEDIDOS-09 — Quantidade de 999999999 calcula o valorTotal corretamente', async () => {

            const pedido = {
                ...criarPedido,
                itens: [
                    {
                        ...criarPedido.itens[0],
                        quantidade: 999999999
                    },
                    ...criarPedido.itens.slice(1)
                ]
            };

            const valorEsperado =
                (999999999 * pedido.itens[0].precoUnitario) +
                (pedido.itens[1].quantidade * pedido.itens[1].precoUnitario);

            const resposta = await api
                .post('/pedidos')
                .set('Authorization', `Bearer ${token}`)
                .send(pedido);

            expect(resposta.status).to.equal(201);
            expect(resposta.body.valorTotal).to.equal(valorEsperado);
            expect(resposta.body.valorTotal).to.be.finite;

        });


        it('PEDIDOS-10 — Preço unitário de um centavo é aceito na criação', async () => {

            const pedido = {
                ...criarPedido,
                itens: [
                    {
                        ...criarPedido.itens[0],
                        precoUnitario: 0.01
                    },
                    ...criarPedido.itens.slice(1)
                ]
            };

            const resposta = await api
                .post('/pedidos')
                .set('Authorization', `Bearer ${token}`)
                .send(pedido);

            expect(resposta.status).to.equal(201);
            expect(resposta.body.itens[0].precoUnitario).to.equal(0.01);

        });


        casosPrecoInvalido.forEach(caso => {

            it(`PEDIDOS-11 — Preço unitário ${caso.descricao} (${caso.valor}) devolve 400`, async () => {

                const pedido = {
                    ...criarPedido,
                    itens: [
                        {
                            ...criarPedido.itens[0],
                            precoUnitario: caso.valor
                        },
                        ...criarPedido.itens.slice(1)
                    ]
                };

                const resposta = await api
                    .post('/pedidos')
                    .set('Authorization', `Bearer ${token}`)
                    .send(pedido);

                expect(resposta.status).to.equal(400);
                expect(resposta.body.erro.codigo).to.equal('VALIDACAO');

                expect(resposta.body.erro.detalhes)
                    .to.satisfy(detalhes =>
                        detalhes.some(detalhe =>
                            detalhe.campo === 'itens[0].precoUnitario' ||
                            detalhe.campo === 'itens.0.precoUnitario'
                        )
                    );

            });

        });


        casosPrecoDecimal.forEach(caso => {

            it(`PEDIDOS-12 — Preço unitário ${caso.descricao} (${caso.valor})`, async () => {

                const pedido = {
                    ...criarPedido,
                    itens: [
                        {
                            ...criarPedido.itens[0],
                            precoUnitario: caso.valor
                        },
                        ...criarPedido.itens.slice(1)
                    ]
                };

                const resposta = await api
                    .post('/pedidos')
                    .set('Authorization', `Bearer ${token}`)
                    .send(pedido);

                console.log(
                    `precoUnitario enviado: ${caso.valor} | ` +
                    `status: ${resposta.status} | ` +
                    `valorTotal retornado: ${resposta.body.valorTotal}`
                );

                expect(resposta.status).to.equal(201);

            });

        });


        it('PEDIDOS-13 — Criação com array de itens vazio devolve 400 por minItems', async () => {

            const pedido = {
                ...criarPedido,
                itens: []
            };

            const resposta = await api
                .post('/pedidos')
                .set('Authorization', `Bearer ${token}`)
                .send(pedido);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.erro.codigo).to.equal('VALIDACAO');

            expect(resposta.body.erro.detalhes)
                .to.satisfy(detalhes =>
                    detalhes.some(detalhe =>
                        detalhe.campo === 'itens'
                    )
                );

        });


        it('PEDIDOS-15 — Campos gerados pelo servidor enviados no corpo da criação', async () => {

            const pedidoComCamposGerados = {
                ...criarPedido,
                id: 99,
                status: 'CANCELADO',
                criadoEm: '2020-01-01T00:00:00Z',
                itens: [
                    {
                        ...criarPedido.itens[0],
                        id: 99
                    },
                    ...criarPedido.itens.slice(1)
                ]
            };

            const resposta = await api
                .post('/pedidos')
                .set('Authorization', `Bearer ${token}`)
                .send(pedidoComCamposGerados);

            expect(resposta.status).to.equal(201);
            expect(resposta.body.id).to.not.equal(99);
            expect(resposta.body.status).to.equal('RECEBIDO');
            expect(resposta.body.criadoEm).to.not.equal('2020-01-01T00:00:00Z');
            expect(resposta.body.itens[0].id).to.not.equal(99);

        });


        const casosCorpoInvalido = [
            {
                id: 'PEDIDOS-17',
                descricao: 'corpo malformado',
                corpo: '{"cliente": "Maria", "itens": ['
            },
            {
                id: 'PEDIDOS-17',
                descricao: 'corpo ausente',
                corpo: undefined
            },
            {
                id: 'PEDIDOS-17',
                descricao: 'corpo nulo',
                corpo: null
            }
        ];


        casosCorpoInvalido.forEach(caso => {

            it(`${caso.id} — ${caso.descricao} na criação devolve 400`, async () => {

                let requisicao = api
                    .post('/pedidos')
                    .set('Authorization', `Bearer ${token}`);

                if (caso.corpo === undefined) {

                    requisicao = requisicao.send();

                } else if (caso.corpo === null) {

                    requisicao = requisicao
                        .set('Content-Type', 'application/json')
                        .send('null');

                } else {

                    requisicao = requisicao
                        .set('Content-Type', 'application/json')
                        .send(caso.corpo);

                }

                const resposta = await requisicao;

                expect(resposta.status).to.equal(400);

                expect(resposta.body).to.have.property('erro');

                expect(resposta.body.erro)
                    .to.have.property('codigo');

                expect(resposta.body.erro)
                    .to.have.property('mensagem');

                expect(resposta.body.erro)
                    .to.have.property('detalhes');

            });

        });
        it('PEDIDOS-18 — Idempotência na criação do pedido', async () => {

            const primeiraResposta = await api
                .post('/pedidos')
                .set('Authorization', `Bearer ${token}`)
                .send(criarPedido);

            const segundaResposta = await api
                .post('/pedidos')
                .set('Authorization', `Bearer ${token}`)
                .send(criarPedido);

            console.log('Primeira criação:', primeiraResposta.body);
            console.log('Segunda criação:', segundaResposta.body);

            expect(primeiraResposta.status).to.equal(201);
            expect(segundaResposta.status).to.equal(201);

            expect(primeiraResposta.body.id)
                .to.not.equal(segundaResposta.body.id);

        });
        it('PEDIDOS-19 — Precisão do valorTotal em ponto flutuante', async () => {

            const casos = [
                {
                    quantidade: 10,
                    precoUnitario: 33.33,
                    valorEsperado: 333.30
                },
                {
                    quantidade: 3,
                    precoUnitario: 0.10,
                    valorEsperado: 0.30
                },
                {
                    quantidade: 7,
                    precoUnitario: 1.15,
                    valorEsperado: 8.05
                }
            ];

            for (const caso of casos) {

                const pedido = {
                    ...criarPedido,
                    itens: [
                        {
                            ...criarPedido.itens[0],
                            quantidade: caso.quantidade,
                            precoUnitario: caso.precoUnitario
                        }
                    ]
                };

                const resposta = await api
                    .post('/pedidos')
                    .set('Authorization', `Bearer ${token}`)
                    .send(pedido);

                console.log(
                    `Quantidade: ${caso.quantidade} | ` +
                    `Preço: ${caso.precoUnitario} | ` +
                    `Esperado: ${caso.valorEsperado} | ` +
                    `Retornado: ${resposta.body.valorTotal}`
                );

                expect(resposta.status).to.equal(201);
                expect(resposta.body.valorTotal).to.equal(caso.valorEsperado);
            }

        });
    });

});