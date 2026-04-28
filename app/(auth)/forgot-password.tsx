import React, { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { forgotPassword } from "@/modules/auth/services/AuthService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { theme } from "@/config/Theme";
import { AuthLayout } from "@/components/layout/AuthLayout";

const forgotPasswordSchema = z.object({
  email: z.string().email("Digite um e-mail válido."),
});

type FormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await forgotPassword(data.email);

      Alert.alert(
        "E-mail Enviado",
        "Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/sign-in") }]
      );
    } catch (error) {
      let errorMessage = "Ocorreu um erro ao tentar enviar o e-mail.";
      if (axios.isAxiosError(error) && error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
      }
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Typography variant="bold" size="xl" align="center" style={styles.title}>
        Esqueci Minha Senha
      </Typography>
      <Typography
        variant="regular"
        size="md"
        align="center"
        style={styles.subtitle}
      >
        Digite seu e-mail abaixo e enviaremos um link para você criar uma nova senha.
      </Typography>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            label="E-mail"
            autoCapitalize="none"
            keyboardType="email-address"
            value={value}
            returnKeyType="send" 
            blurOnSubmit={false} 
            onSubmitEditing={handleSubmit(onSubmit)}
            onChangeText={onChange}
            error={errors.email?.message}
          />
        )}
      />

      <Button
        title="Enviar Link"
        onPress={handleSubmit(onSubmit)}
        isLoading={loading}
        style={styles.button}
      />
      <Button
        title="Voltar para Login"
        variant="outline"
        onPress={() => router.replace("/(auth)/sign-in")}
        style={styles.backButton}
        disabled={loading}
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
  backButton: {
    width: "100%",
    marginTop: theme.spacing.sm,
  },
});
