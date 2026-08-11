const { expect } = require('chai');
const { api } = require('../config/ambiente');
const { metodoNaoPermitido } = require('../fixtures/erros');

describe('/health', () => {

    const verbosNaoDocumentados = [
        { id: 'HEALTH-04', verbo: 'post' },
        { id: 'HEALTH-05', verbo: 'patch' },
        { id: 'HEALTH-06', verbo: 'put' },
        { id: 'HEALTH-07', verbo: 'delete' }
    ];

    describe('Sem autenticação', () => {

        it('HEALTH-01 - Deve responder o estado da API quando não for enviado o header Authorization', async () => {
            const resposta = await api
                .get('/health');

            expect(resposta.status).to.equal(200);
            expect(resposta.body.status).to.equal('ok');
        });

        it('HEALTH-02 - Deve retornar 503 se o banco estiver indisponível', async function () {
            this.timeout(10000);

            const resposta = await api
                .get('/health');

            expect(resposta.status).to.equal(503);
            expect(resposta.body.status).to.equal('indisponivel');
        });

        verbosNaoDocumentados.forEach(({ id, verbo }) => {

            it(`${id} - Deve retornar 405 e não 401 quando for enviado ${verbo.toUpperCase()} sem token`, async () => {
                const resposta = await api[verbo]('/health');

                expect(resposta.status).to.equal(405);
                expect(resposta.body.erro).to.deep.equal(
                    metodoNaoPermitido(verbo.toUpperCase(), '/health')
        );

        });

    });
});
    describe('Com token', () => {

        const tokenInvalido = 'Bearer token.invalido.aqui';

        it('HEALTH-03 - Deve ignorar token inválido e responder o estado da API', async () => {
            const resposta = await api
                .get('/health')
                .set('Authorization', tokenInvalido);

            expect(resposta.status).to.equal(200);
            expect(resposta.body.status).to.equal('ok');
        });

        verbosNaoDocumentados.forEach(({ id, verbo }) => {

            it(`${id} - Deve retornar 405 e não 401 quando for enviado ${verbo.toUpperCase()} com token`, async () => {
                const resposta = await api[verbo]('/health')
                    .set('Authorization', tokenInvalido);

                expect(resposta.status).to.equal(405);
                expect(resposta.body.erro).to.deep.equal(
                    metodoNaoPermitido(verbo.toUpperCase(), '/health')
        );

        });

    });

    });

});
