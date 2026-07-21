/**
 * PulseCare AI - UserPagination Component
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const UserPagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  className = '',
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/40 font-sans ${className}`}>
      <div className="flex items-center space-x-2 text-xs text-muted-foreground font-mono">
        <span>
          Showing {startItem}-{endItem} of {totalItems} entries
        </span>
        {onItemsPerPageChange && (
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="bg-accent/40 border border-border/60 rounded-xl px-2 py-1 text-xs text-foreground outline-none ml-2"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        )}
      </div>

      <div className="flex items-center space-x-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-xl border border-border/60 hover:bg-accent text-muted-foreground hover:text-foreground transition-all disabled:opacity-40"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-mono font-bold px-3 py-1 bg-accent/40 rounded-xl">
          Page {currentPage} of {Math.max(totalPages, 1)}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-xl border border-border/60 hover:bg-accent text-muted-foreground hover:text-foreground transition-all disabled:opacity-40"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default UserPagination;
