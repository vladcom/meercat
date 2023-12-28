export const VITE_APP_SOCKET = import.meta.env.VITE_APP_SOCKET ?? '';
export function wssApi(url: string): string {
  return `${VITE_APP_SOCKET}${url}`;
}
