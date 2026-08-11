module.exports = {
    metodoNaoPermitido: (metodo, rota) => ({
        codigo: 'METODO_NAO_PERMITIDO',
        mensagem: `Método ${metodo} não é permitido em ${rota}.`,
        detalhes: []
    }),

    credenciaisInvalidas: {
        codigo: 'CREDENCIAIS_INVALIDAS',
        mensagem: 'Usuário ou senha inválidos.',
        detalhes: []
    },

    campoObrigatorio: (campo) => ({
        codigo: 'VALIDACAO',
        mensagem: 'Payload inválido.',
        detalhes: [{ campo, problema: 'Campo obrigatório.' }]
    }),
};