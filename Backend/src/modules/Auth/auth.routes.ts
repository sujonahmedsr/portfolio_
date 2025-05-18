import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ChangePasswordSchema, LoginSchema } from './auth.validation';
import { auth } from '../../middlewares/Auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/login', validateRequest(LoginSchema), AuthController.Login);
router.patch(
  '/change-password',
  auth(Role.ADMIN, Role.USER),
  validateRequest(ChangePasswordSchema),
  AuthController.ChangePassword,
);

router.get('/me', auth(Role.ADMIN, Role.USER), AuthController.GetMyProfile);

export const AuthRoutes = router;