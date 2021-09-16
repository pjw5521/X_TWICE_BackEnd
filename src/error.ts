import { IsInt, IsObject, IsOptional, IsString } from "class-validator";
import { HttpStatus, HttpName } from "./types/http";

export class HttpError extends Error {

    @IsInt()
    status: number;

    @IsString()
    name: string;

    @IsString()
    message: string;

    @IsOptional()
    @IsObject()
    extensions?: Record<string, any>

    constructor(
        status: number,
        name: string, 
        message: string, 
        extensions?: Record<string, any>
    ) {
        super(message);
        this.status = status;
        this.name = name;
        this.extensions = extensions;
    }

}

export class BadRequestError extends HttpError {
    constructor(
        public message: string, 
        public extensions?: Record<string, any>
    ) {
        super(HttpStatus.bad_request, HttpName.bad_request, message, extensions)
    }
}

export class UnauthorizedError extends HttpError {
    constructor(
        public message: string, 
        public extensions?: Record<string, any>
    ) {
        super(HttpStatus.unauthorized, HttpName.unauthorized, message, extensions)
    }
}

export class ForbiddenError extends HttpError {
    constructor(
        public message: string, 
        public extensions?: Record<string, any>
    ) {
        super(HttpStatus.forbidden, HttpName.forbidden, message, extensions)
    }
}

export class NotFoundError extends HttpError {
    constructor(
        public message: string, 
        public extensions?: Record<string, any>
    ) {
        super(HttpStatus.not_found, HttpName.not_found, message, extensions)
    }
}