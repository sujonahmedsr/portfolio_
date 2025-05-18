import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { EventRoutes } from "../modules/Events/event.routes";
import { ParticipantRoutes } from "../modules/Participant/participant.routes";

const router = Router()

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/event',
        route: EventRoutes
    },
    {
        path: '/participant',
        route: ParticipantRoutes
    },
]

moduleRoutes.forEach(route=>router.use(route.path,route.route))

export default router