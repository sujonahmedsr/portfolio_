import express from 'express';
import { Role } from '@prisma/client';
import AdminController from './admin.controller';
import { auth } from '../../middlewares/Auth';

const router = express.Router();

router.route('/users').get(auth(Role.ADMIN), AdminController.GetAllUsers);

router
  .route('/users/:id/delete')
  .patch(auth(Role.ADMIN), AdminController.DeleteUser);

router.route('/events').get(auth(Role.ADMIN), AdminController.GetAllEvents);

router
  .route('/events/:id/delete')
  .patch(auth(Role.ADMIN), AdminController.DeleteEvent);

export const AdminRoutes = router;