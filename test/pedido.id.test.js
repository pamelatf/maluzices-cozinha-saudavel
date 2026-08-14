const { expect } = require('chai');
const { api } = require('../config/ambiente');
const { obterToken } = require('../helpers/autenticacao');
const criarPedido = require('../fixtures/criarPedido.json');
const{transicaoInvalida} = require('../fixtures/erros');

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
});