import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createSkillZodSchema, updateSkillZodSchema } from "./skill.validation";
import { skillController } from "./skill.controller";
import { auth } from "../../middlewares/Auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/", auth(Role.ADMIN), validateRequest(createSkillZodSchema), skillController.createSkill);
router.get("/", skillController.getAllSkills);
router.get("/:id", skillController.getSingleSkill);
router.patch("/:id", auth(Role.ADMIN), validateRequest(updateSkillZodSchema), skillController.updateSkill);
router.delete("/:id", auth(Role.ADMIN), skillController.deleteSkill);

export const skillRoutes = router;
