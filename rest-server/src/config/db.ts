import { Connection, createConnection } from 'typeorm';

let mongodbConnection: Connection;

const connect = async (): Promise<void> => {
    mongodbConnection = await createConnection();
}

const disconnect = (): Promise<void> => {
    return mongodbConnection.close();
};

export default { connect, disconnect }
