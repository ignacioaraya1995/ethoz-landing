import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") || "";
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ── Token refresh helpers ──

async function refreshGoogleToken(token: any): Promise<string> {
  if (!token.refresh_token) throw new Error("No Google refresh token");
  if (token.token_expiry && new Date(token.token_expiry) > new Date()) {
    return token.access_token;
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: token.refresh_token,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  if (!data.access_token) throw new Error("Failed to refresh Google token");

  await supabase.from("social_tokens").update({
    access_token: data.access_token,
    token_expiry: new Date(Date.now() + data.expires_in * 1000).toISOString(),
  }).eq("platform", "google");

  return data.access_token;
}

// ── Platform publishers ──

async function publishLinkedIn(post: any, token: any): Promise<string> {
  const orgId = token.org_id;
  const author = orgId ? `urn:li:organization:${orgId}` : "urn:li:person:me";

  const body: any = {
    author,
    commentary: post.body + (post.hashtags ? "\n\n" + post.hashtags : ""),
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
  };

  // If post has an image, upload it first
  if (post.image_url) {
    // Initialize image upload
    const initRes = await fetch("https://api.linkedin.com/rest/images?action=initializeUpload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "LinkedIn-Version": "202504",
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        initializeUploadRequest: { owner: author },
      }),
    });

    if (initRes.ok) {
      const initData = await initRes.json();
      const uploadUrl = initData.value?.uploadUrl;
      const imageUrn = initData.value?.image;

      if (uploadUrl && imageUrn) {
        // Download image and upload to LinkedIn
        const imgRes = await fetch(post.image_url);
        const imgBlob = await imgRes.blob();
        await fetch(uploadUrl, { method: "PUT", body: imgBlob });

        body.content = { media: { id: imageUrn } };
      }
    }
  }

  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "LinkedIn-Version": "202504",
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LinkedIn publish failed: ${res.status} ${err}`);
  }

  const postId = res.headers.get("x-restli-id") || "";
  return `https://www.linkedin.com/feed/update/${postId}`;
}

async function publishFacebook(post: any, token: any): Promise<string> {
  const pageToken = token.page_token;
  const pageId = token.page_id;
  if (!pageToken || !pageId) throw new Error("No Facebook Page token");

  let endpoint: string;
  const params: any = { access_token: pageToken };

  if (post.image_url) {
    // Photo post
    endpoint = `https://graph.facebook.com/v21.0/${pageId}/photos`;
    params.message = post.body + (post.hashtags ? "\n\n" + post.hashtags : "");
    params.url = post.image_url;
  } else {
    // Text/link post
    endpoint = `https://graph.facebook.com/v21.0/${pageId}/feed`;
    params.message = post.body + (post.hashtags ? "\n\n" + post.hashtags : "");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Facebook publish failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  const fbPostId = data.id || data.post_id || "";
  return `https://www.facebook.com/${fbPostId}`;
}

async function publishInstagram(post: any, token: any): Promise<string> {
  const pageToken = token.page_token;
  const igId = token.ig_account_id;
  if (!pageToken || !igId) throw new Error("No Instagram account connected");
  if (!post.image_url) throw new Error("Instagram requires an image");

  // Step 1: Create media container
  const containerRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: post.image_url,
      caption: post.body + (post.hashtags ? "\n\n" + post.hashtags : ""),
      access_token: pageToken,
    }),
  });

  if (!containerRes.ok) {
    const err = await containerRes.text();
    throw new Error(`Instagram container failed: ${containerRes.status} ${err}`);
  }

  const { id: creationId } = await containerRes.json();

  // Wait for container to be ready (Instagram processes async)
  await new Promise((r) => setTimeout(r, 5000));

  // Step 2: Publish
  const pubRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: pageToken,
    }),
  });

  if (!pubRes.ok) {
    const err = await pubRes.text();
    throw new Error(`Instagram publish failed: ${pubRes.status} ${err}`);
  }

  const { id: mediaId } = await pubRes.json();
  return `https://www.instagram.com/p/${mediaId}/`;
}

// ── Main handler ──

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  try {
    const { post_id, platform } = await req.json();
    if (!post_id || !platform) {
      return Response.json({ error: "post_id and platform required" }, { status: 400, headers: corsHeaders });
    }

    // Get the post
    const { data: post, error: postErr } = await supabase
      .from("content_posts")
      .select("*")
      .eq("id", post_id)
      .single();

    if (postErr || !post) {
      return Response.json({ error: "Post not found" }, { status: 404, headers: corsHeaders });
    }

    // Get the token for the platform
    const tokenPlatform = platform === "facebook" || platform === "instagram" ? "meta" : platform === "youtube" ? "google" : platform;
    const { data: token, error: tokenErr } = await supabase
      .from("social_tokens")
      .select("*")
      .eq("platform", tokenPlatform)
      .single();

    if (tokenErr || !token) {
      return Response.json({ error: `No ${platform} token found. Connect the account first.` }, { status: 400, headers: corsHeaders });
    }

    // Publish based on platform
    let publishedUrl = "";

    switch (platform) {
      case "linkedin":
        publishedUrl = await publishLinkedIn(post, token);
        break;
      case "facebook":
        publishedUrl = await publishFacebook(post, token);
        break;
      case "instagram":
        publishedUrl = await publishInstagram(post, token);
        break;
      case "youtube":
        // YouTube requires video upload — handled separately
        return Response.json({ error: "YouTube publishing requires video upload. Use the video upload flow." }, { status: 400, headers: corsHeaders });
      default:
        return Response.json({ error: `Unknown platform: ${platform}` }, { status: 400, headers: corsHeaders });
    }

    // Update post status
    await supabase.from("content_posts").update({
      status: "published",
      published_at: new Date().toISOString(),
      published_url: publishedUrl,
    }).eq("id", post_id);

    return Response.json({ ok: true, published_url: publishedUrl }, { headers: corsHeaders });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
});
