const { expect } = require('chai');
const { api } = require('../config/ambiente');
const { obterToken } = require('../helpers/autenticacao');
const naoAutenticado = require('../fixtures/naoAutenticado.json');
const criarPedido = require('../fixtures/criarPedido.json');
const { rotaNaoEncontrada } = require('../fixtures/erros');
const jwt = require('jsonwebtoken');

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

    it('GERAL-03 — Token expirado após a janela de 1 hora', async () => {

        const tokenExpirado = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) - 60
            },
            process.env.JWT_SECRET
        );

        const resposta = await api
            .get('/pedidos')
            .set('Authorization', `Bearer ${tokenExpirado}`);

        expect(resposta.status).to.equal(401);
        expect(resposta.body.erro.codigo)
            .to.equal(naoAutenticado.codigo);
    });

    it('GERAL-04 — Corpos de erro 4xx não expõem informações internas', async () => {

        const respostas = [];

        const respostaLogin = await api
            .post('/auth/login')
            .send({});

        respostas.push(respostaLogin);

        const respostaPedido = await api
            .get('/pedidos/999999')
            .set('Authorization', `Bearer ${token}`);

        respostas.push(respostaPedido);

        const respostaMetodo = await api
            .put('/pedidos/1/status')
            .set('Authorization', `Bearer ${token}`);

        respostas.push(respostaMetodo);

        for (const resposta of respostas) {

            expect(resposta.status).to.be.within(400, 499);

            const mensagem = resposta.body?.erro?.mensagem || '';

            expect(mensagem).to.not.match(/stack|Error:|at\s+\S+.*:\d+:\d+/i);
            expect(mensagem).to.not.match(/node_modules/i);
            expect(mensagem).to.not.match(/src[\\/]/i);
            expect(mensagem).to.not.match(/\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b/i);
            expect(mensagem).to.not.match(/\bFROM\s+\w+/i);
        }
    });
    it('GERAL-06 — Rota inexistente responde 404 sem exigir autenticação', async () => {

    const rotasInexistentes = [
        '/pedidoss',
        '/Pedidos',
        '/'
    ];

    for (const rota of rotasInexistentes) {

        const resposta = await api
            .get(rota);

        expect(resposta.status).to.equal(404);
        expect(resposta.body.erro.codigo)
            .to.equal(rotaNaoEncontrada.codigo);
    }
});
});