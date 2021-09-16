export enum HttpStatus {
    success = 200,
    bad_request = 400,
    unauthorized = 401,
    forbidden = 403,
    not_found = 404,
    internal_server = 500
}

export enum HttpName {
    success = "Success Response",
    bad_request = "Bad Request",
    unauthorized = "Unauthorized",
    forbidden = "Forbidden",
    not_found = "Not Found",
    internal_server = "Internal Server Error"
}

export enum HttpContentType {
    json = "application/json"
}