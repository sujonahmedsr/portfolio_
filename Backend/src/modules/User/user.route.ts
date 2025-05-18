import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userSchema } from "./user.validation";

const router = Router()

router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserByEmail)
router.post('/', validateRequest(userSchema), userController.createUser)

export const UserRoutes = router