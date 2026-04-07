/**
 * Publish the Ethoz pitch video to LinkedIn, Facebook, and Instagram
 *
 * Uses already-uploaded videos in Supabase Storage:
 *   - 16x9 for LinkedIn + Facebook
 *   - 9x16 for Instagram Reels
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
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
}
const SUPABASE_URL = env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const VIDEO_16x9 = `${SUPABASE_URL}/storage/v1/object/public/pitch-videos/ethoz-pitch-16x9.mp4`;
const VIDEO_9x16 = `${SUPABASE_URL}/storage/v1/object/public/pitch-videos/ethoz-pitch-9x16.mp4`;

const TITLE = 'Ethoz — Protección escolar inteligente';
const DESCRIPTION = `La Ley 21.719 entra en vigencia en diciembre de 2026. Las multas pueden llegar hasta $1.300 millones de pesos.

Ethoz es la plataforma que ayuda a los colegios chilenos a cumplir con la nueva normativa de protección de datos sin reemplazar sus sistemas actuales.

Conoce cómo funciona en menos de 2 minutos.

Agenda una demo: https://ethoz.cl/demo

#Ley21719 #ProtecciónDeDatos #EdTechChile #ColegiosChile #SeguridadEscolar`;

// ── Get tokens from Supabase ──
async function getTokens() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/social_tokens?select=*`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  });
  const data = await res.json();
  const map = {};
  for (const t of data) map[t.platform] = t;
  return map;
}

// ── LinkedIn video upload ──
async function publishLinkedInVideo(token) {
  console.log('\n▸ LinkedIn (16x9)...');
  const author = `urn:li:person:${token.org_id}`;

  // Step 1: Initialize video upload
  console.log('  Initializing upload...');
  const initRes = await fetch('https://api.linkedin.com/rest/videos?action=initializeUpload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'LinkedIn-Version': '202504',
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      initializeUploadRequest: {
        owner: author,
        fileSizeBytes: 0, // will be set after we know
        uploadCaptions: false,
        uploadThumbnail: false,
      },
    }),
  });

  // Get file size from Supabase
  const videoRes = await fetch(VIDEO_16x9);
  const videoBuffer = await videoRes.arrayBuffer();
  const fileSize = videoBuffer.byteLength;

  // Re-init with correct size
  const initRes2 = await fetch('https://api.linkedin.com/rest/videos?action=initializeUpload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'LinkedIn-Version': '202504',
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      initializeUploadRequest: {
        owner: author,
        fileSizeBytes: fileSize,
        uploadCaptions: false,
        uploadThumbnail: false,
      },
    }),
  });

  if (!initRes2.ok) {
    throw new Error(`LinkedIn init failed: ${initRes2.status} ${await initRes2.text()}`);
  }

  const initData = await initRes2.json();
  const videoUrn = initData.value?.video;
  const uploadInstructions = initData.value?.uploadInstructions || [];

  console.log(`  Video URN: ${videoUrn}`);
  console.log(`  Upload chunks: ${uploadInstructions.length}`);

  // Step 2: Upload chunks
  const uploadedPartIds = [];
  for (const inst of uploadInstructions) {
    const start = inst.firstByte;
    const end = inst.lastByte + 1;
    const chunk = videoBuffer.slice(start, end);

    const uploadRes = await fetch(inst.uploadUrl, {
      method: 'PUT',
      body: chunk,
    });

    if (!uploadRes.ok) {
      throw new Error(`LinkedIn chunk upload failed: ${uploadRes.status}`);
    }

    const etag = uploadRes.headers.get('etag');
    if (etag) uploadedPartIds.push(etag);
  }

  // Step 3: Finalize upload
  console.log('  Finalizing upload...');
  const finalizeRes = await fetch('https://api.linkedin.com/rest/videos?action=finalizeUpload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'LinkedIn-Version': '202504',
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      finalizeUploadRequest: {
        video: videoUrn,
        uploadToken: '',
        uploadedPartIds,
      },
    }),
  });

  if (!finalizeRes.ok) {
    throw new Error(`LinkedIn finalize failed: ${finalizeRes.status} ${await finalizeRes.text()}`);
  }

  // Wait for processing
  console.log('  Waiting for video processing (30s)...');
  await new Promise((r) => setTimeout(r, 30000));

  // Step 4: Create post with video
  console.log('  Creating post...');
  const postRes = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'LinkedIn-Version': '202504',
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      author,
      commentary: DESCRIPTION,
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      content: {
        media: {
          title: TITLE,
          id: videoUrn,
        },
      },
      lifecycleState: 'PUBLISHED',
    }),
  });

  if (!postRes.ok) {
    throw new Error(`LinkedIn post failed: ${postRes.status} ${await postRes.text()}`);
  }

  const postId = postRes.headers.get('x-restli-id') || '';
  return `https://www.linkedin.com/feed/update/${postId}`;
}

// ── Facebook video upload ──
async function publishFacebookVideo(token) {
  console.log('\n▸ Facebook (16x9)...');
  const pageToken = token.page_token;
  const pageId = token.page_id;

  console.log('  Posting video...');
  const res = await fetch(`https://graph.facebook.com/v21.0/${pageId}/videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file_url: VIDEO_16x9,
      title: TITLE,
      description: DESCRIPTION,
      access_token: pageToken,
    }),
  });

  if (!res.ok) {
    throw new Error(`Facebook video failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return `https://www.facebook.com/${data.id || data.post_id || ''}`;
}

// ── Instagram Reel ──
async function publishInstagramReel(token) {
  console.log('\n▸ Instagram Reel (9x16)...');
  const pageToken = token.page_token;
  const igId = token.ig_account_id;

  // Step 1: Create container
  console.log('  Creating media container...');
  const containerRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'REELS',
      video_url: VIDEO_9x16,
      caption: DESCRIPTION,
      share_to_feed: true,
      access_token: pageToken,
    }),
  });

  if (!containerRes.ok) {
    throw new Error(`Instagram container failed: ${containerRes.status} ${await containerRes.text()}`);
  }

  const { id: creationId } = await containerRes.json();
  console.log(`  Container: ${creationId}`);

  // Step 2: Wait for processing (Reels need longer)
  console.log('  Waiting for video processing...');
  let status = 'IN_PROGRESS';
  let attempts = 0;
  while (status === 'IN_PROGRESS' && attempts < 30) {
    await new Promise((r) => setTimeout(r, 5000));
    const statusRes = await fetch(
      `https://graph.facebook.com/v21.0/${creationId}?fields=status_code&access_token=${pageToken}`
    );
    const statusData = await statusRes.json();
    status = statusData.status_code;
    attempts++;
    console.log(`  Status: ${status} (attempt ${attempts})`);
  }

  if (status !== 'FINISHED') {
    throw new Error(`Instagram processing failed: ${status}`);
  }

  // Step 3: Publish
  console.log('  Publishing...');
  const pubRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: pageToken,
    }),
  });

  if (!pubRes.ok) {
    throw new Error(`Instagram publish failed: ${pubRes.status} ${await pubRes.text()}`);
  }

  const { id: mediaId } = await pubRes.json();
  return `https://www.instagram.com/reel/${mediaId}/`;
}

// ── Main ──
async function run() {
  console.log('▸ Publishing Ethoz Pitch Video to all platforms\n');

  const tokens = await getTokens();
  const results = {};

  // LinkedIn
  try {
    results.linkedin = await publishLinkedInVideo(tokens.linkedin);
    console.log(`  ✔ ${results.linkedin}`);
  } catch (err) {
    console.error(`  ✘ LinkedIn: ${err.message}`);
    results.linkedin = `ERROR: ${err.message}`;
  }

  // Facebook
  try {
    results.facebook = await publishFacebookVideo(tokens.meta);
    console.log(`  ✔ ${results.facebook}`);
  } catch (err) {
    console.error(`  ✘ Facebook: ${err.message}`);
    results.facebook = `ERROR: ${err.message}`;
  }

  // Instagram
  try {
    results.instagram = await publishInstagramReel(tokens.meta);
    console.log(`  ✔ ${results.instagram}`);
  } catch (err) {
    console.error(`  ✘ Instagram: ${err.message}`);
    results.instagram = `ERROR: ${err.message}`;
  }

  console.log('\n=== Final results ===');
  console.log(JSON.stringify(results, null, 2));
}

run().catch(console.error);
