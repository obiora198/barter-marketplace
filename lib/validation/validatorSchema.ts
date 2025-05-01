import { z } from "zod";

export const listingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  condition: z.enum(["new", "excellent",  "good", "fair", "poor"]),
  tradePreference: z.string().min(3, "Must add a trade preference"),
  location: z.string().min(3, "Must add a valid location"),
  images: z.array(z.string().min(1)).min(1, "At least one image is required"),
})

export const profileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  bio: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const contactSchema = z.object({
  userName: z.string().min(2, "Name is too short"),
  userEmail: z.string().email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})
