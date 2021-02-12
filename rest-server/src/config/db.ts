import mongoose, { ConnectionOptions, Mongoose } from 'mongoose';

const MONGO_URL = process.env.MONGO_SERVER_ADDRESS || 'mongo';
const connectionString = `mongodb://${MONGO_URL}/${process.env.MONGO_INITDB_DATABASE}`;

const mongooseOptions: ConnectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    user: process.env.MONGO_USER_NAME,
    pass: process.env.MONGO_USER_PASSWORD
};

const connect = (): Promise<Mongoose> => {
    return mongoose.connect(connectionString, mongooseOptions);
};

const disconnect = (): Promise<void> => {
    return mongoose.connection.close();
};

export default { connect, disconnect };
