#!/usr/bin/env python3
"""
LEGENDADOR E MONTADOR DE VIDEO — padrao KA

Recebe um video de fala parada e devolve um video com ritmo: legenda
palavra por palavra, palavras de destaque e movimento de camera.

Tres faixas, todas no mesmo roteiro JSON:

  legendas   [[inicio, "PALAVRA", fim], ...]
             Playfair Display caixa alta, no terco inferior.

  destaques  [[inicio, "PALAVRA", fim], ...]
             O ponto de atencao. Maior que a legenda, bem mais acima e com
             entreletra aberta — sao essas tres coisas juntas que separam
             o destaque da legenda, ja que a familia e a mesma. Fica em
             cena durante o trecho inteiro em que o assunto e aquele,
             enquanto a legenda corre embaixo.

             Sem filete: um fio de 4 px sobre filmagem le como risco na
             imagem, nao como elemento.

  movimento  [[inicio, fim, escala_inicial, escala_final], ...]
             Enquadramento por trecho. O corte entre trechos e seco: e o
             que da ritmo a um plano parado. Dentro do trecho a escala
             deriva devagar, para nada ficar estatico.

O QUE O SCRIPT FAZ QUE UM FILTRO COMUM NAO FAZ

  1. LIMPA A LEGENDA ANTERIOR, EM DUAS PASSAGENS. Video que ja sai do
     CapCut com legenda queimada nao pode so receber outra por cima. A
     primeira passagem acha o nucleo branco puro (luminancia > 232,
     saturacao < 34) quadro a quadro. Isso sozinho nao basta: a legenda do
     CapCut ENTRA COM FADE, e nos quadros de transicao o texto e cinza e
     escapa do limiar. Entao a segunda passagem usa, em cada quadro, a
     UNIAO das mascaras de uma janela de vizinhos — o quadro em que a
     palavra ja esta opaca cobre o quadro em que ela ainda esta surgindo.
     Depois dilata para pegar o contorno escuro e reconstroi com inpaint.
     Funciona sobre area de baixa textura; confira o resultado.

  2. ANCORA O ZOOM NO ROSTO. Zoom centrado no quadro faz o rosto descer e
     a cabeca sair. Aqui o recorte e calculado para manter o rosto na
     mesma altura relativa em qualquer escala.

  3. DESENHA TEXTO DEPOIS DO ZOOM. Legenda e destaque nao escalam junto
     com a imagem: ficam no mesmo corpo e no mesmo lugar o video todo.

  4. CALIBRA O CORPO PELA PALAVRA MAIS LONGA. Playfair e bem mais larga
     que as sans de legenda; herdar tamanho de outra fonte estoura a
     margem.

Uso:
    python3 build/legendar-video.py entrada.mp4 roteiro.json saida.mp4
"""
import json
import math
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
FONTE = RAIZ / 'assets' / 'fontes' / 'PlayfairDisplay-Variable.ttf'

LARGURA_UTIL = 880          # 100 px de margem de cada lado, em 1080
ACENTO = (169, 114, 74)     # --cor-acento, caramelo

ESTILO = {
    'legenda':  dict(corpo_max=132, peso=600, entreletra=0.05, centro_y=1580, filete=False),
    'destaque': dict(corpo_max=210, peso=500, entreletra=0.09, centro_y=1170, filete=False),
}
JANELA_MASCARA = 6          # quadros de folga para pegar a entrada em fade

SOMBRAS = [(54, 0.85, 6), (20, 0.70, 3), (5, 0.50, 1)]   # raio, alfa, deslocamento
FAIXA_LIMPEZA = (1430, 1700)
ROSTO_Y = 0.306             # altura relativa do rosto, medida no video
ENTRADA = 0.28              # segundos de entrada do destaque


def abrir_fonte(corpo, peso):
    f = ImageFont.truetype(str(FONTE), corpo)
    try:
        f.set_variation_by_axes([peso])
    except OSError:
        pass
    return f


def medir(palavra, corpo, est):
    f = abrir_fonte(corpo, est['peso'])
    return (sum(f.getlength(c) for c in palavra)
            + corpo * est['entreletra'] * (len(palavra) - 1))


def calibrar(palavras, est):
    corpo = est['corpo_max']
    while corpo > 40 and max(medir(p, corpo, est) for p in palavras) > LARGURA_UTIL:
        corpo -= 2
    return corpo


def desenhar(palavra, largura, altura, corpo, est):
    """Sprite RGBA da palavra, ja com sombra, no tamanho do quadro."""
    fonte = abrir_fonte(corpo, est['peso'])
    espaco = corpo * est['entreletra']
    total = medir(palavra, corpo, est)
    caixa = fonte.getbbox(palavra)          # caixa de tinta, nao a metrica
    alto = caixa[3] - caixa[1]
    x0 = (largura - total) / 2
    y0 = est['centro_y'] - alto / 2 - caixa[1]

    masc = Image.new('L', (largura, altura), 0)
    d = ImageDraw.Draw(masc)
    x = x0
    for c in palavra:
        d.text((x, y0), c, font=fonte, fill=255)
        x += fonte.getlength(c) + espaco

    tinta = Image.new('RGBA', (largura, altura), (0, 0, 0, 0))
    tinta.paste((255, 255, 255, 255), (0, 0), masc)

    if est['filete']:
        fx, fw, fh = largura // 2 - 43, 86, 4
        fy = int(est['centro_y'] - alto / 2 - 58)
        ImageDraw.Draw(masc).rectangle([fx, fy, fx + fw, fy + fh], fill=255)
        # PIL trabalha em RGB; a conversao para BGR acontece so na hora de
        # compor sobre o quadro do OpenCV.
        ImageDraw.Draw(tinta).rectangle([fx, fy, fx + fw, fy + fh],
                                        fill=ACENTO + (255,))

    fora = Image.new('RGBA', (largura, altura), (0, 0, 0, 0))
    for raio, alfa, desloc in SOMBRAS:
        s = masc.filter(ImageFilter.GaussianBlur(raio / 2))
        s = s.point(lambda v, a=alfa: int(v * a))
        s = s.transform(s.size, Image.AFFINE, (1, 0, 0, 0, 1, -desloc))
        camada = Image.new('RGBA', (largura, altura), (18, 18, 16, 0))
        camada.putalpha(s)
        fora = Image.alpha_composite(fora, camada)

    return np.asarray(Image.alpha_composite(fora, tinta))


def nucleo_branco(quadro):
    """Texto branco queimado na faixa de legenda, so o nucleo."""
    rec = quadro[FAIXA_LIMPEZA[0]:FAIXA_LIMPEZA[1]]
    g = cv2.cvtColor(rec, cv2.COLOR_BGR2GRAY)
    sat = rec.max(axis=2).astype(int) - rec.min(axis=2).astype(int)
    m = ((g > 232) & (sat < 34)).astype(np.uint8)
    return m if m.sum() >= 250 else np.zeros_like(m)


def varrer_mascaras(entrada):
    """Primeira passagem: nucleo de cada quadro, empacotado em bits."""
    cap = cv2.VideoCapture(entrada)
    pilha = []
    while True:
        ok, q = cap.read()
        if not ok:
            break
        pilha.append(np.packbits(nucleo_branco(q)))
    cap.release()
    return pilha


def mascara_da_janela(pilha, i, forma):
    """Uniao das mascaras vizinhas: cobre a palavra que ainda esta em fade."""
    a = max(0, i - JANELA_MASCARA)
    b = min(len(pilha), i + JANELA_MASCARA + 1)
    uniao = np.zeros(forma[0] * forma[1], np.uint8)
    for k in range(a, b):
        uniao |= np.unpackbits(pilha[k])[:uniao.size]
    if uniao.sum() < 250:
        return None
    return uniao.reshape(forma)


def escala_em(t, movimento):
    """Escala do enquadramento no instante t, com deriva suavizada."""
    for ini, fim, e0, e1 in movimento:
        if ini <= t < fim:
            u = (t - ini) / max(fim - ini, 1e-6)
            suave = (1 - math.cos(math.pi * u)) / 2     # entra e sai macio
            return e0 + (e1 - e0) * suave
    return 1.0


def enquadrar(quadro, escala):
    """Recorta e reamplia mantendo o rosto na mesma altura relativa."""
    if escala <= 1.001:
        return quadro
    alt, larg = quadro.shape[:2]
    jl, ja = larg / escala, alt / escala
    cx = larg * 0.5
    cy = alt * (ROSTO_Y + (0.5 - ROSTO_Y) / escala)
    x0 = int(round(min(max(cx - jl / 2, 0), larg - jl)))
    y0 = int(round(min(max(cy - ja / 2, 0), alt - ja)))
    rec = quadro[y0:y0 + int(round(ja)), x0:x0 + int(round(jl))]
    return cv2.resize(rec, (larg, alt), interpolation=cv2.INTER_CUBIC)


def compor(quadro, sprite, alfa_extra=1.0, subida=0):
    s = sprite
    if subida:
        s = np.roll(s, subida, axis=0)
    a = s[:, :, 3:4].astype(np.float32) / 255.0 * alfa_extra
    rgb = s[:, :, 2::-1].astype(np.float32)
    ys = np.nonzero(a.max(axis=(1, 2)) > 0.002)[0]
    if not len(ys):
        return quadro
    y0, y1 = ys[0], ys[-1] + 1
    quadro[y0:y1] = (quadro[y0:y1] * (1 - a[y0:y1]) + rgb[y0:y1] * a[y0:y1]).astype(np.uint8)
    return quadro


def main():
    entrada, roteiro_arq, saida = sys.argv[1], sys.argv[2], sys.argv[3]
    r = json.load(open(roteiro_arq, encoding='utf-8'))
    legendas = r['legendas']
    destaques = r.get('destaques', [])
    movimento = r.get('movimento', [])

    cap = cv2.VideoCapture(entrada)
    fps = cap.get(cv2.CAP_PROP_FPS)
    larg = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    alt = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    sprites = {}
    for chave, faixa in (('legenda', legendas), ('destaque', destaques)):
        if not faixa:
            continue
        est = ESTILO[chave]
        palavras = {p for _, p, _ in faixa}
        corpo = calibrar(palavras, est)
        mais = max(palavras, key=lambda p: medir(p, corpo, est))
        print(f'{chave}: corpo {corpo} px (mais longa {mais}, '
              f'{medir(mais, corpo, est):.0f} de {LARGURA_UTIL} uteis)')
        sprites[chave] = {p: desenhar(p, larg, alt, corpo, est) for p in palavras}

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

    print('varrendo a legenda antiga...')
    pilha = varrer_mascaras(entrada)
    forma = (FAIXA_LIMPEZA[1] - FAIXA_LIMPEZA[0], larg)
    grosso = np.ones((23, 23), np.uint8)

    n = limpos = 0
    while True:
        ok, quadro = cap.read()
        if not ok:
            break
        t = n / fps

        m = mascara_da_janela(pilha, n, forma)
        if m is not None:
            cheia = np.zeros((alt, larg), np.uint8)
            cheia[FAIXA_LIMPEZA[0]:FAIXA_LIMPEZA[1]] = cv2.dilate(m, grosso) * 255
            quadro = cv2.inpaint(quadro, cheia, 7, cv2.INPAINT_TELEA)
            limpos += 1

        quadro = enquadrar(quadro, escala_em(t, movimento))

        for ini, palavra, fim in destaques:
            if ini <= t < fim:
                u = min((t - ini) / ENTRADA, 1.0)
                suave = 1 - (1 - u) ** 3
                quadro = compor(quadro, sprites['destaque'][palavra],
                                alfa_extra=suave, subida=int((1 - suave) * 26))
                break

        for ini, palavra, fim in legendas:
            if ini <= t < fim:
                quadro = compor(quadro, sprites['legenda'][palavra])
                break

        escritor.stdin.write(quadro.tobytes())
        n += 1
        if n % 150 == 0:
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
