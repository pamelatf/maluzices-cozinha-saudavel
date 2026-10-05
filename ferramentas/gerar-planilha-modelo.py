#!/usr/bin/env python3
"""
Gera a planilha-modelo de ficha técnica do Maluzices, já preenchida com os
dados convertidos da planilha original da dona.

    python3 ferramentas/gerar-planilha-modelo.py

Lê `prototipo/js/base.js` (que é gerado por `converter-planilha.py`) e escreve
`docs/Maluzices - Ficha Tecnica (modelo).xlsx`.

Por que as fórmulas são do jeito que são
----------------------------------------
Uma sub-receita (frango desfiado, mix de sementes) é ao mesmo tempo um produto
e um insumo de outro produto. Se o preço dela fosse buscado com PROCV numa
coluna inteira, a planilha enxergaria referência circular: o custo do produto
dependeria da coluna toda de insumos, que contém o preço da sub-receita, que
depende do custo do produto.

Por isso os insumos ficam em dois blocos: as sub-receitas no topo, com o preço
puxado direto da aba Produtos, e os insumos comprados embaixo, com preço
digitado. As buscas por INDEX/MATCH só varrem o bloco de comprados, que não tem
fórmula nenhuma, e a corrente nunca volta para trás.
"""
import json
import re
from pathlib import Path

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

RAIZ = Path(__file__).resolve().parent.parent
BASE = RAIZ / 'prototipo' / 'js' / 'base.js'
RELATORIO = RAIZ / 'docs' / 'conversao-relatorio.json'
SAIDA = RAIZ / 'docs' / 'Maluzices - Ficha Tecnica (modelo).xlsx'

# ---------------------------------------------------------------- aparência
FONTE = 'Arial'
OLIVA = '464028'
VERDE = '66713F'
CREME = 'EFF1E3'
AREIA = 'DCD9C6'
TERRACOTA = '9C5C42'

AZUL = Font(name=FONTE, size=10, color='0000FF')          # digitado por ela
PRETO = Font(name=FONTE, size=10)                          # fórmula
VERDE_TXT = Font(name=FONTE, size=10, color='008000')      # vem de outra aba
TITULO = Font(name=FONTE, size=14, bold=True, color=OLIVA)
SUBTITULO = Font(name=FONTE, size=10, color='666666')
CABECALHO = Font(name=FONTE, size=10, bold=True, color='FFFFFF')
NEGRITO = Font(name=FONTE, size=10, bold=True)

FUNDO_CABECALHO = PatternFill('solid', fgColor=OLIVA)
FUNDO_PREENCHER = PatternFill('solid', fgColor='FFF9D6')
FUNDO_CREME = PatternFill('solid', fgColor=CREME)
LINHA_FINA = Side(style='thin', color=AREIA)
BORDA = Border(bottom=LINHA_FINA)

MOEDA = 'R$ #,##0.00'
MOEDA4 = 'R$ #,##0.0000'
PESO = '#,##0.000'
PERCENT = '0,0%'
FATOR = '0.00'

PRIMEIRA = 4  # os dados começam na linha 4 em todas as abas


def ler_base():
    texto = BASE.read_text(encoding='utf-8')

    def bloco(nome):
        achado = re.search(r'export const ' + nome + r' = (\[.*?\n\]);', texto, re.S)
        return json.loads(achado.group(1)) if achado else []

    return {n: bloco(n) for n in
            ('categorias', 'fornecedores', 'unidades', 'insumos', 'fichas',
             'materiaisDeEmbalagem')}


def montar_cabecalho(ws, titulo, subtitulo, colunas):
    """Título, uma linha de explicação e a faixa de cabeçalho na linha 3."""
    ws['A1'] = titulo
    ws['A1'].font = TITULO
    ws['A2'] = subtitulo
    ws['A2'].font = SUBTITULO
    ws.row_dimensions[1].height = 22
    ws.row_dimensions[3].height = 30

    for i, (letra, rotulo, largura, nota) in enumerate(colunas, start=1):
        celula = ws.cell(row=3, column=i, value=rotulo)
        celula.font = CABECALHO
        celula.fill = FUNDO_CABECALHO
        celula.alignment = Alignment(wrap_text=True, vertical='center', horizontal='center')
        ws.column_dimensions[get_column_letter(i)].width = largura
        if nota:
            celula.comment = Comment(nota, 'Maluzices')
    ws.freeze_panes = 'A4'


def escrever(ws, linha, coluna, valor, fonte=PRETO, formato=None, fundo=None, alinhar=None):
    c = ws.cell(row=linha, column=coluna, value=valor)
    c.font = fonte
    c.border = BORDA
    if formato:
        c.number_format = formato
    if fundo:
        c.fill = fundo
    if alinhar:
        c.alignment = Alignment(horizontal=alinhar)
    return c


def gerar():
    dados = ler_base()
    insumos = dados['insumos']
    fichas = dados['fichas']
    categorias = {c['id']: c['nome'] for c in dados['categorias']}

    # sub-receita: insumo que na verdade é uma ficha
    ficha_do_insumo = {f['insumoGemeoId']: f for f in fichas if f.get('insumoGemeoId')}
    sub = [i for i in insumos if i['id'] in ficha_do_insumo]
    comprados = [i for i in insumos if i['id'] not in ficha_do_insumo]
    sub.sort(key=lambda i: i['nome'])
    comprados.sort(key=lambda i: i['nome'])

    wb = Workbook()

    # ------------------------------------------------------------ Produtos
    # montado antes para conhecer as linhas, mas escrito depois dos insumos
    fichas_ordenadas = sorted(fichas, key=lambda f: (not f['vendavel'], f['nome']))
    linha_do_produto = {f['id']: PRIMEIRA + n for n, f in enumerate(fichas_ordenadas)}

    # ------------------------------------------------------------- Insumos
    ws_i = wb.active
    ws_i.title = 'Insumos'
    montar_cabecalho(ws_i, 'Insumos', (
        'Tudo que entra nas receitas. As linhas amarelas são as que você preenche; '
        'as de fundo claro no topo são sub-receitas e têm o preço calculado sozinho.'
    ), [
        ('A', 'Código', 28, 'Não mude: é por este código que as receitas encontram o insumo.'),
        ('B', 'Nome', 32, None),
        ('C', 'Unidade', 11, 'Como você compra: kg, L ou un. O cálculo trabalha sempre em quilo.'),
        ('D', 'Peso bruto', 12, 'Quanto você comprou, antes de limpar. Ex.: 1 kg de cebola com casca.'),
        ('E', 'Peso líquido', 12, 'Quanto sobrou depois de descascar, aparar e limpar. Ex.: 0,850 kg.'),
        ('F', 'Fator de correção', 13, 'Calculado: peso líquido ÷ peso bruto. Quanto menor, mais se perde na limpeza.'),
        ('G', 'Preço por quilo', 14, 'Quanto custa 1 kg (ou 1 L, ou 1 unidade) deste insumo.'),
        ('H', 'Fornecedor', 22, None),
        ('I', 'Data da cotação', 14, 'Quando você viu este preço pela última vez.'),
        ('J', 'Observação', 34, None),
    ])

    linha_do_insumo = {}
    linha = PRIMEIRA

    for i in sub:
        ficha = ficha_do_insumo[i['id']]
        linha_do_insumo[i['id']] = linha
        escrever(ws_i, linha, 1, i['id'], fundo=FUNDO_CREME)
        escrever(ws_i, linha, 2, i['nome'], fonte=NEGRITO, fundo=FUNDO_CREME)
        escrever(ws_i, linha, 3, i['unidade'], fundo=FUNDO_CREME, alinhar='center')
        escrever(ws_i, linha, 4, i['pesoBruto'], formato=PESO, fundo=FUNDO_CREME)
        escrever(ws_i, linha, 5, i['pesoLiquido'], formato=PESO, fundo=FUNDO_CREME)
        escrever(ws_i, linha, 6, f'=IFERROR(E{linha}/D{linha},1)', formato=FATOR, fundo=FUNDO_CREME)
        escrever(ws_i, linha, 7, f"=Produtos!$M${linha_do_produto[ficha['id']]}",
                 fonte=VERDE_TXT, formato=MOEDA4, fundo=FUNDO_CREME)
        escrever(ws_i, linha, 8, 'cozinha', fundo=FUNDO_CREME)
        escrever(ws_i, linha, 9, '', fundo=FUNDO_CREME)
        escrever(ws_i, linha, 10, 'Sub-receita: o preço sai da aba Produtos, não se digita.',
                 fonte=SUBTITULO, fundo=FUNDO_CREME)
        linha += 1

    primeira_comprado = linha
    for i in comprados:
        linha_do_insumo[i['id']] = linha
        escrever(ws_i, linha, 1, i['id'])
        escrever(ws_i, linha, 2, i['nome'], fonte=AZUL, fundo=FUNDO_PREENCHER)
        escrever(ws_i, linha, 3, i['unidade'], fonte=AZUL, fundo=FUNDO_PREENCHER, alinhar='center')
        escrever(ws_i, linha, 4, i['pesoBruto'], fonte=AZUL, formato=PESO, fundo=FUNDO_PREENCHER)
        escrever(ws_i, linha, 5, i['pesoLiquido'], fonte=AZUL, formato=PESO, fundo=FUNDO_PREENCHER)
        escrever(ws_i, linha, 6, f'=IFERROR(E{linha}/D{linha},1)', formato=FATOR)
        escrever(ws_i, linha, 7, i['preco'], fonte=AZUL, formato=MOEDA4, fundo=FUNDO_PREENCHER)
        escrever(ws_i, linha, 8, i.get('fornecedor') or '', fonte=AZUL, fundo=FUNDO_PREENCHER)
        escrever(ws_i, linha, 9, i.get('cotacao') or '', fonte=AZUL, fundo=FUNDO_PREENCHER)
        escrever(ws_i, linha, 10, '')
        linha += 1
    ultima_comprado = linha - 1
    ultima_insumo = ultima_comprado

    escrever(ws_i, linha + 1, 2,
             'Insumo novo: acrescente a linha aqui embaixo, invente um código sem espaço '
             '(ex.: farinha-de-aveia) e preencha as colunas amarelas.', fonte=SUBTITULO)

    # ------------------------------------------------------- Ingredientes
    ws_g = wb.create_sheet('Ingredientes')
    montar_cabecalho(ws_g, 'Ingredientes das receitas', (
        'Uma linha por ingrediente de cada receita. É daqui que sai o custo de cada produto.'
    ), [
        ('A', 'Código do produto', 28, 'Tem que ser igual ao código na aba Produtos.'),
        ('B', 'Produto', 30, None),
        ('C', 'Código do insumo', 28, 'Tem que ser igual ao código na aba Insumos.'),
        ('D', 'Insumo', 30, None),
        ('E', 'Quantidade (kg)', 13, 'Quanto vai na receita, já limpo. 250 g = 0,250.'),
        ('F', 'Fator de correção', 13, 'Vem da aba Insumos.'),
        ('G', 'Peso bruto', 12, 'Calculado: quantidade ÷ fator de correção. É o quanto você precisa comprar.'),
        ('H', 'Preço por quilo', 14, 'Vem da aba Insumos.'),
        ('I', 'Custo', 13, 'Calculado: peso bruto × preço por quilo.'),
    ])

    faixa_fc = f'Insumos!$F${PRIMEIRA}:$F${ultima_insumo}'
    faixa_cod = f'Insumos!$A${PRIMEIRA}:$A${ultima_insumo}'
    faixa_preco = f'Insumos!$G${primeira_comprado}:$G${ultima_comprado}'
    faixa_cod_comprado = f'Insumos!$A${primeira_comprado}:$A${ultima_comprado}'

    nome_do_insumo = {i['id']: i['nome'] for i in insumos}
    linha = PRIMEIRA
    faixa_da_ficha = {}
    for f in fichas_ordenadas:
        inicio = linha
        for item in f['ingredientes']:
            cod = item['insumoId']
            escrever(ws_g, linha, 1, f['id'])
            escrever(ws_g, linha, 2, f['nome'])
            escrever(ws_g, linha, 3, cod, fonte=AZUL, fundo=FUNDO_PREENCHER)
            escrever(ws_g, linha, 4, nome_do_insumo.get(cod, cod))
            escrever(ws_g, linha, 5, item['quantidade'], fonte=AZUL, formato=PESO, fundo=FUNDO_PREENCHER)
            escrever(ws_g, linha, 6,
                     f'=IFERROR(INDEX({faixa_fc},MATCH($C{linha},{faixa_cod},0)),1)',
                     fonte=VERDE_TXT, formato=FATOR)
            escrever(ws_g, linha, 7, f'=IFERROR(E{linha}/F{linha},0)', formato=PESO)
            if cod in ficha_do_insumo:
                # sub-receita: referência direta, para não criar referência circular
                formula = f'=Insumos!$G${linha_do_insumo[cod]}'
            else:
                formula = (f'=IFERROR(INDEX({faixa_preco},'
                           f'MATCH($C{linha},{faixa_cod_comprado},0)),0)')
            escrever(ws_g, linha, 8, formula, fonte=VERDE_TXT, formato=MOEDA4)
            escrever(ws_g, linha, 9, f'=G{linha}*H{linha}', formato=MOEDA4)
            linha += 1
        faixa_da_ficha[f['id']] = (inicio, linha - 1)

    # ------------------------------------------------------------ Produtos
    ws_p = wb.create_sheet('Produtos', 1)
    montar_cabecalho(ws_p, 'Produtos e receitas', (
        'Um por linha. Os 12 primeiros são os que você vende; os de baixo são bases e '
        'sub-receitas que entram em outras fichas.'
    ), [
        ('A', 'Código', 28, 'Não mude: é por este código que a aba Ingredientes encontra a receita.'),
        ('B', 'Nome', 32, None),
        ('C', 'Categoria', 18, None),
        ('D', 'Rendimento (porções)', 12, 'Quantas porções a receita rende.'),
        ('E', 'Rendimento (kg)', 12,
         'Quanto sai da panela, em quilo. Só preencha quando a receita perde peso '
         '(o frango cozinha e a água vai fora). Em branco, o sistema soma os ingredientes.'),
        ('F', 'Tempo de preparo', 13, None),
        ('G', 'Vende?', 9, 'Sim para o que vai para o cliente; Não para base e sub-receita.'),
        ('H', 'Preço praticado', 13, 'Quanto você cobra hoje por uma porção.'),
        ('I', 'Meta de CMV', 11,
         'Quanto do preço você aceita que seja ingrediente. 30% quer dizer que de cada '
         'R$ 10 vendidos, R$ 3 são ingrediente.'),
        ('J', 'Custo da receita', 13, 'Calculado: soma dos ingredientes na aba Ingredientes.'),
        ('K', 'Custo por porção', 13, 'Calculado: custo da receita ÷ rendimento em porções.'),
        ('L', 'Preço sugerido', 13, 'Calculado: custo por porção ÷ meta de CMV.'),
        ('M', 'Custo por quilo', 13,
         'Calculado: custo da receita ÷ rendimento em quilo. É o preço que a sub-receita '
         'tem quando entra em outra ficha.'),
        ('N', 'CMV real', 11, 'Calculado: custo por porção ÷ preço praticado.'),
        ('O', 'Custo na planilha antiga', 14, 'O que a sua planilha original calculava, para conferir.'),
        ('P', 'Diferença', 12, 'Calculado: custo por porção de agora menos o da planilha antiga.'),
    ])

    for f in fichas_ordenadas:
        ln = linha_do_produto[f['id']]
        a, b = faixa_da_ficha[f['id']]
        soma_custo = f'SUM(Ingredientes!$I${a}:$I${b})'
        soma_peso = f'SUM(Ingredientes!$E${a}:$E${b})'
        vendavel = f['vendavel']

        escrever(ws_p, ln, 1, f['id'])
        escrever(ws_p, ln, 2, f['nome'], fonte=NEGRITO if vendavel else PRETO)
        escrever(ws_p, ln, 3, categorias.get(f['categoriaId'], ''), fonte=AZUL, fundo=FUNDO_PREENCHER)
        escrever(ws_p, ln, 4, f['rendimento'], fonte=AZUL, formato='#,##0.##', fundo=FUNDO_PREENCHER)
        escrever(ws_p, ln, 5, f.get('rendimentoKg') or '', fonte=AZUL, formato=PESO, fundo=FUNDO_PREENCHER)
        escrever(ws_p, ln, 6, f.get('tempoPreparo') or '', fonte=AZUL, fundo=FUNDO_PREENCHER)
        escrever(ws_p, ln, 7, 'Sim' if vendavel else 'Não', fonte=AZUL, fundo=FUNDO_PREENCHER, alinhar='center')
        escrever(ws_p, ln, 8, f.get('precoPraticado') or '', fonte=AZUL, formato=MOEDA, fundo=FUNDO_PREENCHER)
        escrever(ws_p, ln, 9, f.get('metaCmv') or '', fonte=AZUL, formato=PERCENT, fundo=FUNDO_PREENCHER)
        escrever(ws_p, ln, 10, f'={soma_custo}', formato=MOEDA)
        escrever(ws_p, ln, 11, f'=IFERROR(J{ln}/D{ln},0)', formato=MOEDA)
        escrever(ws_p, ln, 12, f'=IFERROR(K{ln}/I{ln},0)', formato=MOEDA)
        escrever(ws_p, ln, 13, f'=IFERROR(J{ln}/IF(E{ln}>0,E{ln},{soma_peso}),0)', formato=MOEDA4)
        escrever(ws_p, ln, 14, f'=IFERROR(K{ln}/H{ln},0)', formato=PERCENT)
        escrever(ws_p, ln, 15, f.get('custoPorcaoPlanilha') or '', formato=MOEDA)
        escrever(ws_p, ln, 16, f'=IFERROR(K{ln}-O{ln},0)', formato=MOEDA)

    ultima_produto = PRIMEIRA + len(fichas_ordenadas) - 1

    # -------------------------------------------------------------- Listas
    ws_l = wb.create_sheet('Listas')
    montar_cabecalho(ws_l, 'Listas', 'Alimentam as caixinhas de escolha das outras abas.', [
        ('A', 'Categorias', 22, None),
        ('B', 'Unidades', 12, None),
        ('C', 'Fornecedores', 26, None),
        ('D', 'Vende?', 10, None),
    ])
    nomes_cat = sorted(categorias.values())
    siglas = [u['sigla'] for u in dados['unidades']]
    nomes_forn = sorted({f['nome'] for f in dados['fornecedores']} | {'cozinha'})
    for n, v in enumerate(nomes_cat):
        escrever(ws_l, PRIMEIRA + n, 1, v)
    for n, v in enumerate(siglas):
        escrever(ws_l, PRIMEIRA + n, 2, v)
    for n, v in enumerate(nomes_forn):
        escrever(ws_l, PRIMEIRA + n, 3, v)
    for n, v in enumerate(['Sim', 'Não']):
        escrever(ws_l, PRIMEIRA + n, 4, v)

    def validar(ws, coluna, faixa_lista, de, ate):
        dv = DataValidation(type='list', formula1=faixa_lista, allow_blank=True)
        ws.add_data_validation(dv)
        dv.add(f'{coluna}{de}:{coluna}{ate}')

    validar(ws_i, 'C', f'=Listas!$B${PRIMEIRA}:$B${PRIMEIRA + len(siglas) - 1}', PRIMEIRA, ultima_insumo + 60)
    validar(ws_i, 'H', f'=Listas!$C${PRIMEIRA}:$C${PRIMEIRA + len(nomes_forn) - 1}', PRIMEIRA, ultima_insumo + 60)
    validar(ws_p, 'C', f'=Listas!$A${PRIMEIRA}:$A${PRIMEIRA + len(nomes_cat) - 1}', PRIMEIRA, ultima_produto + 40)
    validar(ws_p, 'G', f'=Listas!$D${PRIMEIRA}:$D${PRIMEIRA + 1}', PRIMEIRA, ultima_produto + 40)

    # --------------------------------------------------------- Conferência
    ws_c = wb.create_sheet('Conferência')
    montar_cabecalho(ws_c, 'Conferência', (
        'Compara o que esta planilha calcula com o que a sua planilha antiga calculava. '
        'Serve para você conferir se a migração ficou certa.'
    ), [
        ('A', 'O que foi conferido', 44, None),
        ('B', 'Valor', 16, None),
        ('C', 'O que isso quer dizer', 60, None),
    ])

    faixa_dif = f'Produtos!$P${PRIMEIRA}:$P${ultima_produto}'
    faixa_antigo = f'Produtos!$O${PRIMEIRA}:$O${ultima_produto}'
    conferencias = [
        ('Receitas na planilha', f'=COUNTA(Produtos!$A${PRIMEIRA}:$A${ultima_produto})', '0',
         'Cada receita sua virou uma linha na aba Produtos.'),
        ('Receitas que a planilha antiga também calculava',
         f'=COUNTIF({faixa_antigo},">0")', '0',
         'Só estas dá para comparar. As outras a planilha antiga não trazia o custo por porção.'),
        ('Receitas com o mesmo custo (diferença abaixo de 1 centavo)',
         f'=SUMPRODUCT(({faixa_antigo}>0)*(ABS({faixa_dif})<0.01))', '0',
         'Estas bateram exatamente com a sua planilha.'),
        ('Receitas com custo diferente',
         f'=SUMPRODUCT(({faixa_antigo}>0)*(ABS({faixa_dif})>=0.01))', '0',
         'Veja a lista abaixo. Em geral é o alho-poró, explicado no documento que acompanha.'),
        ('Maior diferença para cima', f'=MAX({faixa_dif})', MOEDA,
         'Quanto o maior custo subiu em relação à planilha antiga.'),
        ('Maior diferença para baixo', f'=MIN({faixa_dif})', MOEDA,
         'Quanto o maior custo caiu em relação à planilha antiga.'),
        ('Insumos cadastrados', f'=COUNTA(Insumos!$A${PRIMEIRA}:$A${ultima_insumo})', '0',
         'Tudo que entra em alguma receita.'),
        ('Insumos sem preço', f'=COUNTIF({faixa_preco},0)', '0',
         'Se aparecer algum, o custo das receitas que o usam está baixo demais.'),
        ('Insumos sem data de cotação',
         f'=COUNTBLANK(Insumos!$I${primeira_comprado}:$I${ultima_comprado})', '0',
         'Preencher ajuda a saber quando o preço envelheceu.'),
    ]
    ln = PRIMEIRA
    for rotulo, formula, formato, explicacao in conferencias:
        escrever(ws_c, ln, 1, rotulo)
        escrever(ws_c, ln, 2, formula, fonte=NEGRITO, formato=formato, alinhar='center')
        escrever(ws_c, ln, 3, explicacao, fonte=SUBTITULO)
        ln += 1

    ln += 2
    ws_c.cell(row=ln, column=1, value='Receitas em que o custo mudou').font = Font(
        name=FONTE, size=11, bold=True, color=TERRACOTA)
    ln += 1
    for coluna, rotulo in enumerate(['Produto', 'Custo agora', 'Custo antes'], start=1):
        c = ws_c.cell(row=ln, column=coluna, value=rotulo)
        c.font = CABECALHO
        c.fill = FUNDO_CABECALHO
    ln += 1
    for f in fichas_ordenadas:
        antigo = f.get('custoPorcaoPlanilha') or 0
        if not antigo:
            continue
        lp = linha_do_produto[f['id']]
        escrever(ws_c, ln, 1, f'=IF(ABS(Produtos!$P${lp})<0.01,"",Produtos!$B${lp})')
        escrever(ws_c, ln, 2, f'=IF(ABS(Produtos!$P${lp})<0.01,"",Produtos!$K${lp})', formato=MOEDA)
        escrever(ws_c, ln, 3, f'=IF(ABS(Produtos!$P${lp})<0.01,"",Produtos!$O${lp})', formato=MOEDA)
        ln += 1

    # ------------------------------------------------------------ Pendências
    pendencias = []
    if RELATORIO.exists():
        rel = json.loads(RELATORIO.read_text(encoding='utf-8'))
        pendencias = rel.get('pendencias', [])

    ws_pd = wb.create_sheet('Pendências')
    montar_cabecalho(ws_pd, 'Para você conferir', (
        'Coisas que a planilha antiga deixava em aberto e que ninguém consegue adivinhar por você. '
        'Nada aqui impede de usar a planilha; é a lista do que vale olhar com calma.'
    ), [
        ('A', '#', 5, None),
        ('B', 'O que encontramos', 118, None),
    ])
    ln = PRIMEIRA
    for n, texto in enumerate(pendencias, start=1):
        escrever(ws_pd, ln, 1, n, alinhar='center')
        c = escrever(ws_pd, ln, 2, texto)
        c.alignment = Alignment(wrap_text=True, vertical='top')
        ws_pd.row_dimensions[ln].height = 14 * (1 + len(texto) // 115)
        ln += 1

    # -------------------------------------------------------------- Leia-me
    ws_r = wb.create_sheet('Leia-me', 0)
    ws_r.column_dimensions['A'].width = 4
    ws_r.column_dimensions['B'].width = 104
    linhas_leiame = [
        ('t', 'Ficha técnica do Maluzices'),
        ('s', 'Esta planilha já vem preenchida com as suas receitas. É para conferir e, '
              'daqui para frente, manter.'),
        ('', ''),
        ('h', 'Como ler as cores'),
        ('p', 'Fundo amarelo e letra azul: campo seu, pode digitar à vontade.'),
        ('p', 'Letra preta: a planilha calcula sozinha. Se você digitar por cima, a conta some.'),
        ('p', 'Letra verde: o valor vem de outra aba.'),
        ('p', 'Linhas de fundo claro no topo dos Insumos: sub-receitas, com preço calculado.'),
        ('', ''),
        ('h', 'As abas'),
        ('p', 'Insumos: tudo que você compra, com peso bruto, peso líquido e preço.'),
        ('p', 'Produtos: uma linha por receita, com rendimento, preço e os custos calculados.'),
        ('p', 'Ingredientes: o que entra em cada receita e quanto. É daqui que sai o custo.'),
        ('p', 'Conferência: compara estes números com os da sua planilha antiga.'),
        ('p', 'Listas: alimenta as caixinhas de escolha. Só mexa para incluir um fornecedor novo.'),
        ('', ''),
        ('h', 'As contas, em português'),
        ('p', 'Fator de correção = peso líquido ÷ peso bruto. Se 1 kg de cebola vira 850 g depois '
              'de descascada, o fator é 0,85.'),
        ('p', 'Peso bruto da receita = quantidade ÷ fator de correção. Para usar 850 g de cebola '
              'limpa você compra 1 kg.'),
        ('p', 'Custo do ingrediente = peso bruto × preço por quilo. Você paga pela casca também.'),
        ('p', 'Custo da receita = soma de todos os ingredientes.'),
        ('p', 'Custo por porção = custo da receita ÷ quantas porções ela rende.'),
        ('p', 'Preço sugerido = custo por porção ÷ meta de CMV.'),
        ('p', 'CMV real = custo por porção ÷ preço que você cobra hoje.'),
        ('', ''),
        ('h', 'O que é CMV'),
        ('p', 'É a parte do preço que é ingrediente. CMV de 30% quer dizer que de cada R$ 10 '
              'vendidos, R$ 3 foram para a comida e R$ 7 ficaram para pagar gás, luz, embalagem, '
              'o seu trabalho e o lucro. Quanto menor o CMV, mais sobra.'),
        ('', ''),
        ('h', 'Para incluir uma receita nova'),
        ('p', '1. Na aba Produtos, acrescente uma linha no fim com um código sem espaço '
              '(ex.: bolo-de-cenoura), o nome, a categoria e quantas porções rende.'),
        ('p', '2. Copie as fórmulas das colunas J até P de uma linha de cima.'),
        ('p', '3. Na aba Ingredientes, acrescente uma linha por ingrediente, repetindo o código '
              'do produto, e copie as fórmulas das colunas F até I.'),
        ('', ''),
        ('h', 'Rendimento em quilo'),
        ('p', 'Só preencha quando a receita perde peso no preparo. O frango desfiado leva 2 kg de '
              'frango e 2,5 kg de água, mas a água do cozimento vai fora e sobram 2 kg: aí o '
              'rendimento em quilo é 2. Em branco, a planilha soma os ingredientes.'),
        ('', ''),
        ('h', 'Duas coisas que encontramos na sua planilha'),
        ('p', '1. Ingredientes que entravam de graça. Quando o nome escrito na receita não existia '
              'igualzinho na lista de insumos (a receita dizia "MASSA DE QUICHE" e a lista dizia '
              '"MASSA PARA QUICHE"), a busca não achava nada e o ingrediente entrava valendo zero. '
              'A massa da quiche, o pão de nobis e outros estavam assim. Aqui eles passaram a '
              'contar, e por isso alguns custos subiram bastante.'),
        ('p', '2. O alho-poró estava cadastrado duas vezes, com preços diferentes, e a fórmula de '
              'busca somava as duas linhas. Isso deixava o preço e o fator de correção errados e '
              'barateava vários produtos entre 1% e 3%. Aqui ficou uma linha só.'),
        ('p', 'Nos dois casos o custo da planilha antiga estava mais baixo do que o real, nunca '
              'mais alto. A coluna Diferença da aba Produtos mostra quanto mudou em cada receita.'),
        ('', ''),
        ('h', 'O que ainda falta você preencher'),
        ('p', 'Alguns ingredientes continuam sem preço porque não existem na lista de insumos com '
              'nenhum nome parecido (óleo de girassol, melado de cana, gelo, entre outros). '
              'Eles estão listados na aba Pendências. Enquanto não tiverem preço, as receitas que '
              'os usam continuam saindo mais baratas do que são.'),
    ]
    ln = 2
    for tipo, texto in linhas_leiame:
        c = ws_r.cell(row=ln, column=2, value=texto)
        if tipo == 't':
            c.font = Font(name=FONTE, size=18, bold=True, color=OLIVA)
            ws_r.row_dimensions[ln].height = 26
        elif tipo == 's':
            c.font = Font(name=FONTE, size=11, color='666666')
        elif tipo == 'h':
            c.font = Font(name=FONTE, size=12, bold=True, color=VERDE)
        else:
            c.font = Font(name=FONTE, size=10)
        c.alignment = Alignment(wrap_text=True, vertical='top')
        if tipo in ('p', 's'):
            ws_r.row_dimensions[ln].height = 15 * (1 + len(texto) // 100)
        ln += 1
    ws_r.sheet_view.showGridLines = False

    for ws in (ws_i, ws_p, ws_g, ws_c, ws_l, ws_pd):
        ws.sheet_view.showGridLines = False

    # Listas é bastidor: fica por último, longe das abas de trabalho.
    wb.move_sheet('Listas', offset=len(wb.sheetnames))

    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    wb.save(SAIDA)
    print(f'gravado: {SAIDA}')
    print(f'  insumos {len(insumos)} (sub-receitas {len(sub)}, comprados {len(comprados)})')
    print(f'  produtos {len(fichas_ordenadas)} | linhas de ingrediente {linha - PRIMEIRA}')


if __name__ == '__main__':
    gerar()
