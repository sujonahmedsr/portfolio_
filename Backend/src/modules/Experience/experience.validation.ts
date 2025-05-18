import { z } from "zod";

export const createExperienceZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }),
    company: z.string({ required_error: "Company is required" }),
    location: z.string({ required_error: "Location is required" }),
    start_date: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid start date",
    }),
    end_date: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
      message: "Invalid end date",
    }),
    description: z.string().optional(),
  }),
});

export const updateExperienceZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    company: z.string().optional(),
    location: z.string().optional(),
    start_date: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid start date",
    }).optional(),
    end_date: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid end date",
    }).optional(),
    description: z.string().optional(),
  }),
});
