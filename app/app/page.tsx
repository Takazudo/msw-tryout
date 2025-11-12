'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import GalleryThumbnailGrid from '@/components/gallery-thumbnail-grid';
import GalleryDialog from '@/components/gallery-dialog';
import Pagination from '@/components/pagination';
import { fetchGalleryItems } from '@/lib/api';
import type { GalleryItem, PaginationInfo } from '@/lib/types';

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedId = searchParams.get('id');
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGalleryItems() {
      try {
        setLoading(true);
        const response = await fetchGalleryItems(currentPage, 30);
        setItems(response.items);
        setPagination(response.pagination);
        setError(null);
      } catch (err) {
        setError('Failed to load gallery items');
        console.error('Error loading gallery:', err);
      } finally {
        setLoading(false);
      }
    }

    loadGalleryItems();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Make sure you are running with `npm run dev` from the root directory
          </p>
        </div>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen p-8 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Gallery</h1>
        <p className="text-gray-400 mb-8 text-center">MSW Tryout - Simple Gallery Application</p>

        {pagination && (
          <div className="mb-6 text-center text-gray-400">
            Showing {items.length} of {pagination.totalItems} items (Page {pagination.currentPage}{' '}
            of {pagination.totalPages})
          </div>
        )}

        <GalleryThumbnailGrid items={items} />

        {pagination && <Pagination pagination={pagination} onPageChange={handlePageChange} />}

        {selectedId && <GalleryDialog items={items} currentSlug={selectedId} />}
      </div>
    </main>
  );
}
