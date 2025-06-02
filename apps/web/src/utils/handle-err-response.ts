import { ApiErrorResponse } from "#/services";
import { AppError } from "@designr/api-errors";
import { NextResponse } from "next/server";

const handleErrResponse = (err: any, response: typeof NextResponse) => {
    const errorResponse: ApiErrorResponse = {
        message: 'Internal Server Error',
        statusCode: 500,
        type: 'error',
    }
    if (err instanceof AppError) {
        console.error(err.getErrorLogMessage());
        let { message, statusCode } = errorResponse;
        statusCode = err.statusCode || 500;
        message = err.message;
    }
    return response
        .json(
            errorResponse,
            {
                status: errorResponse.statusCode
            })
}
export {
    handleErrResponse
}