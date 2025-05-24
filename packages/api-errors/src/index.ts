class AppError extends Error {
    public statusCode: number;
    constructor(message: string, statusCode: number, ErrorType?: string) {
        super(message);
        this.name = ErrorType || 'AppError';
        this.statusCode = statusCode;
    }
    // construct error log message with time of day
    getErrorLogMessage() {
        const date = new Date();
        const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return `[ERROR_LOG]-[${time}]: ${this.message} with status code ${this.statusCode}`;
    }
    // prevent parent constructor from being called
}

class BadRequestError extends AppError {
    constructor(message: string) {
        super(message, 400, 'BadRequestError');
    }
}
class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message, 401, 'UnauthorizedError');
    }
}
class ForbiddenError extends AppError {
    constructor(message: string) {
        super(message, 403, 'ForbiddenError');
    }
}
class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404, 'NotFoundError');
    }
}
class InternalServerError extends AppError {
    constructor(message: string) {
        super(message, 500, 'InternalServerError');
    }
}
export {
    AppError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    InternalServerError
}
