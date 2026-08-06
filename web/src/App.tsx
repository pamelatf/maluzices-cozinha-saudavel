import { useEffect, useState } from 'react';
import { aoExpirarSessao, definirToken } from './api/httpClient';
import { avancarPedido, cancelarPedido, ErroRequisicao, listarPedidos, retrocederPedido } from './api/pedidos';
import { Indicadores } from './componentes/Indicadores';
import { ModalEditarPedido } from './componentes/ModalEditarPedido';
import { ModalNovoPedido } from './componentes/ModalNovoPedido';
import { Quadro } from './componentes/Quadro';
import { SpriteIcones } from './componentes/SpriteIcones';
import { TelaLogin } from './componentes/TelaLogin';
import { Topo } from './componentes/Topo';
import { Pedido } from './tipos';

export function App() {
  const [token, setToken] = useState<string | null>(null);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [mensagemSessao, setMensagemSessao] = useState('');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [pedidoEmEdicao, setPedidoEmEdicao] = useState<Pedido | null>(null);

  useEffect(() => {
    aoExpirarSessao(() => {
      setToken(null);
      setMensagemSessao('Sua sessão expirou. Faça login novamente.');
    });
  }, []);

  useEffect(() => {
    if (!token) return;
    let cancelado = false;
    setCarregando(true);
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
  }, [token]);

  function aoAutenticar(novoToken: string, usuario: string) {
    definirToken(novoToken);
    setToken(novoToken);
    setNomeUsuario(usuario);
    setMensagemSessao('');
  }

  function aoSair() {
    definirToken(null);
    setToken(null);
    setPedidos([]);
    setMensagemSessao('');
  }

  if (!token) {
    return <TelaLogin aoAutenticar={aoAutenticar} mensagemInicial={mensagemSessao} />;
  }

  const pedidosVisiveis = pedidos.filter((p) => p.status !== 'CANCELADO');

  function substituirPedido(pedido: Pedido) {
    setPedidos((atual) => atual.map((p) => (p.id === pedido.id ? pedido : p)));
  }

  function mensagemDeErro(erro: unknown, padrao: string): string {
    return erro instanceof ErroRequisicao ? erro.message : padrao;
  }

  async function aoAvancar(id: number) {
    try {
      substituirPedido(await avancarPedido(id));
    } catch (erro) {
      alert(mensagemDeErro(erro, 'Não foi possível avançar o pedido.'));
    }
  }

  async function aoRetroceder(id: number) {
    try {
      substituirPedido(await retrocederPedido(id));
    } catch (erro) {
      alert(mensagemDeErro(erro, 'Não foi possível retroceder o pedido.'));
    }
  }

  async function aoCancelar(id: number) {
    try {
      substituirPedido(await cancelarPedido(id));
    } catch (erro) {
      alert(mensagemDeErro(erro, 'Não foi possível cancelar o pedido.'));
    }
  }

  return (
    <>
      <SpriteIcones />
      <Topo aoAbrirModal={() => setModalAberto(true)} nomeUsuario={nomeUsuario} aoSair={aoSair} />
      <Indicadores pedidos={pedidosVisiveis} />
      <Quadro
        pedidos={pedidosVisiveis}
        carregando={carregando}
        aoAvancar={aoAvancar}
        aoRetroceder={aoRetroceder}
        aoCancelar={aoCancelar}
        aoEditar={setPedidoEmEdicao}
      />
      <p className="rodape" style={{ display: 'none' }}>
        Protótipo visual · dados de demonstração em memória ·{' '}
        <span style={{ color: 'var(--taupe)' }}>Maluzices cozinha saudável</span>
      </p>
      <ModalNovoPedido
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        aoRegistrarPedido={(pedido) => setPedidos((atual) => [pedido, ...atual])}
      />
      <ModalEditarPedido
        pedido={pedidoEmEdicao}
        aoFechar={() => setPedidoEmEdicao(null)}
        aoSalvar={(pedido) => {
          substituirPedido(pedido);
          setPedidoEmEdicao(null);
        }}
      />
    </>
  );
}
