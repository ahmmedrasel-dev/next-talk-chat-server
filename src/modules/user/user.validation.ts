import { z } from "zod";

export const signupSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  phone: z.string().min(10).max(15),
  password: z.string().min(6),
});
