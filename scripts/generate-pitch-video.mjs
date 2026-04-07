/**
 * Generate pitch videos in 3 formats from existing /pitch slides + audio
 *
 * Output:
 *   build/videos/ethoz-pitch-16x9.mp4  (LinkedIn, Facebook)
 *   build/videos/ethoz-pitch-9x16.mp4  (Instagram Reels, YouTube Shorts)
 *   build/videos/ethoz-pitch-1x1.mp4   (Instagram feed)
 *
 * Approach:
 *   1. Render each slide as PNG using Playwright (loads /pitch with custom CSS)
 *   2. Use ffmpeg to combine PNGs (timed per slide) + pitch audio
 *
 * Usage:
 *   node scripts/generate-pitch-video.mjs              # All 3 formats
 *   node scripts/generate-pitch-video.mjs --format 9x16
 */

import { chromium } from 'playwright';
import { execFileSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outDir = resolve(root, 'media/videos');
const tmpDir = resolve(root, 'media/.video-tmp');
mkdirSync(outDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });

// ── Slides (mirror of pitch-slides.ts) ──
const slides = [
  { start: 0, end: 5, id: 'intro', subtitle: 'Les presento a Ethoz, el escudo digital diseñado para la comunidad escolar de hoy.' },
  { start: 5, end: 20, id: 'problem', subtitle: '¿Dónde está la información más sensible de los alumnos? Vive en planillas, libretas, WhatsApps... está por todos lados. Y ahí está el riesgo.' },
  { start: 20, end: 31, id: 'law', subtitle: 'Ahora se suma un nuevo desafío: la Ley 21.719 de protección de datos. Va a cambiar las reglas del juego para todos.' },
  { start: 31, end: 48, id: 'fines', subtitle: 'En diciembre de 2026, la ley entra en plena vigencia. Las multas pueden llegar hasta 20.000 UTM — más de $1.200 millones.' },
  { start: 48, end: 53, id: 'classification', subtitle: 'La ley clasifica las faltas en leves, graves y gravísimas, con sanciones para cada nivel.' },
  { start: 53, end: 58, id: 'solution', subtitle: 'Aquí entra Ethoz, el escudo digital que protege al colegio y cumple la ley.' },
  { start: 58, end: 71, id: 'features-a', subtitle: 'Centralizamos todo en una ficha 360° por alumno. Las alertas críticas llegan al instante a las personas correctas.' },
  { start: 71, end: 80, id: 'features-b', subtitle: 'En portería, validan quién retira a un alumno en segundos. Cada persona ve solo lo que necesita.' },
  { start: 80, end: 92, id: 'implementation', subtitle: 'Implementarlo es fácil. Conectamos el colegio, migramos los datos y listo. En semanas, el equipo ya está funcionando.' },
  { start: 92, end: 99, id: 'security', subtitle: 'Cifrado de nivel bancario y todos los datos se guardan de forma segura aquí en Chile.' },
  { start: 99, end: 109, id: 'urgency', subtitle: 'La ley no espera. Para 2026 abrimos un programa piloto.' },
  { start: 109, end: 116.15, id: 'cta', subtitle: 'Cupos limitados. Agenden su demo en ethoz.cl' },
];

const FORMATS = {
  '16x9': { width: 1920, height: 1080, label: '16:9 (LinkedIn / Facebook)' },
  '9x16': { width: 1080, height: 1920, label: '9:16 (Instagram Reels / YouTube Shorts)' },
  '1x1': { width: 1080, height: 1080, label: '1:1 (Instagram feed)' },
};

// ── Args ──
const args = process.argv.slice(2);
function getArg(name) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
}
const formatFilter = getArg('format');

// ── Generate slide HTML ──
function makeSlideHTML(slide, format, slideIndex, totalSlides) {
  const isVertical = format === '9x16';
  const isSquare = format === '1x1';
  const fontSize = isVertical ? 56 : isSquare ? 52 : 48;
  const padding = isVertical ? '8%' : '10%';
  const accentColor = '#2563EB';

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  width: ${FORMATS[format].width}px;
  height: ${FORMATS[format].height}px;
  background: #ffffff;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
}

/* Background pattern: subtle geometric shapes */
.bg-shapes {
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image:
    radial-gradient(circle at 20% 20%, ${accentColor} 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, #0F172A 0%, transparent 40%);
}

/* Top bar with logo */
.top {
  position: absolute;
  top: ${isVertical ? '60px' : '40px'};
  left: ${padding};
  right: ${padding};
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
}
.logo-mark {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo-mark svg { width: ${isVertical ? 48 : 40}px; height: ${isVertical ? 48 : 40}px; }
.brand {
  font-size: ${isVertical ? 32 : 26}px;
  font-weight: 800;
  letter-spacing: -1px;
}
.brand .dark { color: #0F172A; }
.brand .blue { color: ${accentColor}; }
.counter {
  font-size: ${isVertical ? 16 : 14}px;
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Main content */
.center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${isVertical ? '180px ' + padding + ' 200px' : padding};
}
.text {
  font-size: ${fontSize}px;
  font-weight: 700;
  line-height: 1.25;
  color: #0F172A;
  text-align: center;
  letter-spacing: -1px;
  max-width: 90%;
}
.text .accent { color: ${accentColor}; }

/* Bottom CTA bar */
.bottom {
  position: absolute;
  bottom: ${isVertical ? '80px' : '40px'};
  left: ${padding};
  right: ${padding};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 10;
}
.url {
  font-size: ${isVertical ? 24 : 20}px;
  font-weight: 700;
  color: ${accentColor};
  letter-spacing: 0.5px;
}
.divider {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #cbd5e1;
}
.tagline {
  font-size: ${isVertical ? 18 : 16}px;
  color: #64748b;
  font-weight: 500;
}

/* Accent line */
.accent-line {
  position: absolute;
  bottom: ${isVertical ? '160px' : '110px'};
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  height: 4px;
  background: ${accentColor};
  border-radius: 2px;
}
</style>
</head>
<body>
<div class="bg-shapes"></div>

<div class="top">
  <div class="logo-mark">
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="7" width="18" height="22" rx="4.5" fill="none" stroke="#0F172A" stroke-width="2.4"/>
      <rect x="12" y="3" width="18" height="22" rx="4.5" fill="none" stroke="${accentColor}" stroke-width="2.4"/>
    </svg>
    <span class="brand"><span class="dark">Etho</span><span class="blue">z</span></span>
  </div>
  <div class="counter">${String(slideIndex + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}</div>
</div>

<div class="center">
  <div class="text">${slide.subtitle.replace(/Ethoz/g, '<span class="accent">Ethoz</span>').replace(/Ley 21\.719/g, '<span class="accent">Ley 21.719</span>').replace(/20\.000 UTM/g, '<span class="accent">20.000 UTM</span>')}</div>
</div>

<div class="accent-line"></div>

<div class="bottom">
  <span class="url">ethoz.cl/demo</span>
  <span class="divider"></span>
  <span class="tagline">Protección escolar inteligente</span>
</div>
</body>
</html>`;
}

// ── Render slides ──
async function renderSlides(format) {
  console.log(`\n▸ Rendering ${slides.length} slides for ${format}...`);
  const browser = await chromium.launch();
  const context = await browser.newContext({ deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.setViewportSize({ width: FORMATS[format].width, height: FORMATS[format].height });

  const slideFiles = [];
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const html = makeSlideHTML(slide, format, i, slides.length);
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800); // wait for fonts

    const filePath = resolve(tmpDir, `slide-${format}-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: filePath, type: 'png' });
    slideFiles.push({ path: filePath, duration: slide.end - slide.start });
    console.log(`  ✔ Slide ${i + 1}/${slides.length}`);
  }

  await browser.close();
  return slideFiles;
}

// ── Build video with ffmpeg ──
function buildVideo(slideFiles, format) {
  console.log(`\n▸ Encoding ${format} video with ffmpeg...`);

  // Create concat list file
  const listPath = resolve(tmpDir, `list-${format}.txt`);
  const lines = slideFiles.map((s) => `file '${s.path}'\nduration ${s.duration}`);
  // Last file needs to be repeated without duration (ffmpeg quirk)
  lines.push(`file '${slideFiles[slideFiles.length - 1].path}'`);
  writeFileSync(listPath, lines.join('\n'));

  const audioPath = resolve(root, 'static/audio/pitch.m4a');
  const outputPath = resolve(outDir, `ethoz-pitch-${format}.mp4`);

  // Remove existing
  if (existsSync(outputPath)) rmSync(outputPath);

  // ffmpeg: concat images at their durations + add audio + encode
  execFileSync('ffmpeg', [
    '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', listPath,
    '-i', audioPath,
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-r', '30',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    '-movflags', '+faststart',
    outputPath,
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  console.log(`  ✔ Saved: ${outputPath}`);
  return outputPath;
}

// ── Main ──
async function run() {
  console.log('\n▸ Ethoz Pitch Video Generator');

  const formats = formatFilter ? [formatFilter] : Object.keys(FORMATS);

  for (const format of formats) {
    if (!FORMATS[format]) {
      console.error(`Unknown format: ${format}`);
      continue;
    }

    console.log(`\n=== Format: ${format} (${FORMATS[format].label}) ===`);

    const slideFiles = await renderSlides(format);
    const videoPath = buildVideo(slideFiles, format);

    console.log(`✔ ${format}: ${videoPath}`);
  }

  console.log('\n✔ Done\n');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
