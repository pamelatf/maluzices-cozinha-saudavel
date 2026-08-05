import { Pedido } from '../tipos';
import { brl } from '../utils/formato';

interface IndicadoresProps {
  pedidos: Pedido[];
}

export function Indicadores({ pedidos }: IndicadoresProps) {
  const emPreparo = pedidos.filter((p) => p.status === 'EM_PREPARO').length;
  const prontos = pedidos.filter((p) => p.status === 'PRONTO').length;
  const faturamento = pedidos.reduce((soma, p) => soma + Number(p.valorTotal), 0);

  return (
    <section className="indicadores" aria-label="Resumo do dia">
      <div className="ind">
        <div className="ind-icone">
          <svg className="icone">
            <use href="#i-comanda" />
          </svg>
        </div>
        <div>
          <div className="ind-num">{pedidos.length}</div>
          <div className="ind-rot">Pedidos hoje</div>
        </div>
      </div>
      <div className="ind">
        <div className="ind-icone">
          <svg className="icone">
            <use href="#i-panela" />
          </svg>
        </div>
        <div>
          <div className="ind-num">{emPreparo}</div>
          <div className="ind-rot">Na cozinha</div>
        </div>
      </div>
      <div className="ind">
        <div className="ind-icone">
          <svg className="icone">
            <use href="#i-cloche" />
          </svg>
        </div>
        <div>
          <div className="ind-num">{prontos}</div>
          <div className="ind-rot">Aguardando retirada</div>
        </div>
      </div>
      <div className="ind">
        <div className="ind-icone">
          <svg className="icone">
            <use href="#i-real" />
          </svg>
        </div>
        <div>
          <div className="ind-num">{brl(faturamento)}</div>
          <div className="ind-rot">Faturamento do dia</div>
        </div>
      </div>
    </section>
  );
}
