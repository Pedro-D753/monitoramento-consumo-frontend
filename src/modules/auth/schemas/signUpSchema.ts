import { z } from 'zod'

export const signUpStep1Schema = z.object({
    email: z.string().min(1, 'O email é obrigatório').email('Formato de email inválido'),
    real_name: z.string().min(1, 'O nome é obrigatório').min(3, 'O nome deve conter no mínimo 3 caracteres'),
})

export const signUpStep2Schema = z.object({
    username: z.string().min(1, 'O nome de usuário é obrigatório').min(3, 'O nome de usuário deve conter no mínimo 3 caracteres').regex(/^[a-zA-Z0-9_.\-]+$/, 'O nome de usuário só pode conter letras, números e underscores'),
})

export const signUpStep3Schema = z.object({
    password: z.string().min(1, 'A senha é obrigatória').min(8, 'A senha deve conter no mínimo 8 caracteres'),
})

export type SignUpStep1Data = z.infer<typeof signUpStep1Schema>
export type SignUpStep2Data = z.infer<typeof signUpStep2Schema>
export type SignUpStep3Data = z.infer<typeof signUpStep3Schema>
export type SignUpData = SignUpStep1Data & SignUpStep2Data & SignUpStep3Data