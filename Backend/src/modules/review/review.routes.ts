import express from 'express';
import { Role } from '@prisma/client';
import ReviewController from './review.controller';
import { auth } from '../../middlewares/Auth';

const router = express.Router();

router
  .route('/:id/reviews')
  .get(auth(Role.USER), ReviewController.GetReviews)
  .post(auth(Role.USER), ReviewController.SubmitReview);

router
  .route('/:id')
  .put(auth(Role.USER), ReviewController.UpdateReview)
  .delete(auth(Role.USER), ReviewController.DeleteReview);

export const ReviewRoutes = router;