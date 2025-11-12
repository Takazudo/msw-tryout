import { PaginationInfo } from '@/lib/types';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { currentPage, totalPages, hasPreviousPage, hasNextPage } = pagination;

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
    <div className="flex items-center justify-center gap-hgap-xs py-vgap-lg">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className="px-hgap-sm py-vgap-xs rounded-sm bg-zd-gray2 text-zd-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zd-active transition-colors border border-zd-white"
      >
        Previous
      </button>

      <div className="flex gap-hgap-2xs">
        {currentPage > 3 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-hgap-xs py-vgap-xs rounded-sm bg-zd-gray2 text-zd-white hover:bg-zd-active transition-colors border border-zd-white"
            >
              1
            </button>
            {currentPage > 4 && (
              <span className="px-hgap-xs py-vgap-xs text-zd-gray">...</span>
            )}
          </>
        )}

        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-hgap-xs py-vgap-xs rounded-sm transition-colors border border-zd-white ${
              pageNum === currentPage
                ? 'bg-zd-strong text-zd-black font-bold'
                : 'bg-zd-gray2 text-zd-white hover:bg-zd-active'
            }`}
          >
            {pageNum}
          </button>
        ))}

        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && (
              <span className="px-hgap-xs py-vgap-xs text-zd-gray">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-hgap-xs py-vgap-xs rounded-sm bg-zd-gray2 text-zd-white hover:bg-zd-active transition-colors border border-zd-white"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="px-hgap-sm py-vgap-xs rounded-sm bg-zd-gray2 text-zd-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zd-active transition-colors border border-zd-white"
      >
        Next
      </button>
    </div>
  );
}
