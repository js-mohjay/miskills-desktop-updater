export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}
