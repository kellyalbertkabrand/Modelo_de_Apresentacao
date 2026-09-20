# Ativos da Shapes

Extraidos do brandbook (Canva, `DAG8XSf_Ayo` — `BRANDBOOK_SHAPES.pdf`).

## Identidade

| | |
|---|---|
| Branco | `#FFFFFF` |
| Preto | `#010101` |
| Laranja | `#E37037` |
| Tipografia | Montilla (familia completa) |
| Simbolo | a concha, derivada da sequencia de Fibonacci |
| Base | neutra, com a cor entrando como massa — nunca fundo inteiro |

## Arquivos

| Arquivo | Uso |
|---|---|
| `logo-shapes-preto.png` | marca completa sobre fundo claro |
| `logo-shapes-branco.png` | marca completa sobre cor ou fundo escuro |
| `concha-shapes-preto.png` | simbolo sozinho, sobre fundo claro |
| `concha-shapes-branco.png` | simbolo sozinho, sobre cor ou fundo escuro |
| `produtos-shapes.jpg` | foto de produto, primeiro envio (mais cortada) |
| `produtos-shapes-completa.jpg` | a foto inteira, 1179x1616 — use esta |
| `produtos-shapes-capa.jpg` | a foto inteira em 1080x1920, para a capa |
| `forma-organica.svg` | silhueta do gabarito de foto do brandbook |

## A foto na capa

A capa usa a foto **sangrando de borda a borda, sem corte e sem veu**. Como
a foto e 0,73 e o story e 0,5625, coube sem perder pedaco por um caminho
so: em vez de cortar a foto, esticamos o quadro.

`produtos-shapes-capa.jpg` e a foto inteira (1080x1480) com 440 px de
fundo acrescentados **em cima**, e nada embaixo — a mesa da foto termina
no pe da capa. O acrescimo nao e cor chapada nem uma linha repetida (as
duas estriam): e a propria parede espelhada a partir da emenda, so nas 250
primeiras linhas, que sao as unicas sem objeto. Acima, a textura espelhada
se dissolve num campo liso com grao. Degrau medido na emenda: **0,6 nivel**.

Para refazer com outra foto, o roteiro e esse: medir, achar os silencios,
esticar o quadro — nunca cortar o assunto.

## O que decide o layout

Tudo tem de caber no **recorte 1080x1350 do feed** (y 285 a 1635), senao o
Instagram corta no perfil. Dentro desse recorte a foto oferece **um** campo
limpo, nao dois:

| Zona | Medida | Serve para |
|---|---|---|
| fundo, ate y 691 | media 98, desvio 2 | marca do cliente em **branco**, 5,9:1 |
| mesa, so de y 1720 | media 246, desvio 1 | **fora do recorte** — nao da para usar |

Por isso o credito da KA e da VM nao pousa na foto: ele sobe para dentro da
massa de cor, que e o unico campo limpo disponivel dentro do recorte. Vai
em branco, por decisao da Kelly, fechando a peca numa tinta so com o
titulo — 3,1:1 medido no arquivo final, acima do minimo de 3:1 para
grafismo e texto grande. O preto daria 6,6:1: se o bloco diminuir, volte
a ele.

Testamos antes a foto como fundo de texto no meio do quadro e nao da: as
melhores faixas dao media 140 a 190 com desvio de 26 a 45 — meio-tom e
agitado, o pior caso tanto para tinta quanto para branco.

`node build/conferir-capa.mjs` mede as duas coisas: a folga de cada linha
de texto ate a silhueta e se algo saiu do recorte do feed.

## A forma organica

`forma-organica.svg` nao e um oval nem um raio de canto inventado: e a
silhueta do gabarito "Sua foto aqui" do brandbook, tracada do arquivo por
raio a partir do centroide (168 amostras) e fechada em Catmull-Rom.
Proporcao original **0,8972** (largura / altura) — respeite, senao deforma.

No CSS ela vai como `clip-path: polygon(...)` em `.capa-case__forma`,
porque `mask-image` de arquivo externo nao resolve no Chromium da
exportacao. O SVG fica para uso fora daqui: Canva, editor de video.

Como a silhueta e assimetrica, texto centralizado na caixa encosta na
borda. O eixo util medido fica em **x 530**, nao 540, e o recuo de cima e
maior que o de baixo porque a forma e estreita no topo e larga na base.

Os demais arquivos foram extraidos dos prints do Canva enviados pela
Kelly: o branco virou transparencia pelo inverso da luminancia, entao as
bordas ficam suaves.
Sao reconstrucoes a partir de captura de tela, nao os vetores originais —
servem para tela, mas para impressao vale pedir o arquivo vetorial.

## Pendente

**Montilla** — fonte comercial, nao disponivel aqui. A capa usa Outfit no
texto de apoio. Com o arquivo da fonte em `assets/fontes/`, e uma linha em
`.capa-case__titulo` para a marca ficar 100% na tipografia dela.
