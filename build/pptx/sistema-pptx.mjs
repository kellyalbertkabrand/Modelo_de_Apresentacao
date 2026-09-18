/* ---------------------------------------------------------------------------
   SISTEMA VISUAL EM PPTX

   Mesma identidade de sistema/tokens.css e sistema/sistema.css, expressa em
   PowerPoint. Um deck .pptx montado com estes helpers sai visualmente igual
   ao modelo HTML.

   Palco: 20" x 11.25" — a mesma medida do deck de referencia, para que os
   tamanhos em pt do original valham 1:1 sem reconversao.

   Uso:
     import { novoDeck, slide, ... } from './sistema-pptx.mjs';
     const pres = novoDeck();
     const s = slide(pres, { textura: true });
     titulo(s, 'Meu titulo');
     await salvar(pres, 'decks/saida/aula.pptx');
   --------------------------------------------------------------------------- */

import pptxgen from 'pptxgenjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const ativo = (p) => path.join(RAIZ, 'assets', p);

/* ATENCAO: no pptxgenjs, `line: { width: 0 }` NAO remove a borda — ele escreve
   uma linha visivel de 1pt em 333333. O que remove e `type: 'none'`.
   Num sistema de fios finos como este, a diferenca destroi o padrao. */
const SEM_BORDA = { type: 'none' };

/* Logos aparados ate o conteudo. A razao e obrigatoria: no pptx a imagem
   recebe largura E altura, entao um canvas com sobra achata a marca. */
const LOGO_KA = { arquivo: 'logos/ka-marcas-horizontal.png', razao: 3.898 };
const LOGO_CLIENTE = { arquivo: 'logos/kelly-albert-horizontal.png', razao: 5.306 };

/* Insere um logo pela largura, deduzindo a altura da razao do arquivo. */
function logo(s, { arquivo, razao }, { x, y, w }) {
  s.addImage({ path: ativo(arquivo), x, y, w, h: w / razao });
}

/* === TOKENS ===============================================================
   Espelham sistema/tokens.css. Cor em hex SEM '#' (exigencia do pptxgenjs).
   ========================================================================= */

export const COR = {
  papel: 'F8F7F2',
  creme: 'EFECDC',
  tinta: '1C1C1A',
  tintaMedia: '6B6B66',
  tintaClara: 'A5A49F',
  linha: 'E2E1DD',
  acento: 'A9724A',
};

/* Outfit e a tipografia do sistema. Se nao estiver instalada na maquina que
   abrir o arquivo, o PowerPoint substitui — ver README sobre instalar. */
export const FONTE = 'Outfit';
export const FONTE_ALT = 'Playfair Display';

export const TAM = {
  capa: 75, declaracao: 74, sumario: 78, secao: 66, pergunta: 56,
  titulo: 42, destaque: 30, item: 27, lead: 22, corpo: 18,
  apoio: 16, legenda: 15, rotulo: 12.5, numero: 11.5, rodape: 17,
};

/* Grade, em polegadas. */
export const GRADE = {
  largura: 20, altura: 11.25,
  margem: 1.427, margemCapa: 1.683, margemTopo: 2.419,
  colMeio: 8.4, colEstreita: 11.35, colLarga: 12.3,
};

/* charSpacing do pptxgenjs e em pontos, nao em em. */
const TRACK = { rotulo: 3, rodape: 3, numero: 2.1 };

/* === PALCO ================================================================ */

export function novoDeck({ titulo: tit = 'Apresentacao', autor = 'KA Inteligencia para Marcas' } = {}) {
  const pres = new pptxgen();
  pres.defineLayout({ name: 'KA', width: GRADE.largura, height: GRADE.altura });
  pres.layout = 'KA';               // sempre ANTES de criar qualquer slide
  pres.author = autor;
  pres.company = autor;
  pres.title = tit;
  return pres;
}

/* Cria um slide com o fundo do sistema.
   REGRA DO PADRAO: a textura acompanha o card. Use textura: true apenas em
   abertura, capa, sumario, divisoria de secao, slide-card e encerramento. */
export function slide(pres, { textura = false } = {}) {
  const s = pres.addSlide();
  s.background = { color: COR.papel };
  if (textura) {
    s.addImage({ path: ativo('texturas/fundo-onda.jpg'), x: 0, y: 0, w: GRADE.largura, h: GRADE.altura });
  }
  return s;
}

export async function salvar(pres, destino) {
  await pres.writeFile({ fileName: path.isAbsolute(destino) ? destino : path.join(RAIZ, destino) });
  return destino;
}

/* === TEXTO ================================================================
   Todo helper monta o seu proprio objeto de opcoes: o pptxgenjs muta os
   objetos que recebe, entao reaproveitar um entre chamadas corrompe o deck.
   ========================================================================= */

const texto = (s, conteudo, o) => s.addText(conteudo, { isTextBox: true, margin: 0, ...o });

/* Rotulo: caixa-alta pequena e espacada. Ancora a secao. */
export function rotulo(s, txt, { x = GRADE.margem, y = GRADE.margemTopo, w = 12, acento = false } = {}) {
  texto(s, String(txt).toUpperCase(), {
    x, y, w, h: 0.26,
    fontFace: FONTE, fontSize: TAM.rotulo, color: acento ? COR.acento : COR.tintaClara,
    charSpacing: TRACK.rotulo, valign: 'top',
  });
}

/* Micro-rotulo: abre coluna ou bloco interno. Mesmo tamanho, peso maior. */
export function microRotulo(s, txt, { x = GRADE.margem, y, w = 3, acento = false } = {}) {
  texto(s, String(txt).toUpperCase(), {
    x, y, w, h: 0.26,
    fontFace: FONTE, fontSize: TAM.rotulo, bold: true,
    color: acento ? COR.acento : COR.tintaClara,
    charSpacing: TRACK.rotulo, valign: 'top',
  });
}

/* Titulo de slide de conteudo: caixa baixa, leve, generoso. */
export function titulo(s, txt, { x = GRADE.margem, y = 3.009, w = 10.5, size = TAM.titulo } = {}) {
  texto(s, txt, {
    x, y, w, h: 1.3,
    fontFace: FONTE, fontSize: size, color: COR.tinta, lineSpacingMultiple: 1.2, valign: 'top',
  });
}

/* Titulo de divisoria de secao: caixa-alta, grande, respirando. */
export function tituloSecao(s, txt, { x, y, w = 14, size = TAM.secao } = {}) {
  texto(s, String(txt).toUpperCase(), {
    x, y, w, h: 2.4,
    fontFace: FONTE, fontSize: size, color: COR.tinta, lineSpacingMultiple: 1.12, valign: 'top',
  });
}

/* Paragrafo de abertura: um degrau acima do corpo. */
export function lead(s, txt, { x = GRADE.margem, y, w = GRADE.colMeio, h = 1.1 } = {}) {
  texto(s, txt, {
    x, y, w, h,
    fontFace: FONTE, fontSize: TAM.lead, color: COR.tinta, lineSpacingMultiple: 1.45, valign: 'top',
  });
}

/* Corpo: leitura longa, cinza medio. */
export function corpo(s, txt, { x = GRADE.margem, y, w = GRADE.colMeio, h = 1.4, cor = COR.tintaMedia, size = TAM.corpo } = {}) {
  texto(s, txt, {
    x, y, w, h,
    fontFace: FONTE, fontSize: size, color: cor, lineSpacingMultiple: 1.5, valign: 'top',
  });
}

export function legenda(s, txt, { x = GRADE.margem, y, w = 6, cor = COR.tintaClara } = {}) {
  texto(s, txt, {
    x, y, w, h: 0.7,
    fontFace: FONTE, fontSize: TAM.legenda, color: cor, lineSpacingMultiple: 1.4, valign: 'top',
  });
}

/* === FIOS E REGUAS ======================================================== */

/* Fio estrutural: o esqueleto da pagina. */
export function fio(s, { x = GRADE.margem, y, w = GRADE.colMeio } = {}) {
  s.addShape('rect', { x, y, w, h: 0.016, fill: { color: COR.linha }, line: SEM_BORDA });
}

/* Regua de acento: unico caramelo estrutural. */
export function reguaAcento(s, { x = GRADE.margem, y, w = 1.733 } = {}) {
  s.addShape('rect', { x, y, w, h: 0.04, fill: { color: COR.acento }, line: SEM_BORDA });
}

/* === CARD =================================================================
   Superficie clara sobre a textura. Sem sombra: a separacao vem do contraste
   com o relevo do fundo.
   ========================================================================= */

export function card(s, { x = 1.125, y = 1.684, w = 17.75, h = 8.196 } = {}) {
  s.addShape('roundRect', {
    x, y, w, h, rectRadius: 0.42,
    fill: { color: COR.papel }, line: SEM_BORDA,
  });
}

/* Numero de secao em caramelo. */
export function numeroSecao(s, n, { x, y } = {}) {
  /* Numero simples ganha zero a esquerda; rotulo composto ("1 · 2") passa direto. */
  const marca = /^\d+$/.test(String(n)) ? String(n).padStart(2, '0') : String(n);
  texto(s, marca, {
    x, y, w: 1.4, h: 0.3,
    fontFace: FONTE, fontSize: TAM.numero, color: COR.acento, charSpacing: TRACK.numero, valign: 'top',
  });
}

/* === RODAPE ===============================================================
   Faixa-pilula translucida + logo. Posicao fixa em todo slide de conteudo.
   Ausente na abertura, na capa e no encerramento.
   ========================================================================= */

export function rodape(s, entrega, cliente) {
  s.addShape('roundRect', {
    x: 0.917, y: 10.258, w: 11.359, h: 0.541, rectRadius: 0.27,
    fill: { color: COR.creme, transparency: 52 }, line: SEM_BORDA,
  });
  texto(s, [
    { text: String(entrega).toUpperCase(), options: { color: COR.tinta } },
    { text: '   |   ', options: { color: COR.tintaClara } },
    { text: String(cliente).toUpperCase(), options: { color: COR.tinta } },
  ], {
    x: 1.36, y: 10.258, w: 10.5, h: 0.541,
    fontFace: FONTE, fontSize: TAM.rodape, charSpacing: TRACK.rodape, valign: 'middle',
  });
  logo(s, LOGO_KA, { x: 16.476, y: 10.37, w: 2.399 });
}

/* === COLUNAS ==============================================================
   Separadas por fio vertical, nunca por caixa ou fundo colorido.
   ========================================================================= */

export function colunas(s, itens, { x = GRADE.margem, y, w = GRADE.colEstreita, alturaTexto = 2.0 } = {}) {
  const n = itens.length;
  const larguraCol = w / n;
  const respiro = 0.3;

  itens.forEach((item, i) => {
    const cx = x + i * larguraCol;
    if (i > 0) {
      s.addShape('rect', {
        x: cx - respiro / 2, y, w: 0.016, h: alturaTexto + 0.5,
        fill: { color: COR.linha }, line: SEM_BORDA,
      });
    }
    const cl = larguraCol - respiro;
    let cursor = y;
    if (item.numero) { numeroSecao(s, item.numero, { x: cx, y: cursor }); cursor += 0.38; }
    if (item.titulo) {
      texto(s, item.titulo, {
        x: cx, y: cursor, w: cl, h: 0.4,
        fontFace: FONTE, fontSize: TAM.corpo, color: COR.tinta, valign: 'top',
      });
      cursor += 0.52;
    }
    if (item.texto) {
      texto(s, item.texto, {
        x: cx, y: cursor, w: cl, h: alturaTexto,
        fontFace: FONTE, fontSize: TAM.apoio, color: COR.tintaMedia,
        lineSpacingMultiple: 1.5, valign: 'top',
      });
      cursor += alturaTexto;
    }
    if (item.revela) {
      reguaAcento(s, { x: cx, y: cursor, w: 0.85 });
      microRotulo(s, 'O que isso revela', { x: cx, y: cursor + 0.16, w: cl });
      texto(s, item.revela, {
        x: cx, y: cursor + 0.52, w: cl, h: 1.2,
        fontFace: FONTE, fontSize: TAM.apoio, color: COR.tinta,
        lineSpacingMultiple: 1.5, valign: 'top',
      });
    }
  });
}

/* === LISTA DE MARCADORES ==================================================
   Marcador e um ponto caramelo. Nunca a bolinha preta padrao.
   ========================================================================= */

export function marcadores(s, itens, { x = GRADE.margem, y, w = GRADE.colMeio, passo = 0.62 } = {}) {
  itens.forEach((item, i) => {
    const iy = y + i * passo;
    s.addShape('ellipse', {
      x: x + 0.02, y: iy + 0.13, w: 0.075, h: 0.075,
      fill: { color: COR.acento }, line: SEM_BORDA,
    });
    texto(s, item, {
      x: x + 0.42, y: iy, w: w - 0.42, h: passo,
      fontFace: FONTE, fontSize: TAM.corpo, color: COR.tinta, lineSpacingMultiple: 1.4, valign: 'top',
    });
  });
}

/* === CITACAO ==============================================================
   Aspa em caramelo, texto em tinta cheia. Sem italico, sem caixa.
   ========================================================================= */

export function citacao(s, txt, { x = GRADE.margem, y, w = GRADE.colMeio } = {}) {
  texto(s, '“', {
    x, y: y - 0.12, w: 0.5, h: 0.6,
    fontFace: FONTE, fontSize: 44, color: COR.acento, valign: 'top',
  });
  texto(s, txt, {
    x: x + 0.46, y, w: w - 0.46, h: 0.9,
    fontFace: FONTE, fontSize: TAM.lead, color: COR.tinta, lineSpacingMultiple: 1.35, valign: 'top',
  });
}

/* === IMAGEM ===============================================================
   Sangria colada na borda. Nunca moldura, nunca sombra.
   ========================================================================= */

export function imagemSangria(s, arquivo, { lado = 'direita', w = 7.5 } = {}) {
  s.addImage({
    path: path.isAbsolute(arquivo) ? arquivo : path.join(RAIZ, arquivo),
    x: lado === 'direita' ? GRADE.largura - w : 0,
    y: 0, w, h: GRADE.altura,
    sizing: { type: 'cover', w, h: GRADE.altura },
  });
}

/* === PECAS COMPOSTAS ====================================================== */

/* Abertura: trava de duas marcas separadas por filete. Sem rodape. */
export function slideAbertura(pres, { marcaCliente } = {}) {
  const s = slide(pres, { textura: true });
  const meio = GRADE.altura / 2;
  logo(s, LOGO_KA, { x: 6.1, y: meio - 3.2 / LOGO_KA.razao / 2, w: 3.2 });
  s.addShape('rect', { x: 9.85, y: meio - 0.62, w: 0.016, h: 1.24, fill: { color: COR.tinta }, line: SEM_BORDA });
  if (marcaCliente) {
    s.addImage({ path: path.join(RAIZ, marcaCliente), x: 10.6, y: meio - 0.42, w: 3.2, h: 0.83 });
  } else {
    logo(s, LOGO_CLIENTE, { x: 10.6, y: meio - 3.2 / LOGO_CLIENTE.razao / 2, w: 3.2 });
  }
  return s;
}

/* Capa: titulo, subtitulo e assinatura do metodo na base. Sem rodape. */
export function slideCapa(pres, { titulo: tit, cliente, subtitulo, data, metodo = true }) {
  const s = slide(pres, { textura: true });
  texto(s, String(tit).toUpperCase(), {
    x: GRADE.margemCapa, y: 3.93, w: 16.4, h: 1.4,
    fontFace: FONTE, fontSize: TAM.capa, bold: false, color: COR.tinta,
    lineSpacingMultiple: 1.05, valign: 'top',
  });
  texto(s, [
    { text: cliente, options: { bold: true } },
    { text: ` | ${subtitulo}`, options: {} },
  ], {
    x: GRADE.margemCapa, y: 5.24, w: 15, h: 0.6,
    fontFace: FONTE, fontSize: TAM.destaque, color: COR.tinta, valign: 'top',
  });

  if (metodo) {
    const base = 8.52, alt = 0.98;
    const filetes = [1.689, 5.211, 8.188, 10.602];
    filetes.forEach((fx) => {
      s.addShape('rect', { x: fx, y: base, w: 0.014, h: alt, fill: { color: COR.tinta }, line: SEM_BORDA });
    });
    logo(s, LOGO_KA, { x: 1.95, y: 8.83, w: 2.9 });
    texto(s, [
      { text: 'Método ', options: {} },
      { text: 'Marca', options: { bold: true } },
      { text: '\n', options: {} },
      { text: 'com Essência', options: { bold: true } },
      { text: '©', options: { fontSize: 14 } },
    ], {
      x: 5.45, y: base + 0.12, w: 2.6, h: 0.75,
      fontFace: FONTE, fontSize: 26, color: COR.tinta, lineSpacingMultiple: 1.2, valign: 'middle',
    });
    texto(s, String(data).toUpperCase(), {
      x: 8.4, y: base, w: 2.1, h: alt,
      fontFace: FONTE, fontSize: 19, color: COR.tinta, valign: 'middle',
    });
  }
  return s;
}

/* Divisoria de secao: card, numero em caramelo, nome em caixa-alta.

   O titulo se ajusta ao comprimento do nome e o fio desce junto: um nome de
   duas linhas nao pode encostar no fio. Ainda assim, nome de divisoria e
   curto por definicao — duas ou tres palavras, como no deck de referencia. */
export function slideSecao(pres, { numero, nome, entrega, cliente }) {
  const s = slide(pres, { textura: true });
  card(s);

  const LARGURA = 15;                      // polegadas uteis dentro do card
  const RAZAO_GLIFO = 0.62;                // largura media do glifo em caixa-alta
  let tamanho = TAM.secao;
  let linhas = Math.ceil((nome.length * RAZAO_GLIFO * tamanho) / (LARGURA * 72));
  if (linhas > 2) {                        // nome longo: reduz ate caber em duas
    tamanho = Math.max(38, Math.floor((LARGURA * 72 * 2) / (nome.length * RAZAO_GLIFO)));
    linhas = 2;
  }
  const alturaTexto = linhas * (tamanho / 72) * 1.12;

  numeroSecao(s, numero, { x: 1.9, y: 4.42 });
  tituloSecao(s, nome, { x: 1.86, y: 4.75, w: LARGURA, size: tamanho });
  fio(s, { x: 1.9, y: 4.75 + alturaTexto + 0.42, w: 16.2 });
  rodape(s, entrega, cliente);
  return s;
}

/* Pergunta condutora: rotulo pequeno + pergunta grande. Sem card, sem textura. */
export function slidePergunta(pres, { sobretitulo, pergunta, entrega, cliente }) {
  const s = slide(pres);
  rotulo(s, sobretitulo, { y: 4.42 });
  texto(s, pergunta, {
    x: GRADE.margem, y: 5.0, w: 14.5, h: 2.2,
    fontFace: FONTE, fontSize: TAM.pergunta, color: COR.tinta, lineSpacingMultiple: 1.25, valign: 'top',
  });
  rodape(s, entrega, cliente);
  return s;
}

/* Declaracao: a frase que carrega o slide inteiro. */
export function slideDeclaracao(pres, { sobretitulo, frase, desdobramento, entrega, cliente, imagem }) {
  const s = slide(pres);
  if (imagem) imagemSangria(s, imagem, { lado: 'direita', w: 7.2 });
  const w = imagem ? GRADE.colMeio : 14.5;
  if (sobretitulo) microRotulo(s, sobretitulo, { y: 3.4, w, acento: true });
  texto(s, frase, {
    x: GRADE.margem, y: 3.9, w, h: 2.4,
    fontFace: FONTE, fontSize: TAM.titulo, color: COR.tinta, lineSpacingMultiple: 1.2, valign: 'top',
  });
  if (desdobramento) {
    reguaAcento(s, { y: 6.5, w: 0.9 });
    corpo(s, desdobramento, { y: 6.75, w });
  }
  rodape(s, entrega, cliente);
  return s;
}

/* Encerramento: agradecimento + trava de marcas. Sem rodape. */
export function slideEncerramento(pres, { titulo: tit = 'Muito obrigada!', marcaCliente } = {}) {
  const s = slide(pres, { textura: true });
  texto(s, String(tit).toUpperCase(), {
    x: GRADE.margemCapa, y: 4.6, w: 12, h: 1.1,
    fontFace: FONTE, fontSize: 48, color: COR.tinta, charSpacing: 3, valign: 'top',
  });
  logo(s, LOGO_KA, { x: GRADE.margemCapa, y: 6.0, w: 2.4 });
  s.addShape('rect', { x: 4.35, y: 5.92, w: 0.014, h: 0.78, fill: { color: COR.tinta }, line: SEM_BORDA });
  if (marcaCliente) {
    s.addImage({ path: path.join(RAIZ, marcaCliente), x: 4.75, y: 6.0, w: 2.4, h: 0.62 });
  } else {
    logo(s, LOGO_CLIENTE, { x: 4.75, y: 6.05, w: 2.4 });
  }
  return s;
}

/* Percurso: etapas em linha sobre um fio, uma bolinha por etapa.
   Apenas a ultima em caramelo — o ponto de chegada. */
export function percurso(s, etapas, { x = GRADE.margem, y, w = 16.2 } = {}) {
  fio(s, { x, y, w });
  const passo = w / etapas.length;
  etapas.forEach((etapa, i) => {
    const ex = x + i * passo;
    const ultima = i === etapas.length - 1;
    s.addShape('ellipse', {
      x: ex, y: y - 0.05, w: 0.1, h: 0.1,
      fill: { color: ultima ? COR.acento : COR.tintaClara }, line: SEM_BORDA,
    });
    texto(s, etapa, {
      x: ex, y: y + 0.24, w: passo - 0.3, h: 1.2,
      fontFace: FONTE, fontSize: TAM.legenda,
      color: ultima ? COR.tinta : COR.tintaMedia, bold: ultima,
      lineSpacingMultiple: 1.35, valign: 'top',
    });
  });
}

/* Lista numerada com fio entre itens. Serve sumario e enumeracao de etapas. */
export function listaNumerada(s, itens, { x = GRADE.margem, y, w = 16.2, passo = 0.92, size = TAM.item } = {}) {
  itens.forEach((item, i) => {
    const iy = y + i * passo;
    s.addShape('rect', { x, y: iy, w, h: 0.016, fill: { color: COR.linha }, line: SEM_BORDA });
    texto(s, String(item.numero ?? i + 1).padStart(2, '0'), {
      x, y: iy + 0.22, w: 0.8, h: 0.3,
      fontFace: FONTE, fontSize: TAM.numero, color: COR.acento, charSpacing: TRACK.numero, valign: 'top',
    });
    texto(s, item.titulo, {
      x: x + 0.95, y: iy + 0.16, w: w - 1.1, h: passo - 0.22,
      fontFace: FONTE, fontSize: size, color: COR.tinta, valign: 'top',
    });
    if (item.descricao) {
      texto(s, item.descricao, {
        x: x + 0.95, y: iy + 0.56, w: w - 1.1, h: 0.26,
        fontFace: FONTE, fontSize: TAM.legenda, color: COR.tintaClara, valign: 'top',
      });
    }
  });
  s.addShape('rect', {
    x, y: y + itens.length * passo, w, h: 0.016,
    fill: { color: COR.linha }, line: SEM_BORDA,
  });
}

/* Contraposicao: duas colunas rotuladas, separadas por fio vertical.
   O lado esquerdo e o raso; o direito, o que o metodo propoe. */
export function contraposicao(s, { y, esquerda, direita, x = GRADE.margem, w = 16.2 }) {
  const meio = x + w / 2;
  s.addShape('rect', { x: meio - 0.3, y, w: 0.016, h: 3.4, fill: { color: COR.linha }, line: SEM_BORDA });
  const lado = (dados, lx) => {
    microRotulo(s, dados.rotulo, { x: lx, y, w: w / 2 - 0.6, acento: dados.acento });
    texto(s, dados.titulo, {
      x: lx, y: y + 0.46, w: w / 2 - 0.6, h: 0.9,
      fontFace: FONTE, fontSize: TAM.lead, color: COR.tinta, lineSpacingMultiple: 1.3, valign: 'top',
    });
    texto(s, dados.texto, {
      x: lx, y: y + 1.5, w: w / 2 - 0.6, h: 1.8,
      fontFace: FONTE, fontSize: TAM.corpo, color: COR.tintaMedia, lineSpacingMultiple: 1.5, valign: 'top',
    });
  };
  lado(esquerda, x);
  lado(direita, meio + 0.3);
}

/* === PECAS DIDATICAS ======================================================
   Componentes para aula: QR com rotulo, moldura de print e ficha de capitulo.
   ========================================================================= */

/* QR com rotulo em cima e instrucao embaixo. O QR fica sobre um card de papel
   com respiro — a zona silenciosa da norma precisa sobreviver a impressao. */
export function qrBloco(s, {
  arquivo, rotulo: rot, instrucao, x, y, lado = 2.1, compacto = false,
  larguraTexto, marca,
}) {
  const wTexto = larguraTexto ?? lado + 1.7;
  microRotulo(s, rot, { x, y, w: wTexto, acento: true });
  const topo = y + (compacto ? 0.34 : 0.4);

  if (arquivo) {
    s.addShape('roundRect', {
      x, y: topo, w: lado, h: lado, rectRadius: 0.16,
      fill: { color: COR.papel }, line: { color: COR.linha, width: 1 },
    });
    s.addImage({
      path: path.isAbsolute(arquivo) ? arquivo : path.join(RAIZ, arquivo),
      x: x + 0.1, y: topo + 0.1, w: lado - 0.2, h: lado - 0.2,
    });
  } else {
    /* Marcacao: o lugar do QR, ainda vazio. Tracejada de proposito —
       enquanto estiver assim, o slide nao esta pronto para apresentar. */
    s.addShape('roundRect', {
      x, y: topo, w: lado, h: lado, rectRadius: 0.16,
      fill: { color: COR.papel }, line: { color: COR.tintaClara, width: 1.25, dashType: 'dash' },
    });
    texto(s, marca ? `QR\n${marca}` : 'QR', {
      x: x + 0.1, y: topo, w: lado - 0.2, h: lado,
      isTextBox: true, margin: 0, align: 'center',
      fontFace: FONTE, fontSize: TAM.rotulo, color: COR.tintaClara,
      charSpacing: TRACK.rotulo, lineSpacingMultiple: 1.45, valign: 'middle',
    });
  }

  if (instrucao) {
    texto(s, instrucao, {
      x, y: topo + lado + (compacto ? 0.12 : 0.14), w: wTexto, h: compacto ? 0.64 : 0.8,
      isTextBox: true, margin: 0,
      fontFace: FONTE, fontSize: TAM.legenda, color: COR.tintaMedia,
      lineSpacingMultiple: 1.35, valign: 'top',
    });
  }
}

/* Moldura para o print que a Kelly vai colar. Tracejada de proposito: enquanto
   estiver assim, o slide esta incompleto. */
export function molduraImagem(s, { x, y, w, h, legenda: leg }) {
  s.addShape('roundRect', {
    x, y, w, h, rectRadius: 0.2,
    fill: { color: COR.papel }, line: { color: COR.tintaClara, width: 1.25, dashType: 'dash' },
  });
  texto(s, leg, {
    x: x + 0.4, y: y + h / 2 - 0.3, w: w - 0.8, h: 0.6,
    isTextBox: true, margin: 0, align: 'center',
    fontFace: FONTE, fontSize: TAM.rotulo, color: COR.tintaClara,
    charSpacing: TRACK.rotulo, valign: 'middle',
  });
}

/* Ficha de capitulo: a tela que o aluno fotografa.
   Numero, titulo, o que revela, os dois QR e o que anexar junto. */
export function slideFicha(pres, {
  numero, titulo: tit, revela, oQueFaz, qrAudio, qrDocs, qrAgente, anexar, entrega, cliente,
}) {
  const s = slide(pres);
  const X = GRADE.margem;
  const cap = String(numero).padStart(2, '0');

  numeroSecao(s, `Capítulo ${cap}`, { x: X, y: 1.45 });
  texto(s, tit, {
    x: X, y: 1.85, w: 10.2, h: 1.3, isTextBox: true, margin: 0,
    fontFace: FONTE, fontSize: 40, color: COR.tinta, lineSpacingMultiple: 1.15, valign: 'top',
  });
  fio(s, { x: X, y: 3.35, w: 10.2 });

  microRotulo(s, 'O que este capítulo revela', { x: X, y: 3.65, w: 10.2 });
  texto(s, revela, {
    x: X, y: 4.05, w: 10.2, h: 1.4, isTextBox: true, margin: 0,
    fontFace: FONTE, fontSize: TAM.lead, color: COR.tinta, lineSpacingMultiple: 1.4, valign: 'top',
  });

  if (oQueFaz) {
    microRotulo(s, 'O que você faz aqui', { x: X, y: 5.75, w: 10.2 });
    marcadores(s, oQueFaz, { x: X, y: 6.2, w: 10.2, passo: 0.66 });
  }

  if (anexar) {
    reguaAcento(s, { x: X, y: 8.85, w: 0.9 });
    texto(s, anexar, {
      x: X, y: 9.12, w: 10.2, h: 0.7, isTextBox: true, margin: 0,
      fontFace: FONTE, fontSize: TAM.corpo, color: COR.tinta, lineSpacingMultiple: 1.4, valign: 'top',
    });
  }

  /* Coluna de acessos: os mesmos QR que estao no livro, na ordem de uso. */
  const XD = 12.6;
  s.addShape('rect', { x: XD - 0.7, y: 1.45, w: 0.016, h: 8.0, fill: { color: COR.linha }, line: SEM_BORDA });

  const acessos = [];
  if (qrAudio !== false) acessos.push({ arquivo: qrAudio, marca: `Cap. ${cap}\nSpotify`, rotulo: 'Ouça o áudio', instrucao: 'Episódio do Capítulo ' + cap + ', no Spotify.' });
  if (qrDocs !== false) acessos.push({ arquivo: qrDocs, marca: `Cap. ${cap}\nDocs`, rotulo: 'Responda as perguntas', instrucao: 'Salve como: Capítulo ' + cap + ' – Perguntas e Respostas' });
  acessos.push({
    arquivo: qrAgente, marca: `Cap. ${cap}\nAgente`, rotulo: 'Processe no agente',
    instrucao: numero === 11
      ? 'Clique no atalho e anexe os sete relatórios.'
      : 'Clique no atalho, depois anexe. Salve: Relatório/Diagnóstico – Cap. ' + cap,
  });

  /* Altura de um bloco: rotulo 0.34 + QR 1.6 + respiro 0.12 + instrucao 0.64.
     O passo precisa ser maior que isso, senao a instrucao invade o proximo. */
  const PASSO = 2.75;
  acessos.forEach((a, i) => {
    numeroSecao(s, i + 1, { x: XD, y: 1.45 + i * PASSO - 0.24 });
    qrBloco(s, { ...a, x: XD, y: 1.45 + i * PASSO, lado: 1.6, compacto: true, larguraTexto: 5.35 });
  });

  rodape(s, entrega, cliente);
  return s;
}
