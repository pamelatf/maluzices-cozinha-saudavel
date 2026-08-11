const { api, credenciais } = require('../config/ambiente');

const obterToken = async (
    usuario = credenciais.usuario,
    senha = credenciais.senha
) => {
    const respostaLogin = await api
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send({
            usuario: usuario,
            senha: senha
        });

    return respostaLogin.body.token;
};

module.exports = {
    obterToken
};