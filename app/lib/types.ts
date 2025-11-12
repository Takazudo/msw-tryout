export interface GalleryItem {
  slug: string;
  imageAlt: string;
  blurhash: string;
  thumbnailUrl: string;
  enlargedUrl: string;
  user: string;
  description: string;
  created_at: string;
  hashtags: string[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GalleryResponse {
  items: GalleryItem[];
  pagination: PaginationInfo;
}
