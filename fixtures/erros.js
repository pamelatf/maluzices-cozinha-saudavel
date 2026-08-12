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
    validacao: (detalhes) => ({
        codigo: 'VALIDACAO',
        mensagem: 'Payload inválido.',
        detalhes
    }),
    campoObrigatorio: (campo, problema = 'Required') => ({
        codigo: 'VALIDACAO',
        mensagem: 'Payload inválido.',
        detalhes: [{ campo, problema }]
    }),

};