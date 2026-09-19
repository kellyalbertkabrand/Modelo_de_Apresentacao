/* ---------------------------------------------------------------------------
   ANIMAR

   Grava uma peca animada do sistema em video. Em vez de filmar a tela em
   tempo real, percorre a linha do tempo quadro a quadro: para cada frame,
   fixa o relogio das animacoes e captura. O resultado e deterministico —
   a mesma peca gera o mesmo video, sem quadro perdido nem tremida.

   Uso:
     node build/animar.mjs                                  -> a assinatura de projeto
     node build/animar.mjs arte/<peca>.html --segundos 5    -> outra peca
     node build/animar.mjs ... --fps 30 --formato mp4,webm

   Saida: build/saida/<nome>/<nome>.mp4 e .webm
   --------------------------------------------------------------------------- */

import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs/promises';

const RAIZ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const args = process.argv.slice(2);
const opcao = (nome, padrao) => {
  const i = args.indexOf(`--${nome}`);
  return i !== -1 ? args[i + 1] : padrao;
};
const entrada = path.resolve(RAIZ, args.find((a) => a.endsWith('.html'))
  ?? 'arte/story-assinatura-projeto-animado.html');
const FPS = Number(opcao('fps', 30));
const SEGUNDOS = Number(opcao('segundos', 5));
const FORMATOS = String(opcao('formato', 'mp4,webm')).split(',');

const nome = path.basename(entrada, '.html');
const saida = path.join(RAIZ, 'build', 'saida', nome);
const quadros = path.join(saida, 'quadros');
await fs.rm(quadros, { recursive: true, force: true });
await fs.mkdir(quadros, { recursive: true });

async function acharChromium() {
  const candidatos = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium/chrome-linux/chrome', '/usr/bin/chromium'].filter(Boolean);
  for (const c of candidatos) { try { await fs.access(c); return c; } catch { /* segue */ } }
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
const pagina = await navegador.newPage({ viewport: { width: 1080, height: 1920 } });
await pagina.goto(pathToFileURL(entrada).href, { waitUntil: 'networkidle' });
await pagina.evaluate(() => document.fonts.ready);

const { LARGURA, ALTURA } = await pagina.evaluate(() => {
  const r = document.querySelector('.slide').getBoundingClientRect();
  return { LARGURA: Math.round(r.width), ALTURA: Math.round(r.height) };
});
await pagina.setViewportSize({ width: LARGURA, height: ALTURA });

/* Congela todas as animacoes: daqui em diante quem manda no tempo e o script. */
await pagina.evaluate(() => {
  document.getAnimations().forEach((a) => a.pause());
});

const total = Math.round(FPS * SEGUNDOS);
const palco = pagina.locator('.slide').first();

for (let i = 0; i < total; i++) {
  const ms = (i / FPS) * 1000;
  await pagina.evaluate((t) => {
    document.getAnimations().forEach((a) => { a.currentTime = t; });
  }, ms);
  await palco.screenshot({ path: path.join(quadros, `q-${String(i).padStart(4, '0')}.png`) });
  if (i % 30 === 0) process.stdout.write(`  ${i}/${total} quadros\r`);
}
console.log(`  ${total}/${total} quadros`);
await navegador.close();

/* --- codificacao ---------------------------------------------------------- */

const ffmpeg = await new Promise((resolve) => {
  const p = spawn('python3', ['-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())']);
  let out = '';
  p.stdout.on('data', (d) => { out += d; });
  p.on('close', () => resolve(out.trim()));
});

function codificar(argumentos, destino) {
  return new Promise((resolve, reject) => {
    const p = spawn(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', ...argumentos]);
    p.on('close', (c) => (c === 0 ? resolve(destino) : reject(new Error(`ffmpeg saiu com ${c}`))));
  });
}

const padrao = path.join(quadros, 'q-%04d.png');
const feitos = [];

if (FORMATOS.includes('mp4')) {
  const destino = path.join(saida, `${nome}.mp4`);
  /* yuv420p e +faststart: o que faz o arquivo abrir em editor, celular e web. */
  await codificar([
    '-framerate', String(FPS), '-i', padrao,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', destino,
  ], destino);
  feitos.push(destino);
}

if (FORMATOS.includes('webm')) {
  const destino = path.join(saida, `${nome}.webm`);
  await codificar([
    '-framerate', String(FPS), '-i', padrao,
    '-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-pix_fmt', 'yuv420p', destino,
  ], destino);
  feitos.push(destino);
}

await fs.rm(quadros, { recursive: true, force: true });

console.log(`\n${SEGUNDOS}s a ${FPS}fps, ${LARGURA}x${ALTURA}:`);
for (const f of feitos) {
  const { size } = await fs.stat(f);
  console.log(`  ${path.relative(RAIZ, f)}  ${(size / 1e6).toFixed(1)} MB`);
}
