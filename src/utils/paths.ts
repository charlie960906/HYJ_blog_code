const ensureTrailingSlash = (value: string): string => (value.endsWith('/') ? value : `${value}/`);

const baseUrl = ensureTrailingSlash(import.meta.env.BASE_URL || '/');

export const withBase = (path: string): string => {
  const cleanPath = path.replace(/^\/+/, '');
  return `${baseUrl}${cleanPath}`;
};
