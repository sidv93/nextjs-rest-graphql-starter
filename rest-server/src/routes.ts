import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './openapi.json'; // Sample openapi doc
import routes from './modules';
const router = express.Router();

router.use('/api/docs', swaggerUi.serve);
router.get('/api/docs', swaggerUi.setup(swaggerDocument));

router.use('/api/', routes);

export default router;
