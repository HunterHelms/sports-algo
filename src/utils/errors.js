export class APIError extends Error {
    constructor(message, status, code) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.code = code;
    }
}

export const ERROR_CODES = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    API_ERROR: 'API_ERROR',
    RATE_LIMIT: 'RATE_LIMIT',
    DATA_PARSING: 'DATA_PARSING',
    NOT_FOUND: 'NOT_FOUND'
};

export const getErrorMessage = (error) => {
    if (error instanceof APIError) {
        switch (error.code) {
            case ERROR_CODES.NETWORK_ERROR:
                return 'Unable to connect to the server. Please check your internet connection.';
            case ERROR_CODES.RATE_LIMIT:
                return 'Too many requests. Please try again later.';
            case ERROR_CODES.NOT_FOUND:
                return 'The requested data was not found.';
            default:
                return error.message || 'An unexpected error occurred.';
        }
    }
    return 'An unexpected error occurred. Please try again later.';
};
