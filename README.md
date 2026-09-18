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
```

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
