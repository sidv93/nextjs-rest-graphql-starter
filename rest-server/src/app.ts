import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import { db } from './config';
import router from './routes';
import { successhandler, errorhandler } from './middlewares';

const app = express();

app.set('port', process.env.API_PORT || 80);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

const corsOptions = {
    methods: 'GET,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type'
};

app.use(cors(corsOptions));

db.connect().catch((err: any) => {
    console.log('Mongo connection Error', err);
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('Gracefully shutting down');
    await db.disconnect();
    process.exit(0);
});

app.use(router);
app.use(successhandler);
app.use(errorhandler);

export default app;
