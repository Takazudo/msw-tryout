import { GalleryItem } from '../lib/types';

// Real image numbers that exist on takazudomodular.com
// These correspond to actual images available at:
// https://takazudomodular.com/static/images/p/panels-gallery-zudo-blocks-{number}/600w.webp
const REAL_IMAGE_NUMBERS = [
  141, 142, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119,
  120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138,
  139, 140, 85, 86, 87, 88, 89, 94, 95, 96, 97, 98, 99, 100, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
  37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84,
  101, 102,
];

// Sample gallery items for mocking
const users = ['Bob', 'Alice', 'Takazudo'];
const hashtags = [
  ['eurorack', 'modularsynth', 'DIY'],
  ['synthbuilder', 'eurorack', 'handmade'],
  ['modular', 'synthesizer', 'electronics'],
  ['DIYsynth', 'modular', 'eurorack'],
];

const createGalleryItem = (index: number, imageNumber: number): GalleryItem => {
  const user = users[index % users.length];
  const tagSet = hashtags[index % hashtags.length];
  // Pad image number with leading zeros (e.g., 1 -> "001", 101 -> "101")
  const paddedNumber = String(imageNumber).padStart(3, '0');

  return {
    slug: `panels-gallery-zudo-blocks-${paddedNumber}`,
    imageAlt: ``,
    blurhash: 'UFFNxM^d=D~9:kJ.o~EMnAnTIWNf%L=Z-6b^',
    thumbnailUrl: `https://takazudomodular.com/static/images/p/panels-gallery-zudo-blocks-${paddedNumber}/600w.webp`,
    enlargedUrl: `https://takazudomodular.com/static/images/p/panels-gallery-zudo-blocks-${paddedNumber}/1600w.webp`,
    user,
    description: `Mock description for ${user}'s modular synthesizer build. This is a DIY eurorack module showcasing custom panel design and creative circuit work.`,
    created_at: new Date(2024, 0, (index % 365) + 1).toISOString(),
    hashtags: tagSet,
  };
};

// Generate items using real image numbers, cycling through them to reach 260 items
export const mockGalleryItems: GalleryItem[] = Array.from({ length: 260 }, (_, i) => {
  const imageNumber = REAL_IMAGE_NUMBERS[i % REAL_IMAGE_NUMBERS.length];
  return createGalleryItem(i, imageNumber);
});

// Empty dataset for testing "no results" scenario
export const emptyGalleryItems: GalleryItem[] = [];

// Single item for edge case testing
export const singleGalleryItem: GalleryItem[] = [createGalleryItem(0, REAL_IMAGE_NUMBERS[0])];

// Exactly 30 items (one full page)
export const exactPageGalleryItems: GalleryItem[] = Array.from({ length: 30 }, (_, i) => {
  const imageNumber = REAL_IMAGE_NUMBERS[i % REAL_IMAGE_NUMBERS.length];
  return createGalleryItem(i, imageNumber);
});

// Few items (less than one page)
export const fewGalleryItems: GalleryItem[] = Array.from({ length: 5 }, (_, i) => {
  const imageNumber = REAL_IMAGE_NUMBERS[i % REAL_IMAGE_NUMBERS.length];
  return createGalleryItem(i, imageNumber);
});
