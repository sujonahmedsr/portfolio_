import { z } from "zod";

export const createSkillZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Skill name is required" }),
    level: z.enum(["Beginner", "Intermediate", "Expert"], {
      required_error: "Skill level is required",
    }),
    category: z.string({ required_error: "Category is required" }),
    image_url: z.string().url().optional().nullable(),
    user_id: z.string({ required_error: "User ID is required" }),
  }),
});

export const updateSkillZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    level: z.enum(["Beginner", "Intermediate", "Expert"]).optional(),
    category: z.string().optional(),
    image_url: z.string().url().optional().nullable(),
    user_id: z.string().optional(),
  }),
});
