// eslint-disable-file import/first

import dotnev from 'dotenv';
dotnev.config();
import app from './app';
import { logger } from './utils';
import 'reflect-metadata';

app.listen(app.get('port'), (): void => {
    console.log(`API server running at port ${app.get('port')}`);
    logger.info(`API server running at port ${app.get('port')}`);
});
