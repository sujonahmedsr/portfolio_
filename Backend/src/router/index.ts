import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { blogRoutes } from "../modules/Blogs/blog.routes";
import { projectRoutes } from "../modules/Projects/project.routes";
import { skillRoutes } from "../modules/Skills/skill.routes";
import { experienceRoutes } from "../modules/Experience/experience.route";

const router = Router()

const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/blogs',
        route: blogRoutes
    },
    {
        path: '/projects',
        route: projectRoutes
    },
    {
        path: '/skills',
        route: skillRoutes
    },
    {
        path: '/experiences',
        route: experienceRoutes
    },
]

moduleRoutes.forEach(route=>router.use(route.path,route.route))

export default router