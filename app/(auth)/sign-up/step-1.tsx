import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignUpStep1Data,
  signUpStep1Schema,
} from "@/modules/auth/schemas/SignUpSchema";
import { useSignUp } from "@/modules/auth/context/SignUpContext";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { theme } from "@/config/Theme";
import { Typography } from "@/components/ui/Typography";
import { StepIndicator } from "@/components/ui/StepIndicator";

export default function SignFistStep() {
  const router = useRouter();
  const { updateData } = useSignUp();

  const handleNextStep = (data: SignUpStep1Data) => {
    updateData(data);
    router.push("/(auth)/sign-up/step-2");
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpStep1Data>({
    resolver: zodResolver(signUpStep1Schema),
  });

  return (
    <AuthLayout
      footer={
        <Button
          title="Entrar na sua Conta"
          variant="outline"
          onPress={() => router.replace("/(auth)/sign-in")}
        />
      }
      header={
        <View style={styles.card}>
          <Typography variant="bold" size="md" style={styles.title2}>
            Bem-Vindo!
          </Typography>
          <StepIndicator totalSteps={3} currentStep={1} />
        </View>
      }
    >
      <Typography variant="medium" size="md" style={styles.title}>
        Preencha os campos abaixo
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
        name="real_name"
        render={({ field }) => (
          <Input
            label="Nome"
            autoCapitalize="words"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            error={errors.real_name?.message}
          />
        )}
      />
      <Button
        title="Avançar"
        onPress={handleSubmit(handleNextStep)}
        variant="primary"
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
    maxWidth: 400,
    alignSelf: "center",
    alignItems: "center",
  },
});
