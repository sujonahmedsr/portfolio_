import { z } from "zod";

export const createProjectZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }),
    description: z.string({ required_error: "Description is required" }),
    live_link: z.string().url().optional().nullable(),
    github_link: z.string().url().optional().nullable(),
    tech_stack: z.array(z.string(), { required_error: "Tech stack is required" }),
    image_url: z.string().url().optional().nullable(),
  }),
});

export const updateProjectZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    live_link: z.string().url().optional().nullable(),
    github_link: z.string().url().optional().nullable(),
    tech_stack: z.array(z.string()).optional(),
    image_url: z.string().url().optional().nullable(),
  }),
});
