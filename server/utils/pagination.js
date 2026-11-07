const parsePagination = (query = {}) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const requestedLimit = Number.parseInt(query.limit, 10) || 10;
  const limit = Math.min(50, Math.max(1, requestedLimit));

  return { page, limit };
};

const buildPagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
  };
};

module.exports = { parsePagination, buildPagination };
