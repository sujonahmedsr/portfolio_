import { Router } from "express";
import { participantController } from "./participant.controller";
import { auth } from "../../middlewares/Auth";
import { Role } from "@prisma/client";

const route = Router()

route.post('/:eventId/join', auth(Role.USER), participantController.createParticipant)
route.get("/:eventId/participants", auth(Role.USER, Role.ADMIN), participantController.participants)

route.patch(
    '/:id/approve',
    auth(Role.ADMIN, Role.USER),
    participantController.ApproveParticipant,
);

route.patch(
    '/:id/reject',
    auth(Role.ADMIN, Role.USER),
    participantController.RejectParticipant,
);
export const ParticipantRoutes = route