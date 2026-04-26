import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { PageLayout } from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { theme } from "@/config/Theme";
import { updateUser } from "@/modules/auth/services/AuthService";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "@/modules/auth/schemas/ChangePasswordSchema";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleSave = async (data: ChangePasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await updateUser({ new_password: data.new_password });
      setSuccess(true);
      setTimeout(() => router.back(), 1500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        setError(
          typeof detail === "string"
            ? detail
            : "Não foi possível alterar a senha."
        );
      } else {
        setError("Não foi possível alterar a senha.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout showHeader={false}>
      <View style={styles.header}>
        <Typography variant="bold" size="xl">
          Alterar Senha
        </Typography>
        <Typography variant="regular" size="sm" color={theme.colors.text.secondary}>
          Sua nova senha deve seguir os critérios de segurança.
        </Typography>
      </View>

      <View style={styles.card}>
        <Controller
          control={control}
          name="new_password"
          render={({ field }) => (
            <Input
              label="Nova Senha"
              isPassword
              autoCapitalize="none"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={errors.new_password?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="confirm_password"
          render={({ field }) => (
            <Input
              label="Confirmar Nova Senha"
              isPassword
              autoCapitalize="none"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={errors.confirm_password?.message}
            />
          )}
        />

        {error && (
          <Typography
            variant="regular"
            size="sm"
            style={styles.errorText}
          >
            {error}
          </Typography>
        )}

        {success && (
          <Typography
            variant="medium"
            size="sm"
            color={theme.colors.status.success}
            align="center"
            style={{ marginBottom: theme.spacing.sm }}
          >
            Senha alterada com sucesso!
          </Typography>
        )}

        <Button
          title="Salvar Nova Senha"
          onPress={handleSubmit(handleSave)}
          isLoading={isLoading}
          style={styles.button}
        />
        <Button
          title="Cancelar"
          variant="outline"
          onPress={() => router.back()}
          style={styles.button}
        />
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.card.infoCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  errorText: {
    color: theme.colors.danger.main,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  button: {
    width: "100%",
    marginTop: theme.spacing.sm,
  },
});