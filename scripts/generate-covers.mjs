import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outDir = resolve(process.env.HOME, 'Desktop/ethoz-social');
mkdirSync(outDir, { recursive: true });

// Load env manually
const envContent = readFileSync(resolve(root, '.env.local'), 'utf8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('Missing GEMINI_API_KEY'); process.exit(1); }

const iconSvg = readFileSync(resolve(root, 'static/logos/ethoz-final-icon.svg'), 'utf8');

// ── Gemini image generation ──
async function generateBackground(prompt) {
  console.log('  Generating background with Gemini...');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find(p => p.inlineData);
  if (!imagePart) throw new Error('No image in response');

  return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
}

// ── Banner configs ──
const banners = [
  {
    name: 'ethoz-linkedin-banner',
    width: 1584,
    height: 396,
    bgPrompt: `Create a minimal, abstract background image for a tech company banner.
      Dimensions should work for a wide banner (4:1 ratio).
      Use a clean white (#FFFFFF) base with very subtle geometric elements:
      thin intersecting rounded rectangles in light blue (#2563EB at 5-8% opacity) and light navy (#0F172A at 3-5% opacity).
      The shapes should be large, sparse, and elegant — like an architectural blueprint.
      Add a very subtle gradient from white to light gray (#F8FAFC) from left to right.
      NO text, NO logos, NO stock photos, NO people, NO gradients with strong colors.
      The style should feel like Apple or McKinsey — confident, minimal, premium.
      Leave the left-center area relatively clear for logo placement.`,
    layout: 'linkedin',
  },
  {
    name: 'ethoz-youtube-banner',
    width: 2560,
    height: 1440,
    bgPrompt: `Create a minimal, abstract background for a YouTube channel banner.
      Dimensions: 2560x1440 (16:9).
      Use a clean white (#FFFFFF) base with very subtle geometric elements:
      thin intersecting rounded rectangles in light blue (#2563EB at 6-10% opacity) and light navy (#0F172A at 4-6% opacity).
      Large, sparse shapes distributed across the canvas — architectural and elegant.
      Subtle gradient from white to very light gray.
      NO text, NO logos, NO stock photos. Keep center area clear for content.
      Style: Apple-level minimalism, premium tech feel.`,
    layout: 'youtube',
  },
  {
    name: 'ethoz-facebook-cover',
    width: 820,
    height: 312,
    bgPrompt: `Create a minimal, abstract background for a Facebook cover image.
      Wide format (approximately 2.6:1 ratio).
      Clean white (#FFFFFF) base with very subtle geometric accents:
      thin rounded rectangles in light blue (#2563EB at 6% opacity) and navy (#0F172A at 4% opacity).
      Sparse, elegant, architectural feel. Subtle white-to-light-gray gradient.
      NO text, NO logos, NO photos. Keep center-right area clear.
      Style: minimal, professional, premium tech.`,
    layout: 'facebook',
  },
];

function makeLinkedInHTML(bgDataUrl, iconSvg, w, h) {
  return `<!DOCTYPE html><html><head>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { width: ${w}px; height: ${h}px; overflow: hidden; font-family: 'Inter', sans-serif; }
      .bg { position: absolute; inset: 0; background: url('${bgDataUrl}') center/cover no-repeat; }
      .overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 40px; padding: 0 120px; }
      .logo-mark { width: 100px; height: 100px; flex-shrink: 0; }
      .logo-mark svg { width: 100%; height: 100%; }
      .content { display: flex; flex-direction: column; gap: 8px; }
      .brand { display: flex; align-items: center; gap: 12px; }
      .brand-text { font-size: 52px; font-weight: 700; letter-spacing: -1px; }
      .brand-text .dark { color: #0F172A; }
      .brand-text .blue { color: #2563EB; }
      .tagline { font-size: 20px; font-weight: 400; color: #64748B; letter-spacing: 0.5px; }
      .divider { width: 48px; height: 3px; background: #2563EB; border-radius: 2px; margin: 4px 0; }
    </style>
  </head><body>
    <div class="bg"></div>
    <div class="overlay">
      <div class="logo-mark">${iconSvg}</div>
      <div class="content">
        <div class="brand">
          <span class="brand-text"><span class="dark">Etho</span><span class="blue">z</span></span>
        </div>
        <div class="divider"></div>
        <div class="tagline">Protección escolar inteligente</div>
      </div>
    </div>
  </body></html>`;
}

function makeYouTubeHTML(bgDataUrl, iconSvg, w, h) {
  return `<!DOCTYPE html><html><head>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { width: ${w}px; height: ${h}px; overflow: hidden; font-family: 'Inter', sans-serif; }
      .bg { position: absolute; inset: 0; background: url('${bgDataUrl}') center/cover no-repeat; }
      .safe-area { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 1546px; height: 423px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; }
      .logo-row { display: flex; align-items: center; gap: 24px; }
      .logo-mark { width: 80px; height: 80px; }
      .logo-mark svg { width: 100%; height: 100%; }
      .brand-text { font-size: 64px; font-weight: 700; letter-spacing: -1.5px; }
      .brand-text .dark { color: #0F172A; }
      .brand-text .blue { color: #2563EB; }
      .divider { width: 64px; height: 3px; background: #2563EB; border-radius: 2px; }
      .tagline { font-size: 22px; font-weight: 400; color: #64748B; letter-spacing: 0.5px; text-align: center; }
      .url { font-size: 16px; font-weight: 600; color: #2563EB; letter-spacing: 0.5px; margin-top: 8px; }
    </style>
  </head><body>
    <div class="bg"></div>
    <div class="safe-area">
      <div class="logo-row">
        <div class="logo-mark">${iconSvg}</div>
        <span class="brand-text"><span class="dark">Etho</span><span class="blue">z</span></span>
      </div>
      <div class="divider"></div>
      <div class="tagline">Protección escolar inteligente para colegios chilenos</div>
      <div class="url">ethoz.cl/demo</div>
    </div>
  </body></html>`;
}

function makeFacebookHTML(bgDataUrl, iconSvg, w, h) {
  return `<!DOCTYPE html><html><head>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { width: ${w}px; height: ${h}px; overflow: hidden; font-family: 'Inter', sans-serif; }
      .bg { position: absolute; inset: 0; background: url('${bgDataUrl}') center/cover no-repeat; }
      .overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 24px; padding: 0 60px; }
      .logo-mark { width: 64px; height: 64px; flex-shrink: 0; }
      .logo-mark svg { width: 100%; height: 100%; }
      .content { display: flex; flex-direction: column; gap: 6px; }
      .brand-text { font-size: 36px; font-weight: 700; letter-spacing: -0.5px; }
      .brand-text .dark { color: #0F172A; }
      .brand-text .blue { color: #2563EB; }
      .tagline { font-size: 15px; font-weight: 400; color: #64748B; }
    </style>
  </head><body>
    <div class="bg"></div>
    <div class="overlay">
      <div class="logo-mark">${iconSvg}</div>
      <div class="content">
        <span class="brand-text"><span class="dark">Etho</span><span class="blue">z</span></span>
        <div class="tagline">Protección escolar inteligente</div>
      </div>
    </div>
  </body></html>`;
}

const layoutRenderers = {
  linkedin: makeLinkedInHTML,
  youtube: makeYouTubeHTML,
  facebook: makeFacebookHTML,
};

async function run() {
  const browser = await chromium.launch();

  for (const banner of banners) {
    console.log(`\n▸ ${banner.name} (${banner.width}x${banner.height})`);

    // Step 1: Generate background with Gemini
    let bgDataUrl;
    try {
      bgDataUrl = await generateBackground(banner.bgPrompt);
      console.log('  ✔ Background generated');
    } catch (err) {
      console.error(`  ✘ Gemini error: ${err.message}`);
      // Fallback: use a clean gradient background
      bgDataUrl = '';
      console.log('  → Using fallback gradient background');
    }

    // Step 2: Composite with Playwright
    const context = await browser.newContext({ deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.setViewportSize({ width: banner.width, height: banner.height });

    const renderer = layoutRenderers[banner.layout];
    let html = renderer(bgDataUrl, iconSvg, banner.width, banner.height);

    // If no Gemini background, add CSS gradient fallback
    if (!bgDataUrl) {
      html = html.replace(
        "background: url('') center/cover no-repeat;",
        "background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e8eef6 100%);"
      );
    }

    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500); // Wait for fonts

    const outPath = resolve(outDir, `${banner.name}.png`);
    await page.screenshot({ path: outPath, type: 'png' });
    console.log(`  ✔ Saved: ${outPath}`);

    await context.close();
  }

  await browser.close();
  console.log('\n✔ All covers generated!');
}

run().catch(console.error);
