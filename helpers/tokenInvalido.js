function adulterarAssinatura(token) {
  const partes = token.split('.');
  const assinatura = partes[2];

  const ultimo = assinatura.slice(-1);
  const novo = ultimo === 'a' ? 'b' : 'a';

  partes[2] = assinatura.slice(0, -1) + novo;

  return partes.join('.');
}

module.exports = { adulterarAssinatura };