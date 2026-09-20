/* ---------------------------------------------------------------------------
   EXPORTADOR
   Renderiza um deck HTML do sistema em PNG (um por slide) e em PDF unico.

   Uso:
     node build/exportar.mjs                      -> exporta modelo/modelo.html
     node build/exportar.mjs caminho/deck.html    -> exporta o deck indicado
     node build/exportar.mjs deck.html --escala 2 -> PNG em 3840x2160
     node build/exportar.mjs x.html --seletor .postcard -> outra unidade de peca

   Saida: build/saida/<nome-do-deck>/
   --------------------------------------------------------------------------- */

import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';

const RAIZ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const args = process.argv.slice(2);
const iEscala = args.indexOf('--escala');
const escala = iEscala !== -1 ? Number(args[iEscala + 1]) : 1;
const transparente = args.includes('--transparente');
/* Nem toda peca do repositorio e um .slide: cartoes que vem do sistema de
   um cliente trazem a propria classe. O seletor e parametro, nao lei. */
const iSeletor = args.indexOf('--seletor');
const SELETOR = iSeletor !== -1 ? args[iSeletor + 1] : '.slide';
const entradaArg = args.find((a) => !a.startsWith('--') && a !== String(escala) && a !== SELETOR);
const entrada = path.resolve(RAIZ, entradaArg ?? 'modelo/modelo.html');

const nome = path.basename(entrada, '.html');
const saida = path.join(RAIZ, 'build', 'saida', nome);
await fs.mkdir(saida, { recursive: true });

/* O Chromium do Playwright nem sempre esta no caminho que a versao instalada
   espera. Procuramos um executavel disponivel antes de desistir. */
async function acharChromium() {
  const candidatos = [
    process.env.CHROMIUM_PATH,
    '/opt/pw-browsers/chromium/chrome-linux/chrome',
    '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    '/usr/bin/chromium',
    '/usr/bin/google-chrome',
  ].filter(Boolean);
  for (const c of candidatos) {
    try { await fs.access(c); return c; } catch { /* segue */ }
  }
  // fallback: qualquer chromium-*/chrome-linux/chrome sob /opt/pw-browsers
  try {
    for (const d of await fs.readdir('/opt/pw-browsers')) {
      const c = `/opt/pw-browsers/${d}/chrome-linux/chrome`;
      try { await fs.access(c); return c; } catch { /* segue */ }
    }
  } catch { /* segue */ }
  return undefined;
}

const executablePath = await acharChromium();
const navegador = await chromium.launch(executablePath ? { executablePath } : {});
const pagina = await navegador.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: escala });

await pagina.goto(pathToFileURL(entrada).href, { waitUntil: 'networkidle' });
await pagina.evaluate(() => document.fonts.ready);

/* O palco vem do proprio documento: 1920x1080 num deck, 1080x1920 num story.
   Medir evita manter dois exportadores para a mesma identidade. */
const { LARGURA, ALTURA } = await pagina.evaluate((sel) => {
  const primeiro = document.querySelector(sel);
  const r = primeiro.getBoundingClientRect();
  return { LARGURA: Math.round(r.width), ALTURA: Math.round(r.height) };
}, SELETOR);
await pagina.setViewportSize({ width: LARGURA, height: ALTURA });

/* omitBackground so remove o branco padrao da pagina: qualquer fundo
   declarado em html/body/.deck continua aparecendo por tras de um slide
   transparente. Entao, ao exportar com alfa, zeramos esses fundos. */
if (transparente) {
  await pagina.addStyleTag({
    content: 'html, body, .deck { background: transparent !important; }',
  });
}

/* A captura de um elemento e recortada pelo viewport. Se a pagina tiver
   margem ou padding no body — comum em arquivo feito para olhar no
   navegador — a peca comeca deslocada e sai faltando um pedaco na borda,
   silenciosamente. Zeramos antes de capturar. */
await pagina.addStyleTag({ content: 'html, body { margin: 0 !important; padding: 0 !important; }' });

const slides = await pagina.locator(SELETOR).all();
if (slides.length === 0) throw new Error(`Nenhum ${SELETOR} encontrado em ${entrada}`);

for (const [i, slide] of slides.entries()) {
  const arquivo = path.join(saida, `slide-${String(i + 1).padStart(2, '0')}.png`);
  await slide.screenshot({ path: arquivo, omitBackground: transparente });
  const c = await slide.boundingBox();
  const certo = Math.round(c.width) === LARGURA && Math.round(c.height) === ALTURA;
  console.log(`  ${path.relative(RAIZ, arquivo)}` +
              (certo ? '' : `  ATENCAO: ${Math.round(c.width)}x${Math.round(c.height)}` +
                            ` em vez de ${LARGURA}x${ALTURA}`));
}

/* PDF: uma pagina por slide, no formato exato do palco. */
await pagina.addStyleTag({
  content: `@page { size: ${LARGURA}px ${ALTURA}px; margin: 0; }
            html, body { background: #fff; }
            .deck { display: block; gap: 0; padding: 0; }
            ${SELETOR} { break-after: page; page-break-after: always; }
            ${SELETOR}:last-child { break-after: auto; page-break-after: auto; }`,
});

const pdf = path.join(saida, `${nome}.pdf`);
await pagina.pdf({ path: pdf, width: `${LARGURA}px`, height: `${ALTURA}px`, printBackground: true });
console.log(`  ${path.relative(RAIZ, pdf)}`);

await navegador.close();
console.log(`\n${slides.length} slides exportados em build/saida/${nome}/`);
