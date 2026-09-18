# Identidade visual do padrão de apresentação

Este documento descreve o padrão visual extraído do deck de referência
*Revelação de Essência*. Não é uma sugestão de estilo: é a especificação do
sistema. Os valores aqui são os mesmos de `sistema/tokens.css`.

---

## 1. O princípio

O padrão é **editorial, não corporativo**. Ele se comporta como uma página de
revista impressa em papel de qualidade, não como um slide de PowerPoint.

Três decisões sustentam isso:

1. **O peso leve é o padrão.** Toda a tipografia vive em Outfit Light (300).
   O negrito é ocorrência rara e deliberada — uma palavra por slide, no máximo.
2. **O fio substitui a caixa.** A página é estruturada por linhas finas de 1,5px,
   nunca por bordas, molduras, fundos coloridos ou barras.
3. **A cor é escassa.** Um único acento — o caramelo — e ele aparece em
   elementos de poucos pixels: um número, uma régua curta, um marcador, uma aspa.

O que o sistema **não** faz: sombra, gradiente, ícone colorido, barra de
destaque, texto centralizado em corpo, fundo escuro, caixa com preenchimento
de cor.

---

## 2. Palco

| | |
|---|---|
| Proporção | 16:9 |
| Referência | 20" × 11,25" — **1920 × 1080 px** a 96 dpi |
| Conversão | 1pt = 1,3333px |

O original foi produzido em 20" × 11,25" em vez do 13,3" usual. Isso importa:
os tamanhos de fonte em pt do arquivo de origem só fazem sentido nessa escala.

---

## 3. Cor

### Papel

| Token | Hex | Uso |
|---|---|---|
| `--cor-papel` | `#F8F7F2` | Fundo de todo slide e de todo card |
| `--cor-papel-card` | `#F4F1E8` | Desvio quente, uso pontual |
| `--cor-creme` | `#EFECDC` | Faixa do rodapé, **sempre** com transparência |

Nunca branco puro (`#FFFFFF`). O papel do sistema é quente.

### Tinta — três níveis, nesta ordem

| Token | Hex | Uso |
|---|---|---|
| `--cor-tinta` | `#1C1C1A` | Títulos, afirmações, parágrafo de abertura |
| `--cor-tinta-media` | `#6B6B66` | Corpo de texto, leitura longa |
| `--cor-tinta-clara` | `#A5A49F` | Rótulos, legendas, descrições de apoio |

A hierarquia é feita por **valor de cinza**, não por tamanho. Um parágrafo
de abertura e um parágrafo de apoio podem ter corpos próximos: o que os separa
é um estar em `--cor-tinta` e o outro em `--cor-tinta-media`.

Nunca preto puro em corpo de texto.

### Linha e acento

| Token | Hex | Uso |
|---|---|---|
| `--cor-linha` | `#E2E1DD` | Fio estrutural — o esqueleto da página |
| `--cor-acento` | `#A9724A` | Caramelo. O único ponto de cor do sistema |

**Regra do caramelo:** ele nunca preenche uma área. Aparece em:
numeração de seção (`01`), régua curta, marcador de lista, aspas de citação,
último ponto de um percurso, rótulo de destaque. Se o caramelo estiver ocupando
mais que alguns pixels de área, está errado.

---

## 4. Tipografia

**Outfit** em todo o sistema. **Playfair Display** existe como acento editorial
e deve aparecer no máximo uma vez por deck — ou nenhuma.

Ambas são variáveis e estão em `assets/fontes/` (Open Font License). O deck
renderiza igual offline.

### Escala

| Token | px | pt | Uso |
|---|---|---|---|
| `--tam-sumario` | 104 | 78 | Título do sumário |
| `--tam-capa` | 100 | 75 | Título de capa |
| `--tam-declaracao` | 99 | 74 | Frase-manifesto que ocupa o slide |
| `--tam-secao` | 88 | 66 | Divisória de seção |
| `--tam-pergunta` | 75 | 56 | Pergunta condutora |
| `--tam-titulo` | 56 | 42 | Título de slide de conteúdo |
| `--tam-destaque` | 40 | 30 | Subtítulo de capa |
| `--tam-item` | 36 | 27 | Título de item de lista |
| `--tam-lead` | 29 | 22 | Parágrafo de abertura |
| `--tam-corpo` | 24 | 18 | Corpo de texto |
| `--tam-apoio` | 22 | 16 | Coluna estreita, rodapé |
| `--tam-legenda` | 20 | 15 | Descrição de item, nota |
| `--tam-rotulo` | 17 | 12,5 | Rótulo caixa-alta |
| `--tam-numero` | 15 | 11,5 | Numeração `01` / `02` |

### Caixa e espacejamento

- **Caixa-alta é sempre espaçada.** Rótulo: `0.24em`. Rodapé: `0.18em`.
  Caixa-alta sem tracking quebra o padrão imediatamente.
- **Caixa-alta serve a três coisas:** título de capa, divisória de seção e
  rótulo pequeno. Nunca a corpo de texto ou título de conteúdo.
- **Título de conteúdo é caixa baixa**, Light, com tracking levemente negativo.

### Entrelinha

`1.12` em títulos grandes · `1.2` em títulos de conteúdo · `1.55` em corpo.

---

## 5. Grade

| Token | px | |
|---|---|---|
| `--margem-lateral` | 137 | Margem de conteúdo (1,427" do original) |
| `--margem-capa` | 162 | Margem de capa, levemente maior |
| `--margem-topo` | 232 | Início do bloco de conteúdo |

Ritmo vertical — use **apenas** estes intervalos entre blocos:

`--ritmo-xs` 16 · `--ritmo-sm` 28 · `--ritmo-md` 44 · `--ritmo-lg` 72 · `--ritmo-xl` 110

Larguras de conteúdo quando há imagem sangrada:

| Classe | px |
|---|---|
| `.conteudo--meio` | 806 |
| `.conteudo--estreito` | 1090 |
| `.conteudo--larga` | 1180 |

---

## 6. A regra da textura

**A textura acompanha o card.**

A onda em relevo é a parede; o card claro é o papel preso nela. Por isso a
textura aparece exatamente em:

- abertura (trava de marcas)
- capa
- sumário
- divisória de seção
- slide em que um card carrega a frase
- encerramento

E **não** aparece em nenhum slide de conteúdo denso. O motivo é funcional: o
texto de apoio do sistema é cinza claro por definição, e o relevo o apaga.

Verificado slide a slide no arquivo de origem: dos 31 slides, 11 têm textura —
e todos os 11 têm card, capa ou trava de marcas.

Na dúvida: **sem textura**.

---

## 7. Componentes

### Rodapé
Faixa-pílula translúcida (`#EFECDC` a 48%) na esquerda + logo na direita.
Posição **fixa** em todo slide de conteúdo, independente de onde está a imagem:
`left: 88px; bottom: 68px; min-width: 1090px`.

Ausente apenas na abertura, na capa e no encerramento.

> Atenção: quando a imagem sangrada está à esquerda, a pílula passa por cima
> dela. É assim no original. Se a foto for escura nessa faixa, escolha outro
> enquadramento — não mova o rodapé.

### Card
`#F8F7F2`, raio 40px, **sem sombra**. A separação vem do contraste com o
relevo do fundo, não de profundidade simulada.

No sumário, o título cavalga a borda superior do card. É a única peça do
sistema que quebra a moldura — e é de propósito.

### Fio e régua
- **Fio** (`--cor-linha`, 1,5px): separa título de conteúdo, item de item,
  coluna de coluna. É o elemento estrutural mais usado do sistema.
- **Régua de acento** (caramelo, 166 × 4px): marca o início de um bloco-chave.
  Versão curta: 84 × 3px.

### Colunas
De 2 a 4, separadas por **fio vertical**. Nunca por caixa, fundo ou borda
completa.

### Bloco de revelação
Régua curta caramelo → micro-rótulo (`O QUE ISSO REVELA`) → texto em tinta
cheia. É a assinatura argumentativa do método: separa o relato da leitura
estratégica.

### Percurso
Etapas em linha sobre um fio, uma bolinha por etapa. Todas em cinza claro;
**apenas a última em caramelo** — o ponto de chegada.

### Citação
Aspa em caramelo, texto em tinta cheia. Sem itálico, sem caixa, sem moldura.

---

## 8. Erros que quebram o padrão

- Textura em slide de conteúdo denso
- Caixa-alta sem tracking
- Negrito em parágrafo inteiro
- Caramelo como fundo de bloco
- Sombra em card ou imagem
- Branco puro ou preto puro
- Barra de destaque, faixa colorida, borda de um lado só
- Corpo de texto centralizado
- Mais de uma ideia disputando o mesmo slide
