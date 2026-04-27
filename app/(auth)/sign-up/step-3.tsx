import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { registerUser } from "@/modules/auth/services/AuthService";
import { useSignUp } from "@/modules/auth/context/SignUpContext";
import { SignUpStep3Data, signUpStep3Schema } from "@/modules/auth/schemas/SignUpSchema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { Typography } from "@/components/ui/Typography";
import { theme } from "@/config/Theme";

export default function SignThirdStep() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const { data: contextData, clearData } = useSignUp();

  const { control, handleSubmit, formState: { errors } } = useForm<SignUpStep3Data>({
    resolver: zodResolver(signUpStep3Schema),
  });

  const handleFinishSignUp = async (formData: SignUpStep3Data) => {
    if (!contextData.email || !contextData.real_name || !contextData.username) {
      setAuthError("Dados incompletos. Volte e preencha todos os campos.");
      return;
    }
    try {
      setIsLoading(true);
      setAuthError(null);
      await registerUser({
        email: contextData.email,
        real_name: contextData.real_name,
        username: contextData.username,
        password: formData.password, // confirm_password não é enviado
      });
      router.replace('/(auth)/sign-in')
      clearData();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        const message =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail[0]?.msg || "Ocorreu um erro ao criar a conta."
              : "Ocorreu um erro ao criar a conta.";
        setAuthError(message);
      } else {
        setAuthError("Ocorreu um erro ao criar a conta. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      header={
        <View style={styles.card}>
          <Typography variant="bold" size="md" style={styles.title}>
            Quase lá!
          </Typography>
          <StepIndicator totalSteps={3} currentStep={3} />
        </View>
      }
      footer={
        <Button title="Voltar" variant="outline" onPress={() => router.back()} />
      }
    >
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <Input
            label="Senha"
            autoCapitalize="none"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            isPassword
            ref={field.ref}
            error={errors.password?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="confirm_password"
        render={({ field }) => (
          <Input
            label="Confirmar Senha"
            autoCapitalize="none"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            isPassword
            ref={field.ref}
            error={errors.confirm_password?.message}
          />
        )}
      />

      {authError && (
        <Typography variant="regular" size="sm" style={styles.errorText}>
          {authError}
        </Typography>
      )}

      <Button
        title="Criar Conta"
        onPress={handleSubmit(handleFinishSignUp)}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  title: { margin: theme.spacing.sm },
  card: {
    backgroundColor: theme.colors.card.subCard,
    borderRadius: theme.borderRadius.md,
    width: "95%",
    maxWidth: 400,
    alignSelf: "center",
    alignItems: "center",
  },
  errorText: {
    color: theme.colors.danger.main,
    fontSize: 12,
    maxWidth: 220,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
});