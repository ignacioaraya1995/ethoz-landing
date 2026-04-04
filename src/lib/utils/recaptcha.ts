import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';

export async function executeRecaptcha(action: string): Promise<string | null> {
  if (!PUBLIC_RECAPTCHA_SITE_KEY) return null;

  const grecaptcha = (window as any).grecaptcha;
  if (!grecaptcha) return null;

  try {
    return await grecaptcha.execute(PUBLIC_RECAPTCHA_SITE_KEY, { action });
  } catch {
    return null;
  }
}

export function getRecaptchaScriptUrl(): string {
  return `https://www.google.com/recaptcha/api.js?render=${PUBLIC_RECAPTCHA_SITE_KEY}`;
}
