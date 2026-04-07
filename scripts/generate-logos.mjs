import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outDir = resolve(root, 'static/logos/png');
const desktopDir = resolve(process.env.HOME, 'Desktop/ethoz-social');
mkdirSync(outDir, { recursive: true });
mkdirSync(desktopDir, { recursive: true });

const iconSvg = readFileSync(resolve(root, 'static/logos/ethoz-final-icon.svg'), 'utf8');
const lightSvg = readFileSync(resolve(root, 'static/logos/ethoz-final-light.svg'), 'utf8');
const darkSvg = readFileSync(resolve(root, 'static/logos/ethoz-final-dark.svg'), 'utf8');

function makeHTML(svgContent, width, height, bg, padding = '15%') {
  return `<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: ${width}px;
      height: ${height}px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${bg};
      overflow: hidden;
    }
    .logo {
      width: calc(100% - ${padding} * 2);
      height: calc(100% - ${padding} * 2);
      max-width: 100%;
      max-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo svg {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  </style>
</head>
<body>
  <div class="logo">${svgContent}</div>
</body>
</html>`;
}

const configs = [
  // Icon versions (square, for profile pics)
  { name: 'ethoz-icon-512', svg: iconSvg, w: 512, h: 512, bg: '#ffffff', pad: '12%' },
  { name: 'ethoz-icon-256', svg: iconSvg, w: 256, h: 256, bg: '#ffffff', pad: '12%' },
  { name: 'ethoz-icon-128', svg: iconSvg, w: 128, h: 128, bg: '#ffffff', pad: '12%' },
  { name: 'ethoz-icon-64', svg: iconSvg, w: 64, h: 64, bg: '#ffffff', pad: '10%' },
  { name: 'ethoz-icon-32', svg: iconSvg, w: 32, h: 32, bg: '#ffffff', pad: '6%' },

  // Horizontal light (white bg, dark text)
  { name: 'ethoz-horizontal-light-1024', svg: lightSvg, w: 1024, h: 256, bg: '#ffffff', pad: '8%' },
  { name: 'ethoz-horizontal-light-512', svg: lightSvg, w: 512, h: 128, bg: '#ffffff', pad: '8%' },
  { name: 'ethoz-horizontal-light-256', svg: lightSvg, w: 256, h: 64, bg: '#ffffff', pad: '8%' },

  // Horizontal dark (dark bg, light text)
  { name: 'ethoz-horizontal-dark-1024', svg: darkSvg, w: 1024, h: 256, bg: '#0F172A', pad: '8%' },
  { name: 'ethoz-horizontal-dark-512', svg: darkSvg, w: 512, h: 128, bg: '#0F172A', pad: '8%' },
  { name: 'ethoz-horizontal-dark-256', svg: darkSvg, w: 256, h: 64, bg: '#0F172A', pad: '8%' },

  // Social media special sizes
  { name: 'ethoz-linkedin-profile', svg: iconSvg, w: 400, h: 400, bg: '#ffffff', pad: '15%' },
  { name: 'ethoz-favicon-192', svg: iconSvg, w: 192, h: 192, bg: '#ffffff', pad: '10%' },
];

async function generate() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ deviceScaleFactor: 2 });

  for (const cfg of configs) {
    const page = await context.newPage();
    await page.setViewportSize({ width: cfg.w, height: cfg.h });
    const html = makeHTML(cfg.svg, cfg.w, cfg.h, cfg.bg, cfg.pad);
    await page.setContent(html, { waitUntil: 'networkidle' });

    // Wait for Inter font to load
    await page.waitForTimeout(1000);

    const outPath = resolve(outDir, `${cfg.name}.png`);
    await page.screenshot({ path: outPath, type: 'png' });
    console.log(`✔ ${cfg.name}.png (${cfg.w}x${cfg.h})`);

    // Also copy social-specific ones to desktop
    if (cfg.name.includes('linkedin') || cfg.name === 'ethoz-icon-512' || cfg.name === 'ethoz-horizontal-light-1024' || cfg.name === 'ethoz-horizontal-dark-1024') {
      const deskPath = resolve(desktopDir, `${cfg.name}.png`);
      await page.screenshot({ path: deskPath, type: 'png' });
    }

    await page.close();
  }

  await browser.close();
  console.log('\n✔ All logos generated');
}

generate().catch(console.error);
