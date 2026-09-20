/* ---------------------------------------------------------------------------
   CONFERENCIA DA CAPA E DOS STORIES DE CASE

   Mede o que de fato vai ao ar, nao o que o CSS declara:

   1. FOLGA ATE A SILHUETA — a massa de cor nao e um retangulo. Um texto
      centralizado na caixa pode estar dentro da caixa e fora da forma. O
      script le o proprio clip-path aplicado, reconstroi a borda linha a
      linha e mede a distancia de cada LINHA de texto (nao da caixa) ate ela.

   2. RECORTE DO FEED — so para a capa, que e peca unica. A capa tem de
      caber em 1080x1350 (y 285 a 1635), senao o Instagram corta na
      miniatura do perfil. Story nao tem esse recorte: e sempre visto
      inteiro, entao um documento com mais de uma peca pula esta conferencia.

   Uso:  node build/conferir-capa.mjs [arte/capa-case-shapes.html]
   --------------------------------------------------------------------------- */

import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const RAIZ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const entrada = path.resolve(RAIZ, process.argv[2] ?? 'arte/capa-case-shapes.html');

const FOLGA_MINIMA = 26;
const FEED_TOPO = 285, FEED_BASE = 1635;

let exe;
for (const d of fs.readdirSync('/opt/pw-browsers')) {
  const c = `/opt/pw-browsers/${d}/chrome-linux/chrome`;
  if (fs.existsSync(c)) { exe = c; break; }
}
const navegador = await chromium.launch(exe ? { executablePath: exe } : {});
const pagina = await navegador.newPage({ viewport: { width: 1080, height: 1920 } });
await pagina.goto(pathToFileURL(entrada).href, { waitUntil: 'networkidle' });
await pagina.evaluate(() => document.fonts.ready);

const pecas = await pagina.evaluate(() => {
  const saida = [];
  document.querySelectorAll('.slide').forEach((sl, i) => {
    const forma = sl.querySelector('.capa-case__forma');
    if (!forma) return;
    const s = sl.getBoundingClientRect();
    const rel = (c) => ({ t: c.top - s.top, b: c.bottom - s.top,
                          e: c.left - s.left, d: c.right - s.left });
    const cf = forma.getBoundingClientRect();
    const pontos = [...getComputedStyle(forma).clipPath.matchAll(/([\d.]+)%\s+([\d.]+)%/g)]
      .map(([, x, y]) => [Number(x) / 100, Number(y) / 100]);

    const itens = [];
    const it = document.createNodeIterator(forma, NodeFilter.SHOW_TEXT);
    const rng = document.createRange();
    for (let n; (n = it.nextNode());) {
      if (!n.textContent.trim()) continue;
      rng.selectNodeContents(n);
      for (const c of rng.getClientRects())
        if (c.width > 2) itens.push({ nome: n.textContent.trim().slice(0, 18), ...rel(c) });
    }
    for (const el of forma.querySelectorAll('img, .capa-case__filete'))
      itens.push({ nome: el.alt || 'filete', ...rel(el.getBoundingClientRect()) });

    const tudo = [...sl.querySelectorAll(':scope > *')]
      .map((el) => ({ nome: el.className || el.tagName.toLowerCase(), ...rel(el.getBoundingClientRect()) }))
      .filter((o) => !String(o.nome).includes('__foto'));

    saida.push({ n: i + 1,
                 forma: { e: cf.left - s.left, t: cf.top - s.top, l: cf.width, a: cf.height },
                 pontos, itens, tudo });
  });
  return saida;
});
await navegador.close();

if (!pecas.length) { console.error('Nenhuma .capa-case__forma encontrada.'); process.exit(1); }

function bordaDe(peca) {
  const { e: FE, t: FT, l: FL, a: FA } = peca.forma;
  return (y) => {
    const fy = (y - FT) / FA;
    if (fy < 0 || fy > 1) return null;
    const cortes = [];
    const P = peca.pontos;
    for (let i = 0; i < P.length; i++) {
      const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % P.length];
      if ((y1 <= fy && y2 > fy) || (y2 <= fy && y1 > fy))
        cortes.push(x1 + ((fy - y1) / (y2 - y1)) * (x2 - x1));
    }
    if (!cortes.length) return null;
    return [FE + Math.min(...cortes) * FL, FE + Math.max(...cortes) * FL];
  };
}

console.log(`\n${path.relative(RAIZ, entrada)}  —  ${pecas.length} peca(s)\n`);
let tudoOk = true;

for (const peca of pecas) {
  const borda = bordaDe(peca);
  console.log(`PECA ${peca.n} · folga ate a silhueta`);
  let pior = Infinity, culpado = '';
  for (const o of peca.itens) {
    let fe = Infinity, fd = Infinity;
    for (let y = o.t; y <= o.b; y += 2) {
      const r = borda(y);
      if (r) { fe = Math.min(fe, o.e - r[0]); fd = Math.min(fd, r[1] - o.d); }
    }
    if (Math.min(fe, fd) < pior) { pior = Math.min(fe, fd); culpado = o.nome; }
    console.log(`  ${o.nome.padEnd(20)} y ${String(Math.round(o.t)).padStart(4)}` +
      `-${String(Math.round(o.b)).padEnd(4)}  esq ${fe.toFixed(0).padStart(5)}  dir ${fd.toFixed(0).padStart(5)}`);
  }
  const ok = pior >= FOLGA_MINIMA;
  tudoOk &&= ok;
  console.log(`  -> menor folga ${pior.toFixed(0)} px em "${culpado}"` +
              ` (minimo ${FOLGA_MINIMA}) ${ok ? 'ok' : 'ENCOSTA'}\n`);
}

if (pecas.length === 1) {
  console.log('RECORTE DO FEED (1080x1350, y 285 a 1635)');
  for (const o of pecas[0].tudo) {
    const dentro = o.t >= FEED_TOPO && o.b <= FEED_BASE;
    tudoOk &&= dentro;
    console.log(`  ${String(o.nome).padEnd(20)} y ${String(Math.round(o.t)).padStart(4)}` +
                `-${String(Math.round(o.b)).padEnd(4)}  ${dentro ? 'ok' : 'FORA'}`);
  }
} else {
  console.log('RECORTE DO FEED: nao se aplica — story e sempre visto inteiro.');
}

process.exit(tudoOk ? 0 : 1);
