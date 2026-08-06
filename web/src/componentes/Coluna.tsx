import { Pedido, StatusPedido } from '../tipos';
import { Cartao } from './Cartao';

interface ColunaProps {
  status: StatusPedido;
  nome: string;
  icone: string;
  pedidos: Pedido[];
  carregando: boolean;
  aoAvancar: (id: number) => void;
  aoRetroceder: (id: number) => void;
  aoCancelar: (id: number) => void;
  aoEditar: (pedido: Pedido) => void;
}

export function Coluna({
  status,
  nome,
  icone,
  pedidos,
  carregando,
  aoAvancar,
  aoRetroceder,
  aoCancelar,
  aoEditar,
}: ColunaProps) {
  return (
    <section className="coluna" data-status={status}>
      <div className="col-topo">
        <svg className="icone">
          <use href={`#${icone}`} />
        </svg>
        <h2 className="col-nome">{nome}</h2>
        <span className="col-cont">{pedidos.length}</span>
      </div>
      <div className="lista">
        {carregando ? (
          <p className="vazio">carregando…</p>
        ) : pedidos.length === 0 ? (
          <p className="vazio">nada por aqui</p>
        ) : (
          pedidos.map((pedido) => (
            <Cartao
              key={pedido.id}
              pedido={pedido}
              aoAvancar={aoAvancar}
              aoRetroceder={aoRetroceder}
              aoCancelar={aoCancelar}
              aoEditar={aoEditar}
            />
          ))
        )}
      </div>
    </section>
  );
}
