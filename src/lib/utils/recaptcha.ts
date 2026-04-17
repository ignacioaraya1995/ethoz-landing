import { env } from '$env/dynamic/public';

function getKey(): string | undefined {
  return env.PUBLIC_RECAPTCHA_SITE_KEY;
}

export async function executeRecaptcha(action: string): Promise<string | null> {
  const key = getKey();
  if (!key) return null;

  const grecaptcha = (window as any).grecaptcha;
  if (!grecaptcha) return null;

  try {
    return await grecaptcha.execute(key, { action });
  } catch {
    return null;
  }
}

export function getRecaptchaScriptUrl(): string {
  const key = getKey() ?? '';
  return `https://www.google.com/recaptcha/api.js?render=${key}`;
}
