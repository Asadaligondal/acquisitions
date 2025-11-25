import { z } from 'zod';

export const userIdSchema = z.object({
  id: z.string().refine(
    val => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num > 0;
    },
    {
      message: 'ID must be a positive number',
    }
  ),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    email: z
      .string()
      .email()
      .max(255)
      .transform(val => val.toLowerCase())
      .optional(),
    role: z.enum(['user', 'admin']).optional(),
  })
  .refine(
    data => {
      // At least one field must be provided for update
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );
