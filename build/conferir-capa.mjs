/* ---------------------------------------------------------------------------
   CONFERENCIA DA CAPA DE CASE

   Mede o que de fato vai ao ar, nao o que o CSS declara:

   1. FOLGA ATE A SILHUETA — a massa de cor nao e um retangulo. Um texto
      centralizado na caixa pode estar dentro da caixa e fora da forma. O
      script le o proprio clip-path aplicado, reconstroi a borda linha a
      linha e mede a distancia de cada LINHA de texto (nao da caixa) ate ela.

   2. RECORTE DO FEED — tudo tem de caber em 1080x1350 (y 285 a 1635). Fora
      disso o Instagram corta no perfil, e o credito some.

   Uso:  node build/conferir-capa.mjs [arte/capa-case-shapes.html]
   --------------------------------------------------------------------------- */

import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const RAIZ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const entrada = path.resolve(RAIZ, process.argv[2] ?? 'arte/capa-case-shapes.html');

const FOLGA_MINIMA = 26;          // px de respiro entre texto e borda da forma
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

const dados = await pagina.evaluate(() => {
  const palco = document.querySelector('.slide').getBoundingClientRect();
  const rel = (c) => ({ t: c.top - palco.top, b: c.bottom - palco.top,
                        e: c.left - palco.left, d: c.right - palco.left });

  const forma = document.querySelector('.capa-case__forma');
  const cf = forma.getBoundingClientRect();
  const clip = getComputedStyle(forma).clipPath;
  const pontos = [...clip.matchAll(/([\d.]+)%\s+([\d.]+)%/g)]
    .map(([, x, y]) => [Number(x) / 100, Number(y) / 100]);

  // Linhas de texto de verdade, nao a caixa do paragrafo.
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

  const tudo = [...document.querySelectorAll('.capa-case > *')]
    .map((el) => ({ nome: el.className || el.tagName.toLowerCase(),
                    ...rel(el.getBoundingClientRect()) }))
    .filter((o) => o.nome !== 'capa-case__foto');

  return { forma: { e: cf.left - palco.left, t: cf.top - palco.top,
                    l: cf.width, a: cf.height }, pontos, itens, tudo };
});
await navegador.close();

if (dados.pontos.length < 3) {
  console.error('Nao consegui ler o clip-path da forma.');
  process.exit(1);
}

/* Borda esquerda e direita da silhueta na altura y, em px do palco. */
const { e: FE, t: FT, l: FL, a: FA } = dados.forma;
function borda(y) {
  const fy = (y - FT) / FA;
  if (fy < 0 || fy > 1) return null;
  const cortes = [];
  const P = dados.pontos;
  for (let i = 0; i < P.length; i++) {
    const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % P.length];
    if ((y1 <= fy && y2 > fy) || (y2 <= fy && y1 > fy))
      cortes.push(x1 + ((fy - y1) / (y2 - y1)) * (x2 - x1));
  }
  if (!cortes.length) return null;
  return [FE + Math.min(...cortes) * FL, FE + Math.max(...cortes) * FL];
}

console.log(`\n${path.relative(RAIZ, entrada)}\n`);
console.log('FOLGA ATE A SILHUETA');
let pior = Infinity, culpado = '';
for (const o of dados.itens) {
  let fe = Infinity, fd = Infinity;
  for (let y = o.t; y <= o.b; y += 2) {
    const r = borda(y);
    if (r) { fe = Math.min(fe, o.e - r[0]); fd = Math.min(fd, r[1] - o.d); }
  }
  if (Math.min(fe, fd) < pior) { pior = Math.min(fe, fd); culpado = o.nome; }
  console.log(`  ${o.nome.padEnd(20)} y ${String(Math.round(o.t)).padStart(4)}` +
    `-${String(Math.round(o.b)).padEnd(4)}  esq ${fe.toFixed(0).padStart(5)}  dir ${fd.toFixed(0).padStart(5)}`);
}
const okFolga = pior >= FOLGA_MINIMA;
console.log(`  -> menor folga ${pior.toFixed(0)} px em "${culpado}"` +
            ` (minimo ${FOLGA_MINIMA}) ${okFolga ? 'ok' : 'ENCOSTA'}`);

console.log('\nRECORTE DO FEED (1080x1350, y 285 a 1635)');
let okFeed = true;
for (const o of dados.tudo) {
  const dentro = o.t >= FEED_TOPO && o.b <= FEED_BASE;
  if (!dentro) okFeed = false;
  console.log(`  ${o.nome.padEnd(20)} y ${String(Math.round(o.t)).padStart(4)}` +
              `-${String(Math.round(o.b)).padEnd(4)}  ${dentro ? 'ok' : 'FORA'}`);
}
console.log(`  -> ${okFeed ? 'tudo dentro' : 'HA CONTEUDO FORA DO RECORTE'}`);

process.exit(okFolga && okFeed ? 0 : 1);
