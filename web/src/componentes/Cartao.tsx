import { useEffect, useState } from 'react';
import { Pedido } from '../tipos';
import { brl, tempoRelativo } from '../utils/formato';

const ORDEM = ['RECEBIDO', 'EM_PREPARO', 'PRONTO', 'ENTREGUE'] as const;

interface CartaoProps {
  pedido: Pedido;
  aoAvancar: (id: number) => void;
  aoRetroceder: (id: number) => void;
  aoCancelar: (id: number) => void;
}

export function Cartao({ pedido, aoAvancar, aoRetroceder, aoCancelar }: CartaoProps) {
  const [agora, setAgora] = useState(() => Date.now());

  useEffect(() => {
    const intervalo = setInterval(() => setAgora(Date.now()), 60000);
    return () => clearInterval(intervalo);
  }, []);

  const fim = pedido.status === 'ENTREGUE';
  const indice = ORDEM.indexOf(pedido.status as (typeof ORDEM)[number]);

  return (
    <article className="cartao" data-id={pedido.id}>
      <div className="cartao-topo">
        <span className="cliente">{pedido.cliente}</span>
        <span className="hora">{tempoRelativo(pedido.criadoEm, agora)}</span>
      </div>
      <ul className="itens">
        {pedido.itens.map((item) => (
          <li key={item.id}>
            <span className="qtd">{item.quantidade}×</span> {item.nome}
          </li>
        ))}
      </ul>
      {pedido.observacao ? <p className="obs">“{pedido.observacao}”</p> : null}
      <div className="cartao-base">
        <span className="total">{brl(pedido.valorTotal)}</span>
        {fim ? (
          <span className="concluido">
            <svg className="icone">
              <use href="#i-check" />
            </svg>{' '}
            concluído
          </span>
        ) : (
          <div className="acoes">
            <button
              className="acao perigo"
              data-acao="cancelar"
              aria-label={`Cancelar pedido de ${pedido.cliente}`}
              onClick={() => aoCancelar(pedido.id)}
            >
              <svg className="icone">
                <use href="#i-x" />
              </svg>
            </button>
            <button
              className="acao"
              data-acao="voltar"
              aria-label="Retroceder status"
              disabled={indice === 0}
              onClick={() => aoRetroceder(pedido.id)}
            >
              <svg className="icone">
                <use href="#i-esq" />
              </svg>
            </button>
            <button className="acao principal" data-acao="avancar" onClick={() => aoAvancar(pedido.id)}>
              Avançar{' '}
              <svg className="icone">
                <use href="#i-dir" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
