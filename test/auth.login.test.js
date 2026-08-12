const { expect } = require('chai');
const { api, credenciais } = require('../config/ambiente');
const { credenciaisInvalidas, campoObrigatorio, metodoNaoPermitido, validacao } = require('../fixtures/erros');


const montarBodyLogin = () => ({
    usuario: credenciais.usuario,
    senha: credenciais.senha
});

describe('/auth/login', () => {
    let bodyLogin;

    beforeEach(() => {
        bodyLogin = montarBodyLogin();
    });

    describe('POST /auth/login', () => {

        it('AUTH-01 - Deve retornar 200 com token e expiraEm quando forem enviadas credenciais válidas', async () => {
            const resposta = await api
                .post('/auth/login')
                .send(bodyLogin);

            expect(resposta.status).to.equal(200);
            expect(resposta.body.token).to.not.be.empty;
            expect(resposta.body.expiraEm).to.be.a('string');
        });

        it('AUTH-02 - Deve retornar 400 com codigo VALIDACAO quando o usuário não for informado', async () => {
            bodyLogin.usuario = undefined;

            const resposta = await api
                .post('/auth/login')
                .send(bodyLogin);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.erro).to.deep.equal(campoObrigatorio('usuario'));
        });

        it('AUTH-03 - Deve retornar 400 com codigo VALIDACAO quando a senha não for informada', async () => {
            bodyLogin.senha = undefined;

            const resposta = await api
                .post('/auth/login')
                .send(bodyLogin);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.erro).to.deep.equal(campoObrigatorio('senha'));
        });

        it('AUTH-04 - Deve retornar 400 com codigo VALIDACAO quando o usuario informado for numérico', async () => {
            bodyLogin.usuario = 1234;

            const resposta = await api
                .post('/auth/login')
                .send(bodyLogin);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.erro).to.deep.equal(
                validacao([{ campo: 'usuario', problema: 'Expected string, received number' }])
            );

        });

        it('AUTH-05 - Deve retornar 400 com codigo VALIDACAO quando o o corpo do login for vazio', async () => {
            bodyLogin = {};

            const resposta = await api
                .post('/auth/login')
                .send(bodyLogin);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.erro.detalhes).to.have.deep.members([
                { campo: 'usuario', problema: 'Required' },
                { campo: 'senha', problema: 'Required' }
            ]);

        });

        it('AUTH-06 — Senha de 100 mil caracteres é processada por falta de maxLength', async () => {
            bodyLogin.senha = 'a'.repeat(100000);

            const resposta = await api
                .post('/auth/login')
                .send(bodyLogin);

            expect(resposta.status).to.equal(401);
            expect(resposta.body.erro).to.deep.equal(credenciaisInvalidas);
        });

        it('AUTH-07 — Login de usuário inexistente devolve 401 CREDENCIAIS_INVALIDAS', async () => {
            bodyLogin.usuario = 'fulano';

            const resposta = await api
                .post('/auth/login')
                .send(bodyLogin);

            expect(resposta.status).to.equal(401);
            expect(resposta.body.erro).to.deep.equal(credenciaisInvalidas);

        });

        it('AUTH-08 — Senha errada de usuário existente responde igual a usuário inexistente', async () => {
            bodyLogin.senha = '4321';

            const resposta = await api
                .post('/auth/login')
                .send(bodyLogin);

            expect(resposta.status).to.equal(401);
            expect(resposta.body.erro).to.deep.equal(credenciaisInvalidas);

        });

        it('AUTH-10 — Coerência entre expiraEm e o claim exp do token', async () => {
            const resposta = await api
                .post('/auth/login')
                .send(bodyLogin);

            expect(resposta.status).to.equal(200);

            const carga = JSON.parse(
                Buffer.from(resposta.body.token.split('.')[1], 'base64url').toString('utf8')
            );

            const expDoToken = carga.exp * 1000;
            const expiraEm = new Date(resposta.body.expiraEm).getTime();

            expect(expDoToken).to.be.closeTo(expiraEm, 2000);
            expect(expiraEm - Date.now()).to.be.closeTo(60 * 60 * 1000, 5000);
        });

    });


});

describe('GET /auth/login', () => {

    it('AUTH-13 — GET em /auth/login devolve 405 e recusa credencial na query', async () => {
        const resposta = await api
            .get('/auth/login?usuario=pamela&senha=1234');

        expect(resposta.status).to.equal(405);
        expect(resposta.body.erro).to.deep.equal(metodoNaoPermitido('GET', '/auth/login'));

        const verbosPermitidos = (resposta.headers.allow || '')
            .split(',')
            .map((verbo) => verbo.trim());

        expect(verbosPermitidos).to.include('POST', 'OPTIONS');
        expect(resposta.body).to.not.have.property('token');
    });

});

