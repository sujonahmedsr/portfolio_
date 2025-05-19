import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createProjectZodSchema, updateProjectZodSchema } from "./project.validation";
import { projectController } from "./project.controller";
import { auth } from "../../middlewares/Auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/", auth(Role.ADMIN), validateRequest(createProjectZodSchema), projectController.createProject);
router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getSingleProject);
router.patch("/:id", auth(Role.ADMIN), validateRequest(updateProjectZodSchema), projectController.updateProject);
router.delete("/:id", auth(Role.ADMIN), projectController.deleteProject);

export const projectRoutes = router;
