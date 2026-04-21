export class AppError extends Error {
    constructor(
        public message: string, 
        public statusCode: number,
        public isOperational = true // True for planned errors
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}