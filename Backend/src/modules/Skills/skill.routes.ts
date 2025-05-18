import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createSkillZodSchema, updateSkillZodSchema } from "./skill.validation";
import { skillController } from "./skill.controller";

const router = express.Router();

router.post("/", validateRequest(createSkillZodSchema), skillController.createSkill);
router.get("/", skillController.getAllSkills);
router.get("/:id", skillController.getSingleSkill);
router.patch("/:id", validateRequest(updateSkillZodSchema), skillController.updateSkill);
router.delete("/:id", skillController.deleteSkill);

export const skillRoutes = router;
