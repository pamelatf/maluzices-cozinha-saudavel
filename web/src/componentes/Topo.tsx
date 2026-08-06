interface TopoProps {
  aoAbrirModal: () => void;
  nomeUsuario: string;
  aoSair: () => void;
}

export function Topo({ aoAbrirModal, nomeUsuario, aoSair }: TopoProps) {
  const dataHoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  return (
    <header className="topo">
      <div className="marca">
        <div className="marca-nome" style={{ display: 'none' }}>
          MALUZ
          <svg className="colher-i" viewBox="0 0 12 26">
            <ellipse cx="6" cy="4.2" rx="3" ry="3.9" />
            <path d="M6 8.3V25" />
          </svg>
          CES
        </div>
        <div className="marca-tag">cozinha saudável</div>
      </div>
      <div className="topo-dir">
        <span className="data-hoje">{dataHoje}</span>
        <button className="btn-novo" onClick={aoAbrirModal}>
          <svg className="icone">
            <use href="#i-mais" />
          </svg>{' '}
          Novo pedido
        </button>
        <div className="sessao">
          <span className="sessao-usuario">{nomeUsuario}</span>
          <button className="btn-sair" onClick={aoSair}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
