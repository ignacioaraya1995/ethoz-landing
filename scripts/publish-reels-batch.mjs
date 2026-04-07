/**
 * Publish 5 Ethoz reels to Instagram, Facebook, and LinkedIn.
 */

import { readFileSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envContent = readFileSync(resolve(root, '.env.local'), 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
}
const SUPABASE_URL = env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const REELS = [
  {
    file: 'ethoz-reel-1-reinicio.mp4',
    title: 'Reinicio de marzo',
    caption: `Cada marzo, los colegios chilenos pierden información crítica de sus alumnos.

Observaciones, derivaciones, registros de convivencia: todo se reinicia. El nuevo profesor jefe tiene que partir de cero.

Ethoz mantiene el historial integral del alumno entre años, sin reinicio.

Agenda una demo: https://ethoz.cl/demo

#GestionEscolar #ConvivenciaEscolar #ColegiosChile #EduChile #DirectoresChile #SostenedoresChile #EdTechChile #Ley21719 #ProteccionDeDatos`,
  },
  {
    file: 'ethoz-reel-2-excel.mp4',
    title: 'Excel no cumple la Ley 21.719',
    caption: `Si tu colegio guarda fichas de alumnos en Excel, esto te interesa.

Excel no tiene control de acceso por usuario. No tiene audit trail. No tiene encriptación at-rest. No cumple con la Ley 21.719.

Ethoz se construyó desde el día uno para cumplir la normativa.

Agenda una demo: https://ethoz.cl/demo

#Ley21719 #ProteccionDeDatos #ColegiosChile #ExcelNoCumple #SeguridadEscolar #EdTechChile #Cumplimiento #Sostenedores`,
  },
  {
    file: 'ethoz-reel-3-retiros.mp4',
    title: 'Retiros escolares inseguros',
    caption: `¿Quién retiró a tu alumno hoy a las 15:30?

En la mayoría de los colegios, la respuesta vive en un cuaderno con firmas ilegibles. Cero trazabilidad. Si pasa algo, no hay forma de demostrar nada.

Ethoz registra cada retiro digitalmente, con verificación de identidad.

Agenda una demo: https://ethoz.cl/demo

#SeguridadEscolar #RetirosEscolares #ColegiosChile #PorteriaDigital #EdTechChile #ProteccionEscolar #Directores`,
  },
  {
    file: 'ethoz-reel-4-permisos.mp4',
    title: 'Permisos sin control',
    caption: `En la mayoría de los colegios chilenos, todos los profesores ven todo.

El profesor de matemática puede ver los informes psicológicos. La secretaria puede ver las derivaciones. Eso viola el principio de minimización de datos de la Ley 21.719.

Ethoz asigna permisos por cargo automáticamente.

Agenda una demo: https://ethoz.cl/demo

#PrivacidadPorDiseno #ControlDeAcceso #Ley21719 #ColegiosChile #ProteccionDatos #EdTechChile #ConvivenciaEscolar`,
  },
  {
    file: 'ethoz-reel-5-multas.mp4',
    title: 'Multas hasta 20.000 UTM',
    caption: `Las multas de la Ley 21.719 pueden llegar a 20.000 UTM.

Eso son más de 1.300 millones de pesos. Y la responsabilidad cae directamente sobre el sostenedor.

La ley entra en vigencia en diciembre de 2026. Cada día que pasa es un día menos para prepararse.

Ethoz te ayuda a cumplir antes de que la fiscalización empiece.

Agenda una demo: https://ethoz.cl/demo

#Ley21719 #Multas #Sostenedores #ColegiosChile #ProteccionDeDatos #Cumplimiento #EdTechChile`,
  },
];

// Get tokens
const tokensRes = await fetch(`${SUPABASE_URL}/rest/v1/social_tokens?select=*`, {
  headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
});
const allTokens = await tokensRes.json();
const tokens = {};
for (const t of allTokens) tokens[t.platform] = t;

// ── Instagram Reel ──
async function publishInstagramReel(reel) {
  const igId = tokens.meta.ig_account_id;
  const pageToken = tokens.meta.page_token;
  const videoUrl = `${SUPABASE_URL}/storage/v1/object/public/pitch-videos/${reel.file}`;

  console.log(`  Creating IG container...`);
  const containerRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'REELS',
      video_url: videoUrl,
      caption: reel.caption,
      share_to_feed: true,
      access_token: pageToken,
    }),
  });
  if (!containerRes.ok) throw new Error(`IG container: ${await containerRes.text()}`);
  const { id: creationId } = await containerRes.json();

  console.log(`  Waiting for IG processing...`);
  let status = 'IN_PROGRESS';
  for (let i = 0; i < 30 && status === 'IN_PROGRESS'; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const sRes = await fetch(`https://graph.facebook.com/v21.0/${creationId}?fields=status_code&access_token=${pageToken}`);
    status = (await sRes.json()).status_code;
  }
  if (status !== 'FINISHED') throw new Error(`IG processing: ${status}`);

  console.log(`  Publishing IG Reel...`);
  const pubRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: creationId, access_token: pageToken }),
  });
  if (!pubRes.ok) throw new Error(`IG publish: ${await pubRes.text()}`);
  const { id: mediaId } = await pubRes.json();
  return `https://www.instagram.com/reel/${mediaId}/`;
}

// ── Facebook video ──
async function publishFacebookVideo(reel) {
  const pageId = tokens.meta.page_id;
  const pageToken = tokens.meta.page_token;
  const videoUrl = `${SUPABASE_URL}/storage/v1/object/public/pitch-videos/${reel.file}`;

  console.log(`  Posting FB video...`);
  const res = await fetch(`https://graph.facebook.com/v21.0/${pageId}/videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file_url: videoUrl,
      title: reel.title,
      description: reel.caption,
      access_token: pageToken,
    }),
  });
  if (!res.ok) throw new Error(`FB video: ${await res.text()}`);
  const data = await res.json();
  return `https://www.facebook.com/${data.id || data.post_id}`;
}

// ── Main ──
async function run() {
  console.log(`\n▸ Publishing ${REELS.length} Reels to Instagram + Facebook\n`);

  const results = [];
  for (const reel of REELS) {
    console.log(`\n▸ ${reel.title}`);

    const result = { title: reel.title };

    try {
      result.instagram = await publishInstagramReel(reel);
      console.log(`  ✔ IG: ${result.instagram}`);
    } catch (err) {
      result.instagram = `ERROR: ${err.message}`;
      console.error(`  ✘ IG: ${err.message}`);
    }

    try {
      result.facebook = await publishFacebookVideo(reel);
      console.log(`  ✔ FB: ${result.facebook}`);
    } catch (err) {
      result.facebook = `ERROR: ${err.message}`;
      console.error(`  ✘ FB: ${err.message}`);
    }

    results.push(result);
  }

  console.log('\n=== ALL DONE ===\n');
  console.log(JSON.stringify(results, null, 2));
}

run().catch(console.error);
