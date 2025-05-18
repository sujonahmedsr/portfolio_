import { z } from "zod";

export const LoginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string(),
    }),
});

export const ChangePasswordSchema = z.object({
  body: z.object({
    old_password: z.string({
      required_error: 'Old password is required',
      invalid_type_error: 'Old password must be a string',
    }),
    new_password: z.string({
      required_error: 'New password is required',
      invalid_type_error: 'New password must be a string',
    }),
  }),
});