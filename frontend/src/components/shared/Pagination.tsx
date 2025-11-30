import { ChevronLeft, ChevronRight } from 'react-feather';

import { PaginationMeta } from '../../models/common/Pagination';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
  const page = Number(meta.page);
  const totalPages = Number(meta.totalPages);
  const total = Number(meta.total);
  const limit = Number(meta.limit);
  const { hasNextPage, hasPrevPage } = meta;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (page > 3) pages.push('...');

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 2) pages.push('...');

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
      <span className="text-sm text-gray-600">
        Showing {startItem}-{endItem} of {total} results
      </span>

      <div className="flex items-center gap-1">
        <button
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        {getPageNumbers().map((pageNum, idx) =>
          typeof pageNum === 'number' ? (
            <button
              key={idx}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                pageNum === page
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          ) : (
            <span key={idx} className="px-2 text-gray-400">
              {pageNum}
            </span>
          ),
        )}

        <button
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
