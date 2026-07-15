/**
 * Utility helper to extract database limit and offset parameters
 * @param {number|string} page - 1-indexed current page number
 * @param {number|string} limit - records count per page page
 */
const getPagination = (page, limit) => {
  const defaultLimit = 10;
  const parsedLimit = limit ? parseInt(limit, 10) : defaultLimit;
  const parsedPage = page ? parseInt(page, 10) : 1;

  // Enforce a hard cap of 100 records per query page
  const dbLimit = parsedLimit > 100 ? 100 : parsedLimit;
  const dbOffset = (parsedPage - 1) * dbLimit;

  return {
    limit: dbLimit,
    offset: dbOffset >= 0 ? dbOffset : 0,
  };
};

/**
 * Utility helper to compile list rows and row counts into structured response metadata
 * @param {object} data - Sequelize findAndCountAll payload results ({ count, rows })
 * @param {number} page - 1-indexed page
 * @param {number} limit - requested page items size
 */
const getPaginatedData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? parseInt(page, 10) : 1;
  const requestedLimit = limit ? parseInt(limit, 10) : 10;
  const totalPages = Math.ceil(totalItems / requestedLimit);

  return {
    totalItems,
    items,
    totalPages,
    currentPage,
  };
};

module.exports = {
  getPagination,
  getPaginatedData,
};
