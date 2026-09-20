#!/usr/bin/env python3
"""
LEGENDADOR DE VIDEO — padrao KA

Grava a legenda no video, palavra por palavra, em Playfair Display caixa
alta, com a mesma sombra difusa das sobreposicoes de video do sistema.

Faz duas coisas que um filtro de legenda comum nao faz:

  1. LIMPA A LEGENDA ANTERIOR. Video que ja sai do CapCut com legenda
     queimada nao pode so receber outra por cima. O script detecta o texto
     antigo pelo nucleo branco puro (luminancia > 240 e saturacao < 30),
     dilata a mascara para pegar o contorno escuro e reconstroi o fundo com
     inpaint. Funciona porque o texto costuma cair sobre area de baixa
     textura; confira sempre o resultado.

  2. DESENHA A SOMBRA EM CAMADAS, nao um contorno duro. Tres desfoques
     sobrepostos, iguais aos de .sobre-video em sistema/sistema.css. E o
     que mantem a legenda legivel sobre filmagem clara sem virar caixa.

Uso:
    python3 build/legendar-video.py entrada.mp4 legendas.json saida.mp4

legendas.json: [[inicio_s, "PALAVRA", fim_s], ...]
"""
import json
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
FONTE = RAIZ / 'assets' / 'fontes' / 'PlayfairDisplay-Variable.ttf'

# --- padrao visual -------------------------------------------------------
# O corpo NAO e fixo: e calculado pela palavra mais longa do roteiro, para
# que nenhuma estoure a margem. Playfair e bem mais larga que a sans que o
# CapCut usa, entao herdar o tamanho da legenda antiga arrebenta a caixa.
LARGURA_UTIL = 880     # 100 px de margem de cada lado, em 1080
CORPO_MAX = 132        # teto: acima disso a legenda come o enquadramento
PESO = 600             # eixo Weight da variavel
ENTRELETRA = 0.05      # em ems
CENTRO_Y = 1536        # centro da linha de legenda, px (mesma altura da antiga)
SOMBRAS = [(54, 0.85, 6), (20, 0.70, 3), (5, 0.50, 1)]   # raio, alfa, deslocamento y

# --- faixa onde a legenda antiga vive e onde a limpeza atua --------------
FAIXA = (1430, 1700)


def abrir_fonte(corpo):
    fonte = ImageFont.truetype(str(FONTE), corpo)
    try:
        fonte.set_variation_by_axes([PESO])
    except OSError:
        pass
    return fonte


def medir(palavra, corpo):
    fonte = abrir_fonte(corpo)
    return sum(fonte.getlength(c) for c in palavra) + corpo * ENTRELETRA * (len(palavra) - 1)


def calibrar(palavras):
    """Maior corpo em que a palavra mais longa ainda cabe na largura util."""
    corpo = CORPO_MAX
    while corpo > 40 and max(medir(p, corpo) for p in palavras) > LARGURA_UTIL:
        corpo -= 2
    return corpo


def desenhar(palavra, largura, altura, corpo):
    """Sprite RGBA da palavra, ja com sombra, no tamanho do quadro."""
    fonte = abrir_fonte(corpo)
    espaco = corpo * ENTRELETRA
    total = medir(palavra, corpo)

    caixa = fonte.getbbox(palavra)  # caixa de tinta, nao a metrica da fonte
    alto = caixa[3] - caixa[1]
    x0 = (largura - total) / 2
    y0 = CENTRO_Y - alto / 2 - caixa[1]

    # 1. mascara do texto, para as sombras
    masc = Image.new('L', (largura, altura), 0)
    d = ImageDraw.Draw(masc)
    x = x0
    for c in palavra:
        d.text((x, y0), c, font=fonte, fill=255)
        x += fonte.getlength(c) + espaco

    fora = Image.new('RGBA', (largura, altura), (0, 0, 0, 0))
    for raio, alfa, desloc in SOMBRAS:
        s = masc.filter(ImageFilter.GaussianBlur(raio / 2))
        s = s.point(lambda v, a=alfa: int(v * a))
        camada = Image.new('RGBA', (largura, altura), (18, 18, 16, 0))
        camada.putalpha(s.transform(s.size, Image.AFFINE, (1, 0, 0, 0, 1, -desloc)))
        fora = Image.alpha_composite(fora, camada)

    # 2. o texto em branco por cima das sombras
    tinta = Image.new('RGBA', (largura, altura), (255, 255, 255, 0))
    tinta.putalpha(masc)
    return Image.alpha_composite(fora, tinta)


def mascara_legenda_antiga(quadro):
    """Onde esta o texto branco queimado, na faixa de legenda."""
    rec = quadro[FAIXA[0]:FAIXA[1]]
    g = cv2.cvtColor(rec, cv2.COLOR_BGR2GRAY)
    sat = rec.max(axis=2).astype(int) - rec.min(axis=2).astype(int)
    nucleo = ((g > 240) & (sat < 30)).astype(np.uint8)
    if nucleo.sum() < 300:
        return None
    grossa = cv2.dilate(nucleo, np.ones((23, 23), np.uint8))
    cheia = np.zeros(quadro.shape[:2], np.uint8)
    cheia[FAIXA[0]:FAIXA[1]] = grossa * 255
    return cheia


def main():
    entrada, legendas, saida = sys.argv[1], sys.argv[2], sys.argv[3]
    eventos = json.load(open(legendas, encoding='utf-8'))

    cap = cv2.VideoCapture(entrada)
    fps = cap.get(cv2.CAP_PROP_FPS)
    larg = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    alt = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    palavras = {p for _, p, _ in eventos}
    corpo = calibrar(palavras)
    mais_longa = max(palavras, key=lambda p: medir(p, corpo))
    print(f'corpo calibrado: {corpo} px '
          f'(mais longa: {mais_longa}, {medir(mais_longa, corpo):.0f} px '
          f'de {LARGURA_UTIL} uteis)')
    sprites = {p: np.asarray(desenhar(p, larg, alt, corpo)) for p in palavras}
    print(f'{len(sprites)} palavras distintas, {total} quadros a {fps:g} fps')

    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    tmp = str(Path(saida).with_suffix('.mudo.mp4'))
    escritor = subprocess.Popen(
        [ff, '-hide_banner', '-loglevel', 'error', '-y',
         '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{larg}x{alt}',
         '-r', str(fps), '-i', 'pipe:0',
         '-c:v', 'libx264', '-preset', 'slow', '-crf', '17',
         '-pix_fmt', 'yuv420p', '-movflags', '+faststart', tmp],
        stdin=subprocess.PIPE)

    n = 0
    limpos = 0
    while True:
        ok, quadro = cap.read()
        if not ok:
            break
        t = n / fps

        m = mascara_legenda_antiga(quadro)
        if m is not None:
            quadro = cv2.inpaint(quadro, m, 7, cv2.INPAINT_TELEA)
            limpos += 1

        for ini, palavra, fim in eventos:
            if ini <= t < fim:
                s = sprites[palavra]
                a = s[:, :, 3:4].astype(np.float32) / 255.0
                rgb = s[:, :, 2::-1].astype(np.float32)
                y0, y1 = FAIXA[0] - 120, FAIXA[1] + 120
                quadro[y0:y1] = (quadro[y0:y1] * (1 - a[y0:y1])
                                 + rgb[y0:y1] * a[y0:y1]).astype(np.uint8)
                break

        escritor.stdin.write(quadro.tobytes())
        n += 1
        if n % 120 == 0:
            print(f'  {n}/{total}')

    cap.release()
    escritor.stdin.close()
    escritor.wait()
    print(f'{n} quadros, {limpos} com legenda antiga removida')

    subprocess.run([ff, '-hide_banner', '-loglevel', 'error', '-y',
                    '-i', tmp, '-i', entrada,
                    '-map', '0:v:0', '-map', '1:a:0',
                    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k',
                    '-shortest', saida], check=True)
    Path(tmp).unlink()
    print('saida:', saida)


if __name__ == '__main__':
    main()
