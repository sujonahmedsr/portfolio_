import express, { NextFunction, Request, Response } from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ChangePasswordSchema, LoginSchema, RegistrationSchema } from './auth.validation';
import { auth } from '../../middlewares/Auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.post(
  '/register',
  (req: Request, res: Response, next: NextFunction) => {
    console.log("From debug middleware", req.body); // 👈 Check here
    next(); // Don't forget this!
  },
  validateRequest(RegistrationSchema), // Zod validator
  AuthController.createUser // Main controller
);


router.post('/login', validateRequest(LoginSchema), AuthController.Login);

router.patch(
  '/change-password',
  auth(Role.ADMIN),
  validateRequest(ChangePasswordSchema),
  AuthController.ChangePassword,
);

router.get('/me', auth(Role.ADMIN), AuthController.GetMyProfile);

export const AuthRoutes = router;