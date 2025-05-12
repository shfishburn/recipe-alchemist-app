
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ImageLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export function ImageLoader({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  className,
  containerClassName,
  priority = false,
  loading = 'lazy',
  onLoad,
  onError,
  ...props
}: ImageLoaderProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // Reset state when src changes
  useEffect(() => {
    setLoaded(false);
    setError(false);
    setImageSrc(src);
  }, [src]);

  const handleLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setError(true);
    setImageSrc(fallbackSrc);
    if (onError) onError();
  };

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {!loaded && !error && (
        <Skeleton className={cn('absolute inset-0 z-0', className)} />
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        onError={handleError}
        // Remove fetchPriority prop and use data-fetch-priority instead
        data-fetch-priority={priority ? 'high' : 'auto'}
        // Add performance optimizations
        decoding="async"
        {...props}
      />
    </div>
  );
}
