import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ChangePasswordSchema, LoginSchema, RegistrationSchema } from './auth.validation';
import { auth } from '../../middlewares/Auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/register', validateRequest(RegistrationSchema), AuthController.Login);

router.post('/login', validateRequest(LoginSchema), AuthController.Login);

router.patch(
  '/change-password',
  auth(Role.ADMIN),
  validateRequest(ChangePasswordSchema),
  AuthController.ChangePassword,
);

router.get('/me', auth(Role.ADMIN), AuthController.GetMyProfile);

export const AuthRoutes = router;