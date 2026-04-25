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

// 1. Segura a Splash Screen nativamente
SplashScreen.preventAutoHideAsync();

// 2. Componente interno que atua como Guarda de Rotas
function InitialLayout({ fontsLoaded, fontError }: { fontsLoaded: boolean; fontError: Error | null }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Só prossegue se as fontes carregaram E a autenticação terminou de ler o SecureStore
    if (!fontsLoaded && !fontError) return;
    if (authLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    // Regras de redirecionamento (State-Driven Routing)
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(app)/'); // Vai procurar o app/(app)/index.tsx
    }

    // 3. Oculta a Splash Screen apenas quando tudo estiver resolvido
    SplashScreen.hideAsync();
  }, [isAuthenticated, authLoading, segments, fontsLoaded, fontError]);

  // Usamos o Stack no Root para envelopar os subgrupos
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

// 4. Layout Raiz que carrega fontes e provê o contexto
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  // Retorna nulo visualmente enquanto as fontes carregam para evitar erros do Expo
  if (!fontsLoaded && !fontError) {
    return null; 
  }

  return (
    <AuthProvider>
      <InitialLayout fontsLoaded={fontsLoaded} fontError={fontError} />
    </AuthProvider>
  );
}