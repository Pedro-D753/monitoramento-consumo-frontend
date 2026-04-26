import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { theme } from '@/config/Theme';
import { Typography } from '@/components/ui/Typography'; // Respeitando a regra de tipografia

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

    // 3. Renderização em Abas (Tabs) com UI Flutuante
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: theme.colors.primary.main,
                tabBarInactiveTintColor: theme.colors.text.secondary, // Assumindo que você tem essa cor no Theme
                tabBarStyle: styles.floatingTabBar,
                tabBarItemStyle: styles.tabBarItem,
            }}
        >
            {/* Tela Principal (Dashboard) */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Início',
                    tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
                    tabBarLabel: ({ focused, color }) => (
                        <Typography 
                            variant={focused ? 'bold' : 'regular'} 
                            style={{ color }}
                        >
                            Início
                        </Typography>
                    )
                }}
            />

            {/* Tela de Metas */}
            <Tabs.Screen
                name="goals"
                options={{
                    title: 'Metas',
                    tabBarIcon: ({ color, size }) => <Feather name="target" size={size} color={color} />,
                    tabBarLabel: ({ focused, color }) => (
                        <Typography 
                            variant={focused ? 'bold' : 'regular'} 
                            style={{ color }}
                        >
                            Metas
                        </Typography>
                    )
                }}
            />

            {/* Tela de Simulações */}
            <Tabs.Screen
                name="simulations"
                options={{
                    title: 'Simular',
                    tabBarIcon: ({ color, size }) => <Feather name="sliders" size={size} color={color} />,
                    tabBarLabel: ({ focused, color }) => (
                        <Typography 
                            variant={focused ? 'bold' : 'regular'} 
                            style={{ color }}
                        >
                            Simular
                        </Typography>
                    )
                }}
            />

            {/* Ocultando outras telas da barra inferior (Ex: Perfil, Histórico, etc) */}
            <Tabs.Screen name="profile" options={{ href: null }} />
            <Tabs.Screen name="history" options={{ href: null }} />
            <Tabs.Screen name="change-password" options={{ href: null }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    floatingTabBar: {
        marginLeft: 10,
        marginRight: 10,
        position: 'absolute',
        bottom: 50, // Eleva a barra
        backgroundColor: theme.colors.card.infoCard, // Use theme.colors.surface.main se existir
        borderRadius: 40, // Borda bem arredondada para o efeito pílula/flutuante
        height: 55, // Altura confortável para o toque
        borderTopWidth: 0, // Remove a linha feia nativa do iOS
        paddingBottom: 0, // Zera o padding do iPhone X+ para centralizar os ícones
        // Sombra para dar o efeito de flutuação (elevação)
        elevation: 8, // Android
        shadowColor: theme.colors.gray[900], // iOS
        shadowOffset: { width: 0, height: 4 }, // iOS
        shadowOpacity: 0.1, // iOS
        shadowRadius: 16, // iOS
    },
    tabBarItem: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});