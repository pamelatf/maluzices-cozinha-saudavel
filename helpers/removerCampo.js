function removerCampo(bodyPedido, campo) {

    const body = JSON.parse(JSON.stringify(bodyPedido));

    switch (campo) {
        case 'cliente':
            delete body.cliente;
            break;

        case 'itens':
            delete body.itens;
            break;

        case 'itens[0].nome':
            delete body.itens[0].nome;
            break;

        case 'itens[0].quantidade':
            delete body.itens[0].quantidade;
            break;

        case 'itens[0].precoUnitario':
            delete body.itens[0].precoUnitario;
            break;
    }

    return body;
}

module.exports = { removerCampo };