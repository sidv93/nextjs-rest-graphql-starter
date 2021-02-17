import { Connection, createConnection } from 'typeorm';
import { User } from '../entity/User';

let mongodbConnection: Connection;

const connect = async (): Promise<void> => {
    mongodbConnection =  await createConnection();
    const users = await mongodbConnection.manager.find(User);
    console.log('Loaded users: ', users);
}

const disconnect = (): Promise<void> => {
    return mongodbConnection.close();
};

export default { connect, disconnect }
