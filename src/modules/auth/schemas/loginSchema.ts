//Importando modulos e libs globais
import { z } from "zod";

//Definindo o schema de validação usando Zod, que é uma biblioteca
//de validação de esquemas para TypeScript e JavaScript
export const loginSchema = z.object({
    email: z
    .string() // tipagem
    .min(1, 'Email é obrigatório') // rejeita campo vazio
    .email('Formato de email inválido'), // rejeita formato de email inválido

    password: z
    .string() // tipagem
    .min(1, 'Senha é obrigatória') // rejeita campo vazio
    .min(8, 'A senha deve conter no mínimo 8 caracteres'), // regras de negocio para senha
});

// O TypeScript extrai a tipagem automaticamente baseada no schema do Zod!
export type LoginFormData = z.infer<typeof loginSchema>;