/**
 * Upload pitch video to YouTube using existing OAuth token in social_tokens
 */

import { readFileSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Load env
const envContent = readFileSync(resolve(root, '.env.local'), 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
}

const SUPABASE_URL = env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;

// ── Get & refresh YouTube token ──
async function getYouTubeToken() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/social_tokens?platform=eq.google&select=access_token,refresh_token,token_expiry`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  });
  const tokens = await res.json();
  if (!tokens.length) throw new Error('No Google token in social_tokens');

  const token = tokens[0];

  // Refresh if expired
  if (new Date(token.token_expiry) <= new Date()) {
    console.log('  Refreshing token...');
    const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: token.refresh_token,
        grant_type: 'refresh_token',
      }),
    });
    const refreshed = await refreshRes.json();
    if (!refreshed.access_token) throw new Error(`Refresh failed: ${JSON.stringify(refreshed)}`);

    // Save new access token
    await fetch(`${SUPABASE_URL}/rest/v1/social_tokens?platform=eq.google`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: refreshed.access_token,
        token_expiry: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
      }),
    });
    return refreshed.access_token;
  }

  return token.access_token;
}

// ── Upload to YouTube ──
async function uploadVideo(filePath, accessToken, snippet, status) {
  const fileSize = statSync(filePath).size;
  console.log(`  File size: ${(fileSize / 1024 / 1024).toFixed(2)}MB`);

  // Step 1: Initiate resumable upload
  console.log('  Initiating upload...');
  const initRes = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Length': String(fileSize),
        'X-Upload-Content-Type': 'video/mp4',
      },
      body: JSON.stringify({ snippet, status }),
    }
  );

  if (!initRes.ok) {
    const err = await initRes.text();
    throw new Error(`Init failed: ${initRes.status} ${err}`);
  }

  const uploadUrl = initRes.headers.get('Location');
  if (!uploadUrl) throw new Error('No upload URL returned');

  // Step 2: Upload file
  console.log('  Uploading binary...');
  const fileBuffer = readFileSync(filePath);
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'video/mp4' },
    body: fileBuffer,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error(`Upload failed: ${uploadRes.status} ${err}`);
  }

  return await uploadRes.json();
}

// ── Main ──
async function run() {
  console.log('\n▸ Ethoz Pitch — YouTube Upload\n');

  const token = await getYouTubeToken();
  console.log('  ✔ Token ready');

  const videoPath = resolve(root, 'media/videos/ethoz-pitch-16x9.mp4');

  const snippet = {
    title: 'Ethoz — Protección escolar inteligente para colegios chilenos',
    description: `Ethoz es la plataforma que ayuda a los colegios chilenos a cumplir con la Ley 21.719 de Protección de Datos Personales sin reemplazar sus sistemas actuales.

Conecta con Napsis, Syscol, SchoolTrack y otros sistemas existentes. Agrega:
• Perfil integral del alumno (sin reinicio de marzo)
• Retiros escolares con verificación digital
• Permisos por cargo (cada persona ve solo lo que necesita)
• Cumplimiento Ley 21.719 documentable
• Búsqueda inteligente de cualquier alumno en segundos

La Ley 21.719 entra en vigencia en diciembre de 2026. Las multas pueden llegar hasta 20.000 UTM (~\$1.300 millones CLP).

Agenda una demo gratis: https://ethoz.cl/demo

#Ley21719 #ProtecciónDeDatos #EdTechChile #ColegiosChile`,
    tags: ['Ley 21.719', 'Protección de datos', 'EdTech Chile', 'Colegios', 'Educación', 'Cumplimiento normativo', 'Ethoz'],
    categoryId: '27', // Education
    defaultLanguage: 'es',
    defaultAudioLanguage: 'es',
  };

  const status = {
    privacyStatus: 'public',
    selfDeclaredMadeForKids: false,
  };

  console.log('▸ Uploading 16x9 to YouTube...');
  const result = await uploadVideo(videoPath, token, snippet, status);
  console.log(`\n✔ Uploaded: https://www.youtube.com/watch?v=${result.id}\n`);
}

run().catch((err) => {
  console.error('\n✘ Error:', err.message);
  process.exit(1);
});
