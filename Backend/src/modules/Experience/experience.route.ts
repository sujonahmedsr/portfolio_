import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  createExperienceZodSchema,
  updateExperienceZodSchema,
} from "./experience.validation";
import { experienceController } from "./experience.controller";
import { auth } from "../../middlewares/Auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/", validateRequest(createExperienceZodSchema), auth(Role.ADMIN), experienceController.createExperience);
router.get("/", experienceController.getAllExperiences);
router.get("/:id", experienceController.getSingleExperience);
router.patch("/:id", auth(Role.ADMIN), validateRequest(updateExperienceZodSchema), experienceController.updateExperience);
router.delete("/:id", auth(Role.ADMIN), experienceController.deleteExperience);

export const experienceRoutes = router;
