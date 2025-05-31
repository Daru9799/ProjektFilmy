export interface PaginationResponse<T> {
  data: { $values: T[] };
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
