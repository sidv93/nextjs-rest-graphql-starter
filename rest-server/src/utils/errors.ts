import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT } from 'http-status';

export class GeneralError extends Error {
    constructor (message: string) {
        super();
        Object.setPrototypeOf(this, GeneralError.prototype);
        this.message = message;
    }

    getCode (): number {
        if (this instanceof BadRequest) {
            return BAD_REQUEST;
        }
        if (this instanceof NotFound) {
            return NOT_FOUND;
        }
        if (this instanceof Conflict) {
            return CONFLICT;
        }
        return INTERNAL_SERVER_ERROR;
    }
}

export class BadRequest extends GeneralError {
    constructor (message: string) {
        super(message);
        Object.setPrototypeOf(this, BadRequest.prototype);
    }
}
export class NotFound extends GeneralError {
    constructor (message: string) {
        super(message);
        Object.setPrototypeOf(this, NotFound.prototype);
    }
}

export class Conflict extends GeneralError {
    constructor (message: string) {
        super(message);
        Object.setPrototypeOf(this, Conflict.prototype);
    }
}
