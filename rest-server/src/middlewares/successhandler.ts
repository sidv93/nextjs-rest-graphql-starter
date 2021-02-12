import { Response, Request, NextFunction, ErrorRequestHandler } from 'express';
import { ApiSuccess } from '../utils';
import { OK } from 'http-status';

export const handleSuccess: ErrorRequestHandler = (payload: ApiSuccess, req: Request, res: Response, next: NextFunction) => {
    if (payload instanceof ApiSuccess) {
        return res.status(OK).json({
            status: 'success',
            message: payload.message,
            data: payload.data
        });
    }

    return next(payload);
};
