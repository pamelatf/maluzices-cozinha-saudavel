import { Pedido, StatusPedido } from '../tipos';
import { Coluna } from './Coluna';

const COLUNAS: { status: StatusPedido; nome: string; icone: string }[] = [
  { status: 'RECEBIDO', nome: 'Recebido', icone: 'i-comanda' },
  { status: 'EM_PREPARO', nome: 'Em preparo', icone: 'i-panela' },
  { status: 'PRONTO', nome: 'Pronto', icone: 'i-cloche' },
  { status: 'ENTREGUE', nome: 'Entregue', icone: 'i-sacola' },
];

interface QuadroProps {
  pedidos: Pedido[];
  carregando: boolean;
  aoAvancar: (id: number) => void;
  aoRetroceder: (id: number) => void;
  aoCancelar: (id: number) => void;
}

export function Quadro({ pedidos, carregando, aoAvancar, aoRetroceder, aoCancelar }: QuadroProps) {
  return (
    <main className="quadro">
      {COLUNAS.map((coluna) => (
        <Coluna
          key={coluna.status}
          status={coluna.status}
          nome={coluna.nome}
          icone={coluna.icone}
          pedidos={pedidos.filter((p) => p.status === coluna.status)}
          carregando={carregando}
          aoAvancar={aoAvancar}
          aoRetroceder={aoRetroceder}
          aoCancelar={aoCancelar}
        />
      ))}
    </main>
  );
}
