import { Request } from 'express';

export interface IRequest<T> extends Request {
    body: T;
}

type Type = '$match' | '$sort' | '$limit' | '$skip' | '$project';

export type Pipeline = {
    /* eslint-disable-next-line */
    [key in Type]?: any;
}
