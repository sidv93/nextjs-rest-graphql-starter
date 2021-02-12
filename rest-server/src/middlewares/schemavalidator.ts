import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'yup';
import { BadRequest, logger } from '../utils';
import { inspect } from 'util';

interface ValidatorProps {
    schema: ObjectSchema;
    location: 'body' | 'query';
}

export const validateSchema = ({ schema, location = 'body' }: ValidatorProps) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validData = await schema.validate(req[location], { stripUnknown: true });
        req[location] = validData;
        return next();
    } catch (error) {
        logger.error('Error during schema validation');
        logger.error(`Error => ${inspect(error)}`);
        return next(new BadRequest(`${error.message}`));
    }
};
