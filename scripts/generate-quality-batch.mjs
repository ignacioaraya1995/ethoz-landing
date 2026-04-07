/**
 * Quality content generation using marketing psychology principles
 * for the Ethoz brand. Single batch with platform-specific tone.
 *
 * Usage: node scripts/generate-quality-batch.mjs
 *
 * Generates:
 *   - 3 Instagram posts (single-image format)
 *   - 2 LinkedIn corporate posts
 *
 * Uses Kimi CLI with Ethoz-specific prompts that apply:
 *   - Loss aversion (multas, riesgo legal)
 *   - Authority (datos concretos, fechas)
 *   - Social proof / specificity
 *   - Pattern interrupts (hooks que cortan el scroll)
 */

import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ── Load env ──
const envContent = readFileSync(resolve(root, '.env.local'), 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
}
const SUPABASE_URL = env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

// ── Audience profiles per platform ──
const AUDIENCES = {
  instagram: {
    primary: 'Profesores jóvenes (28-40), coordinadores académicos, encargados de convivencia, apoderados profesionales tech-savvy. Personas que pasan tiempo en IG y forman opinión.',
    pain: 'Sienten que su colegio está atrasado tecnológicamente. Les preocupa la seguridad de los alumnos. Quieren validar que su institución es moderna y profesional.',
    motivation: 'Compartir contenido que los haga ver inteligentes/informados. Sentirse parte de una comunidad educativa moderna.',
    tone: 'Visual-first, profesional pero humano, accesible. Como un colega que sabe del tema. Frases cortas. Espacios. Cero corporativo. 1-2 emojis máximo.',
    cta: 'Implícito o suave. "Conoce más", "Te lo cuento en bio". Link en bio a ethoz.cl/demo.',
  },
  linkedin: {
    primary: 'Sostenedores de colegios (decisión de compra), directores ejecutivos de fundaciones educacionales, gerentes de TI educacional, abogados de derecho educacional. 35-60 años.',
    pain: 'Responsabilidad legal directa. Riesgo de multas millonarias. Presión por modernizar sin presupuesto. Necesitan evidencia para convencer al directorio.',
    motivation: 'Tomar decisiones defendibles. Mostrar liderazgo. Reducir riesgos institucionales antes que ocurran.',
    tone: 'Profesional, denso en datos, autoritativo sin ser arrogante. Hooks fuertes. Estructura clara. Cero emojis. Saltos de línea para escaneo rápido.',
    cta: 'Directo. "Agenda una conversación", "Hablemos antes del 2026".',
  },
};

// ── Posts to generate ──
const POSTS = [
  // 3 Instagram posts
  {
    platform: 'instagram',
    title: 'IG-Hook-Multa',
    angle: 'loss-aversion',
    topic: 'El costo real de no cumplir la Ley 21.719 — multa específica y comparación visual ($1.300 millones = ¿cuántos sueldos de profesores? ¿cuántos años de matrícula?). Hook fuerte que detenga el scroll.',
  },
  {
    platform: 'instagram',
    title: 'IG-Reinicio-Marzo',
    angle: 'pain-point-vivid',
    topic: 'El "reinicio de marzo" — esa frustración de empezar el año sin saber qué pasó con cada alumno el año anterior. Habla del profesor jefe que pierde 3 meses solo para "conocer" a su nuevo curso porque la información no se traspasa.',
  },
  {
    platform: 'instagram',
    title: 'IG-Excel-No-Cumple',
    angle: 'authority-revelation',
    topic: 'Por qué Excel no cumple con la Ley 21.719 — 3 razones técnicas concretas (sin control de acceso por usuario, sin audit trail, sin encriptación at-rest). Tono profesor explicando algo importante.',
  },
  // 2 LinkedIn corporate posts
  {
    platform: 'linkedin',
    title: 'LI-Datos-Sostenedores',
    angle: 'authority-data',
    topic: 'Análisis: De los 12.038 colegios chilenos, solo el X% tiene controles de acceso digital documentados. Cita la Ley 21.719 y la fecha de entrada en vigencia. Posiciona a Ethoz como la solución que llega antes que la fiscalización. Datos específicos.',
  },
  {
    platform: 'linkedin',
    title: 'LI-Director-Decision',
    angle: 'social-proof-implicit',
    topic: 'Carta abierta de un director ficticio (perspectiva en primera persona) explicando por qué su colegio adoptó Ethoz: la decisión, las objeciones del directorio, los resultados. Tono honesto, sin marketing-speak. Fortalece autoridad por demostración.',
  },
];

// ── Kimi prompt builder ──
function buildPrompt(post) {
  const audience = AUDIENCES[post.platform];

  return `Eres un copywriter senior que escribe para Ethoz, una plataforma chilena de protección de datos escolares y cumplimiento de la Ley 21.719.

CONTEXTO DEL NEGOCIO:
- Ethoz NO reemplaza sistemas escolares, los complementa (Napsis, Syscol, SchoolTrack)
- Ley 21.719 entra en vigencia diciembre 2026
- Multas: hasta 20.000 UTM ≈ $1.300 millones CLP
- Audiencia objetivo en Chile (colegios particulares y subvencionados)
- Tagline: "Protección escolar inteligente"

PLATAFORMA: ${post.platform.toUpperCase()}

AUDIENCIA OBJETIVO:
${audience.primary}

DOLOR DE LA AUDIENCIA:
${audience.pain}

MOTIVACIÓN DE LA AUDIENCIA:
${audience.motivation}

TONO REQUERIDO:
${audience.tone}

CTA:
${audience.cta}

ÁNGULO PSICOLÓGICO: ${post.angle}

TEMA:
${post.topic}

REGLAS DE ESCRITURA (NO NEGOCIABLES):
- Español chileno profesional. NO modismos, NO slang.
- Hook potente en la PRIMERA LÍNEA — debe cortar el scroll.
- Datos concretos cuando puedas. No inventes.
- ${post.platform === 'instagram' ? '200-400 caracteres total. Texto continuo natural, NO formato "Slide 1, Slide 2".' : 'Hasta 1500 caracteres. Saltos de línea estratégicos. Estructura: hook → contexto → revelación → CTA.'}
- ${post.platform === 'instagram' ? '1-2 emojis máximo, solo si suman al mensaje.' : 'CERO emojis.'}
- NO formato markdown (nada de **, *, #, backticks).
- NO frases vacías como "en estos tiempos modernos" o "transformación digital".
- NO hyperbole ("revolucionario", "el mejor del mundo").
- CTA con link específico: ethoz.cl/demo (o ethoz.cl si es informativo).
- ${post.platform === 'instagram' ? 'Hashtags: 8-12 al final del caption, mix amplio + nicho. Ejemplo: #ColegiosChile #Ley21719 #ProtecciónDatos #EduChile #EdTechChile #SeguridadEscolar #GestionEducativa #DirectoresChile' : 'Hashtags: 3-4 al final. Ejemplo: #Ley21719 #ProtecciónDeDatos #EdTech #Chile'}

FORMATO DE SALIDA (responde SOLO esto, sin texto adicional):

TÍTULO: [título interno corto, 5-7 palabras]
HASHTAGS: [los hashtags]
---
[el contenido del post limpio]`;
}

// ── Kimi CLI call ──
function generateWithKimi(prompt) {
  const output = execFileSync('kimi', ['--print', '--no-thinking', '-p', prompt], {
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
    timeout: 180000,
  });
  const m = output.match(/TextPart\(\s*type='text',\s*text='([\s\S]*?)'\s*\)/);
  if (!m) throw new Error('No TextPart in Kimi output');
  return m[1].replace(/\\n/g, '\n').replace(/\\'/g, "'").trim();
}

// ── Save to Supabase ──
async function saveDraft(post, generatedContent) {
  const titleMatch = generatedContent.match(/TÍTULO:\s*(.+)/i);
  const hashtagMatch = generatedContent.match(/HASHTAGS:\s*(.+)/i);
  const bodyParts = generatedContent.split('---');
  const body = (bodyParts[1] || bodyParts[0] || '').trim();

  const title = titleMatch?.[1]?.trim() || post.title;
  const hashtags = hashtagMatch?.[1]?.trim() || '';

  // Strip any leftover markdown
  const cleanBody = body
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^#{1,3}\s+/gm, '')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .trim();

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
      body: cleanBody,
      platform: post.platform,
      status: 'draft',
      hashtags,
    }),
  });

  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return (await res.json())[0];
}

// ── Main ──
async function run() {
  console.log('\n▸ Quality Content Batch Generator (Ethoz)');
  console.log(`  Generating ${POSTS.length} posts with marketing psychology\n`);

  let saved = 0;
  for (const post of POSTS) {
    try {
      console.log(`▸ ${post.title} (${post.platform}, ${post.angle})`);
      console.log(`  Calling Kimi...`);
      const content = generateWithKimi(buildPrompt(post));
      const record = await saveDraft(post, content);
      console.log(`  ✔ Saved: "${record.title}" (id: ${record.id.slice(0, 8)})`);
      console.log(`  Preview: ${record.body.slice(0, 100)}...\n`);
      saved++;
    } catch (err) {
      console.error(`  ✘ Failed: ${err.message}\n`);
    }
  }

  console.log(`\n✔ ${saved}/${POSTS.length} posts saved as drafts in Supabase`);
  console.log('  Review them at: ethoz.cl/admin/content\n');
}

run().catch(console.error);
