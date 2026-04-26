import { z } from "zod";

export const changePasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(6, "Mínimo de 6 caracteres")
      .regex(/[a-z]/, "Deve conter letra minúscula")
      .regex(/[A-Z]/, "Deve conter letra maiúscula")
      .regex(/[0-9]/, "Deve conter um número")
      .regex(/[!@#$%&*?]/, "Deve conter caractere especial (!@#$%&*?)"),
    confirm_password: z.string().min(1, "Confirmação obrigatória"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "As senhas não coincidem.",
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
