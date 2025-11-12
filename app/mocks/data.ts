import { GalleryItem } from '../lib/types';

// Sample gallery items for mocking
const users = ['Bob', 'Alice', 'Takazudo'];
const hashtags = [
  ['eurorack', 'modularsynth', 'DIY'],
  ['synthbuilder', 'eurorack', 'handmade'],
  ['modular', 'synthesizer', 'electronics'],
  ['DIYsynth', 'modular', 'eurorack'],
];

const createGalleryItem = (index: number): GalleryItem => {
  const user = users[index % users.length];
  const tagSet = hashtags[index % hashtags.length];

  return {
    slug: `mock-panels-gallery-${index}`,
    imageAlt: `Mock gallery image ${index}`,
    blurhash: 'UFFNxM^d=D~9:kJ.o~EMnAnTIWNf%L=Z-6b^',
    thumbnailUrl: `https://takazudomodular.com/img/panels/thumbnail/panels-gallery-zudo-blocks-${index}.webp`,
    enlargedUrl: `https://takazudomodular.com/img/panels/enlarged/panels-gallery-zudo-blocks-${index}.webp`,
    user,
    description: `Mock description for ${user}'s modular synthesizer build #${index}. This is a DIY eurorack module showcasing custom panel design and creative circuit work.`,
    created_at: new Date(2024, 0, (index % 365) + 1).toISOString(),
    hashtags: tagSet,
  };
};

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
