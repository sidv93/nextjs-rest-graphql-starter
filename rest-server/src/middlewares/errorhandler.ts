import { Response, ErrorRequestHandler, Request, NextFunction } from 'express';
import { INTERNAL_SERVER_ERROR } from 'http-status';

import { GeneralError } from '../utils';

/** Disabling eslint because express needs errorhandler middlewares
 * to be in this signature (error, request, response, next). The trailing
 * next argument in the function satisfies this.
*/
/* eslint-disable @typescript-eslint/no-unused-vars */
export const handleErrors: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof GeneralError) {
        return res.status(err.getCode()).json({
            status: 'error',
            message: err.message
        });
    }

    return res.status(INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: err.message
    });
};
