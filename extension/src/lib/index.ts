export const SERVER_BASE_URL = import.meta.env.VITE_BASE_SERVER_URL;

export function getServerBaseUrl(): string {
  if (!SERVER_BASE_URL) throw new Error("Missing VITE_BASE_SERVER_URL");
  return SERVER_BASE_URL.replace(/\/+$/, "");
}
