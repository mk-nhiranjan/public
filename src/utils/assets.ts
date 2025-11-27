/**
 * Asset handling utilities for Figma-exported assets
 */

/**
 * Get the public asset path
 */
export const getAssetPath = (path: string): string => {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // In production, you might want to add a CDN URL here
  return cleanPath;
};

/**
 * Get image asset path
 */
export const getImagePath = (filename: string): string => {
  return getAssetPath(`assets/images/${filename}`);
};

/**
 * Get icon asset path
 */
export const getIconPath = (filename: string): string => {
  return getAssetPath(`assets/icons/${filename}`);
};

/**
 * Generate srcset for responsive images
 */
export const generateSrcSet = (
  basePath: string,
  sizes: Array<{ suffix: string; width: number }>
): string => {
  return sizes
    .map(({ suffix, width }) => {
      const ext = basePath.split('.').pop();
      const pathWithoutExt = basePath.replace(`.${ext}`, '');
      return `${pathWithoutExt}${suffix}.${ext} ${width}w`;
    })
    .join(', ');
};

/**
 * Get optimized image props for performance
 */
export const getOptimizedImageProps = (
  src: string,
  alt: string,
  options?: {
    lazy?: boolean;
    sizes?: string;
    srcSet?: string;
  }
) => {
  const { lazy = true, sizes, srcSet } = options || {};
  
  return {
    src,
    alt,
    loading: lazy ? 'lazy' as const : 'eager' as const,
    decoding: 'async' as const,
    ...(sizes && { sizes }),
    ...(srcSet && { srcSet })
  };
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string): void => {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

/**
 * Check if WebP is supported
 */
export const isWebPSupported = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Get optimized image format
 */
export const getOptimizedFormat = async (
  basePath: string,
  formats: string[] = ['webp', 'jpg', 'png']
): Promise<string> => {
  if (formats.includes('webp') && await isWebPSupported()) {
    const webpPath = basePath.replace(/\.(jpg|png)$/i, '.webp');
    return webpPath;
  }
  return basePath;
};
