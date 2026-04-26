import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { resetPassword } from "@/modules/auth/services/AuthService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { theme } from "@/config/Theme";
import { changePasswordSchema } from "@/modules/auth/schemas/ChangePasswordSchema";
import { AuthLayout } from "@/components/layout/AuthLayout";

type FormData = z.infer<typeof changePasswordSchema>;

export default function ResetPasswordScreen() {
  const { recovery_token } = useLocalSearchParams<{
    recovery_token?: string;
  }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!recovery_token) return;

    try {
      setLoading(true);
      await resetPassword(data.new_password, recovery_token);

      Alert.alert("Sucesso", "Sua senha foi redefinida com sucesso!", [
        { text: "OK", onPress: () => router.replace("/(auth)/sign-in") },
      ]);
    } catch (error) {
      let errorMessage = "Ocorreu um erro inesperado ao redefinir a senha.";

      if (axios.isAxiosError(error) && error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!recovery_token) {
    return (
      <AuthLayout>
        <Typography
          variant="bold"
          size="xl"
          align="center"
          style={styles.title}
        >
          Link Inválido
        </Typography>
        <Typography
          variant="regular"
          size="md"
          align="center"
          style={styles.subtitle}
        >
          Não foi possível encontrar o token de recuperação. Verifique se o link
          está correto ou solicite uma nova redefinição de senha.
        </Typography>
        <Button
          title="Voltar para Login"
          onPress={() => router.replace("/(auth)/sign-in")}
          style={styles.button}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Typography variant="bold" size="xl" align="center" style={styles.title}>
        Nova Senha
      </Typography>
      <Typography
        variant="regular"
        size="md"
        align="center"
        style={styles.subtitle}
      >
        Crie uma nova senha para acessar sua conta.
      </Typography>

      <Controller
        control={control}
        name="new_password"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Nova Senha"
            isPassword
            value={value}
            onChangeText={onChange}
            error={errors.new_password?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="confirm_password"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Confirmar Nova Senha"
            isPassword
            value={value}
            onChangeText={onChange}
            error={errors.confirm_password?.message}
          />
        )}
      />

      <Button
        title="Salvar Nova Senha"
        onPress={handleSubmit(onSubmit)}
        isLoading={loading}
        style={styles.button}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  subtitle: {
    marginBottom: theme.spacing.xl,
    color: theme.colors.text.secondary,
  },
  button: {
    width: "100%",
    marginTop: theme.spacing.md,
  },
});
