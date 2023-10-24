import express from 'express';
import { getUsers, getUser, createUser, deleteUser, updateUser, userLogin, resetUserPassword, sendResetPasswordEmail } from '../controllers/usersController';
import { authorization } from '../middlewares/authorization';

export const usersRouter = express.Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:id', authorization, getUser);
usersRouter.post('/', createUser);
usersRouter.put('/:id', authorization, updateUser);
usersRouter.delete('/:id', authorization, deleteUser);
usersRouter.post('/login', userLogin);
usersRouter.patch('/reset-password',authorization, resetUserPassword);
usersRouter.post('/send-email', sendResetPasswordEmail);

