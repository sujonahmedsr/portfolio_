import { z } from "zod";

// EventType enum values — adjust as per your actual enum
const eventTypeEnum = z.enum([
  "PUBLIC_FREE",
  "PUBLIC_PAID",
  "PRIVATE_FREE",
  "PRIVATE_PAID"
]);

// EventStatus enum (if you allow setting it from frontend, otherwise skip)
const eventStatusEnum = z.enum([
  "UPCOMING",
  "ONGOING",
  "CANCELLED",
  "COMPLETED"
]); // Adjust based on your Prisma enum

export const createEventZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }),
    description: z.string({ required_error: "Description is required" }),
    date_time: z.string({ required_error: "Date & time is required" }).refine(
      val => !isNaN(Date.parse(val)),
      { message: "Invalid date format" }
    ),
    location: z.string({ required_error: "Location is required" }),
    fee: z.number().min(0, { message: "Fee must be zero or positive" }).default(0),
    is_paid: z.boolean({ required_error: "is_paid is required" }),
    is_private: z.boolean({ required_error: "is_private is required" }),
    type: eventTypeEnum,
    creator_id: z.string({ required_error: "creator_id is required" })
  })
});

export const updateEventZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    date_time: z.string().refine(
      val => !isNaN(Date.parse(val)),
      { message: "Invalid date format" }
    ).optional(),
    location: z.string().optional(),
    fee: z.number().min(0).optional(),
    is_paid: z.boolean().optional(),
    is_private: z.boolean().optional(),
    type: eventTypeEnum.optional(),
    status: eventStatusEnum.optional(), // optional: if updating event status
    creator_id: z.string().optional()
  })
});
