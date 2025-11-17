import {email, z} from 'zod';

export const signupSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().max(255).toLowerCase().trim(),
    password: z.string().min(8).max(255).toLowerCase(),
    role: z.enum(['user', 'admin']).default('user'),
});
export const signInSchema = z.object({
    email: z.email().toLowerCase().trim(),
    password: z.string().min(1),
});