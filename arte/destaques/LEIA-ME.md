# Capas de destaque · KA

Duas opções, 1080×1920, prontas para subir como capa de destaque.

| Opção | Arquivos | O que a fileira vira |
|---|---|---|
| **A · a palavra** | `opcao-a-1..4-*.png` | um índice: cada capa diz o assunto |
| **B · o monograma** | `opcao-b-1..4.png` | um bloco de marca: o rótulo do Instagram faz o índice |

Prévias da fileira montada: `previa-opcao-a.png` e `previa-opcao-b.png`.

## O que as duas têm em comum

**Mesmo ritmo de cor:** marinho, caramelo, papel, marinho. Isso é de
propósito — assim a escolha entre A e B é de **conteúdo**, não de tom.

**Sistema visual master da KA**, de `ka-carrossel-educativo`:

| | |
|---|---|
| Papel | `#F2EEE3` |
| Marinho | `#152535` |
| Caramelo | `#C47830` |
| Títulos | Playfair Display |

A regra inviolável do sistema é **um fundo e uma cor de fonte por peça**:
nada de segunda cor, ícone decorativo ou marcador gráfico. É por isso que
as duas opções são tipográficas, e não um jogo de ícones.

## O recorte do Instagram

O app pega o quadrado do meio do story e recorta um círculo dentro dele.
Todo o conteúdo cabe num **círculo de 680 px** no centro (raio 340 a
partir de 540, 960), com folga para o anel da interface. Arte encostada na
borda do quadro some.

## Como escolher

**A** funciona se você quiser que a pessoa entenda o conteúdo antes de ler
o rótulo. O custo: a palavra repete o nome que o Instagram já escreve
embaixo, e em tela de celular ela fica pequena.

**B** funciona se você quiser presença de marca na primeira dobra do
perfil. O custo: as capas não diferenciam um destaque do outro sozinhas, e
dependem do rótulo.

## Para trocar as palavras ou acrescentar destaques

Tudo está em `arte/capas-destaques-ka.html`. Cada capa é uma linha. O
corpo da palavra é declarado nela (`--corpo`), porque palavra longa e
palavra curta não pedem o mesmo tamanho.

```bash
node build/exportar.mjs arte/capas-destaques-ka.html --seletor .capa
```

## Pendente

O quarto destaque aparecia cortado no print (`USO DE...`). Assumi **USO DE
IA** e a capa da opção A traz `IA`. Confirme o nome.

## Monograma

`assets/logos/ka-monograma.png` e `-branco.png` foram recortados do lockup
horizontal. São o primeiro ativo de monograma isolado do repositório.
