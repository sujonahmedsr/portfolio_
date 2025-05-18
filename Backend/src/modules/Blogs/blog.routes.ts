import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/Auth";
import { Role } from "@prisma/client";
import { blogController } from "./blog.controller";
import { createBlogZodSchema, updateBlogZodSchema } from "./blog.validation";

const route = Router()

route.post('/', validateRequest(createBlogZodSchema), auth(Role.ADMIN), blogController.createBlog)
route.get('/', blogController.getAllBlogs)
route.get('/:id', blogController.getSingleBlog)
route.patch('/:id', validateRequest(updateBlogZodSchema), auth(Role.ADMIN), blogController.updateBlog)
route.delete('/:id', auth(Role.ADMIN), blogController.deleteBlog)

export const blogRoutes = route
