/**
 * Image Generation Pipeline for Ethoz Content Posts
 *
 * Usage:
 *   node scripts/generate-images.mjs                      # All posts without images
 *   node scripts/generate-images.mjs --post-id <uuid>     # Specific post
 *   node scripts/generate-images.mjs --platform linkedin  # All linkedin posts without images
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ── Load env manually (no dotenv) ──
const envContent = readFileSync(resolve(root, '.env.local'), 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const GEMINI_API_KEY = env.GEMINI_API_KEY;
const SUPABASE_URL = env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!GEMINI_API_KEY) { console.error('Missing GEMINI_API_KEY in .env.local'); process.exit(1); }
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('Missing SUPABASE credentials in .env.local'); process.exit(1); }

const BUCKET = 'content-images';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`;

// ── Platform image specs ──
const PLATFORM_SPECS = {
  linkedin: {
    aspect: '1200x627',
    style: `Professional, clean illustration. White or very light gray background (#F8FAFC). Subtle blue accents (#2563EB). Abstract geometric shapes. 1200x627px landscape ratio. NO stock photos. NO people. Minimal, Apple/McKinsey aesthetic.`,
  },
  facebook: {
    aspect: '1200x630',
    style: `Similar to LinkedIn but slightly more visual and warm. Light background. Abstract geometric composition. 1200x630px landscape ratio. NO stock photos. NO people. Clean and professional.`,
  },
  instagram: {
    aspect: '1080x1080',
    style: `Bold, eye-catching square composition. Can be more colorful but still professional. 1080x1080px square. Strong visual hierarchy. NO stock photos. NO people. Modern and minimal.`,
  },
  youtube: {
    aspect: '1280x720',
    style: `Thumbnail style. High contrast. 1280x720px landscape ratio. Bold visual impact. NO stock photos. NO people. Dark or rich background with geometric elements.`,
  },
};

// ── Args ──
const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 ? args[idx + 1] : null;
}

const postId = getArg('post-id');
const platformFilter = getArg('platform');

// ── Build image prompt ──
function buildPrompt(post) {
  const spec = PLATFORM_SPECS[post.platform] || PLATFORM_SPECS.linkedin;
  const topic = (post.body || post.title || '').slice(0, 200).trim();

  return `Create a professional marketing image for a Chilean edtech company called Ethoz.

TOPIC: ${topic}
PLATFORM: ${post.platform || 'general'}
DIMENSIONS/ASPECT: ${spec.aspect}

VISUAL STYLE:
${spec.style}

BRANDING:
- Include two overlapping rounded rectangles logo mark in a corner, one dark navy (#0F172A) and one blue (#2563EB). Keep it subtle and small.
- No text overlays, no labels, no titles in the image.

CONTENT DIRECTION:
- Abstract geometric shapes that relate thematically to: school safety, data protection, digital management, education technology.
- Shapes could include: shields, rounded rectangles, soft grids, circular nodes, flowing lines.
- Colors: primarily white/light gray (#F8FAFC), navy (#0F172A), blue (#2563EB), with optional soft teal accent.
- NO stock photos. NO people. NO generic AI imagery. NO gradients with garish colors.
- Style: minimal, confident, premium — like Apple product pages or McKinsey slide decks.`;
}

// ── Gemini image generation ──
async function generateImage(prompt) {
  const res = await fetch(GEMINI_URL, {
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
  if (!imagePart) throw new Error('No image returned by Gemini');

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType || 'image/png',
  };
}

// ── Supabase Storage ──
async function ensureBucketExists() {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'apikey': SUPABASE_KEY,
    },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  });

  // 409 or "already exists" means bucket exists — that's fine
  if (!res.ok) {
    const err = await res.text();
    if (!err.includes('already exists') && !err.includes('409') && res.status !== 409) {
      throw new Error(`Failed to create bucket: ${res.status} ${err}`);
    }
  }
}

async function uploadImage(filename, base64Data, mimeType) {
  const binary = Buffer.from(base64Data, 'base64');

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`, {
    method: 'POST',
    headers: {
      'Content-Type': mimeType,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'apikey': SUPABASE_KEY,
    },
    body: binary,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed: ${res.status} ${err}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;
}

// ── Supabase DB ──
async function fetchPosts() {
  const filters = ['image_url=is.null'];

  if (postId) {
    // Fetch specific post regardless of image_url
    const res = await fetch(`${SUPABASE_URL}/rest/v1/content_posts?id=eq.${postId}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (!res.ok) throw new Error(`Supabase query failed: ${res.status} ${await res.text()}`);
    return res.json();
  }

  if (platformFilter) {
    filters.push(`platform=eq.${platformFilter}`);
  }

  const query = filters.map(f => f).join('&');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/content_posts?${query}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!res.ok) throw new Error(`Supabase query failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function updateImageUrl(id, imageUrl) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/content_posts?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ image_url: imageUrl }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to update post: ${res.status} ${err}`);
  }
}

// ── Main ──
async function run() {
  console.log('\n▸ Ethoz Image Generation Pipeline');

  if (postId) console.log(`  Mode: single post (${postId})`);
  else if (platformFilter) console.log(`  Mode: platform filter (${platformFilter})`);
  else console.log('  Mode: all posts without images');

  // Ensure bucket exists
  try {
    await ensureBucketExists();
    console.log(`  ✔ Storage bucket "${BUCKET}" ready`);
  } catch (err) {
    console.error(`  ✘ Bucket setup failed: ${err.message}`);
    process.exit(1);
  }

  // Fetch posts
  const posts = await fetchPosts();
  if (posts.length === 0) {
    console.log('\n  No posts found matching criteria.\n');
    return;
  }

  console.log(`  Found ${posts.length} post(s) to process\n`);

  let success = 0;
  let failed = 0;

  for (const post of posts) {
    const label = post.title || post.id;
    console.log(`▸ "${label}" (${post.platform || 'unknown'})`);

    try {
      // 1. Build prompt
      const prompt = buildPrompt(post);

      // 2. Generate image
      console.log('  Generating image with Gemini...');
      const { base64, mimeType } = await generateImage(prompt);
      console.log('  ✔ Image generated');

      // 3. Upload to Supabase Storage
      const ext = mimeType.includes('jpeg') ? 'jpg' : 'png';
      const filename = `post-${post.id}-${Date.now()}.${ext}`;
      const publicUrl = await uploadImage(filename, base64, mimeType);
      console.log('  ✔ Uploaded to storage');

      // 4. Update post record
      await updateImageUrl(post.id, publicUrl);
      console.log(`  ✔ Generated image for: "${label}" (${post.platform})`);
      console.log(`     ${publicUrl}`);

      success++;
    } catch (err) {
      console.error(`  ✘ Failed for "${label}": ${err.message}`);
      failed++;
    }

    console.log('');
  }

  console.log(`✔ Done: ${success} succeeded, ${failed} failed\n`);
}

run().catch(console.error);
