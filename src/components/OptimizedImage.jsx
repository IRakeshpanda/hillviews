import React from 'react';
import { getWebpPath, getImageSrcSet } from '../utils/imageUtils';

export default function OptimizedImage({
  src,
  alt = '',
  className = '',
  sizes = '100vw',
  priority = false,
  width,
  height,
  aspectRatio,
  style = {},
  imgRef,
  ...rest
}) {
  if (!src) return null;

  const isLocal = typeof src === 'string' && src.startsWith('/images/');
  const webpSrc = isLocal ? getWebpPath(src) : src;
  const srcSet = isLocal ? getImageSrcSet(src) : undefined;

  const combinedStyle = {
    ...(aspectRatio ? { aspectRatio } : {}),
    ...style,
  };

  return (
    <img
      ref={imgRef}
      src={webpSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={priority ? 'high' : 'auto'}
      width={width}
      height={height}
      style={combinedStyle}
      {...rest}
    />
  );
}
