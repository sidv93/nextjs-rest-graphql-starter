// eslint-disable-file import/first

import * as dotenv from 'dotenv';
dotenv.config();
import * as express from 'express';
import { buildSchema } from 'type-graphql';
import { logger } from './utils';
import 'reflect-metadata';
import { db } from './config';
import { BookResolver, UserResolver } from './resolvers';
import { ApolloServer } from 'apollo-server-express';


const bootstrap = async () => {
    db.connect().catch((err: any) => {
        console.log('Mongo connection Error', err);
        process.exit(0);
    });

    process.on('SIGINT', async () => {
        console.log('Gracefully shutting down');
        await db.disconnect();
        process.exit(0);
    });

    const schema = await buildSchema({
        resolvers: [UserResolver, BookResolver]
    });

    const server = new ApolloServer({ schema });
    server.graphqlPath = '/graphql';
    const app = express();
    server.applyMiddleware({ app });

    app.listen({ port: process.env.API_PORT }, () =>
        logger.info(`🚀 Server ready at http://localhost${server.graphqlPath}`)
    );
}

bootstrap();
