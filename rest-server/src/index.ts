// eslint-disable-file import/first

import dotnev from 'dotenv';
dotnev.config();
import app from './app';
import { logger } from './utils';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from './entity/User';

// createConnection().then(async connection => {

//     console.log('Inserting a new user into the database...');
//     const user = new User();
//     user.firstName = 'Timber';
//     user.lastName = 'Saw';
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log('Saved a new user with id: ' + user.id);

//     console.log('Loading users from the database...');
    

//     console.log('Here you can setup and run express/koa/any other framework.');

// }).catch(error => console.log(error));


app.listen(app.get('port'), (): void => {
    console.log(`API server running at port ${app.get('port')}`);
    logger.info(`API server running at port ${app.get('port')}`);
});
