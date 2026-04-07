import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LINKEDIN_CLIENT_ID = Deno.env.get("LINKEDIN_CLIENT_ID")!;
const LINKEDIN_CLIENT_SECRET = Deno.env.get("LINKEDIN_CLIENT_SECRET")!;
const REDIRECT_URI = `${SUPABASE_URL}/functions/v1/social-auth-linkedin`;
const ADMIN_URL = Deno.env.get("ADMIN_URL") || "https://ethoz.cl/admin/content";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);

  // Step 1: If no code, redirect to LinkedIn OAuth
  const code = url.searchParams.get("code");
  if (!code) {
    const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", LINKEDIN_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.set("scope", "openid profile w_member_social w_organization_social r_organization_social");
    // State encodes a timestamp so we can verify it wasn't replayed or forged
    const state = `${Date.now()}:${crypto.randomUUID()}`;
    authUrl.searchParams.set("state", state);
    return Response.redirect(authUrl.toString(), 302);
  }

  // Validate state parameter to prevent CSRF attacks
  const state = url.searchParams.get("state");
  if (!state) {
    return new Response("Missing state parameter", { status: 400 });
  }
  const [tsStr] = state.split(":");
  const ts = Number(tsStr);
  const TEN_MINUTES_MS = 10 * 60 * 1000;
  if (isNaN(ts) || Date.now() - ts > TEN_MINUTES_MS) {
    // SECURITY: state parameter timestamp is expired or invalid
    console.error("[LinkedIn OAuth] State parameter invalid or expired:", state);
    return new Response("Invalid or expired state parameter", { status: 400 });
  }

  // Step 2: Exchange code for token
  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    return new Response(`LinkedIn token error: ${err}`, { status: 400 });
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;
  const expiresIn = tokenData.expires_in; // seconds

  // Step 3: Get organization ID (company page)
  const orgRes = await fetch("https://api.linkedin.com/rest/organizationAcls?q=roleAssignee&role=ADMINISTRATOR", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "LinkedIn-Version": "202504",
      "X-Restli-Protocol-Version": "2.0.0",
    },
  });

  let orgId = "";
  if (orgRes.ok) {
    const orgData = await orgRes.json();
    const firstOrg = orgData.elements?.[0];
    if (firstOrg) {
      orgId = firstOrg.organization?.split(":").pop() || "";
    }
  }

  // Step 4: Save to Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const expiry = new Date(Date.now() + expiresIn * 1000).toISOString();

  await supabase.from("social_tokens").upsert({
    platform: "linkedin",
    access_token: accessToken,
    refresh_token: tokenData.refresh_token || null,
    token_expiry: expiry,
    org_id: orgId,
    metadata: { scope: tokenData.scope },
  }, { onConflict: "platform" });

  // Redirect back to admin
  return Response.redirect(`${ADMIN_URL}?connected=linkedin`, 302);
});
