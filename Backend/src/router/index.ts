import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { blogRoutes } from "../modules/Blogs/blog.routes";

const router = Router()

const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/blog',
        route: blogRoutes
    },
]

moduleRoutes.forEach(route=>router.use(route.path,route.route))

export default router