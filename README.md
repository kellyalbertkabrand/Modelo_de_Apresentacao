# Modelo de Apresentação — KA Inteligência para Marcas

Sistema visual de apresentação extraído do deck *Revelação de Essência*.
Este repositório é o padrão: qualquer deck novo nasce daqui.

O que ele entrega: **você escreve o conteúdo, o padrão já está aplicado.**

---

## Como usar

```bash
npm install                                  # uma vez

cp modelo/modelo.html decks/cliente-x.html   # duplique o modelo
# edite o conteúdo, mantendo as classes

npm run exportar decks/cliente-x.html        # PNG por slide + PDF
```

Saída em `build/saida/<nome-do-deck>/`.

Para exportar em 3840 × 2160 (impressão, telão):

```bash
node build/exportar.mjs decks/cliente-x.html --escala 2
```

Enquanto edita, abra o HTML direto no navegador — ele já mostra o resultado
final, em tamanho real.

---

## Gerar um deck em PowerPoint

O sistema também existe em `.pptx`, com a mesma identidade:

```bash
node decks/<seu-deck>.mjs                                   # gera o .pptx
python3 build/pptx/previa.py decks/saida/<deck>.pptx p.html # prévia do arquivo real
node build/exportar.mjs decks/saida/p.html                  # PNG + PDF da prévia
```

`build/pptx/sistema-pptx.mjs` traz os mesmos tokens e componentes do CSS.
`build/pptx/previa.py` lê a geometria do `.pptx` já gerado e a desenha em
HTML — é assim que se faz QA visual sem depender do LibreOffice.

**Instale a fonte Outfit** antes de abrir o `.pptx`: ela está em
`assets/fontes/Outfit-Variable.ttf`. Sem ela, o PowerPoint substitui a
tipografia e o padrão se perde.

## Estrutura

```
sistema/          o padrão — mexa aqui para mudar o sistema
  tokens.css        cor, tipografia, grade, forma. Fonte única de verdade
  sistema.css       as classes de componente
  fontes.css        Outfit + Playfair Display, arquivos locais

modelo/
  modelo.html       16 layouts prontos, um por seção comentada

assets/
  texturas/         fundo em relevo de onda
  logos/            assinaturas KA
  simbolos/         apoio gráfico
  fontes/           .woff2 variáveis (OFL)
  placeholders/     imagens neutras de marcação

build/
  exportar.mjs      HTML → PNG + PDF via Chromium
  conferir-capa.mjs mede a capa de case: folga até a silhueta + recorte do feed
  legendar-video.py legenda, palavras de destaque e movimento de câmera
  pptx/
    sistema-pptx.mjs  o mesmo sistema, em PowerPoint
    previa.py         lê um .pptx e desenha sua geometria real em HTML

decks/            os decks montados. Saída em decks/saida/
arte/             peças avulsas (story, capa, assinatura de vídeo)
```

---

## Formato vertical

O mesmo sistema atende story (1080×1920): use `.slide--story` no lugar da
medida padrão. O exportador mede o palco no próprio documento, então o
comando é o mesmo:

```bash
node build/exportar.mjs arte/story-assinatura-projeto.html
```

---

## Animar uma peça

Peças com a classe `.anima` viram vídeo:

```bash
node build/animar.mjs                                   # a assinatura de projeto
node build/animar.mjs arte/<peca>.html --segundos 5     # outra peça
```

Sai `.mp4` (H.264, pronto para editor e redes) e `.webm`.

O script não filma a tela: ele percorre a linha do tempo quadro a quadro,
fixando o relógio das animações em cada frame. Isso torna o resultado
determinístico — a mesma peça gera o mesmo vídeo, sem quadro perdido.

O vocabulário de entrada está em `sistema/sistema.css`: `.entra-sobe` e
`.entra-cresce`, com o tempo de cada camada em `--atraso`.

---

## Montar um vídeo de fala

```bash
python3 build/legendar-video.py entrada.mp4 roteiro.json saida.mp4
```

Pega um plano parado e devolve um vídeo com ritmo. Três faixas, todas no
mesmo `roteiro.json`:

| Faixa | Formato | O que é |
|---|---|---|
| `legendas` | `[[início, "PALAVRA", fim], …]` | Playfair caixa alta, terço inferior |
| `destaques` | `[[início, "PALAVRA", fim], …]` | o ponto de atenção, maior e bem acima |
| `movimento` | `[[início, fim, escala0, escala1], …]` | enquadramento por trecho |

Quatro coisas que um filtro comum não faz:

- **Limpa a legenda anterior, em duas passagens.** Vídeo que sai do CapCut
  já vem com legenda queimada. A legenda de lá **entra com fade**: nos
  quadros de transição o texto é cinza e escapa de qualquer limiar. Por
  isso a segunda passagem usa a união das máscaras dos quadros vizinhos.
  Confira o resultado: funciona sobre área de baixa textura.
- **Ancora o zoom no rosto.** Zoom centrado no quadro faz o rosto descer e
  corta a cabeça. Aqui o recorte mantém o rosto na mesma altura relativa
  em qualquer escala.
- **Desenha o texto depois do zoom.** Legenda e destaque não escalam junto
  com a imagem.
- **Calibra o corpo pela palavra mais longa.** Playfair é bem mais larga
  que as sans de legenda, e herdar tamanho de outra fonte estoura a margem.

Duas regras de montagem que valem repetir:

- O destaque entra **depois** que a legenda passou da mesma palavra. Os
  dois juntos na mesma palavra leem como erro, não como ênfase.
- Corte seco entre trechos, nas viradas da fala. Num plano parado é o
  corte que cria ritmo.

Sai também `.srt` para subir no Instagram e no YouTube.

---

## Regra de ouro

**Componha com as classes. Não escreva estilo solto no HTML do deck.**

Se faltar um componente, ele nasce em `sistema/sistema.css` — não no deck.
É o que mantém vinte apresentações parecendo a mesma marca.

Toda cor, tamanho e espaçamento sai de `sistema/tokens.css`. Nenhum valor
literal no deck.

---

## Os 16 layouts do modelo

| # | Layout | Para |
|---|---|---|
| 01 | Abertura | Trava de marcas KA + cliente |
| 02 | Capa | Título, cliente, assinatura do método |
| 03 | Sumário | Até 6 seções numeradas |
| 04 | Pergunta em card | Abre etapa, com imagem sangrada |
| 05 | Contexto | Texto + duas colunas de delimitação |
| 06 | Pergunta condutora | Uma pergunta, nada mais |
| 07 | Método | 4 etapas + fórmula de síntese |
| 08 | Divisória de seção | Número, nome, respiro |
| 09 | Narrativa | Texto corrido + tags de valores |
| 10 | Itens numerados | Relato + bloco "o que isso revela" |
| 11 | Tensões | Tabela de contraposição |
| 12 | Marcadores | Sequência + citação |
| 13 | Percurso | Etapas em linha, chegada em caramelo |
| 14 | Mapa | 4 dimensões + símbolo de apoio |
| 15 | Declaração | A frase que sustenta a entrega |
| 16 | Encerramento | Agradecimento + trava de marcas |

Varie os layouts. Um deck em que todo slide é o mesmo layout perde o padrão
tanto quanto um que troca de cor a cada página.

---

## Especificação

O padrão completo — cor, tipografia, grade, componentes, a regra da textura
e a lista de erros que o quebram — está em
**[IDENTIDADE-VISUAL.md](IDENTIDADE-VISUAL.md)**.

Há ainda uma skill em `.claude/skills/modelo-apresentacao-ka/` para que o
Claude monte decks já dentro do padrão, sem precisar reexplicá-lo.

---

## Ativos

As fontes (Outfit, Playfair Display) estão sob Open Font License e podem ser
redistribuídas com o repositório.

Os placeholders em `assets/placeholders/` são marcações neutras: **troque-os
pelas imagens do projeto**. Fotografias de clientes não são versionadas aqui.

O logo de cliente no slide de abertura e no encerramento é um espaço
reservado — substitua pela marca do projeto.
