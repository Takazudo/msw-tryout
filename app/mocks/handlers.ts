import { http, HttpResponse } from 'msw';
import { GalleryResponse, GalleryItem } from '../lib/types';
import {
  mockGalleryItems,
  emptyGalleryItems,
  singleGalleryItem,
  exactPageGalleryItems,
  fewGalleryItems,
} from './data';
import { type MockScenario, MSW_SCENARIO_HEADER } from './types';

// Helper function to paginate items
const paginateItems = (items: GalleryItem[], page: number, limit: number): GalleryResponse => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);
  // Handle empty results: return 0 pages instead of NaN or negative
  const totalPages = items.length === 0 ? 0 : Math.ceil(items.length / limit);

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

// Get the mock scenario from request header
// MSW handlers run in browser context with msw/browser, so we can read headers
const getMockScenario = (request: Request): MockScenario => {
  const scenario = request.headers.get(MSW_SCENARIO_HEADER);
  // Validate scenario is one of the allowed values
  if (
    scenario === 'default' ||
    scenario === 'empty' ||
    scenario === 'single' ||
    scenario === 'few' ||
    scenario === 'exact-page'
  ) {
    return scenario;
  }
  return 'default';
};

// Get the appropriate dataset based on scenario
const getDataset = (scenario: MockScenario): GalleryItem[] => {
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

    const scenario = getMockScenario(request);
    const dataset = getDataset(scenario);
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

    const scenario = getMockScenario(request);
    const dataset = getDataset(scenario);
    const item = dataset.find((item) => item.slug === slug);

    if (!item) {
      return HttpResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    return HttpResponse.json(item);
  }),
];
