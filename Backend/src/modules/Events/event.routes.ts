import { Router } from "express";
import { eventController } from "./event.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createEventZodSchema, updateEventZodSchema } from "./event.validation";
import { auth } from "../../middlewares/Auth";
import { Role } from "@prisma/client";

const route = Router()

route.post('/', validateRequest(createEventZodSchema), auth(Role.USER), eventController.createEvent)
route.get('/', eventController.getAllEvents)
route.get('/:id', eventController.getSingleEvent)
route.patch('/:id', validateRequest(updateEventZodSchema), auth(Role.USER), eventController.updateEvent)
route.delete('/:id', auth(Role.USER, Role.ADMIN), eventController.deleteEvent)
route.delete('/:id/admin', auth(Role.ADMIN), eventController.deleteEvent)

export const EventRoutes = route
