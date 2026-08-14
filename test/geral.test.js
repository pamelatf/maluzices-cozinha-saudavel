const { expect } = require('chai');
const { api } = require('../config/ambiente');
const { obterToken } = require('../helpers/autenticacao');
const naoAutenticado = require('../fixtures/naoAutenticado.json');
const criarPedido = require('../fixtures/criarPedido.json');

describe('/GERAL', () => {

    let token;

    beforeEach(async () => {
        token = await obterToken();
    });

    it('GERAL-01 — Header Authorization malformado', async () => {

        const headersInvalidos = [
            'Bearer abc',
            `Basic ${token}`,
            token,
            'Bearer'
        ];

        for (const authorization of headersInvalidos) {

            const resposta = await api
                .get('/pedidos')
                .set('Authorization', authorization);

            expect(resposta.status).to.equal(401);
            expect(resposta.body.erro).to.deep.equal(naoAutenticado);

        }

    });

    it('GERAL-02 — Endpoints protegidos rejeitam token com assinatura adulterada', async () => {

        const tokenAdulterado = `${token}abc`;

        const respostaPost = await api
            .post('/pedidos')
            .set('Authorization', `Bearer ${tokenAdulterado}`)
            .send(criarPedido);

        expect(respostaPost.status).to.equal(401);
        expect(respostaPost.body.erro).to.deep.equal(naoAutenticado);

        const respostaGet = await api
            .get('/pedidos')
            .set('Authorization', `Bearer ${tokenAdulterado}`);

        expect(respostaGet.status).to.equal(401);
        expect(respostaGet.body.erro).to.deep.equal(naoAutenticado);

    });

});