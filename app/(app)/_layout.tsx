import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { theme } from '@/config/Theme';

export default function AppLayout() {
    const { isAuthenticated, isLoading } = useAuth();

    // 1. Estado de Carregamento Seguro (Splash)
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.primary }}>
                <ActivityIndicator size="large" color={theme.colors.primary.main} />
            </View>
        );
    }

    // 2. Proteção de Rota (Guarda)
    if (!isAuthenticated) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    // 3. Renderização Empilhada (Stack) com Gesto de Voltar
    return (
        <Stack 
            screenOptions={{ 
                headerShown: false, // Esconde o cabeçalho feio nativo do iOS/Android
                animation: 'slide_from_right', // Garante a animação de deslizar suave em ambas as plataformas
                gestureEnabled: true, // Força a ativação do "Swipe-to-back" (arrastar da esquerda para a direita para voltar)
                gestureDirection: 'horizontal'
            }} 
        />
    );
}