"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventZodSchema = exports.createEventZodSchema = void 0;
const zod_1 = require("zod");
// EventType enum values — adjust as per your actual enum
const eventTypeEnum = zod_1.z.enum([
    "PUBLIC_FREE",
    "PUBLIC_PAID",
    "PRIVATE_FREE",
    "PRIVATE_PAID"
]);
// EventStatus enum (if you allow setting it from frontend, otherwise skip)
const eventStatusEnum = zod_1.z.enum([
    "UPCOMING",
    "ONGOING",
    "CANCELLED",
    "COMPLETED"
]); // Adjust based on your Prisma enum
exports.createEventZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: "Title is required" }),
        description: zod_1.z.string({ required_error: "Description is required" }),
        date_time: zod_1.z.string({ required_error: "Date & time is required" }).refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
        location: zod_1.z.string({ required_error: "Location is required" }),
        fee: zod_1.z.number().min(0, { message: "Fee must be zero or positive" }).default(0),
        is_paid: zod_1.z.boolean({ required_error: "is_paid is required" }),
        is_private: zod_1.z.boolean({ required_error: "is_private is required" }),
        type: eventTypeEnum,
        creator_id: zod_1.z.string({ required_error: "creator_id is required" })
    })
});
exports.updateEventZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        date_time: zod_1.z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }).optional(),
        location: zod_1.z.string().optional(),
        fee: zod_1.z.number().min(0).optional(),
        is_paid: zod_1.z.boolean().optional(),
        is_private: zod_1.z.boolean().optional(),
        type: eventTypeEnum.optional(),
        status: eventStatusEnum.optional(), // optional: if updating event status
        creator_id: zod_1.z.string().optional()
    })
});
