import { requisitar } from './httpClient';

export interface ResultadoLogin {
  token: string;
  expiraEm: string;
}

export function login(usuario: string, senha: string): Promise<ResultadoLogin> {
  return requisitar<ResultadoLogin>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usuario, senha }),
  });
}
