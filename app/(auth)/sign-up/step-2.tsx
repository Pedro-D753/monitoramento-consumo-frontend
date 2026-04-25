//Importndo bibliotecas
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
//importando componentes e configs locais
import { Input } from "@/components/ui/Input";
import {
  SignUpStep2Data,
  signUpStep2Schema,
} from "@/modules/auth/schemas/SignUpSchema";
import { useSignUp } from "@/modules/auth/context/SignUpContext";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { theme } from "@/config/Theme";
import { Typography } from "@/components/ui/Typography";

export default function SignSecondStep() {
  const router = useRouter();
  const { updateData } = useSignUp();

  const handleNextStep = (data: SignUpStep2Data) => {
    updateData(data);
    router.push("/(auth)/sign-up/step-3");
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpStep2Data>({
    resolver: zodResolver(signUpStep2Schema),
  });

  return (
    <AuthLayout
      footer={
        <Button
          title="Voltar"
          variant="outline"
          onPress={() => router.back()}
        />
      }
      header={
        <View style={styles.card}>
          <Typography variant="bold" size="md" style={styles.title2}>
            Crie seu Nome de Usuário!
          </Typography>
          <StepIndicator totalSteps={3} currentStep={2} />
        </View>
      }
    >
      <Controller
        control={control}
        name="username"
        render={({ field }) => (
          <Input
            label="Nome de usuário"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            error={errors.username?.message}
          />
        )}
      />
      <Button title="Continuar" onPress={handleSubmit(handleNextStep)} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
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
});
