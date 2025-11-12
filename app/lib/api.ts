import { GalleryResponse, GalleryItem } from './types';

// When running with netlify dev, the API will be available at /api/*
// which gets redirected to /.netlify/functions/*
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchGalleryItems(
  page: number = 1,
  limit: number = 30,
): Promise<GalleryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/gallery?page=${page}&limit=${limit}`);

  if (!response.ok) {
    throw new Error('Failed to fetch gallery items');
  }

  return response.json();
}

export async function fetchGalleryItem(slug: string): Promise<GalleryItem> {
  const response = await fetch(`${API_BASE_URL}/api/gallery-item?slug=${slug}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch gallery item: ${slug}`);
  }

  return response.json();
}
