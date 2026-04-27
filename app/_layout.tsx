import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts, 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_700Bold 
} from '@expo-google-fonts/inter';
import { AuthProvider, useAuth } from '@/modules/auth/context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';


SplashScreen.preventAutoHideAsync();

function InitialLayout({ fontsLoaded, fontError }: { fontsLoaded: boolean; fontError: Error | null }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!fontsLoaded && !fontError) return;
    if (authLoading) return;

    // Monitoramos se estamos dentro de algum grupo específico
    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    // Se NÃO estiver autenticado e tentar acessar uma rota fora do grupo (auth)
    // Isso protege o /(app) e também captura a rota inicial '/'
    if (!isAuthenticated && !inAuthGroup) {
      // Usamos setTimeout para dar respiro à fila de roteamento (Routing Queue)
      setTimeout(() => router.replace('/(auth)/sign-in'), 0);
    } 
    // Se ESTIVER autenticado e tentar acessar o login ou a rota inicial '/'
    else if (isAuthenticated && !inAppGroup) {
      setTimeout(() => router.replace('/(app)/'), 0);
    }

    SplashScreen.hideAsync();
  }, [isAuthenticated, authLoading, segments, fontsLoaded, fontError]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null; 
  }

  return (
        <SafeAreaProvider>
          <AuthProvider>
            <InitialLayout fontsLoaded={fontsLoaded} fontError={fontError} />
          </AuthProvider>
        </SafeAreaProvider>
  );
}