import { Stack } from 'expo-router';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '@/config/Theme';

export default function AppLayout() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.primary }}>
                <ActivityIndicator size="large" color={theme.colors.primary.main} />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }} />
    );
}