class HttpError extends Error {

    constructor(
        public status: number,
        public name: string, 
        public message: string, 
        public extensions?: Record<string, any>
    ) {
        super(message);
    }

}

export class BadRequestError extends HttpError {
    constructor(
        public message: string, 
        public extensions?: Record<string, any>
    ) {
        super(400, 'Bad Request', message, extensions)
    }
}

export class NotFoundError extends HttpError {
    constructor(
        public message: string, 
        public extensions?: Record<string, any>
    ) {
        super(404, 'Not Found', message, extensions)
    }
}