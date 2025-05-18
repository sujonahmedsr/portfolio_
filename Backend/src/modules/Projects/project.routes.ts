import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createProjectZodSchema, updateProjectZodSchema } from "./project.validation";
import { projectController } from "./project.controller";

const router = express.Router();

router.post("/", validateRequest(createProjectZodSchema), projectController.createProject);
router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getSingleProject);
router.patch("/:id", validateRequest(updateProjectZodSchema), projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

export const projectRoutes = router;
