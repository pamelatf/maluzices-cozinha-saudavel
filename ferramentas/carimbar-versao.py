#!/usr/bin/env python3
"""
Carimba o endereço do CSS e dos módulos JavaScript com a versão do arquivo.

    python3 ferramentas/carimbar-versao.py

Por que isso existe
-------------------
O protótipo é publicado no GitHub Pages, que manda o navegador guardar CSS e
JavaScript por um tempo. Enquanto o endereço do arquivo não muda, o navegador
serve o que guardou, mesmo que o arquivo no servidor já seja outro.

Na prática isso apareceu de um jeito confuso: o HTML e o JavaScript vinham
novos, o CSS vinha velho, e a tela ficava meio nova e meio antiga. Um layout
corrigido continuava aparecendo torto, e a correção parecia não ter
funcionado.

Acrescentando ?v=<resumo do arquivo> ao endereço, qualquer mudança no arquivo
muda o endereço e o navegador é obrigado a buscar de novo. Quando o arquivo
não muda, o endereço também não, e o cache continua fazendo o trabalho dele.

Por que os imports também são carimbados
----------------------------------------
Carimbar só o index.html resolveria css/ e js/app.js, e deixaria de fora
calculo.js, graficos.js e os outros, que o navegador busca pelo endereço
escrito dentro do próprio JavaScript. Um gráfico corrigido continuaria
aparecendo errado, que é o mesmo problema com outra roupa.

Como o resumo de um arquivo muda quando os imports dele mudam, o cálculo é
repetido até parar de mudar. A árvore não tem ciclo, então isso estabiliza em
poucas voltas.

Rodar depois de mexer em css/ ou js/, antes de commitar.
"""
import hashlib
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent / 'prototipo'
PAGINA = RAIZ / 'index.html'

NA_PAGINA = ['css/estilos.css', 'css/pedidos.css', 'js/app.js']
LIMITE_DE_VOLTAS = 10


def resumo(caminho):
    return hashlib.sha1((RAIZ / caminho).read_bytes()).hexdigest()[:8]


def carimbar_imports():
    """Põe ?v= nos from './outro.js' de cada módulo. Devolve se algo mudou."""
    mudou = False
    for modulo in sorted(RAIZ.glob('js/*.js')):
        texto = original = modulo.read_text(encoding='utf-8')

        def troca(m):
            alvo = RAIZ / 'js' / m.group('arquivo')
            if not alvo.exists():
                return m.group(0)
            return f"{m.group('antes')}./{m.group('arquivo')}?v={resumo(alvo.relative_to(RAIZ))}{m.group('depois')}"

        texto = re.sub(
            r"(?P<antes>from\s+['\"])\./(?P<arquivo>[\w.-]+\.js)(\?v=[0-9a-f]+)?(?P<depois>['\"])",
            troca, texto)
        if texto != original:
            modulo.write_text(texto, encoding='utf-8')
            mudou = True
    return mudou


def carimbar_pagina():
    html = original = PAGINA.read_text(encoding='utf-8')
    for arquivo in NA_PAGINA:
        v = resumo(arquivo)
        html = re.sub(
            rf'(["\']){re.escape(arquivo)}(\?v=[0-9a-f]+)?\1',
            lambda m: f'{m.group(1)}{arquivo}?v={v}{m.group(1)}', html)
    if html != original:
        PAGINA.write_text(html, encoding='utf-8')
        return True
    return False


def main():
    if not PAGINA.exists():
        sys.exit(f'não achei {PAGINA}')

    for volta in range(1, LIMITE_DE_VOLTAS + 1):
        mexeu = carimbar_imports() | carimbar_pagina()
        if not mexeu:
            print(f'versões em dia (estabilizou em {volta} volta{"s" if volta > 1 else ""})')
            break
    else:
        sys.exit('as versões não estabilizaram; há import circular em js/?')

    for arquivo in NA_PAGINA:
        print(f'  {arquivo} -> {resumo(arquivo)}')


if __name__ == '__main__':
    main()
