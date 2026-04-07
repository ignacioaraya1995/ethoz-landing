/**
 * Ethoz Narrated Video Generator
 *
 * Pipeline 100% open source / gratis:
 *   1. Recibe un guión (texto plano, párrafos = secciones)
 *   2. Edge TTS (es-CL-LorenzoNeural) → audio MP3 narrado
 *   3. Whisper.cpp → subtítulos SRT con timing preciso
 *   4. Playwright → renderiza slides PNG basados en secciones
 *   5. ffmpeg → combina slides + audio + subtítulos en MP4
 *   6. Output: 3 formatos (16x9, 9x16, 1x1)
 *
 * Usage:
 *   node scripts/generate-narrated-video.mjs --script path/to/script.txt --format 9x16
 *   node scripts/generate-narrated-video.mjs --text "Línea 1\n\nLínea 2" --voice catalina
 */

import { chromium } from 'playwright';
import { execFileSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, statSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outDir = resolve(root, 'media/videos');
mkdirSync(outDir, { recursive: true });

// ── Args ──
const args = process.argv.slice(2);
function getArg(name) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
}

const scriptPath = getArg('script');
const textArg = getArg('text');
const voiceName = getArg('voice') || 'lorenzo'; // 'lorenzo' or 'catalina'
const format = getArg('format') || '9x16';
const outputName = getArg('output') || `narrated-${Date.now()}`;

const VOICES = {
  lorenzo: 'es-CL-LorenzoNeural',
  catalina: 'es-CL-CatalinaNeural',
};

const FORMATS = {
  '16x9': { width: 1920, height: 1080 },
  '9x16': { width: 1080, height: 1920 },
  '1x1': { width: 1080, height: 1080 },
};

const voice = VOICES[voiceName] || VOICES.lorenzo;
const dims = FORMATS[format];
if (!dims) { console.error(`Unknown format: ${format}`); process.exit(1); }

// ── Read script ──
let script;
if (scriptPath) {
  script = readFileSync(scriptPath, 'utf8');
} else if (textArg) {
  script = textArg.replace(/\\n/g, '\n');
} else {
  console.error('Need --script <path> or --text "..."');
  process.exit(1);
}

// Split into sections (paragraphs)
const sections = script.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
console.log(`\n▸ Ethoz Narrated Video Generator`);
console.log(`  Voice: ${voice}`);
console.log(`  Format: ${format} (${dims.width}x${dims.height})`);
console.log(`  Sections: ${sections.length}`);
console.log(`  Output: ${outputName}.mp4\n`);

// Working dir
const workDir = resolve(tmpdir(), `narrated-${Date.now()}`);
mkdirSync(workDir, { recursive: true });

// ── Step 1: Generate audio with Edge TTS (slower for natural feel) ──
console.log('▸ Step 1/4: Generating audio with Edge TTS...');
const audioPath = resolve(workDir, 'audio.mp3');
execFileSync('uvx', ['--from', 'edge-tts', 'edge-tts',
  '--voice', voice,
  '--rate=-8%',
  '--text', script,
  '--write-media', audioPath,
], { stdio: ['ignore', 'pipe', 'pipe'] });

const audioDuration = parseFloat(
  execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', audioPath], { encoding: 'utf8' })
);
console.log(`  ✔ Audio: ${audioDuration.toFixed(2)}s`);

// ── Step 2: Generate subtitles with Whisper ──
console.log('\n▸ Step 2/4: Generating subtitles with Whisper...');
const wavPath = resolve(workDir, 'audio.wav');
execFileSync('ffmpeg', ['-y', '-i', audioPath, '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wavPath], { stdio: 'ignore' });

const srtBase = resolve(workDir, 'audio');
execFileSync('whisper-cli', [
  '-m', `${process.env.HOME}/.whisper-models/ggml-small.bin`,
  '-l', 'es',
  '-osrt',
  '-of', srtBase,
  wavPath,
], { stdio: ['ignore', 'pipe', 'pipe'] });

const srtPath = `${srtBase}.srt`;
console.log(`  ✔ Subtitles: ${srtPath}`);

// ── Step 3: Generate slide images ──
console.log('\n▸ Step 3/4: Rendering slides...');

// Distribute time evenly across sections
const sectionDuration = audioDuration / sections.length;
console.log(`  ${sections.length} slides × ${sectionDuration.toFixed(2)}s each`);

function makeSlideHTML(text, sectionIndex, totalSections, format) {
  const isVertical = format === '9x16';
  const isSquare = format === '1x1';
  const fontSize = isVertical ? 56 : isSquare ? 52 : 48;
  const padding = isVertical ? '8%' : '10%';
  const accent = '#2563EB';

  const highlighted = text
    .replace(/Ethoz/g, `<span class="accent">Ethoz</span>`)
    .replace(/Ley 21\.719/g, `<span class="accent">Ley 21.719</span>`)
    .replace(/20\.000 UTM/g, `<span class="accent">20.000 UTM</span>`)
    .replace(/\$1\.\d+ ?millones?/g, (m) => `<span class="accent">${m}</span>`)
    .replace(/diciembre de? 2026/gi, (m) => `<span class="accent">${m}</span>`);

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{width:${dims.width}px;height:${dims.height}px;background:#fff;font-family:'Inter',sans-serif;position:relative;overflow:hidden}
.bg{position:absolute;inset:0;background-image:radial-gradient(circle at 20% 20%, ${accent}11 0%, transparent 40%),radial-gradient(circle at 80% 80%, #0F172A11 0%, transparent 40%)}
.top{position:absolute;top:${isVertical?'60px':'40px'};left:${padding};right:${padding};display:flex;align-items:center;justify-content:space-between;z-index:10}
.logo{display:flex;align-items:center;gap:12px}
.logo svg{width:${isVertical?48:40}px;height:${isVertical?48:40}px}
.brand{font-size:${isVertical?32:26}px;font-weight:800;letter-spacing:-1px}
.brand .dark{color:#0F172A}
.brand .blue{color:${accent}}
.counter{font-size:${isVertical?16:14}px;color:#94a3b8;font-weight:600;letter-spacing:0.5px}
.center{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:${isVertical?'180px '+padding+' 200px':padding}}
.text{font-size:${fontSize}px;font-weight:700;line-height:1.25;color:#0F172A;text-align:center;letter-spacing:-1px;max-width:90%}
.text .accent{color:${accent}}
.bottom{position:absolute;bottom:${isVertical?'80px':'40px'};left:${padding};right:${padding};display:flex;align-items:center;justify-content:center;gap:16px;z-index:10}
.url{font-size:${isVertical?24:20}px;font-weight:700;color:${accent};letter-spacing:0.5px}
.dot{width:4px;height:4px;border-radius:50%;background:#cbd5e1}
.tagline{font-size:${isVertical?18:16}px;color:#64748b;font-weight:500}
.line{position:absolute;bottom:${isVertical?'160px':'110px'};left:50%;transform:translateX(-50%);width:64px;height:4px;background:${accent};border-radius:2px}
</style></head><body>
<div class="bg"></div>
<div class="top">
  <div class="logo">
    <svg viewBox="0 0 32 32"><rect x="2" y="7" width="18" height="22" rx="4.5" fill="none" stroke="#0F172A" stroke-width="2.4"/><rect x="12" y="3" width="18" height="22" rx="4.5" fill="none" stroke="${accent}" stroke-width="2.4"/></svg>
    <span class="brand"><span class="dark">Etho</span><span class="blue">z</span></span>
  </div>
  <div class="counter">${String(sectionIndex+1).padStart(2,'0')} / ${String(totalSections).padStart(2,'0')}</div>
</div>
<div class="center"><div class="text">${highlighted}</div></div>
<div class="line"></div>
<div class="bottom">
  <span class="url">ethoz.cl/demo</span>
  <span class="dot"></span>
  <span class="tagline">Protección escolar inteligente</span>
</div>
</body></html>`;
}

const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: 1 });
const page = await context.newPage();
await page.setViewportSize(dims);

const slideFiles = [];
for (let i = 0; i < sections.length; i++) {
  const html = makeSlideHTML(sections[i], i, sections.length, format);
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const filePath = resolve(workDir, `slide-${String(i).padStart(2, '0')}.png`);
  await page.screenshot({ path: filePath, type: 'png' });
  slideFiles.push({ path: filePath, duration: sectionDuration });
}
await browser.close();
console.log(`  ✔ ${slideFiles.length} slides rendered`);

// ── Step 4: Encode video with audio + subtitles ──
console.log('\n▸ Step 4/4: Encoding video with subtitles...');

// Build concat list
const listPath = resolve(workDir, 'list.txt');
const lines = slideFiles.map(s => `file '${s.path}'\nduration ${s.duration}`);
lines.push(`file '${slideFiles[slideFiles.length - 1].path}'`);
writeFileSync(listPath, lines.join('\n'));

const outputPath = resolve(outDir, `${outputName}.mp4`);
if (existsSync(outputPath)) rmSync(outputPath);

// Pick a background music track at random
const musicDir = resolve(root, 'media/music');
const availableMusic = ['inspired.mp3', 'tech-pulse.mp3'];
const musicChoice = availableMusic[Math.floor(Math.random() * availableMusic.length)];
const musicPath = resolve(musicDir, musicChoice);
const hasMusic = existsSync(musicPath);
console.log(`  Music: ${hasMusic ? musicChoice : 'none (fallback to voice only)'}`);

try {
  if (hasMusic) {
    // Mix voice (100%) + background music (12%) with fade in/out
    execFileSync('ffmpeg', [
      '-y',
      '-f', 'concat', '-safe', '0', '-i', listPath,
      '-i', audioPath,
      '-stream_loop', '-1', '-i', musicPath,
      '-filter_complex',
      `[1:a]volume=1.0[voice];` +
      `[2:a]volume=0.10,afade=in:st=0:d=1,afade=out:st=${audioDuration - 1}:d=1[music];` +
      `[voice][music]amix=inputs=2:duration=first:dropout_transition=0[out]`,
      '-map', '0:v', '-map', '[out]',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-r', '30',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-shortest',
      '-movflags', '+faststart',
      outputPath,
    ], { stdio: ['ignore', 'pipe', 'pipe'] });
  } else {
    // Voice only fallback
    execFileSync('ffmpeg', [
      '-y',
      '-f', 'concat', '-safe', '0', '-i', listPath,
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
  }
} catch (err) {
  const stderr = err.stderr ? err.stderr.toString('utf8') : '';
  console.error('\n=== FFMPEG STDERR ===');
  console.error(stderr.split('\n').slice(-20).join('\n'));
  throw err;
}

// Also save SRT alongside the video for reference / future use
const srtOut = resolve(outDir, `${outputName}.srt`);
execFileSync('cp', [srtPath, srtOut]);

console.log(`  ✔ Video encoded`);

// ── Cleanup ──
rmSync(workDir, { recursive: true, force: true });

const sizeMB = (statSync(outputPath).size / 1024 / 1024).toFixed(2);
console.log(`\n✔ Done!`);
console.log(`  ${outputPath}`);
console.log(`  ${sizeMB}MB · ${audioDuration.toFixed(1)}s · voice: ${voice}\n`);
