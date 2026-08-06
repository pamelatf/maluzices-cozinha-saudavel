export interface ErroDetalhe {
  campo: string;
  problema: string;
}

export class AppError extends Error {
  constructor(
    public readonly codigo: string,
    mensagem: string,
    public readonly status: number,
    public readonly detalhes: ErroDetalhe[] = [],
  ) {
    super(mensagem);
    this.name = new.target.name;
  }
}

export class ErroValidacao extends AppError {
  constructor(detalhes: ErroDetalhe[]) {
    super('VALIDACAO', 'Payload inválido.', 400, detalhes);
  }
}

export class StatusInvalidoError extends AppError {
  constructor(status: string) {
    super('STATUS_INVALIDO', `Status '${status}' não é válido.`, 400);
  }
}

export class PedidoNaoEncontradoError extends AppError {
  constructor(id: number) {
    super('PEDIDO_NAO_ENCONTRADO', `Pedido ${id} não existe.`, 404);
  }
}

export class TransicaoInvalidaError extends AppError {
  constructor(mensagem: string) {
    super('TRANSICAO_INVALIDA', mensagem, 409);
  }
}

export class CredenciaisInvalidasError extends AppError {
  constructor() {
    super('CREDENCIAIS_INVALIDAS', 'Usuário ou senha inválidos.', 401);
  }
}

export class NaoAutenticadoError extends AppError {
  constructor() {
    super('NAO_AUTENTICADO', 'Não autenticado.', 401);
  }
}
