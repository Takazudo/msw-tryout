'use client';

import { PaginationInfo } from '@/lib/types';
import { usePathname, useSearchParams } from 'next/navigation';
import type { MouseEvent } from 'react';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

function isModifiedEvent(event: MouseEvent): boolean {
  return !!(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0);
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { currentPage, totalPages, hasPreviousPage, hasNextPage } = pagination;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div
      className="flex items-center justify-center gap-hgap-xs py-vgap-lg"
      data-testid="pagination"
    >
      {hasPreviousPage ? (
        <a
          href={buildPageUrl(currentPage - 1)}
          onClick={(e) => {
            if (isModifiedEvent(e)) return;
            e.preventDefault();
            onPageChange(currentPage - 1);
          }}
          className="px-hgap-sm py-vgap-xs rounded-sm bg-zd-gray2 text-zd-white hover:bg-zd-active transition-colors border border-zd-white"
        >
          Previous
        </a>
      ) : (
        <span
          role="button"
          aria-disabled="true"
          className="px-hgap-sm py-vgap-xs rounded-sm bg-zd-gray2 text-zd-white opacity-50 cursor-not-allowed border border-zd-white"
        >
          Previous
        </span>
      )}

      <div className="flex gap-hgap-2xs">
        {currentPage > 3 && (
          <>
            <a
              href={buildPageUrl(1)}
              onClick={(e) => {
                if (isModifiedEvent(e)) return;
                e.preventDefault();
                onPageChange(1);
              }}
              className="px-hgap-xs py-vgap-xs rounded-sm bg-zd-gray2 text-zd-white hover:bg-zd-active transition-colors border border-zd-white"
            >
              1
            </a>
            {currentPage > 4 && (
              <span className="px-hgap-xs py-vgap-xs text-zd-gray">...</span>
            )}
          </>
        )}

        {getPageNumbers().map((pageNum) => {
          const isCurrentPage = pageNum === currentPage;
          return isCurrentPage ? (
            <span
              key={pageNum}
              aria-current="page"
              className="px-hgap-xs py-vgap-xs rounded-sm bg-zd-strong text-zd-black font-bold border border-zd-white"
            >
              {pageNum}
            </span>
          ) : (
            <a
              key={pageNum}
              href={buildPageUrl(pageNum)}
              onClick={(e) => {
                if (isModifiedEvent(e)) return;
                e.preventDefault();
                onPageChange(pageNum);
              }}
              className="px-hgap-xs py-vgap-xs rounded-sm transition-colors border border-zd-white bg-zd-gray2 text-zd-white hover:bg-zd-active"
            >
              {pageNum}
            </a>
          );
        })}

        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && (
              <span className="px-hgap-xs py-vgap-xs text-zd-gray">...</span>
            )}
            <a
              href={buildPageUrl(totalPages)}
              onClick={(e) => {
                if (isModifiedEvent(e)) return;
                e.preventDefault();
                onPageChange(totalPages);
              }}
              className="px-hgap-xs py-vgap-xs rounded-sm bg-zd-gray2 text-zd-white hover:bg-zd-active transition-colors border border-zd-white"
            >
              {totalPages}
            </a>
          </>
        )}
      </div>

      {hasNextPage ? (
        <a
          href={buildPageUrl(currentPage + 1)}
          onClick={(e) => {
            if (isModifiedEvent(e)) return;
            e.preventDefault();
            onPageChange(currentPage + 1);
          }}
          className="px-hgap-sm py-vgap-xs rounded-sm bg-zd-gray2 text-zd-white hover:bg-zd-active transition-colors border border-zd-white"
        >
          Next
        </a>
      ) : (
        <span
          role="button"
          aria-disabled="true"
          className="px-hgap-sm py-vgap-xs rounded-sm bg-zd-gray2 text-zd-white opacity-50 cursor-not-allowed border border-zd-white"
        >
          Next
        </span>
      )}
    </div>
  );
}
