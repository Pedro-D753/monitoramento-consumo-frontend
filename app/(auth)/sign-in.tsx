import { StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { LoginFormData, loginSchema } from "@/modules/auth/schemas/LoginSchema";
import { loginUser } from "@/modules/auth/services/AuthService";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { theme } from "@/config/Theme";
import { Typography } from "@/components/ui/Typography";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      const response = await loginUser(data);

      if (!response.access_token || !response.refresh_token) {
        throw new Error("A resposta de login veio incompleta.");
      }

      await signIn(response.access_token, response.refresh_token);
      router.replace("/(app)");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        const message =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail[0]?.msg || "Credenciais inválidas."
              : "Credenciais inválidas.";

        setAuthError(message);
      } else if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("Ocorreu um erro inesperado.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      footer={
        <Button
          title="Criar Conta"
          variant="outline"
          onPress={() => router.push("/(auth)/sign-up/step-1")}
        />
      }
    >
      <Typography variant="bold" size="md" style={styles.title}>
        Entre na sua conta
      </Typography>

      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Input
            label="E-mail"
            autoCapitalize="none"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            error={errors.email?.message}
          />
        )}
      />
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
            ref={field.ref}
            isPassword={true}
            error={errors.password?.message}
          />
        )}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/(auth)/forgot-password')}
      >
        <Typography style={styles.password} variant="regular" size={'xs'}>
          Esqueci minha senha
        </Typography>
      </TouchableOpacity>

      {authError && (
        <Typography variant="regular" size="xl" style={styles.errorText}>
          {authError}
        </Typography>
      )}

      <Button
        title="Entrar"
        onPress={handleSubmit(handleLogin)}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.text.primary,
    marginBottom: 15,
    marginTop: -10,
  },
  errorText: {
    color: theme.colors.danger.main,
    fontSize: 12,
    maxWidth: 200,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  password: {
    marginBottom: 15,
    padding: 5,
    color: theme.colors.primary.blue
  },
});
