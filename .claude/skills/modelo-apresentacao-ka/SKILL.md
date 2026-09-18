---
name: modelo-apresentacao-ka
description: Monta apresentações no padrão visual do KA Inteligência para Marcas (sistema Revelação de Essência). USE SEMPRE que a Kelly pedir para criar, montar, diagramar ou atualizar uma apresentação, deck, slides, proposta visual ou entrega de cliente neste repositório — inclusive quando disser "monta o deck da marca X", "apresentação da Revelação de Essência", "no padrão do modelo", "diagrama esses slides", "PDF da apresentação". Também use para ajustar deck já montado (trocar conteúdo, acrescentar slide, corrigir layout). Entrega HTML editável + PNG por slide + PDF. Ler IDENTIDADE-VISUAL.md ANTES de escrever qualquer slide.
---

# Apresentação no padrão KA

## Antes de começar

Leia, nesta ordem:

1. `IDENTIDADE-VISUAL.md` — a especificação do padrão. Não pule.
2. `modelo/modelo.html` — os 16 layouts disponíveis, comentados.
3. `sistema/tokens.css` — os valores. Nenhum número vem de outro lugar.

## Dois caminhos de saída

**HTML** (padrão, editável no navegador): duplique `modelo/modelo.html`.
**PowerPoint** (quando pedirem `.pptx`): escreva um script em `decks/` usando
`build/pptx/sistema-pptx.mjs`, que traz os mesmos tokens e componentes.

No caminho pptx, o QA visual não usa LibreOffice — ele não tem o Impress
instalado neste ambiente. Use `build/pptx/previa.py`, que lê a geometria do
arquivo gerado e a desenha em HTML para exportar em PNG.

Toda imagem em pptx recebe largura E altura, então declare a proporção do
arquivo ou o logo achata. Use os ativos aparados `*-horizontal.png`.

## O fluxo

1. **Duplique o modelo:** `cp modelo/modelo.html decks/<cliente>-<entrega>.html`
2. **Escolha os layouts** que a narrativa pede e **apague os que sobrarem**.
   Um deck usa de 6 a 10 layouts diferentes — não os 16, nem sempre o mesmo.
3. **Escreva o conteúdo** dentro das classes existentes.
4. **Exporte:** `node build/exportar.mjs decks/<arquivo>.html`
5. **Olhe os PNGs** antes de entregar. Sempre. Ver a seção QA.

## As regras que não se negociam

**Textura acompanha o card.** `.slide--textura` só em abertura, capa,
sumário, divisória de seção, slide-card e encerramento. Slide de conteúdo
denso fica em papel liso — o relevo apaga o texto cinza claro. Na dúvida,
sem textura.

**Peso leve é o padrão.** Outfit Light (300) em tudo. Negrito é uma palavra
por slide, no máximo.

**Caramelo (`#A9724A`) nunca preenche área.** Só número de seção, régua curta,
marcador, aspa, último ponto do percurso.

**Fio, nunca caixa.** Estruture com `.fio` e fios verticais entre colunas.
Sem borda completa, sem fundo colorido, sem barra de destaque, sem sombra.

**Hierarquia por valor de cinza,** não por tamanho: `--cor-tinta` para a
afirmação, `--cor-tinta-media` para o corpo, `--cor-tinta-clara` para apoio.

**Caixa-alta sempre com tracking.** Sem isso o padrão quebra na hora.

**Componha com as classes.** Se faltar um componente, crie-o em
`sistema/sistema.css` — nunca estilo solto no HTML do deck. Ajuste pontual de
posição (`top`, `width`) inline é aceitável; cor, tamanho e peso, não.

## Conteúdo

O texto dos slides segue o tom da Kelly: afirmativo, curto, sem adjetivo
decorativo. Uma ideia por slide. Se duas ideias disputam o mesmo slide,
são dois slides.

Para redigir o texto — e não só diagramar — use junto a skill
`kelly-tom-de-voz`. Para conteúdo de base estratégica de marca, use
`base-estrategica-marca-identidade-verbal`.

## Imagens

Os arquivos em `assets/placeholders/` são marcação. Troque pelas imagens do
projeto e **não versione fotografia de cliente** neste repositório — aponte
para uma pasta do projeto.

Imagem é sempre sangrada (`.imagem-sangria`) ou com canto arredondado
(`.imagem-cartao`). Nunca com moldura ou sombra.

Cuidado: com a imagem à esquerda, a pílula do rodapé passa por cima dela.
É assim no padrão. Se a foto for escura nessa faixa, troque o enquadramento —
não mova o rodapé.

## QA — obrigatório antes de entregar

Exporte e **olhe cada PNG**. Procure, nesta ordem:

1. **Texto estourando** o card ou saindo do slide — o defeito mais comum.
   Acontece sobretudo no sumário com 6 entradas e em colunas de 4.
2. Rótulo cinza claro sobre textura — indica textura em slide que não devia ter.
3. Rodapé colidindo com conteúdo acima.
4. Coluna com quebra feia (uma palavra sozinha na última linha).
5. Placeholder esquecido: `grep -i "nome do cliente\|nome da secao\|MES/ANO"`.

Corrija, reexporte, olhe de novo.

## Entrega

- `build/saida/<deck>/slide-NN.png` — slides individuais
- `build/saida/<deck>/<deck>.pdf` — PDF para envio

Entregue o PDF e o HTML. O HTML é o que permite a Kelly editar depois.
