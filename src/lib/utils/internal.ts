import { browser } from '$app/environment';
import { log } from '$lib/utils/logger';

const STORAGE_KEY = 'ethoz_internal';
const IP_CACHE_KEY = 'ethoz_ip_checked';
const TEST_EMAILS = ['ignacioaraya1995@gmail.com'];
const INTERNAL_IPS = ['181.43.240.234'];

/** Check if current user is flagged as internal (team member) */
export function isInternal(): boolean {
  if (!browser) return false;
  return localStorage.getItem(STORAGE_KEY) === '1';
}

/** Check URL for ?_internal=1 flag and persist it */
export function checkInternalFlag(): void {
  if (!browser) return;
  const params = new URLSearchParams(window.location.search);
  if (params.has('_internal')) {
    const value = params.get('_internal');
    if (value === '1') {
      localStorage.setItem(STORAGE_KEY, '1');
      log.info('[Ethoz] Internal mode ON — analytics excluded');
    } else {
      localStorage.removeItem(STORAGE_KEY);
      log.info('[Ethoz] Internal mode OFF');
    }
    // Clean URL without reload
    params.delete('_internal');
    const clean = params.toString();
    const newUrl = window.location.pathname + (clean ? `?${clean}` : '');
    window.history.replaceState({}, '', newUrl);
  }
}

/** Auto-detect internal IP and set flag (runs once per session) */
export async function checkInternalIP(): Promise<void> {
  if (!browser) return;
  // Already flagged or already checked this session
  if (isInternal()) return;
  if (sessionStorage.getItem(IP_CACHE_KEY)) return;

  sessionStorage.setItem(IP_CACHE_KEY, '1');

  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const { ip } = await res.json();
    if (INTERNAL_IPS.includes(ip)) {
      localStorage.setItem(STORAGE_KEY, '1');
      log.info(`[Ethoz] Internal IP detected (${ip}) — analytics excluded`);
    }
  } catch {
    // Silent fail — not critical
  }
}

/** Check if an email belongs to the team (for Supabase lead flagging) */
export function isTestEmail(email: string): boolean {
  return TEST_EMAILS.includes(email.toLowerCase().trim());
}
