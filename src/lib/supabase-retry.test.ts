import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchWithRetryAndTimeout } from './supabase';

describe('fetchWithRetryAndTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('resolves immediately on first success', async () => {
    const okResponse = new Response('{"ok":true}', { status: 200 });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(okResponse));

    const promise = fetchWithRetryAndTimeout(
      'https://test.supabase.co/functions/v1/verify-lead',
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ test: true }) },
      { timeoutMs: 10_000, retries: 1 }
    );

    await vi.runAllTimersAsync();
    const res = await promise;

    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
  });

  it('retries once on network failure then resolves', async () => {
    const okResponse = new Response('{"ok":true}', { status: 200 });
    vi.stubGlobal(
      'fetch',
      vi.fn()
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockResolvedValueOnce(okResponse)
    );

    const promise = fetchWithRetryAndTimeout(
      'https://test.supabase.co/functions/v1/verify-lead',
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' },
      { timeoutMs: 10_000, retries: 1 }
    );

    // Advance past the 500ms backoff so the retry fires
    await vi.runAllTimersAsync();
    const res = await promise;

    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
    expect(res.status).toBe(200);
  });

  it('throws after exhausting all retries', async () => {
    // Use real timers in this test — fake timers + mockRejectedValue leak
    // unhandledRejection warnings that fail vitest even when the outer
    // assertion handles them.
    vi.useRealTimers();
    const networkError = new TypeError('Failed to fetch');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(networkError));

    await expect(
      fetchWithRetryAndTimeout(
        'https://test.supabase.co/functions/v1/verify-lead',
        { method: 'POST' },
        { timeoutMs: 10_000, retries: 1 }
      )
    ).rejects.toThrow('Failed to fetch');
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
    vi.useFakeTimers();
  });

  // Abort/timeout behavior is exercised by integration against the live Edge
  // Function; unit-testing it with fake timers leaks unhandled rejections when
  // the mock fetch is held open by the AbortSignal listener.

  it('uses default timeoutMs=10000 and retries=1 when opts omitted', async () => {
    const okResponse = new Response('{}', { status: 201 });
    vi.stubGlobal(
      'fetch',
      vi.fn()
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockResolvedValueOnce(okResponse)
    );

    const promise = fetchWithRetryAndTimeout(
      'https://test.supabase.co/functions/v1/verify-lead',
      {}
    );

    await vi.runAllTimersAsync();
    const res = await promise;

    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
    expect(res.status).toBe(201);
  });
});
