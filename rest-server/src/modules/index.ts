import express from 'express';
import v1 from './v1.0';
const router = express.Router({ mergeParams: true });

router.use('/v1.0/', v1);

export default router;
