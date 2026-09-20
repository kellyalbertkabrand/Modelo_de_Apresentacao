# Stories do case · Shapes

Sequência para o Instagram, na identidade da Shapes.

| Arquivo | Onde entra |
|---|---|
| `story-01-abertura-case.png` | **antes** dos cortes do vídeo |
| cortes de 60 s do vídeo | `arte/video/tripe-marca-legendado.mp4` |
| `story-02-encerramento-case.png` | **depois**, leva para o site |

Os dois são irmãos da capa do Reels (`arte/capa-case-shapes.png`): mesma
foto, mesma marca no topo, mesma massa de cor, mesmo crédito. A abertura é
deliberadamente igual à capa — é o que faz a pessoa reconhecer o mesmo
case no feed e no story, e não tratar como dois conteúdos.

## O botão do encerramento

**Story não tem botão clicável.** O botão desenhado é a âncora visual; quem
leva ao site é o **adesivo de link do Instagram**.

Coloque o adesivo **por cima do botão**, em `y 1235 a 1345` (o botão ocupa
`x 310 a 770`). Foi para isso que ele ficou na base da forma, com folga em
volta: o adesivo cai exatamente ali e completa o desenho em vez de brigar
com ele. O crédito da KA e da VM está **acima** do botão justamente para
não ser coberto.

Falta preencher: o endereço do case no site. O botão não imprime a URL
porque quem carrega o link é o adesivo. Se preferir a URL escrita, é uma
linha a mais.

## Por que o crédito ficou dentro da forma

Testei devolver o crédito ao rodapé, já que story não tem o recorte
1080x1350 do feed. Não dá: neste quadro os objetos da foto descem até o pé
(desvio de 40 a 52 níveis em toda a faixa de y 1600 a 1900). Não há
silêncio ali. Dentro da forma, há.

Pelo mesmo motivo caiu a linha "A história do projeto" que eu tinha posto
abaixo da forma: ela pousava sobre os vasos claros e sumia.

## Conferência

```bash
node build/conferir-capa.mjs arte/stories-case-shapes.html
```

Mede a folga de cada linha de texto até a silhueta. Estado atual: 39 px na
abertura, 120 px no encerramento (mínimo 26).
