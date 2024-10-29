import * as z from "zod";

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  price: z.coerce
    .number({ message: "Price must be numerical" })
    .positive({ message: "Price must be a positive number" }),
});

export type zProductSchema = z.infer<typeof ProductSchema>;
