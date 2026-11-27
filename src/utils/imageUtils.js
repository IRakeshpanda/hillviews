/**
 * Image helper utilities for responsive WebP and fallback handling.
 */

export function getWebpPath(src) {
  if (!src || typeof src !== 'string') return src;
  if (!src.startsWith('/images/')) return src;
  return src.replace(/\.(jpe?g|png)$/i, '.webp');
}

export function getImageSrcSet(src) {
  if (!src || typeof src !== 'string' || !src.startsWith('/images/')) return undefined;
  if (src.includes('/logo') || src.includes('icon')) return undefined;
  const match = src.match(/^(.*)\.(jpe?g|png|webp)$/i);
  if (!match) return undefined;
  const base = match[1].replace(/-(640w|1024w|1600w)$/, '');
  return `${base}-640w.webp 640w, ${base}-1024w.webp 1024w, ${base}-1600w.webp 1600w, ${base}.webp 2400w`;
}

export function getResponsiveImageProps(src, { sizes = '100vw', priority = false, alt = '' } = {}) {
  const isLocal = typeof src === 'string' && src.startsWith('/images/');
  const webpSrc = isLocal ? getWebpPath(src) : src;
  const srcSet = isLocal ? getImageSrcSet(src) : undefined;

  return {
    src: webpSrc,
    srcSet,
    sizes,
    alt,
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async',
    fetchpriority: priority ? 'high' : 'auto',
  };
}
