/*
import { Redirect } from 'expo-router';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '@/config/Theme';

export default function RootIndex() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.primary }}>
                <ActivityIndicator size="large" color={theme.colors.primary.main} />
            </View>
        );
    }

    return <Redirect href={isAuthenticated ? '/(app)' : '/(auth)/sign-in'} />;
}
*/

import { Redirect } from 'expo-router';

export default function RootIndex() {
  // 🚧 BYPASS DE DESENVOLVIMENTO:
  // Redireciona o aplicativo direto para a área logada.
  // Quando for conectar com a API real, basta trocar para "/(auth)/sign-in" 
  // ou colocar a lógica de verificar se o token existe aqui.
  
  return <Redirect href="/(app)" />;
}
