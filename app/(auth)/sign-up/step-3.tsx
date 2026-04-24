import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerUser } from '@/modules/auth/services/authService';
import { useSignUp } from '@/modules/auth/context/SignUpContext';
import { SignUpStep3Data, signUpStep3Schema } from '@/modules/auth/schemas/signUpSchema';
import { Button } from "@/components/ui/Button";
import { Input } from '@/components/ui/Input';
import { AuthLayout } from "@/components/layout/AuthLayout";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { Typography } from "@/components/ui/Typography";
import { theme } from '@/config/Theme';

export default function SignThirdStep() {

    const router = useRouter();
    const [authError, setAuthError] = useState<string | null>(null);

    const { data: contextData, clearData } = useSignUp();

    const handleFinishSignUp = async (formData: SignUpStep3Data) => {
        if (!contextData.email || !contextData.real_name || !contextData.username) {
            setAuthError('Dados incompletos. Volte e preencha todos os campos.');
            return;
        }
        try {
            await registerUser({
                email: contextData.email,
                real_name: contextData.real_name,
                username: contextData.username,
                password: formData.password,
            });
            clearData();
            router.push('/(auth)/sign-in');
        } catch (error) {
            setAuthError('Ocorreu um erro ao criar a conta. Tente novamente.');
            console.error('Erro no registro:', error);
        }
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpStep3Data>({
        resolver: zodResolver(signUpStep3Schema), 
    });

    return (
        <AuthLayout
            header={
                <View style={styles.card}>
                    <Typography variant="bold" size="md" style={styles.title2}>Quase lá!</Typography>
                    <StepIndicator totalSteps={3} currentStep={3} />
                </View>
            }
            footer={
                <Button
                    title="Voltar"
                    variant="outline"
                    onPress={() => router.back()}
                />
            }
            >

            <Controller
                control={control}
                name='password'
                render={({ field }) => (
                    <Input
                        label="Senha"
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        isPassword={true}
                        ref={field.ref}
                        error={errors.password?.message}
                    />
                )}
            />

            {authError && <Typography variant='regular' size='xl' style={styles.errorText}>{authError}</Typography>}

            <Button
                title="Criar Conta"
                onPress={handleSubmit(handleFinishSignUp)}
            />
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    title: {
        marginBottom: 15,
        marginTop: -10,
    },
    title2: {
        margin: theme.spacing.sm, 
    },
    card: {
        backgroundColor: theme.colors.card.subCard,
        borderRadius: theme.borderRadius.md,
        width: "95%",
        maxWidth: 400, // Limita a largura máxima para telas maiores
        alignSelf: "center", // Centraliza horizontalmente
        alignItems: "center", // Centraliza os itens dentro do card
    },
    errorText: {
        color: theme.colors.danger.main,
        fontSize: 12,
        maxWidth: 200,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    }
})