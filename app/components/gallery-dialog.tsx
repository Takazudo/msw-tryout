'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { GalleryItem } from '@/lib/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CloseIcon } from '@/components/icons/close-icon';

interface GalleryDialogProps {
  items: GalleryItem[];
  currentSlug: string;
}

export default function GalleryDialog({ items, currentSlug }: GalleryDialogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentIndex = items.findIndex((item) => item.slug === currentSlug);
  const currentItem = items[currentIndex];
  const previousItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  const dialogTitleId = useMemo(() => `gallery-dialog-title-${currentSlug}`, [currentSlug]);
  const dialogDescriptionId = useMemo(() => `gallery-dialog-description-${currentSlug}`, [currentSlug]);

  const handleClose = useCallback(() => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete('id');
    const queryString = params.toString();
    router.replace(queryString ? `/?${queryString}` : '/', { scroll: false });
  }, [router, searchParams]);

  const handleNavigate = useCallback(
    (newSlug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('id', newSlug);
      router.replace(`/?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handlePrevious = useCallback(() => {
    if (previousItem) {
      handleNavigate(previousItem.slug);
    }
  }, [handleNavigate, previousItem]);

  const handleNext = useCallback(() => {
    if (nextItem) {
      handleNavigate(nextItem.slug);
    }
  }, [handleNavigate, nextItem]);

  // Open/close dialog based on currentItem
  useEffect(() => {
    if (currentItem && dialogRef.current) {
      if (!dialogRef.current.open) {
        dialogRef.current.showModal();
      }
    } else if (!currentItem && dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close();
    }
  }, [currentItem]);

  // Handle backdrop click
  const handleDialogClick = useCallback(
    (event: ReactMouseEvent<HTMLDialogElement>) => {
      const rect = dialogRef.current?.getBoundingClientRect();
      if (rect) {
        const clickedInDialog =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

        if (!clickedInDialog || event.target === dialogRef.current) {
          handleClose();
        }
      }
    },
    [handleClose],
  );

  // Handle native dialog cancel event (ESC key)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      handleClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [handleClose]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!currentItem) return;

      if (event.key === 'ArrowLeft' && previousItem) {
        handlePrevious();
      } else if (event.key === 'ArrowRight' && nextItem) {
        handleNext();
      } else if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentItem, previousItem, nextItem, handlePrevious, handleNext, handleClose]);

  // Reset image loaded state when slug changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      if (imageRef.current && imageRef.current.complete && imageRef.current.naturalWidth > 0) {
        setImageLoaded(true);
        setIsLoading(false);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [currentSlug]);

  if (!currentItem) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      data-testid="gallery-dialog"
      id="gallery-dialog"
      className="fixed inset-0 z-[60] m-0 max-h-screen h-screen max-w-screen w-screen bg-transparent p-0 backdrop:bg-zd-black/70"
      onClick={handleDialogClick}
      aria-labelledby={dialogTitleId}
      aria-describedby={dialogDescriptionId}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        {/* Close button */}
        <button
          data-testid="gallery-dialog-close"
          onClick={handleClose}
          className="fixed top-hgap-sm right-hgap-sm z-[100] p-vgap-xs text-zd-white hover:text-zd-gray transition-colors"
          aria-label="Close dialog"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        {/* Navigation buttons */}
        {previousItem && (
          <button
            data-testid="gallery-dialog-prev"
            onClick={handlePrevious}
            className="fixed left-hgap-xs top-[50vh] z-[100] -translate-y-1/2 rounded-full text-zd-white backdrop-blur transition-colors hover:bg-zd-white/20 p-hgap-xs"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-[50px] w-[50px]" />
          </button>
        )}

        {nextItem && (
          <button
            data-testid="gallery-dialog-next"
            onClick={handleNext}
            className="fixed right-hgap-xs top-[50vh] z-[100] -translate-y-1/2 rounded-full text-zd-white backdrop-blur transition-colors hover:bg-zd-white/20 p-hgap-xs"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-10 w-10" />
          </button>
        )}

        {/* Screen reader announcements */}
        <h2 id={dialogTitleId} className="sr-only">
          {currentItem.imageAlt || `Gallery image ${currentItem.slug}`}
        </h2>
        <p id={dialogDescriptionId} className="sr-only">
          Use the arrow keys to move through images. Press Escape to close.
        </p>

        {/* Image container */}
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="relative flex h-full w-full items-center justify-center">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="loader" />
              </div>
            )}

            <img
              ref={imageRef}
              src={currentItem.enlargedUrl}
              alt={currentItem.imageAlt || `Gallery image ${currentItem.slug}`}
              className="relative max-h-[95vh] max-w-[calc(100vw-200px)] object-contain transition-opacity duration-300 border border-zd-white"
              onLoad={() => {
                setImageLoaded(true);
                setImageError(false);
                setIsLoading(false);
              }}
              onError={() => {
                setImageLoaded(false);
                setImageError(true);
                setIsLoading(false);
              }}
              style={{
                opacity: imageLoaded ? 1 : 0,
              }}
              aria-busy={!imageLoaded && !imageError}
            />
          </div>

          {imageError && (
            <div
              role="alert"
              className="absolute inset-0 flex items-center justify-center bg-zd-black/80 px-hgap-sm text-center text-sm text-zd-gray"
            >
              Unable to load this image. Please try another item.
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
