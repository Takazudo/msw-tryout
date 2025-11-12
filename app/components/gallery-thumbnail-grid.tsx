'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { GalleryItem } from '@/lib/types';
import { Blurhash } from '@/components/blurhash';

interface GalleryThumbnailGridProps {
  items: GalleryItem[];
}

interface GalleryThumbnailButtonProps {
  item: GalleryItem;
  href: string;
  isLoaded: boolean;
  isErrored: boolean;
  onActivate: (slug: string) => void;
  registerImage: (image: HTMLImageElement) => void;
  unregisterImage: (image: HTMLImageElement) => void;
  onImageLoad: (image: HTMLImageElement, src: string) => void;
  onImageError: (image: HTMLImageElement, src: string) => void;
}

function GalleryThumbnailButton({
  item,
  href,
  isLoaded,
  isErrored,
  onActivate,
  registerImage,
  unregisterImage,
  onImageLoad,
  onImageError,
}: GalleryThumbnailButtonProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) {
      return;
    }

    registerImage(imageElement);

    return () => {
      unregisterImage(imageElement);
    };
  }, [registerImage, unregisterImage]);

  return (
    <li className="relative" role="listitem">
      <a
        href={href}
        data-testid="gallery-thumbnail"
        data-slug={item.slug}
        onClick={(e) => {
          e.preventDefault();
          onActivate(item.slug);
        }}
        className="group relative block aspect-square w-full overflow-hidden bg-zd-black transition-transform hover:ring-3 hover:ring-zd-strong hover:z-10 focus:outline-none focus:ring-2 focus:ring-zd-white focus:ring-offset-2 focus:ring-offset-zd-black focus:z-10"
        aria-haspopup="dialog"
        aria-label={item.imageAlt || `Open gallery image ${item.slug}`}
        aria-controls="gallery-dialog"
      >
        {!isErrored && item.blurhash && (
          <div className="absolute inset-0">
            <Blurhash
              hash={item.blurhash}
              width="100%"
              height="100%"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 backdrop-blur-xl opacity-50" />
          </div>
        )}

        {!isErrored ? (
          <img
            ref={imageRef}
            data-src={item.thumbnailUrl}
            alt={item.imageAlt || `Gallery image ${item.slug}`}
            className="absolute inset-0 block h-full w-full object-cover transition-opacity duration-300"
            decoding="async"
            style={{ opacity: isLoaded ? 1 : 0 }}
            onLoad={(event) => onImageLoad(event.currentTarget, item.thumbnailUrl)}
            onError={(event) => onImageError(event.currentTarget, item.thumbnailUrl)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm text-zd-gray">
            Image failed to load
          </span>
        )}
      </a>
    </li>
  );
}

export default function GalleryThumbnailGrid({ items }: GalleryThumbnailGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [erroredImages, setErroredImages] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pendingImagesRef = useRef(new Set<HTMLImageElement>());

  const buildThumbnailUrl = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('id', slug);
      return `/?${params.toString()}`;
    },
    [searchParams],
  );

  const handleThumbnailClick = useCallback(
    (slug: string) => {
      router.push(buildThumbnailUrl(slug), { scroll: false });
    },
    [router, buildThumbnailUrl],
  );

  const handleImageLoad = useCallback((image: HTMLImageElement, src: string) => {
    image.dataset.loaded = 'true';
    setLoadedImages((prev) => {
      const next = new Set(prev);
      next.add(src);
      return next;
    });
    setErroredImages((prev) => {
      if (!prev.has(src)) {
        return prev;
      }
      const next = new Set(prev);
      next.delete(src);
      return next;
    });
    observerRef.current?.unobserve(image);
    pendingImagesRef.current.delete(image);
  }, []);

  const handleImageError = useCallback((image: HTMLImageElement, src: string) => {
    image.dataset.error = 'true';
    setErroredImages((prev) => {
      const next = new Set(prev);
      next.add(src);
      return next;
    });
    observerRef.current?.unobserve(image);
    pendingImagesRef.current.delete(image);
  }, []);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const image = entry.target as HTMLImageElement;
      const source = image.dataset.src;
      if (!source) {
        observerRef.current?.unobserve(image);
        return;
      }

      if (image.dataset.loaded === 'true' || image.dataset.error === 'true') {
        observerRef.current?.unobserve(image);
        return;
      }

      if (image.src !== source && !image.src.endsWith(source)) {
        image.src = source;
      }
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '100px',
      threshold: 0.01,
    });

    observerRef.current = observer;

    if (pendingImagesRef.current.size > 0) {
      const pendingImages = Array.from(pendingImagesRef.current);
      pendingImagesRef.current.clear();

      setTimeout(() => {
        pendingImages.forEach((image) => {
          if (observerRef.current) {
            observer.observe(image);
          }
        });
      }, 50);
    }

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [handleIntersection]);

  const registerImage = useCallback((image: HTMLImageElement) => {
    if (observerRef.current) {
      setTimeout(() => {
        if (observerRef.current) {
          observerRef.current.observe(image);
        }
      }, 50);
      return;
    }

    pendingImagesRef.current.add(image);
  }, []);

  const unregisterImage = useCallback((image: HTMLImageElement) => {
    if (observerRef.current) {
      observerRef.current.unobserve(image);
    }
    pendingImagesRef.current.delete(image);
  }, []);

  return (
    <ul
      data-testid="gallery-thumbnail-grid"
      className="grid grid-cols-2 gap-1px sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      role="list"
    >
      {items.map((item) => {
        return (
          <GalleryThumbnailButton
            key={item.slug}
            item={item}
            href={buildThumbnailUrl(item.slug)}
            isLoaded={loadedImages.has(item.thumbnailUrl)}
            isErrored={erroredImages.has(item.thumbnailUrl)}
            onActivate={handleThumbnailClick}
            registerImage={registerImage}
            unregisterImage={unregisterImage}
            onImageLoad={handleImageLoad}
            onImageError={handleImageError}
          />
        );
      })}
    </ul>
  );
}
