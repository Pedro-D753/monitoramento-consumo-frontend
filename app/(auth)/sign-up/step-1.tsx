//Importando modulos e libs globais
import {
  Text,
  View,
  StyleSheet,
} from "react-native";
import { useRouter } from 'expo-router';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpStep1Data, signUpStep1Schema } from "@/modules/auth/schemas/signUpSchema";
//Importando componentes e configs locais
import { useSignUp } from "@/modules/auth/context/SignUpContext";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { theme } from '@/config/Theme';

export default function SignFistStep() {

    const router = useRouter();
    const { updateData } = useSignUp();

    const handleNextStep = (data: SignUpStep1Data) => {
        updateData(data);
        router.push('/(auth)/sign-up/step-2');
    }
    
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
            variant="primary"
            onPress={() => router.push('/(auth)/sign-in')}
        />
    }
    >

        <Text style={styles.title}>Criando Conta</Text>

            <Controller
                control={control}
                name="email"
                render={({ field }) => (
                    <Input
                        label="E-mail"
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
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        error={errors.real_name?.message}
                    />
                )}
            />
            <Button 
            title="Criar Conta" 
            onPress={handleSubmit(handleNextStep)}
            variant='outline'
            />
    </AuthLayout>
  )
}

const styles = StyleSheet.create({
    title: {
        color: theme.colors.text.primary,
        marginBottom: 15,
        marginTop: -10,
        fontSize: 16,
        fontWeight: 'bold',
    },
})