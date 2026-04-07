/**
 * Ethoz Content Strategy — Audiences, Formats, and Platform Rules
 *
 * This is the single source of truth for content generation.
 * Used by the content pipeline to generate platform-appropriate content.
 */

export interface PlatformConfig {
  id: 'linkedin' | 'facebook' | 'instagram' | 'youtube';
  name: string;
  audience: string;
  tone: string;
  formats: FormatConfig[];
  hashtagStrategy: string;
  bestTimes: string;
  frequency: string;
}

export interface FormatConfig {
  type: string;
  specs: string;
  description: string;
}

export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    audience: 'Sostenedores, directores de colegio, encargados de convivencia, coordinadores TI, abogados educacionales. Profesionales que toman decisiones de compra o influyen en ellas. Chile.',
    tone: 'Profesional pero cercano. Sin jerga técnica innecesaria. Datos concretos. Urgencia real (fechas de ley, multas). Autoridad sin arrogancia.',
    formats: [
      { type: 'text-post', specs: 'Max 3000 chars. Hook en primera línea. Saltos de línea para legibilidad. CTA al final con link.', description: 'Post de texto puro — el formato con más alcance orgánico' },
      { type: 'carousel', specs: 'PDF de 5-10 slides. 1080x1350px cada slide. Texto grande legible en móvil.', description: 'Contenido educativo tipo "5 pasos para cumplir la ley"' },
      { type: 'article', specs: 'Long-form. 800-1500 palabras. Con imagen de portada.', description: 'Para temas profundos — compliance, guías, análisis' },
    ],
    hashtagStrategy: '3-5 hashtags al final. Mezcla de amplios (#EdTech #Chile) y nicho (#Ley21719 #ProtecciónDeDatos #ConvivenciaEscolar). No más de 5.',
    bestTimes: 'Martes a jueves, 8:00-9:30 AM o 12:00-1:00 PM (hora Chile)',
    frequency: '3x por semana (lunes, miércoles, viernes)',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    audience: 'Directores de colegio, apoderados informados, comunidad educativa general. Más amplio que LinkedIn. Tono más accesible.',
    tone: 'Cercano y directo. Preguntas que inviten a comentar. Historias y ejemplos reales. Menos corporativo que LinkedIn.',
    formats: [
      { type: 'text-image', specs: 'Texto corto (300-500 chars) + imagen 1200x630px. Hook con pregunta.', description: 'Post con imagen — el formato estándar' },
      { type: 'video', specs: 'MP4, 1080x1920 (vertical) o 1920x1080 (horizontal). Max 60s para feed, 15s para reels.', description: 'Video corto explicativo o demo' },
      { type: 'link-share', specs: 'Texto corto + link a blog de ethoz.cl. La preview se genera automática.', description: 'Compartir artículos del blog' },
    ],
    hashtagStrategy: '2-3 hashtags máximo. Facebook no es hashtag-heavy. #Educación #Colegios #Chile',
    bestTimes: 'Miércoles a viernes, 12:00-3:00 PM (hora Chile)',
    frequency: '2-3x por semana',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    audience: 'Profesores jóvenes, coordinadores, apoderados tech-savvy. Visual-first. Más aspiracional y emocional.',
    tone: 'Visual, limpio, profesional pero humano. Emojis con moderación. Stories para behind-the-scenes. Reels para alcance.',
    formats: [
      { type: 'carousel', specs: '1080x1350px, 5-10 slides. Primera slide = hook visual fuerte. Última = CTA.', description: 'Carruseles educativos — mejor formato para engagement' },
      { type: 'reel', specs: 'MP4, 1080x1920 (9:16 vertical). 15-30 segundos. Subtítulos obligatorios.', description: 'Video corto — máximo alcance orgánico' },
      { type: 'single-image', specs: '1080x1080px (cuadrado) o 1080x1350px (vertical). Diseño limpio.', description: 'Imagen única con dato o cita impactante' },
      { type: 'story', specs: '1080x1920px. Efímero (24h). Polls, preguntas, behind-the-scenes.', description: 'Engagement diario y humanización de marca' },
    ],
    hashtagStrategy: '10-15 hashtags. Mix: 5 amplios (#educación #colegios), 5 medianos (#gestióescolar #edtech), 5 nicho (#ley21719 #proteccióndatos). En primer comentario, no en el caption.',
    bestTimes: 'Lunes a jueves, 11:00 AM-1:00 PM y 7:00-9:00 PM (hora Chile)',
    frequency: '4-5x por semana (feed + stories)',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    audience: 'Directores y sostenedores investigando soluciones. Profesores buscando herramientas. Búsqueda intencional (SEO-driven).',
    tone: 'Educativo y práctico. Tipo tutorial/explainer. Sin relleno — ir al grano. Profesional pero no aburrido.',
    formats: [
      { type: 'explainer', specs: 'MP4, 1920x1080. 3-8 min. Intro de 15s, contenido, CTA. Thumbnail 1280x720.', description: 'Video explicativo — "Qué es la Ley 21.719 y cómo afecta a tu colegio"' },
      { type: 'demo', specs: 'MP4, 1920x1080. 5-15 min. Screencast de la plataforma con narración.', description: 'Demo de producto — mostrar funcionalidades' },
      { type: 'short', specs: 'MP4, 1080x1920 (vertical). Max 60s. Subtítulos. Hook en 3s.', description: 'YouTube Shorts — clips rápidos, tips, datos' },
      { type: 'pitch-video', specs: 'MP4 generado desde slides + audio (como /pitch). 2-5 min.', description: 'Presentación tipo pitch con slides sincronizadas — ya tenemos el sistema' },
    ],
    hashtagStrategy: '3-5 en descripción. SEO en título y descripción importa más que hashtags.',
    bestTimes: 'Jueves a sábado, 2:00-4:00 PM (hora Chile)',
    frequency: '1-2x por semana',
  },
];

// ── Content pillars (temas recurrentes) ──

export const CONTENT_PILLARS = [
  {
    id: 'compliance',
    name: 'Cumplimiento Ley 21.719',
    description: 'Plazos, multas, requisitos, qué hacer. URGENCIA.',
    platforms: ['linkedin', 'facebook', 'youtube', 'instagram'],
    keywords: ['Ley 21.719', 'protección de datos', 'multas', 'cumplimiento', 'normativa'],
  },
  {
    id: 'school-safety',
    name: 'Seguridad Escolar',
    description: 'Retiros seguros, control de acceso, registros digitales.',
    platforms: ['linkedin', 'facebook', 'instagram'],
    keywords: ['retiros escolares', 'seguridad escolar', 'portería', 'control acceso'],
  },
  {
    id: 'convivencia',
    name: 'Convivencia Escolar',
    description: 'Registro continuo, perfil integral, reinicio de marzo.',
    platforms: ['linkedin', 'facebook', 'instagram'],
    keywords: ['convivencia escolar', 'perfil alumno', 'seguimiento', 'reinicio marzo'],
  },
  {
    id: 'digital-transformation',
    name: 'Transformación Digital',
    description: 'Excel vs plataforma, integración, modernización sin dolor.',
    platforms: ['linkedin', 'youtube'],
    keywords: ['transformación digital', 'gestión escolar', 'digitalización', 'integración'],
  },
  {
    id: 'product',
    name: 'Producto Ethoz',
    description: 'Demos, features, integraciones, casos de uso.',
    platforms: ['youtube', 'linkedin', 'instagram'],
    keywords: ['Ethoz', 'demo', 'plataforma', 'funcionalidades'],
  },
];

// ── Kimi prompt builder ──

export function buildKimiPrompt(opts: {
  platform: PlatformConfig;
  pillar: typeof CONTENT_PILLARS[number];
  format: FormatConfig;
  topic?: string;
  count?: number;
}): string {
  const { platform, pillar, format, topic, count = 1 } = opts;

  return `Eres un content strategist para Ethoz, una plataforma de protección escolar para colegios chilenos.

MARCA: Ethoz — "Protección escolar inteligente"
WEB: ethoz.cl
DEMO: ethoz.cl/demo

PLATAFORMA: ${platform.name}
AUDIENCIA: ${platform.audience}
TONO: ${platform.tone}

PILAR DE CONTENIDO: ${pillar.name}
CONTEXTO: ${pillar.description}

FORMATO: ${format.type}
ESPECIFICACIONES: ${format.specs}

HASHTAGS: ${platform.hashtagStrategy}

${topic ? `TEMA ESPECÍFICO: ${topic}` : ''}

Genera ${count} ${count === 1 ? 'post' : 'posts'} en español para ${platform.name}.

REGLAS:
- Escribe en español chileno profesional (no slang, no modismos extremos)
- Cada post debe tener un hook potente en la primera línea
- Incluye un CTA claro al final (link a ethoz.cl/demo o ethoz.cl/blog/...)
- Usa datos concretos cuando puedas (multas UTM, plazos, estadísticas)
- NO uses emojis excesivos (máximo 2-3 por post, o ninguno en LinkedIn)
- NO inventes datos — si no estás seguro, sé general
- La Ley 21.719 es la Ley de Protección de Datos Personales de Chile
- Las multas pueden llegar a 20.000 UTM (~$1.300 millones CLP)
- Ethoz complementa sistemas existentes (Napsis, Syscol), no los reemplaza

${count > 1 ? 'Separa cada post con "---"' : ''}

Responde SOLO con el contenido del post, sin explicaciones ni metadata.`;
}
