import express from 'express';
import { Role } from '@prisma/client';
import PaymentController from './payment.controller';
import { auth } from '../../middlewares/Auth';

const router = express.Router();

router.post(
  '/intent/:participant_id',
  auth(Role.USER),
  PaymentController.CreatePaymentIntent,
);

router.post('/ipn_listener', PaymentController.VerifyPayment);

export const PaymentRoutes = router;