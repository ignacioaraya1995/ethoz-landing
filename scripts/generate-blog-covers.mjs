import { readFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outDir = resolve(root, 'static/images/blog');
mkdirSync(outDir, { recursive: true });

// Load env manually
const envContent = readFileSync(resolve(root, '.env.local'), 'utf8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('Missing GEMINI_API_KEY'); process.exit(1); }

const PROMPT_PREFIX = `Create a minimal, premium marketing image for a Chilean EdTech startup called Ethoz.

VISUAL STYLE:
- 1200x627 landscape format
- Pure white (#FFFFFF) or very light gray (#F8FAFC) background
- Abstract geometric composition with thin rounded rectangles, subtle circles, and clean lines
- Accent colors: subtle blue (#2563EB at 20-40% opacity) and dark navy (#0F172A at 15-25% opacity)
- Apple/McKinsey minimalism — premium, confident, architectural feel
- Generous negative space
- The shapes should suggest the topic metaphorically (not literally)

ABSOLUTELY NO:
- Stock photos
- People or children
- Classroom scenes
- Generic edtech imagery (globes, graduation caps, books)
- Text or words
- Heavy gradients
- Vibrant/saturated colors
- Shadows or 3D effects

The style should feel like a premium institutional report cover — serious, trustworthy, understated.

TOPIC: `;

const images = [
  {
    filename: 'agobio-docente-tecnologia-solucion.webp',
    topic: 'profesor agobiado por burocracia, tecnología como solución y liberación — representado por formas geométricas que pasan de caos a orden, de complejidad a simplicidad',
  },
  {
    filename: 'ciberacoso-escolar-chile-estadisticas.webp',
    topic: 'ciberacoso escolar, redes sociales, efecto psicológico — representado por nodos interconectados con tensión visual, líneas que convergen amenazantemente',
  },
  {
    filename: 'comparativa-plataformas-gestion-escolar.webp',
    topic: 'comparativa de software escolar, tabla comparativa visual — representado por columnas geométricas paralelas de distintas alturas, arquitectura de comparación',
  },
  {
    filename: 'desercion-escolar-chile-prevencion.webp',
    topic: 'deserción escolar, alerta temprana, inteligencia artificial prediciendo abandono — representado por una trayectoria que se quiebra y una línea de intervención que la redirige',
  },
  {
    filename: 'ficha-360-perfil-integral-alumno.webp',
    topic: 'perfil integral del alumno, ficha 360 grados, trazabilidad longitudinal — representado por círculos concéntricos o capas que rodean un centro, completitud y profundidad',
  },
  {
    filename: 'ley-21663-ciberseguridad-colegios.webp',
    topic: 'ciberseguridad, ley chilena, candado digital, protección institucional — representado por formas geométricas que encierran y protegen, geometría de seguridad y contención',
  },
  {
    filename: 'violencia-escolar-estadisticas-2025.webp',
    topic: 'violencia escolar, estadísticas preocupantes, crisis de convivencia — representado por formas geométricas con tensión visual, fragmentación controlada, datos implícitos',
  },
  {
    filename: 'whatsapp-datos-sensibles-colegios.webp',
    topic: 'riesgo de WhatsApp en colegios, datos sensibles filtrándose, alerta de privacidad — representado por formas que se escapan de un contenedor, flujo no controlado, vulnerabilidad',
  },
];

async function generateImage(topic) {
  const prompt = PROMPT_PREFIX + topic;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find(p => p.inlineData);
  if (!imagePart) {
    // Log text response for debugging
    const textPart = parts.find(p => p.text);
    throw new Error(`No image in response. Text: ${textPart?.text || JSON.stringify(data)}`);
  }

  return imagePart.inlineData.data;
}

async function run() {
  console.log(`Generating ${images.length} blog cover images...\n`);

  for (const img of images) {
    const outPath = resolve(outDir, img.filename);
    console.log(`▸ ${img.filename}`);

    try {
      const base64 = await generateImage(img.topic);
      await sharp(Buffer.from(base64, 'base64'))
        .resize(1200, 627, { fit: 'cover' })
        .webp({ quality: 85 })
        .toFile(outPath);
      console.log(`  ✔ Saved`);
    } catch (err) {
      console.error(`  ✘ Error: ${err.message}`);
    }
  }

  console.log('\nDone.');
}

run().catch(console.error);
