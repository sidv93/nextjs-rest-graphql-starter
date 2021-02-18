import { db } from './config';

db.connect().catch((err: any) => {
    console.log('Mongo connection Error', err);
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('Gracefully shutting down');
    await db.disconnect();
    process.exit(0);
});
