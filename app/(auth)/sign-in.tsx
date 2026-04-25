//Importando modulos e libs globais
import { Text, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/modules/auth/schemas/LoginSchema";
import { loginUser } from "@/modules/auth/services/AuthService";
import { useRouter } from "expo-router";
import axios from "axios";
//Importando componentes e configs locais
import { useAuth } from '@/modules/auth/context/AuthContext';
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
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
    resolver: zodResolver(loginSchema), // Integração do Zod com React Hook Form para validação
  });

const handleLogin = async (data: LoginFormData) => {
    try {
        setIsLoading(true);
        setAuthError(null);

        const response = await loginUser(data);
        
        // ALERTA DE DEBUG:
        if (!response.refresh_token) {
            console.warn("SERVER REPORT: O FastAPI não enviou o refresh_token no payload de login!");
        }

        await signIn(response.access_token, response.refresh_token);

        router.replace('/(app)');
    } catch (error) {
      if (axios.isAxiosError(error)) {
          const detail = error.response?.data?.detail;
          
          // Garante que a mensagem é sempre uma string
          const message = typeof detail === 'string'
              ? detail
              : Array.isArray(detail)
                  ? detail[0]?.msg || 'Credenciais inválidas.'
                  : 'Credenciais inválidas.';
          
          setAuthError(message);
      } else {
          setAuthError('Ocorreu um erro inesperado.');
      } 
  } finally {
      setIsLoading(false)
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
});
