import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  createExperienceZodSchema,
  updateExperienceZodSchema,
} from "./experience.validation";
import { experienceController } from "./experience.controller";

const router = express.Router();

router.post("/", validateRequest(createExperienceZodSchema), experienceController.createExperience);
router.get("/", experienceController.getAllExperiences);
router.get("/:id", experienceController.getSingleExperience);
router.patch("/:id", validateRequest(updateExperienceZodSchema), experienceController.updateExperience);
router.delete("/:id", experienceController.deleteExperience);

export const experienceRoutes = router;
