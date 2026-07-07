export function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

export function getCookie(name: string): string | null {
  return document.cookie.split('; ').reduce((r, v) => {
    const idx = v.indexOf('=');
    if (idx === -1) return r;
    const key = v.slice(0, idx);
    const val = v.slice(idx + 1);
    return key === name ? decodeURIComponent(val) : r;
  }, null as string | null);
}