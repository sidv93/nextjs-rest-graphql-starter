import { inspect } from 'util';
import { logger } from './logger';

export const logErrorObject = (error: any, message: string): void => {
    logger.error(message);
    logger.error(`Error => ${inspect(error)}`);
};
