import { Stack } from 'expo-router';
import { SignUpProvider } from '@/modules/auth/context/SignUpContext';

export default function AuthLayout() {
    return (
        <SignUpProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right', // ← animação de entrada
                }}
            />
        </SignUpProvider>
    )
}