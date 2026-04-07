import { supabase } from '$lib/supabase';
import type { User } from '@supabase/supabase-js';

class AdminStore {
  user = $state<User | null>(null);
  private _subscription: { unsubscribe: () => void } | null = null;
  private _initialized = false;

  get authenticated(): boolean {
    return this.user !== null;
  }

  async init(): Promise<void> {
    if (!supabase || this._initialized) return;
    this._initialized = true;

    const { data } = await supabase.auth.getSession();
    this.user = data.session?.user ?? null;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      this.user = session?.user ?? null;
    });
    this._subscription = subscription;
  }

  async login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    if (!supabase) return { ok: false, error: 'Supabase not configured' };

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };

    this.user = data.user;
    return { ok: true };
  }

  async logout(): Promise<void> {
    if (!supabase) return;
    await supabase.auth.signOut();
    this.user = null;
  }
}

export const adminStore = new AdminStore();
