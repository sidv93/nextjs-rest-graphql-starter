import express from 'express';
import { schemaValidator } from '../../../middlewares';
import { UserSchema, UserQuerySchema, UserEditSchema } from '../../../validators';
import { registerUser, fetchUsers, updateUser, deleteUser } from './user';
const router = express.Router({ mergeParams: true });

router.post('/', schemaValidator({ schema: UserSchema, location: 'body' }), registerUser);
router.get('/', schemaValidator({ schema: UserQuerySchema, location: 'query' }), fetchUsers);
router.patch('/:id', schemaValidator({ schema: UserEditSchema, location: 'body' }), updateUser);
router.delete('/:id', deleteUser);

export default router;
