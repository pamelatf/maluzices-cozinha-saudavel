const { expect } = require('chai');
const { api } = require('../config/ambiente');
const { obterToken } = require('../helpers/autenticacao'); 
const getResumo = require('../fixtures/getResumo.json')
 
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
});