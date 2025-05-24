export type PaginatedResponse<T> = {
    data: T[];
    page: number;
    totalPages: number;
    type: 'success'
}