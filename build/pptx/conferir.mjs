/* ---------------------------------------------------------------------------
   CONFERENCIA AUTOMATICA DA PREVIA

   Abre o HTML gerado por previa.py e mede cada caixa de texto: se o conteudo
   e mais alto que a caixa, ha estouro; se a caixa passa da borda do slide ou
   invade a faixa do rodape, ha colisao.

   Estouro de texto e o defeito mais comum e o mais caro — melhor medir do que
   olhar 33 slides e confiar na vista.

   Uso:
     node build/pptx/conferir.mjs decks/saida/previa.html
   --------------------------------------------------------------------------- */

import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';

const RAIZ = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const entrada = path.resolve(RAIZ, process.argv[2] ?? 'decks/saida/previa.html');

/* O Chromium do Playwright nem sempre esta onde a versao instalada espera. */
async function acharChromium() {
  const candidatos = [
    process.env.CHROMIUM_PATH,
    '/opt/pw-browsers/chromium/chrome-linux/chrome',
    '/usr/bin/chromium',
  ].filter(Boolean);
  for (const c of candidatos) {
    try { await fs.access(c); return c; } catch { /* segue */ }
  }
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
const pagina = await navegador.newPage({ viewport: { width: 1920, height: 1080 } });
await pagina.goto(pathToFileURL(entrada).href, { waitUntil: 'networkidle' });
await pagina.evaluate(() => document.fonts.ready);

const achados = await pagina.evaluate(() => {
  const ALTURA = 1080, LARGURA = 1920;
  const RODAPE = 985;            // topo da faixa do rodape, em px
  const TOLERANCIA = 2;          // folga para arredondamento
  const saida = [];

  document.querySelectorAll('.slide').forEach((slide, i) => {
    const n = i + 1;
    const base = slide.getBoundingClientRect();
    const ocupadas = [];   // retangulos REAIS do texto, para detectar colisao

    slide.querySelectorAll('div[style*="position:absolute"]').forEach((caixa) => {
      const temTexto = caixa.innerText && caixa.innerText.trim().length > 0;
      if (!temTexto) return;

      const r = caixa.getBoundingClientRect();
      const topo = r.top - base.top;
      const esq = r.left - base.left;
      const trecho = caixa.innerText.trim().replace(/\s+/g, ' ').slice(0, 52);

      /* Mancha real do texto: uniao dos retangulos das linhas, nao a caixa. */
      const linhas = [...caixa.children].filter((c) => c.innerText.trim());
      const tinta = linhas.length
        ? linhas.reduce((acc, c) => {
            const b = c.getBoundingClientRect();
            return {
              x0: Math.min(acc.x0, b.left - base.left), y0: Math.min(acc.y0, b.top - base.top),
              x1: Math.max(acc.x1, b.right - base.left), y1: Math.max(acc.y1, b.bottom - base.top),
            };
          }, { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity })
        : { x0: esq, y0: topo, x1: esq + r.width, y1: topo + r.height };

      if (caixa.scrollHeight > caixa.clientHeight + TOLERANCIA) {
        saida.push({
          slide: n, tipo: 'estouro',
          detalhe: `conteudo ${caixa.scrollHeight}px em caixa de ${caixa.clientHeight}px`,
          trecho,
        });
      }
      if (topo + r.height > ALTURA - TOLERANCIA || esq + r.width > LARGURA - TOLERANCIA || topo < -TOLERANCIA || esq < -TOLERANCIA) {
        saida.push({
          slide: n, tipo: 'fora do slide',
          detalhe: `x ${Math.round(esq)}..${Math.round(esq + r.width)} · y ${Math.round(topo)}..${Math.round(topo + r.height)}`,
          trecho,
        });
      }
      /* A faixa do rodape e fixa: conteudo nao pode descer ate ela. */
      const ehRodape = trecho.toUpperCase().includes('IA COM ESS') || trecho.includes('|');
      if (!ehRodape && tinta.y1 > RODAPE) {
        saida.push({
          slide: n, tipo: 'invade o rodape',
          detalhe: `desce ate ${Math.round(tinta.y1)}px (limite ${RODAPE})`,
          trecho,
        });
      }

      /* Colisao: o retangulo real do texto (altura do conteudo, nao da caixa)
         nao pode se sobrepor ao de outro bloco. E o que pega texto que cresceu
         e foi parar em cima do rotulo seguinte. */
      const meu = { ...tinta, trecho };
      for (const outro of ocupadas) {
        const sobrepoeX = meu.x0 < outro.x1 - 6 && outro.x0 < meu.x1 - 6;
        const sobrepoeY = meu.y0 < outro.y1 - 6 && outro.y0 < meu.y1 - 6;
        if (sobrepoeX && sobrepoeY) {
          saida.push({
            slide: n, tipo: 'colisao',
            detalhe: `sobre "${outro.trecho.slice(0, 34)}"`,
            trecho,
          });
          break;
        }
      }
      ocupadas.push(meu);
    });
  });
  return saida;
});

await navegador.close();

if (achados.length === 0) {
  console.log('Nenhum estouro, nenhuma colisao. Todas as caixas cabem.');
} else {
  const porSlide = new Map();
  for (const a of achados) {
    if (!porSlide.has(a.slide)) porSlide.set(a.slide, []);
    porSlide.get(a.slide).push(a);
  }
  console.log(`${achados.length} ocorrencias em ${porSlide.size} slides:\n`);
  for (const [n, itens] of [...porSlide].sort((a, b) => a[0] - b[0])) {
    console.log(`  slide ${String(n).padStart(2, '0')}`);
    for (const it of itens) console.log(`    ${it.tipo.padEnd(16)} ${it.detalhe}\n                     "${it.trecho}"`);
  }
  process.exitCode = 1;
}
