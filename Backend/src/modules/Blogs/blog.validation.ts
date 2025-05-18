import { z } from "zod";

export const createBlogZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }),
    content: z.string({ required_error: "Content is required" }),
    image_url: z.string().url().optional().nullable(), // image_url can be null or omitted
  }),
});

export const updateBlogZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    image_url: z.string().url().optional().nullable(),
    is_published: z.boolean().optional(),
  }),
});
