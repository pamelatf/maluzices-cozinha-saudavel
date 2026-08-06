import { useEffect, useRef, useState } from 'react';
import { ErroRequisicao } from '../api/httpClient';
import { editarPedido } from '../api/pedidos';
import { Pedido } from '../tipos';
import { brl } from '../utils/formato';

interface LinhaItemForm {
  chave: number;
  nome: string;
  quantidade: string;
  precoUnitario: string;
}

let proximaChave = 1;

function linhaDeItem(item: { nome: string; quantidade: number; precoUnitario: number }): LinhaItemForm {
  return {
    chave: proximaChave++,
    nome: item.nome,
    quantidade: String(item.quantidade),
    precoUnitario: String(item.precoUnitario),
  };
}

interface ItemCalculado {
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

function itensDoForm(itens: LinhaItemForm[]): ItemCalculado[] {
  return itens.map((linha) => ({
    nome: linha.nome.trim(),
    quantidade: parseInt(linha.quantidade, 10) || 0,
    precoUnitario: parseFloat(linha.precoUnitario) || 0,
  }));
}

interface ModalEditarPedidoProps {
  pedido: Pedido | null;
  aoFechar: () => void;
  aoSalvar: (pedido: Pedido) => void;
}

export function ModalEditarPedido({ pedido, aoFechar, aoSalvar }: ModalEditarPedidoProps) {
  const aberto = pedido !== null;
  const [cliente, setCliente] = useState('');
  const [observacao, setObservacao] = useState('');
  const [itens, setItens] = useState<LinhaItemForm[]>([]);
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);
  const campoClienteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pedido) return;
    setCliente(pedido.cliente);
    setObservacao(pedido.observacao ?? '');
    setItens(pedido.itens.map(linhaDeItem));
    setAviso('');
    const id = setTimeout(() => campoClienteRef.current?.focus(), 40);
    return () => clearTimeout(id);
  }, [pedido]);

  useEffect(() => {
    if (!aberto) return;
    function aoTeclado(evento: KeyboardEvent) {
      if (evento.key === 'Escape') aoFechar();
    }
    document.addEventListener('keydown', aoTeclado);
    return () => document.removeEventListener('keydown', aoTeclado);
  }, [aberto, aoFechar]);

  const total = itensDoForm(itens).reduce((soma, item) => soma + item.quantidade * item.precoUnitario, 0);

  function atualizarLinha(chave: number, campo: 'nome' | 'quantidade' | 'precoUnitario', valor: string) {
    setItens((atual) => atual.map((linha) => (linha.chave === chave ? { ...linha, [campo]: valor } : linha)));
  }

  function removerLinha(chave: number) {
    setItens((atual) => (atual.length > 1 ? atual.filter((linha) => linha.chave !== chave) : atual));
  }

  async function salvar() {
    if (!pedido) return;

    const clienteAparado = cliente.trim();
    const itensValidos = itensDoForm(itens).filter((item) => item.nome);
    const erros: string[] = [];
    if (!clienteAparado) erros.push('informe o nome do cliente');
    if (!itensValidos.length) erros.push('adicione pelo menos um item');
    if (itensValidos.some((item) => item.quantidade < 1)) erros.push('quantidade mínima é 1');
    if (itensValidos.some((item) => item.precoUnitario <= 0)) erros.push('preço precisa ser maior que zero');

    if (erros.length) {
      setAviso(erros.join(' · '));
      return;
    }

    setEnviando(true);
    try {
      const atualizado = await editarPedido(pedido.id, {
        cliente: clienteAparado,
        observacao: observacao.trim() || null,
        itens: itensValidos,
      });
      aoSalvar(atualizado);
    } catch (erro) {
      if (erro instanceof ErroRequisicao) {
        setAviso(erro.detalhes.length ? erro.detalhes.map((d) => d.problema).join(' · ') : erro.message);
      } else {
        setAviso('Não foi possível salvar as alterações.');
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div
      className={`fundo-modal${aberto ? ' aberto' : ''}`}
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) aoFechar();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="tituloModalEditar">
        <div className="modal-topo">
          <svg className="icone">
            <use href="#i-editar" />
          </svg>
          <h2 id="tituloModalEditar">Editar pedido</h2>
          <button className="fechar" aria-label="Fechar" onClick={aoFechar}>
            <svg className="icone">
              <use href="#i-x" />
            </svg>
          </button>
        </div>
        <div className="modal-corpo">
          <div>
            <label htmlFor="campoClienteEditar">Cliente</label>
            <input
              id="campoClienteEditar"
              ref={campoClienteRef}
              maxLength={120}
              placeholder="Nome de quem pediu"
              autoComplete="off"
              value={cliente}
              onChange={(evento) => setCliente(evento.target.value)}
            />
          </div>
          <div>
            <label>Itens</label>
            <div className="cabec-itens">
              <span>Item</span>
              <span>Qtd</span>
              <span>Preço un.</span>
              <span></span>
            </div>
            <div>
              {itens.map((linha) => (
                <div className="linha-item" key={linha.chave}>
                  <input
                    className="it-nome"
                    placeholder="Nome do item"
                    autoComplete="off"
                    value={linha.nome}
                    onChange={(evento) => atualizarLinha(linha.chave, 'nome', evento.target.value)}
                  />
                  <input
                    className="it-qtd"
                    type="number"
                    min={1}
                    step={1}
                    value={linha.quantidade}
                    onChange={(evento) => atualizarLinha(linha.chave, 'quantidade', evento.target.value)}
                  />
                  <input
                    className="it-preco"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0,00"
                    value={linha.precoUnitario}
                    onChange={(evento) => atualizarLinha(linha.chave, 'precoUnitario', evento.target.value)}
                  />
                  <button
                    className="rm-item"
                    aria-label="Remover item"
                    onClick={() => removerLinha(linha.chave)}
                  >
                    <svg className="icone">
                      <use href="#i-x" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              className="add-item"
              onClick={() =>
                setItens((atual) => [...atual, linhaDeItem({ nome: '', quantidade: 1, precoUnitario: 0 })])
              }
            >
              <svg className="icone">
                <use href="#i-mais" />
              </svg>{' '}
              adicionar item
            </button>
          </div>
          <div>
            <label htmlFor="campoObsEditar">Observação</label>
            <textarea
              id="campoObsEditar"
              maxLength={280}
              placeholder="sem cebola, embalar separado…"
              value={observacao}
              onChange={(evento) => setObservacao(evento.target.value)}
            />
          </div>
          <div className={`aviso${aviso ? ' visivel' : ''}`}>{aviso}</div>
        </div>
        <div className="modal-base">
          <div className="total-previa">
            <span>Total</span>
            <strong>{brl(total)}</strong>
          </div>
          <button className="btn-secundario" onClick={aoFechar}>
            Cancelar
          </button>
          <button className="btn-primario" disabled={enviando} onClick={salvar}>
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}
