import { GalleryItem } from '../lib/types';

// Sample gallery items for mocking
const createGalleryItem = (index: number): GalleryItem => ({
  slug: `mock-panels-gallery-${index}`,
  imageAlt: `Mock gallery image ${index}`,
  blurhash: 'UFFNxM^d=D~9:kJ.o~EMnAnTIWNf%L=Z-6b^',
  thumbnailUrl: `https://takazudomodular.com/img/panels/thumbnail/panels-gallery-zudo-blocks-${index}.webp`,
  enlargedUrl: `https://takazudomodular.com/img/panels/enlarged/panels-gallery-zudo-blocks-${index}.webp`,
});

// Generate 260 items (same as real data)
export const mockGalleryItems: GalleryItem[] = Array.from({ length: 260 }, (_, i) =>
  createGalleryItem(i + 1),
);

// Empty dataset for testing "no results" scenario
export const emptyGalleryItems: GalleryItem[] = [];

// Single item for edge case testing
export const singleGalleryItem: GalleryItem[] = [createGalleryItem(1)];

// Exactly 30 items (one full page)
export const exactPageGalleryItems: GalleryItem[] = Array.from({ length: 30 }, (_, i) =>
  createGalleryItem(i + 1),
);

// Few items (less than one page)
export const fewGalleryItems: GalleryItem[] = Array.from({ length: 5 }, (_, i) =>
  createGalleryItem(i + 1),
);
