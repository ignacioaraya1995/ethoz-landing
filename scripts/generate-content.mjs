/**
 * Content Generation Pipeline
 *
 * Usage:
 *   node scripts/generate-content.mjs --platform linkedin --pillar compliance --count 3
 *   node scripts/generate-content.mjs --platform instagram --pillar school-safety --topic "retiros escolares" --count 5
 *   node scripts/generate-content.mjs --platform youtube --pillar product --format short --count 2
 *   node scripts/generate-content.mjs --list-pillars
 *   node scripts/generate-content.mjs --list-platforms
 *
 * Posts are saved as drafts in Supabase content_posts table.
 * Review and approve them in /admin/content
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Load env
const envContent = readFileSync(resolve(root, '.env.local'), 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const KIMI_API_KEY = env.KIMI_API_KEY;
const SUPABASE_URL = env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!KIMI_API_KEY) { console.error('Missing KIMI_API_KEY'); process.exit(1); }
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('Missing SUPABASE credentials'); process.exit(1); }

// ── Platform & Pillar configs (inline to avoid TS import) ──

const PLATFORMS = {
  linkedin: {
    name: 'LinkedIn',
    audience: 'Sostenedores, directores de colegio, encargados de convivencia, coordinadores TI. Profesionales que toman decisiones de compra. Chile.',
    tone: 'Profesional pero cercano. Datos concretos. Urgencia real. Autoridad sin arrogancia.',
    formats: {
      'text-post': 'Max 3000 chars. Hook en primera línea. Saltos de línea. CTA al final con link.',
      'carousel': 'Guión para PDF de 5-10 slides. Texto de cada slide.',
      'article': 'Long-form, 800-1500 palabras con imagen de portada.',
    },
    hashtags: '3-5 hashtags al final. #EdTech #Ley21719 #ProtecciónDeDatos #Colegios #Chile',
    defaultFormat: 'text-post',
  },
  facebook: {
    name: 'Facebook',
    audience: 'Directores, apoderados informados, comunidad educativa general. Más accesible que LinkedIn.',
    tone: 'Cercano y directo. Preguntas que inviten a comentar. Historias y ejemplos reales.',
    formats: {
      'text-image': 'Texto corto (300-500 chars) + descripción de imagen. Hook con pregunta.',
      'link-share': 'Texto corto + link a blog de ethoz.cl.',
      'video': 'Guión para video corto (30-60s).',
    },
    hashtags: '2-3 hashtags: #Educación #Colegios #Chile',
    defaultFormat: 'text-image',
  },
  instagram: {
    name: 'Instagram',
    audience: 'Profesores jóvenes, coordinadores, apoderados tech-savvy. Visual-first.',
    tone: 'Visual, limpio, profesional pero humano. Emojis con moderación.',
    formats: {
      'single-image': 'Caption fluido de 200-400 chars (NO uses formato slide-by-slide). Hook potente en primera línea, valor en el medio, CTA al final. Texto continuo natural, no listas numeradas ni "Slide 1/Slide 2".',
      'carousel': 'NO uses este formato a menos que se pida explícitamente. Si se pide: 5-10 slides separadas claramente.',
      'reel': 'Guión para video vertical (15-30s). Subtítulos incluidos.',
    },
    hashtags: '10-15 hashtags al final del caption. Mix amplio/nicho.',
    defaultFormat: 'single-image',
  },
  youtube: {
    name: 'YouTube',
    audience: 'Directores y sostenedores investigando soluciones. Búsqueda intencional.',
    tone: 'Educativo y práctico. Tipo tutorial/explainer. Sin relleno.',
    formats: {
      'explainer': 'Guión completo para video de 3-8 min. Intro, contenido, CTA.',
      'short': 'Guión para YouTube Short (max 60s vertical). Hook en 3s.',
      'demo': 'Guión para demo de 5-15 min. Narración + indicaciones de screencast.',
      'pitch-video': 'Slides + narración tipo pitch (como /pitch del sitio). 2-5 min.',
    },
    hashtags: '3-5 en descripción. SEO en título importa más.',
    defaultFormat: 'short',
  },
};

const PILLARS = {
  compliance: { name: 'Cumplimiento Ley 21.719', desc: 'Plazos, multas, requisitos, qué hacer. URGENCIA.' },
  'school-safety': { name: 'Seguridad Escolar', desc: 'Retiros seguros, control de acceso, registros digitales.' },
  convivencia: { name: 'Convivencia Escolar', desc: 'Registro continuo, perfil integral, reinicio de marzo.' },
  'digital-transformation': { name: 'Transformación Digital', desc: 'Excel vs plataforma, integración, modernización.' },
  product: { name: 'Producto Ethoz', desc: 'Demos, features, integraciones, casos de uso.' },
};

// ── Args ──

const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 ? args[idx + 1] : null;
}

if (args.includes('--list-platforms')) {
  Object.entries(PLATFORMS).forEach(([id, p]) => console.log(`${id}: ${p.name} — formats: ${Object.keys(p.formats).join(', ')}`));
  process.exit(0);
}
if (args.includes('--list-pillars')) {
  Object.entries(PILLARS).forEach(([id, p]) => console.log(`${id}: ${p.name} — ${p.desc}`));
  process.exit(0);
}

const platformId = getArg('platform') || 'linkedin';
const pillarId = getArg('pillar') || 'compliance';
const formatId = getArg('format');
const topic = getArg('topic');
const count = parseInt(getArg('count') || '3', 10);

const platform = PLATFORMS[platformId];
const pillar = PILLARS[pillarId];

if (!platform) { console.error(`Unknown platform: ${platformId}. Use --list-platforms`); process.exit(1); }
if (!pillar) { console.error(`Unknown pillar: ${pillarId}. Use --list-pillars`); process.exit(1); }

const format = formatId || platform.defaultFormat;
const formatSpec = platform.formats[format];
if (!formatSpec) { console.error(`Unknown format: ${format}. Options: ${Object.keys(platform.formats).join(', ')}`); process.exit(1); }

// ── Kimi CLI ──

async function generateWithKimi(prompt) {
  console.log('  Calling Kimi CLI...');
  const { execFileSync } = await import('child_process');

  const output = execFileSync('kimi', ['--print', '--no-thinking', '-p', prompt], {
    encoding: 'utf8',
    maxBuffer: 2 * 1024 * 1024,
    timeout: 180000,
  });

  // Parse TextPart content from Kimi's structured output
  const textMatch = output.match(/TextPart\(\s*type='text',\s*text='([\s\S]*?)'\s*\)/);
  if (!textMatch) throw new Error('No TextPart found in Kimi output');

  // Unescape newlines from the Python-style string
  return textMatch[1].replace(/\\n/g, '\n').replace(/\\'/g, "'").trim();
}

// ── Save to Supabase ──

async function saveDraft(title, body, platformName, hashtags) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/content_posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      title,
      body,
      platform: platformName,
      status: 'draft',
      hashtags,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase error: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data[0];
}

// ── Main ──

async function run() {
  console.log(`\n▸ Generating ${count} ${platform.name} posts`);
  console.log(`  Pillar: ${pillar.name}`);
  console.log(`  Format: ${format}`);
  if (topic) console.log(`  Topic: ${topic}`);

  const prompt = `Eres un content strategist para Ethoz, una plataforma de protección escolar para colegios chilenos.

MARCA: Ethoz — "Protección escolar inteligente"
WEB: ethoz.cl
DEMO: ethoz.cl/demo

PLATAFORMA: ${platform.name}
AUDIENCIA: ${platform.audience}
TONO: ${platform.tone}

PILAR: ${pillar.name}
CONTEXTO: ${pillar.desc}

FORMATO: ${format}
ESPECIFICACIONES: ${formatSpec}

HASHTAGS: ${platform.hashtags}

${topic ? `TEMA ESPECÍFICO: ${topic}` : ''}

Genera ${count} posts en español para ${platform.name}.

REGLAS:
- Español chileno profesional
- Hook potente en la primera línea
- CTA claro al final (link a ethoz.cl/demo o ethoz.cl/blog/...)
- Datos concretos cuando puedas (multas 20.000 UTM, ~$1.300M CLP)
- NO emojis excesivos (max 2-3 por post, ninguno en LinkedIn)
- NO uses formato markdown (nada de **, *, #, backticks, [](). Texto plano para redes sociales)
- NO uses formato "Slide 1:", "Slide 2:" — escribe texto continuo natural
- NO uses listas numeradas con dos puntos al inicio (1., 2., etc.) salvo si es absolutamente necesario
- NO inventes datos
- La Ley 21.719 es la Ley de Protección de Datos Personales de Chile
- Ethoz complementa sistemas existentes, no los reemplaza

Para cada post, usa este formato:
TÍTULO: [título corto para identificar el post internamente]
HASHTAGS: [hashtags para este post]
---
[contenido del post]
===

Responde SOLO con los posts, sin explicaciones.`;

  const raw = await generateWithKimi(prompt);
  console.log('  ✔ Kimi generated content');

  // Parse posts
  const postBlocks = raw.split('===').filter(b => b.trim());
  let saved = 0;

  for (const block of postBlocks) {
    const titleMatch = block.match(/TÍTULO:\s*(.+)/i);
    const hashtagMatch = block.match(/HASHTAGS:\s*(.+)/i);
    const bodyParts = block.split('---');
    const body = (bodyParts[1] || bodyParts[0] || '').trim();

    if (!body) continue;

    const title = titleMatch?.[1]?.trim() || `${pillar.name} — ${platform.name} ${saved + 1}`;
    const hashtags = hashtagMatch?.[1]?.trim() || '';

    try {
      const record = await saveDraft(title, body, platformId, hashtags);
      saved++;
      console.log(`  ✔ Saved draft: "${title}" (id: ${record.id})`);
    } catch (err) {
      console.error(`  ✘ Failed to save: ${err.message}`);
    }
  }

  console.log(`\n✔ ${saved} posts saved as drafts in Supabase`);
  console.log('  Review them at: ethoz.cl/admin/content\n');
}

run().catch(console.error);
