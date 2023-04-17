export const PAGINATE_LIMIT = 20; // min 1

export const paginate = (
  page: number = 1,
  limit: number = PAGINATE_LIMIT,
): { offset: number; limit: number } => {
  const offset = (page - 1) * limit;

  return {
    offset,
    limit,
  };
};
