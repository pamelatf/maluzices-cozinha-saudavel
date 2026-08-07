export type Metodo = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface DescritorRota {
  caminho: string;
  metodos: Metodo[];
}
