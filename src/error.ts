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

export class NotFoundError extends HttpError {
    constructor(
        public message, 
        public extensions?: Record<string, any>
    ) {
        super(404, 'NotFound', message, extensions)
    }
}
