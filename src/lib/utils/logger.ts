const isDev = import.meta.env.DEV;

export const log = {
  info: (...args: unknown[]) => { if (isDev) console.info(...args); },
  warn: (...args: unknown[]) => { if (isDev) console.warn(...args); },
  error: (...args: unknown[]) => console.error(...args), // always log errors
  debug: (...args: unknown[]) => { if (isDev) console.debug(...args); },
};
