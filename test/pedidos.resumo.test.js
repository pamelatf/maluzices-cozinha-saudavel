const { expect } = require('chai');
const { api } = require('../config/ambiente');
const { obterToken } = require('../helpers/autenticacao');
const getResumo = require('../fixtures/getResumo.json');

describe('PEDIDOS/RESUMO', async () => {
    let token;

    beforeEach(async () => {
        token = await obterToken();
    });

    it('RESUMO-01 — GET /pedidos/resumo devolve ResumoPedidos, e não 404 de pedido', async () => {
        const resposta = await api
            .get('/pedidos/resumo')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).to.equal(200);
        expect(resposta.body).to.include.all.keys(Object.keys(getResumo));
    });

    it('RESUMO-02 — GET /pedidos/resumo com barra final tem comportamento consistente', async () => {
        const resposta = await api
            .get('/pedidos/resumo/')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).to.equal(200);
        expect(resposta.body).to.include.all.keys(Object.keys(getResumo));
    });

    it('RESUMO-03 — Contagens do resumo batem com a listagem filtrada por status', async () => {

        const resumo = await api
            .get('/pedidos/resumo')
            .set('Authorization', `Bearer ${token}`);

        expect(resumo.status).to.equal(200);

        expect(Object.keys(resumo.body))
            .to.have.members(Object.keys(getResumo));

        const status = Object.keys(getResumo);

        let totalListagem = 0;
        let totalResumo = 0;

        for (const statusAtual of status) {

            const resposta = await api
                .get(`/pedidos?status=${statusAtual}`)
                .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.be.an('array');

            resposta.body.forEach(pedido => {
                expect(pedido.status).to.equal(statusAtual);
            });

            const quantidade = resposta.body.length;

            expect(resumo.body[statusAtual])
                .to.equal(quantidade);

            totalListagem += quantidade;
            totalResumo += resumo.body[statusAtual];
        }

        expect(totalResumo).to.equal(totalListagem);
    });

    it('RESUMO-05 — DELETE /pedidos/resumo devolve 405 com Allow de GET, HEAD e OPTIONS', async () => {

        const resposta = await api
            .delete('/pedidos/resumo');

        expect(resposta.status).to.equal(405);

        expect(resposta.headers)
            .to.have.property('allow');

        const metodosPermitidos = resposta.headers.allow
            .split(',')
            .map(metodo => metodo.trim());

        expect(metodosPermitidos)
            .to.include.members(['GET', 'HEAD', 'OPTIONS']);
    });

    it('RESUMO-06 — DELETE /pedidos/resumo sem token devolve 405, e não 401', async () => {
        const resposta = await api
            .delete('/pedidos/resumo');

        expect(resposta.status).to.equal(405);
        expect(resposta.headers.allow)
            .to.include.members(['GET', 'HEAD', 'OPTIONS']);
    });


});