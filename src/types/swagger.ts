import { HttpContentType, HttpName, HttpStatus } from "./http"

export interface IResponseOptions {
    contentType?: string;
    description?: string;
    statusCode?: string | number;
    isArray?: boolean;
};

export const SuccessReponse = {
    [HttpStatus.success] : {
        contentType: HttpContentType.json,
        description: HttpName.success,
        isArray: false
    }
} as IResponseOptions

export const BadRequestResponse = {
    [HttpStatus.bad_request]: {
        contentType: HttpContentType.json,
        description: HttpName.bad_request,
        isArray: false
    } as IResponseOptions
}

export const UnauthorizedResponse = {
    [HttpStatus.unauthorized]: {
        contentType: HttpContentType.json,
        description: HttpName.unauthorized,
        isArray: false
    } as IResponseOptions
}

export const ForbidenRespone = {
    [HttpStatus.forbidden]: {
        contentType: HttpContentType.json,
        description: HttpName.forbidden,
        isArray: false
    } as IResponseOptions
}

export const NotFoundResponse = {
    [HttpStatus.not_found]: {
        contentType: HttpContentType.json,
        description: HttpName.not_found,
        isArray: false
    } as IResponseOptions
}

export const InternalServerResponse = {
    [HttpStatus.internal_server]: {
        contentType: HttpContentType.json,
        description: HttpName.internal_server,
        isArray: false
    } as IResponseOptions
}