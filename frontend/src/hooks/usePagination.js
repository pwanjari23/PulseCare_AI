import { useState, useCallback } from 'react';

export const usePagination = (initialPage = 1, initialPageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / pageSize);

  const setPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages || Infinity)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    setPage(currentPage + 1);
  }, [currentPage, setPage]);

  const prevPage = useCallback(() => {
    setPage(currentPage - 1);
  }, [currentPage, setPage]);

  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    setPage,
    setPageSize,
    setTotalItems,
    nextPage,
    prevPage,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
  };
};

export default usePagination;
