
import { z} from 'zod'

export const signInSchema = z.object({
  email: z.string().email({message: 'Invalid email address'}),
  password: z.string().min(6, {message: 'Password must be at least 6 characters'}),
})

export const signUpSchema = z.object({
    username: z.string().min(2, {message: 'Username must be at least 2 characters'}).max(30, {message: 'Username must be at most 30 characters'}).regex(/^[a-zA-Z0-9_]+$/, {message: 'Username can only contain letters, numbers, and underscores'}),
    name: z.string().min(2, {message: 'Name must be at least 2 characters'}).max(50, {message: 'Name must be at most 50 characters'}),
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: 'Password must be at least 6 characters'}).regex(/[A-Z]/, {message: 'Password must contain at least one uppercase letter'}).regex(/[0-9]/, {message: 'Password must contain at least one number'}).regex(/[!@#$%^&*(),.?":{}|<>]/, {message: 'Password must contain at least one symbol'}),
    confirmPassword: z.string().min(6, {message: 'Confirm Password must be at least 6 characters'}).regex(/[A-Z]/, {message: 'Confirm Password must contain at least one uppercase letter'}).regex(/[0-9]/, {message: 'Confirm Password must contain at least one number'}).regex(/[!@#$%^&*(),.?":{}|<>]/, {message: 'Confirm Password must contain at least one symbol'}),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});