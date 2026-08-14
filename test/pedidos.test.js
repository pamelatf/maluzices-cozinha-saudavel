const { expect } = require('chai');
const { api } = require('../config/ambiente');
const { obterToken } = require('../helpers/autenticacao');
const naoAutenticado = require('../fixtures/naoAutenticado.json');
const criarPedido = require('../fixtures/criarPedido.json');


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

    });

 });
