#!/usr/bin/env python3
"""
PREVIA DE PPTX SEM LIBREOFFICE

Le a geometria real do .pptx gerado (posicao, tamanho, texto, fonte, cor) e
emite um HTML com os mesmos elementos posicionados em pixel. Esse HTML passa
pelo build/exportar.mjs como qualquer deck do sistema, produzindo PNG e PDF.

Serve para QA: como a previa nasce do XML do arquivo final, o que aparece
aqui e o que o PowerPoint vai montar — inclusive estouro de texto.

Uso:
    python3 build/pptx/previa.py decks/saida/aula.pptx [saida.html]
"""

import sys
import zipfile
import html
from pathlib import Path
import defusedxml.minidom as minidom

EMU_POR_POL = 914400.0
PX_POR_POL = 96.0
NS_A = 'http://schemas.openxmlformats.org/drawingml/2006/main'
NS_R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
NS_P = 'http://schemas.openxmlformats.org/presentationml/2006/main'


def px(emu):
    return round(float(emu) / EMU_POR_POL * PX_POR_POL, 2)


def filho(no, tag, ns=NS_A):
    for f in no.childNodes:
        if f.nodeType == f.ELEMENT_NODE and f.localName == tag and f.namespaceURI == ns:
            return f
    return None


def descendente(no, tag, ns=NS_A):
    achados = no.getElementsByTagNameNS(ns, tag)
    return achados[0] if achados else None


def cor_de(no):
    """Primeira cor solida declarada dentro do no, com alpha se houver."""
    if no is None:
        return None
    preenche = descendente(no, 'solidFill')
    if preenche is None:
        return None
    srgb = descendente(preenche, 'srgbClr')
    if srgb is None:
        return None
    valor = srgb.getAttribute('val')
    alfa = descendente(srgb, 'alpha')
    if alfa is not None:
        a = int(alfa.getAttribute('val')) / 100000.0
        r, g, b = (int(valor[i:i + 2], 16) for i in (0, 2, 4))
        return f'rgba({r},{g},{b},{a:.3f})'
    return f'#{valor}'


def borda_de(sppr):
    """Traco da forma, se houver: (cor, espessura_px, tracejado)."""
    if sppr is None:
        return None
    ln = filho(sppr, 'ln')
    if ln is None or not ln.childNodes:
        return None                      # <a:ln></a:ln> vazio = sem borda
    cor = cor_de(ln)
    if cor is None:
        return None
    dash = descendente(ln, 'prstDash')
    tracejado = dash is not None and dash.getAttribute('val') != 'solid'
    larg = int(ln.getAttribute('w')) / EMU_POR_POL * PX_POR_POL if ln.hasAttribute('w') else 1.0
    return cor, round(larg, 2), tracejado


def geometria(forma):
    xfrm = descendente(forma, 'xfrm')
    if xfrm is None:
        return None
    off, ext = filho(xfrm, 'off'), filho(xfrm, 'ext')
    if off is None or ext is None:
        return None
    return (px(off.getAttribute('x')), px(off.getAttribute('y')),
            px(ext.getAttribute('cx')), px(ext.getAttribute('cy')))


def paragrafos(corpo_txt):
    """Devolve [(alinhamento, [(texto, props_do_run), ...]), ...]."""
    saida = []
    if corpo_txt is None:
        return saida
    for p in corpo_txt.getElementsByTagNameNS(NS_A, 'p'):
        ppr = filho(p, 'pPr')
        algn = ppr.getAttribute('algn') if ppr is not None and ppr.hasAttribute('algn') else 'l'
        runs = []
        for r in p.getElementsByTagNameNS(NS_A, 'r'):
            t = filho(r, 't')
            if t is None or not t.firstChild:
                continue
            rpr = filho(r, 'rPr')
            props = {'sz': 18.0, 'cor': '#1C1C1A', 'negrito': False, 'spc': 0.0, 'fonte': 'Outfit'}
            if rpr is not None:
                if rpr.hasAttribute('sz'):
                    props['sz'] = int(rpr.getAttribute('sz')) / 100.0
                if rpr.hasAttribute('b'):
                    props['negrito'] = rpr.getAttribute('b') in ('1', 'true')
                if rpr.hasAttribute('spc'):
                    props['spc'] = int(rpr.getAttribute('spc')) / 100.0
                c = cor_de(rpr)
                if c:
                    props['cor'] = c
                latin = filho(rpr, 'latin')
                if latin is not None and latin.getAttribute('typeface'):
                    props['fonte'] = latin.getAttribute('typeface')
            runs.append((t.firstChild.nodeValue, props))
        if not runs and p.getElementsByTagNameNS(NS_A, 'br'):
            runs.append(('', {'sz': 18.0, 'cor': '#1C1C1A', 'negrito': False, 'spc': 0.0, 'fonte': 'Outfit'}))
        saida.append((algn, runs))
    return saida


def entrelinha(corpo_txt):
    esp = descendente(corpo_txt, 'lnSpc') if corpo_txt is not None else None
    if esp is None:
        return 1.2
    pct = descendente(esp, 'spcPct')
    return int(pct.getAttribute('val')) / 100000.0 if pct is not None else 1.2


def ancoragem(corpo_txt):
    bp = descendente(corpo_txt, 'bodyPr') if corpo_txt is not None else None
    if bp is None or not bp.hasAttribute('anchor'):
        return 'flex-start'
    return {'t': 'flex-start', 'ctr': 'center', 'b': 'flex-end'}.get(bp.getAttribute('anchor'), 'flex-start')


def converter(caminho_pptx, caminho_html):
    pptx = zipfile.ZipFile(caminho_pptx)
    nomes = sorted(
        (n for n in pptx.namelist() if n.startswith('ppt/slides/slide') and n.endswith('.xml')),
        key=lambda n: int(''.join(c for c in Path(n).stem if c.isdigit())),
    )

    raiz = Path(caminho_html).parent.resolve()
    partes = []
    alertas = []

    for nome in nomes:
        n = int(''.join(c for c in Path(nome).stem if c.isdigit()))
        doc = minidom.parseString(pptx.read(nome).decode('utf-8'))

        # mapa de relacionamentos, para resolver imagens
        rels = {}
        rel_nome = f'ppt/slides/_rels/{Path(nome).name}.rels'
        if rel_nome in pptx.namelist():
            rdoc = minidom.parseString(pptx.read(rel_nome).decode('utf-8'))
            for rel in rdoc.getElementsByTagName('Relationship'):
                rels[rel.getAttribute('Id')] = rel.getAttribute('Target')

        fundo = cor_de(descendente(doc, 'bg', 'http://schemas.openxmlformats.org/presentationml/2006/main')) or '#F8F7F2'
        elementos = []

        arvore = descendente(doc, 'spTree', 'http://schemas.openxmlformats.org/presentationml/2006/main')
        for forma in arvore.childNodes:
            if forma.nodeType != forma.ELEMENT_NODE:
                continue
            geo = geometria(forma)
            if geo is None:
                continue
            x, y, w, h = geo

            if forma.localName == 'pic':
                blip = descendente(forma, 'blip')
                alvo = rels.get(blip.getAttributeNS(NS_R, 'embed') or blip.getAttribute('r:embed'), '')
                # extrai a midia para um diretorio ao lado do html
                destino = raiz / 'midia' / Path(alvo).name
                destino.parent.mkdir(parents=True, exist_ok=True)
                interno = 'ppt/' + alvo.replace('../', '')
                if interno in pptx.namelist() and not destino.exists():
                    destino.write_bytes(pptx.read(interno))
                elementos.append(
                    f'<img style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;'
                    f'object-fit:cover" src="midia/{Path(alvo).name}">')
                continue

            if forma.localName != 'sp':
                continue

            prst = descendente(forma, 'prstGeom')
            tipo = prst.getAttribute('prst') if prst is not None else 'rect'
            sppr = filho(forma, 'spPr', NS_P)
            preenche = cor_de(sppr)

            raio = ''
            if tipo == 'roundRect':
                adj = descendente(prst, 'gd') if prst is not None else None
                fator = int(adj.getAttribute('fmla').split()[-1]) / 100000.0 if adj is not None else 0.16
                raio = f'border-radius:{min(w, h) * fator}px;'
            elif tipo == 'ellipse':
                raio = 'border-radius:50%;'

            borda = borda_de(sppr)
            estilo_borda = ''
            if borda:
                cor_b, larg_b, tracejado = borda
                estilo_borda = f'border:{larg_b}px {"dashed" if tracejado else "solid"} {cor_b};'
            if preenche or borda:
                estilo_fundo = f'background:{preenche};' if preenche else ''
                elementos.append(
                    f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;'
                    f'box-sizing:border-box;{estilo_fundo}{estilo_borda}{raio}"></div>')

            corpo_txt = filho(forma, 'txBody', NS_P)
            paras = paragrafos(corpo_txt)
            if not paras or not any(runs for _, runs in paras):
                continue

            lh = entrelinha(corpo_txt)
            anc = ancoragem(corpo_txt)
            linhas = []
            for algn, runs in paras:
                mapa = {'l': 'left', 'ctr': 'center', 'r': 'right', 'just': 'justify'}
                spans = ''.join(
                    f'<span style="font-family:\'{p["fonte"]}\',sans-serif;'
                    f'font-size:{p["sz"] * 96 / 72:.2f}px;color:{p["cor"]};'
                    f'font-weight:{600 if p["negrito"] else 300};'
                    f'letter-spacing:{p["spc"] * 96 / 72:.2f}px;">{html.escape(t)}</span>'
                    for t, p in runs) or '&nbsp;'
                linhas.append(f'<div style="text-align:{mapa.get(algn, "left")}">{spans}</div>')

            elementos.append(
                f'<div data-caixa="{n}" style="position:absolute;left:{x}px;top:{y}px;width:{w}px;'
                f'height:{h}px;display:flex;flex-direction:column;justify-content:{anc};'
                f'line-height:{lh}">{"".join(linhas)}</div>')

        partes.append(
            f'<!-- slide {n} -->\n<section class="slide" style="background:{fundo}">\n'
            + '\n'.join(elementos) + '\n</section>')

    doc_html = f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Previa · {html.escape(Path(caminho_pptx).stem)}</title>
<link rel="stylesheet" href="../../sistema/fontes.css">
<style>
  html,body {{ margin:0; background:#D9D8D3; }}
  .deck {{ display:flex; flex-direction:column; align-items:center; gap:40px; padding:40px 0; }}
  .slide {{ position:relative; width:1920px; height:1080px; overflow:hidden; flex:none; }}
</style>
</head>
<body>
<div class="deck">
{chr(10).join(partes)}
</div>
</body>
</html>
'''
    Path(caminho_html).write_text(doc_html, encoding='utf-8')
    print(f'Previa de {len(nomes)} slides: {caminho_html}')
    for a in alertas:
        print(' ', a)


if __name__ == '__main__':
    entrada = sys.argv[1]
    saida = sys.argv[2] if len(sys.argv) > 2 else str(Path(entrada).with_suffix('.previa.html'))
    converter(entrada, saida)
