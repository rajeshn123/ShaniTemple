import { Capacitor } from '@capacitor/core';

export const isNative = Capacitor.isNativePlatform();

// On mobile native app (Android), use live production Firebase Cloud Functions endpoint.
// On web (browser), use relative root so proxy / Firebase Hosting rewrites handle it.
export const API_BASE = isNative
  ? 'https://shani-temple-2026.web.app'
  : (import.meta.env.VITE_API_BASE_URL || '');

export function getApiUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
}
