type Paginated<T> = {
    data: T[];
    page: number;
    totalPages: number;
};

type PaginatedResponse<T> = ApiSuccessResponse<Paginated<T>>;
type ApiSuccessResponse<T> = T & {
    type: "success";
};
type ApiErrorResponse = {
    message: string;
    statusCode: number;
    type: 'error';
}
export {
    PaginatedResponse,
    ApiSuccessResponse,
    ApiErrorResponse
}