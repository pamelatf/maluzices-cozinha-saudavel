import { FormEvent, useState } from 'react';
import { login } from '../api/auth';
import { ErroRequisicao } from '../api/httpClient';

interface TelaLoginProps {
  aoAutenticar: (token: string, usuario: string) => void;
  mensagemInicial?: string;
}

export function TelaLogin({ aoAutenticar, mensagemInicial }: TelaLoginProps) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [aviso, setAviso] = useState(mensagemInicial ?? '');
  const [enviando, setEnviando] = useState(false);

  async function aoEntrar(evento: FormEvent) {
    evento.preventDefault();
    setAviso('');
    setEnviando(true);
    try {
      const resultado = await login(usuario, senha);
      aoAutenticar(resultado.token, usuario);
    } catch (erro) {
      if (erro instanceof ErroRequisicao) {
        setAviso(erro.detalhes.length ? erro.detalhes.map((d) => d.problema).join(' · ') : erro.message);
      } else {
        setAviso('Não foi possível entrar. Tente novamente.');
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="tela-login">
      <form className="cartao-login" onSubmit={aoEntrar}>
        <h1 className="login-titulo">Maluzices</h1>
        <p className="login-subtitulo">entre para acessar o painel</p>
        <div>
          <label htmlFor="campoUsuario">Usuário</label>
          <input
            id="campoUsuario"
            autoComplete="username"
            value={usuario}
            onChange={(evento) => setUsuario(evento.target.value)}
          />
        </div>
        <div>
          <label htmlFor="campoSenha">Senha</label>
          <input
            id="campoSenha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
          />
        </div>
        <div className={`aviso${aviso ? ' visivel' : ''}`}>{aviso}</div>
        <button type="submit" className="btn-primario" disabled={enviando}>
          Entrar
        </button>
      </form>
    </div>
  );
}
