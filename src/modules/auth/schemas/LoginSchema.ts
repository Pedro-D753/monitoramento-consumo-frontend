import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .toLowerCase()
    .trim()
    .min(1, "Email é obrigatório")
    .email("Formato de email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
