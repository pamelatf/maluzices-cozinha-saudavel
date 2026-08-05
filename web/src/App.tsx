import { useEffect, useState } from 'react';
import { listarPedidos } from './api/pedidos';
import { Indicadores } from './componentes/Indicadores';
import { Quadro } from './componentes/Quadro';
import { SpriteIcones } from './componentes/SpriteIcones';
import { Topo } from './componentes/Topo';
import { Pedido } from './tipos';

export function App() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    listarPedidos()
      .then((dados) => {
        if (!cancelado) setPedidos(dados);
      })
      .catch((erro) => {
        console.error(erro);
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  const pedidosVisiveis = pedidos.filter((p) => p.status !== 'CANCELADO');

  return (
    <>
      <SpriteIcones />
      <Topo aoAbrirModal={() => {}} />
      <Indicadores pedidos={pedidosVisiveis} />
      <Quadro
        pedidos={pedidosVisiveis}
        carregando={carregando}
        aoAvancar={() => {}}
        aoRetroceder={() => {}}
        aoCancelar={() => {}}
      />
      <p className="rodape">
        Protótipo visual · dados de demonstração em memória ·{' '}
        <span style={{ color: 'var(--taupe)' }}>Maluzices cozinha saudável</span>
      </p>
    </>
  );
}
