const { expect } = require('chai');
const { api } = require('../config/ambiente');
const { obterToken } = require('../helpers/autenticacao');
const criarPedido = require('../fixtures/criarPedido.json');
const { transicaoInvalida, validacao } = require('../fixtures/erros');

describe('PEDIDO/ID', () => {

    let token;

    before(async () => {
        token = await obterToken();
    });

    const criarNovoPedido = async () => {

        const criacao = await api
            .post('/pedidos')
            .set('Authorization', `Bearer ${token}`)
            .send(criarPedido);

        expect(criacao.status).to.equal(201);

        return criacao.body;
    };

    it('PEDIDO-ID-05 — Substituição de itens recalcula o valorTotal no servidor', async () => {

        const pedido = await criarNovoPedido();
        const pedidoId = pedido.id;

        const itensNovos = [
            {
                nome: 'Item A',
                quantidade: 2,
                precoUnitario: 15.00
            },
            {
                nome: 'Item B',
                quantidade: 1,
                precoUnitario: 20.00
            }
        ];

        const valorTotalEsperado = itensNovos.reduce(
            (total, item) => total + (item.quantidade * item.precoUnitario),
            0
        );

        const resposta = await api
            .patch(`/pedidos/${pedidoId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ itens: itensNovos });

        expect(resposta.status).to.equal(200);

        expect(resposta.body.valorTotal).to.equal(valorTotalEsperado);

        expect(resposta.body.itens).to.have.lengthOf(itensNovos.length);

        expect(resposta.body.itens[0].nome).to.equal(itensNovos[0].nome);
        expect(resposta.body.itens[0].quantidade).to.equal(itensNovos[0].quantidade);
        expect(resposta.body.itens[0].precoUnitario).to.equal(itensNovos[0].precoUnitario);

        expect(resposta.body.itens[1].nome).to.equal(itensNovos[1].nome);
        expect(resposta.body.itens[1].quantidade).to.equal(itensNovos[1].quantidade);
        expect(resposta.body.itens[1].precoUnitario).to.equal(itensNovos[1].precoUnitario);

        const consulta = await api
            .get(`/pedidos/${pedidoId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(consulta.status).to.equal(200);
        expect(consulta.body.valorTotal).to.equal(valorTotalEsperado);

        expect(consulta.body.itens).to.have.lengthOf(itensNovos.length);
    });

    it('PEDIDO-ID-08 — Campos de servidor não podem escapar pelo endpoint de edição', async () => {

        const pedido = await criarNovoPedido();
        const pedidoId = pedido.id;

        const statusOriginal = pedido.status;
        const valorTotalOriginal = pedido.valorTotal;
        const criadoEmOriginal = pedido.criadoEm;
        const idOriginal = pedido.id;

        const resposta = await api
            .patch(`/pedidos/${pedidoId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                cliente: 'Ana',
                status: 'ENTREGUE',
                valorTotal: 0.01,
                criadoEm: '2000-01-01T00:00:00.000Z',
                id: 99
            });

        expect(resposta.status).to.equal(200);

        expect(resposta.body.cliente).to.equal('Ana');
        expect(resposta.body.status).to.equal(statusOriginal);
        expect(resposta.body.valorTotal).to.equal(valorTotalOriginal);
        expect(resposta.body.criadoEm).to.equal(criadoEmOriginal);
        expect(resposta.body.id).to.equal(idOriginal);

        const consulta = await api
            .get(`/pedidos/${pedidoId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(consulta.status).to.equal(200);

        expect(consulta.body.cliente).to.equal('Ana');
        expect(consulta.body.status).to.equal(statusOriginal);
        expect(consulta.body.valorTotal).to.equal(valorTotalOriginal);
        expect(consulta.body.criadoEm).to.equal(criadoEmOriginal);
        expect(consulta.body.id).to.equal(idOriginal);
    });

    it('PEDIDO-ID-09 — Edição bloqueada nos status não permitidos', async () => {

        const statusBloqueados = [
            'PRONTO',
            'ENTREGUE',
            'CANCELADO'
        ];

        for (const status of statusBloqueados) {

            const pedido = await criarNovoPedido();
            const pedidoId = pedido.id;

            if (status === 'PRONTO') {

                const respostaEmPreparo = await api
                    .patch(`/pedidos/${pedidoId}/status`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ acao: 'AVANCAR' });

                expect(respostaEmPreparo.status).to.equal(200);
                expect(respostaEmPreparo.body.status).to.equal('EM_PREPARO');

                const respostaPronto = await api
                    .patch(`/pedidos/${pedidoId}/status`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ acao: 'AVANCAR' });

                expect(respostaPronto.status).to.equal(200);
                expect(respostaPronto.body.status).to.equal('PRONTO');
            }

            if (status === 'ENTREGUE') {

                const respostaEmPreparo = await api
                    .patch(`/pedidos/${pedidoId}/status`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ acao: 'AVANCAR' });

                expect(respostaEmPreparo.status).to.equal(200);

                const respostaPronto = await api
                    .patch(`/pedidos/${pedidoId}/status`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ acao: 'AVANCAR' });

                expect(respostaPronto.status).to.equal(200);

                const respostaEntregue = await api
                    .patch(`/pedidos/${pedidoId}/status`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ acao: 'AVANCAR' });

                expect(respostaEntregue.status).to.equal(200);
                expect(respostaEntregue.body.status).to.equal('ENTREGUE');
            }

            if (status === 'CANCELADO') {

                const respostaCancelar = await api
                    .delete(`/pedidos/${pedidoId}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(respostaCancelar.status).to.equal(200);
                expect(respostaCancelar.body.status).to.equal('CANCELADO');
            }

            const resposta = await api
                .patch(`/pedidos/${pedidoId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    cliente: 'Ana'
                });

            expect(resposta.status).to.equal(409);
            expect(resposta.body.erro.codigo)
                .to.equal(transicaoInvalida.codigo);

            const consulta = await api
                .get(`/pedidos/${pedidoId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(consulta.status).to.equal(200);
            expect(consulta.body.status).to.equal(status);
        }
    });

    it('PEDIDO-ID-14 — Cancelamento a partir de cada status ativo', async () => {

        const statusAtivos = [
            'RECEBIDO',
            'EM_PREPARO',
            'PRONTO'
        ];

        for (const status of statusAtivos) {

            const pedido = await criarNovoPedido();
            const pedidoId = pedido.id;

            if (status === 'EM_PREPARO') {

                const respostaStatus = await api
                    .patch(`/pedidos/${pedidoId}/status`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ acao: 'AVANCAR' });

                expect(respostaStatus.status).to.equal(200);
            }

            if (status === 'PRONTO') {

                const respostaEmPreparo = await api
                    .patch(`/pedidos/${pedidoId}/status`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ acao: 'AVANCAR' });

                expect(respostaEmPreparo.status).to.equal(200);

                const respostaPronto = await api
                    .patch(`/pedidos/${pedidoId}/status`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ acao: 'AVANCAR' });

                expect(respostaPronto.status).to.equal(200);
            }

            const resposta = await api
                .delete(`/pedidos/${pedidoId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(200);
            expect(resposta.body.status).to.equal('CANCELADO');
        }
    });
    it('PEDIDO-ID-15 — Cancelamento de pedido ENTREGUE devolve 409 TRANSICAO_INVALIDA', async () => {

        const pedido = await criarNovoPedido();
        const pedidoId = pedido.id;

        const respostaEmPreparo = await api
            .patch(`/pedidos/${pedidoId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'AVANCAR' });

        expect(respostaEmPreparo.status).to.equal(200);
        expect(respostaEmPreparo.body.status).to.equal('EM_PREPARO');

        const respostaPronto = await api
            .patch(`/pedidos/${pedidoId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'AVANCAR' });

        expect(respostaPronto.status).to.equal(200);
        expect(respostaPronto.body.status).to.equal('PRONTO');

        const respostaEntregue = await api
            .patch(`/pedidos/${pedidoId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'AVANCAR' });

        expect(respostaEntregue.status).to.equal(200);
        expect(respostaEntregue.body.status).to.equal('ENTREGUE');

        const respostaCancelar = await api
            .delete(`/pedidos/${pedidoId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(respostaCancelar.status).to.equal(409);
        expect(respostaCancelar.body.erro.codigo)
            .to.equal(transicaoInvalida.codigo);

        const consulta = await api
            .get(`/pedidos/${pedidoId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(consulta.status).to.equal(200);
        expect(consulta.body.status).to.equal('ENTREGUE');
    });

    it('PEDIDO-ID-16 — Cancelamento repetido devolve 409 na segunda chamada', async () => {

        const pedido = await criarNovoPedido();
        const pedidoId = pedido.id;

        const primeiraResposta = await api
            .delete(`/pedidos/${pedidoId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(primeiraResposta.status).to.equal(200);
        expect(primeiraResposta.body.status).to.equal('CANCELADO');

        const segundaResposta = await api
            .delete(`/pedidos/${pedidoId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(segundaResposta.status).to.equal(409);
        expect(segundaResposta.body.erro.codigo)
            .to.equal(transicaoInvalida.codigo);

        const consulta = await api
            .get(`/pedidos/${pedidoId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(consulta.status).to.equal(200);
        expect(consulta.body.status).to.equal('CANCELADO');
    });

    it('STATUS-01 — Ação fora do enum devolve 400 e não altera o status do pedido', async () => {

        const pedido = await criarNovoPedido();
        const pedidoId = pedido.id;

        const resposta = await api
            .patch(`/pedidos/${pedidoId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'CANCELAR' });

        expect(resposta.status).to.equal(400);
        expect(resposta.body.erro.codigo).to.equal('VALIDACAO');

        const consulta = await api
            .get(`/pedidos/${pedidoId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(consulta.status).to.equal(200);
        expect(consulta.body.status).to.equal('RECEBIDO');
    });

    it('STATUS-02 — Ação em caixa baixa registra comportamento da API', async () => {

        const pedido = await criarNovoPedido();
        const pedidoId = pedido.id;

        const resposta = await api
            .patch(`/pedidos/${pedidoId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'avancar' });

        expect(resposta.status).to.be.oneOf([200, 400]);
    });

    it('STATUS-03 — Ação vazia, nula, com tipo errado e corpo ausente', async () => {

        const casos = [
            { acao: '' },
            { acao: null },
            { acao: 1 },
            {}
        ];

        for (const dados of casos) {

            const pedido = await criarNovoPedido();
            const pedidoId = pedido.id;

            const resposta = await api
                .patch(`/pedidos/${pedidoId}/status`)
                .set('Authorization', `Bearer ${token}`)
                .send(dados);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.erro.codigo)
                .to.equal(validacao().codigo);

            const consulta = await api
                .get(`/pedidos/${pedidoId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(consulta.status).to.equal(200);
            expect(consulta.body.status).to.equal('RECEBIDO');
        }
    });

    it('STATUS-04 — Avanço de status percorre a máquina de estados uma casa por vez', async () => {

        const pedido = await criarNovoPedido();

        const pedidoId = pedido.id;
        const criadoEm = pedido.criadoEm;
        let atualizadoEm = pedido.atualizadoEm;

        const statusEsperados = [
            'EM_PREPARO',
            'PRONTO',
            'ENTREGUE'
        ];

        for (const statusEsperado of statusEsperados) {

            const resposta = await api
                .patch(`/pedidos/${pedidoId}/status`)
                .set('Authorization', `Bearer ${token}`)
                .send({ acao: 'AVANCAR' });

            expect(resposta.status).to.equal(200);
            expect(resposta.body.status).to.equal(statusEsperado);
            expect(resposta.body.criadoEm).to.equal(criadoEm);
            expect(resposta.body.atualizadoEm).to.not.equal(atualizadoEm);

            atualizadoEm = resposta.body.atualizadoEm;
        }
    });

    it('STATUS-05 — Retrocesso de status percorre a máquina de estados uma casa por vez', async () => {

        const pedido = await criarNovoPedido();

        const pedidoId = pedido.id;

        const respostaEmPreparo = await api
            .patch(`/pedidos/${pedidoId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'AVANCAR' });

        expect(respostaEmPreparo.status).to.equal(200);
        expect(respostaEmPreparo.body.status).to.equal('EM_PREPARO');

        const respostaPronto = await api
            .patch(`/pedidos/${pedidoId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'AVANCAR' });

        expect(respostaPronto.status).to.equal(200);
        expect(respostaPronto.body.status).to.equal('PRONTO');

        const respostaRetrocederPreparo = await api
            .patch(`/pedidos/${pedidoId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'RETROCEDER' });

        expect(respostaRetrocederPreparo.status).to.equal(200);
        expect(respostaRetrocederPreparo.body.status).to.equal('EM_PREPARO');

        const respostaRetrocederRecebido = await api
            .patch(`/pedidos/${pedidoId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'RETROCEDER' });

        expect(respostaRetrocederRecebido.status).to.equal(200);
        expect(respostaRetrocederRecebido.body.status).to.equal('RECEBIDO');
    });

    it('STATUS-06 — ENTREGUE rejeita AVANCAR e RETROCEDER', async () => {

        const pedido = await criarNovoPedido();
        const pedidoId = pedido.id;

        const respostaEmPreparo = await api
            .patch(`/pedidos/${pedidoId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'AVANCAR' });

        expect(respostaEmPreparo.status).to.equal(200);
        expect(respostaEmPreparo.body.status).to.equal('EM_PREPARO');

        const respostaPronto = await api
            .patch(`/pedidos/${pedidoId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'AVANCAR' });

        expect(respostaPronto.status).to.equal(200);
        expect(respostaPronto.body.status).to.equal('PRONTO');

        const respostaEntregue = await api
            .patch(`/pedidos/${pedidoId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'AVANCAR' });

        expect(respostaEntregue.status).to.equal(200);
        expect(respostaEntregue.body.status).to.equal('ENTREGUE');

        const respostaAvancar = await api
            .patch(`/pedidos/${pedidoId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'AVANCAR' });

        expect(respostaAvancar.status).to.equal(409);
        expect(respostaAvancar.body.erro.codigo)
            .to.equal(transicaoInvalida.codigo);

        const respostaRetroceder = await api
            .patch(`/pedidos/${pedidoId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'RETROCEDER' });

        expect(respostaRetroceder.status).to.equal(409);
        expect(respostaRetroceder.body.erro.codigo)
            .to.equal(transicaoInvalida.codigo);

        const consulta = await api
            .get(`/pedidos/${pedidoId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(consulta.status).to.equal(200);
        expect(consulta.body.status).to.equal('ENTREGUE');
    });

    it('STATUS-07 — Retrocesso a partir de RECEBIDO devolve 409', async () => {

        const pedido = await criarNovoPedido();
        const pedidoId = pedido.id;

        const resposta = await api
            .patch(`/pedidos/${pedidoId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'RETROCEDER' });

        expect(resposta.status).to.equal(409);
        expect(resposta.body.erro.codigo)
            .to.equal(transicaoInvalida.codigo);

        const consulta = await api
            .get(`/pedidos/${pedidoId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(consulta.status).to.equal(200);
        expect(consulta.body.status).to.equal('RECEBIDO');
    });

    it('STATUS-08 — CANCELADO rejeita AVANCAR e RETROCEDER', async () => {

        const pedido = await criarNovoPedido();
        const pedidoId = pedido.id;

        const respostaCancelar = await api
            .delete(`/pedidos/${pedidoId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(respostaCancelar.status).to.equal(200);
        expect(respostaCancelar.body.status).to.equal('CANCELADO');

        const respostaAvancar = await api
            .patch(`/pedidos/${pedidoId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'AVANCAR' });

        expect(respostaAvancar.status).to.equal(409);
        expect(respostaAvancar.body.erro.codigo)
            .to.equal(transicaoInvalida.codigo);

        const respostaRetroceder = await api
            .patch(`/pedidos/${pedidoId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'RETROCEDER' });

        expect(respostaRetroceder.status).to.equal(409);
        expect(respostaRetroceder.body.erro.codigo)
            .to.equal(transicaoInvalida.codigo);
    });

    it('STATUS-09 — Concorrência no avanço de status do mesmo pedido', async () => {

        const pedido = await criarNovoPedido();
        const pedidoId = pedido.id;

        const respostas = await Promise.all([
            api
                .patch(`/pedidos/${pedidoId}/status`)
                .set('Authorization', `Bearer ${token}`)
                .send({ acao: 'AVANCAR' }),

            api
                .patch(`/pedidos/${pedidoId}/status`)
                .set('Authorization', `Bearer ${token}`)
                .send({ acao: 'AVANCAR' })
        ]);

        const sucessos = respostas.filter(
            resposta => resposta.status === 200
        );

        expect(sucessos.length).to.be.greaterThan(0);

        const consulta = await api
            .get(`/pedidos/${pedidoId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(consulta.status).to.equal(200);
        expect(consulta.body.status).to.equal('EM_PREPARO');
    });

    it('STATUS-10 — Integridade dos dados do pedido após a transição', async () => {

        const pedido = await criarNovoPedido();

        const dadosOriginais = {
            id: pedido.id,
            cliente: pedido.cliente,
            observacao: pedido.observacao,
            valorTotal: pedido.valorTotal,
            itens: pedido.itens,
            criadoEm: pedido.criadoEm
        };

        const resposta = await api
            .patch(`/pedidos/${pedido.id}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ acao: 'AVANCAR' });

        expect(resposta.status).to.equal(200);

        expect({
            id: resposta.body.id,
            cliente: resposta.body.cliente,
            observacao: resposta.body.observacao,
            valorTotal: resposta.body.valorTotal,
            itens: resposta.body.itens,
            criadoEm: resposta.body.criadoEm
        }).to.deep.equal(dadosOriginais);

        expect(resposta.body.status).to.equal('EM_PREPARO');

        const consulta = await api
            .get(`/pedidos/${pedido.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(consulta.status).to.equal(200);

        expect({
            id: consulta.body.id,
            cliente: consulta.body.cliente,
            observacao: consulta.body.observacao,
            valorTotal: consulta.body.valorTotal,
            itens: consulta.body.itens,
            criadoEm: consulta.body.criadoEm,
            status: consulta.body.status
        }).to.deep.equal({
            ...dadosOriginais,
            status: 'EM_PREPARO'
        });

        expect(consulta.body.atualizadoEm)
            .to.equal(resposta.body.atualizadoEm);
    });

    it('STATUS-11 — POST em /pedidos/{id}/status devolve 405', async () => {

        const pedido = await criarNovoPedido();
        const pedidoId = pedido.id;

        const resposta = await api
            .post(`/pedidos/${pedidoId}/status`);

        expect(resposta.status).to.equal(405);
        expect(resposta.headers.allow).to.include('PATCH');
        expect(resposta.headers.allow).to.include('OPTIONS');
    });

    it('STATUS-12 — PUT em /pedidos/{id}/status sem token devolve 405 e não muda o status', async () => {

        const pedido = await criarNovoPedido();
        const pedidoId = pedido.id;
        const statusOriginal = pedido.status;

        const resposta = await api
            .put(`/pedidos/${pedidoId}/status`)
            .send({ status: 'ENTREGUE' });

        expect(resposta.status).to.equal(405);
        expect(resposta.headers.allow).to.include('PATCH');
        expect(resposta.headers.allow).to.include('OPTIONS');

        const consulta = await api
            .get(`/pedidos/${pedidoId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(consulta.status).to.equal(200);
        expect(consulta.body.status).to.equal(statusOriginal);
    });

    it('STATUS-13 — Header Allow correto na rota de status', async () => {

    const pedido = await criarNovoPedido();
    const pedidoId = pedido.id;

    const resposta = await api
        .post(`/pedidos/${pedidoId}/status`);

    expect(resposta.status).to.equal(405);

    const metodosPermitidos = resposta.headers.allow
        .split(',')
        .map(metodo => metodo.trim());

    expect(metodosPermitidos)
        .to.have.members(['PATCH', 'OPTIONS']);

    expect(metodosPermitidos)
        .to.have.lengthOf(2);
    });
});