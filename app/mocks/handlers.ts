import { http, HttpResponse } from 'msw';
import { GalleryResponse, GalleryItem } from '../lib/types';
import {
  mockGalleryItems,
  emptyGalleryItems,
  singleGalleryItem,
  exactPageGalleryItems,
  fewGalleryItems,
} from './data';

// Helper function to paginate items
const paginateItems = (items: GalleryItem[], page: number, limit: number): GalleryResponse => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(items.length / limit);

  return {
    items: paginatedItems,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: items.length,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

// Get the mock scenario from localStorage or default to 'default'
const getMockScenario = (): string => {
  // Service workers have access to self, not window
  // But they don't have access to localStorage directly
  // Instead, we'll use a message-based approach or check in the browser context
  if (typeof window !== 'undefined') {
    // Browser environment - read from localStorage
    return localStorage.getItem('msw_scenario') || 'default';
  }
  // Service worker context - default scenario
  // Note: The scenario will be read from localStorage in browser context
  // before the request reaches the service worker
  return 'default';
};

// Get the appropriate dataset based on scenario
const getDataset = (): GalleryItem[] => {
  const scenario = getMockScenario();

  switch (scenario) {
    case 'empty':
      return emptyGalleryItems;
    case 'single':
      return singleGalleryItem;
    case 'exact-page':
      return exactPageGalleryItems;
    case 'few':
      return fewGalleryItems;
    default:
      return mockGalleryItems;
  }
};

export const handlers = [
  // Mock GET /api/gallery
  http.get('/api/gallery', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '30', 10);

    const dataset = getDataset();
    const response = paginateItems(dataset, page, limit);

    return HttpResponse.json(response);
  }),

  // Mock GET /api/gallery-item
  http.get('/api/gallery-item', ({ request }) => {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
      return HttpResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    const dataset = getDataset();
    const item = dataset.find((item) => item.slug === slug);

    if (!item) {
      return HttpResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    return HttpResponse.json(item);
  }),
];
