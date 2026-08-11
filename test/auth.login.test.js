const { expect } = require('chai');
const { api, credenciais } = require('../config/ambiente');
const { credenciaisInvalidas, campoObrigatorio } = require('../fixtures/erros');


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

        it('AUTH-02 - Deve retornar 400 com codigo VALIDACAO quando um campo obrigatório não for enviado', async () => {
            bodyLogin.usuario = undefined;

            const semUsuario = await api
                .post('/auth/login')
                .send(bodyLogin);

            expect(semUsuario.status).to.equal(400);
            expect(semUsuario.body.erro).to.deep.equal(campoObrigatorio('usuario'));

            bodyLogin = montarBodyLogin();
            bodyLogin.senha = undefined;

            const semSenha = await api
                .post('/auth/login')
                .send(bodyLogin);

            expect(semSenha.status).to.equal(400);
            expect(semSenha.body.erro).to.deep.equal(campoObrigatorio('senha'));

        });

        it('AUTH-04 - Deve retornar 400 com codigo VALIDACAO quando o usuario informado for numérico', async () => {
            bodyLogin.usuario = 1234;

            const resposta = await api
                .post('/auth/login')
                .send(bodyLogin);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.erro).to.deep.equal(credenciaisInvalidas);

        });

        it('AUTH-05 - Deve retornar 400 com codigo VALIDACAO quando o o corpo do login for vazio', async () => {
            bodyLogin = {};

            const resposta = await api
                .post('/auth/login')
                .send(bodyLogin);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.erro).to.deep.equal(campoObrigatorio('usuario'));
            expect(resposta.body.erro).to.deep.equal(campoObrigatorio('senha'));

        });

    });

 //  describe('GET /auth/login', () => {

        //it(' - Deve retornar 405 quando um verbo não documentado for utilizado no endpoint de login', async () => {
           // const resposta = await api
           //     .get('/login');

           // expect(resposta.status).to.equal(405);
        });

   // });

//});