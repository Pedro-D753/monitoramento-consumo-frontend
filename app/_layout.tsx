import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { AuthProvider, useAuth } from "@/modules/auth/context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

function InitialLayout({
  fontsLoaded,
  fontError,
}: {
  fontsLoaded: boolean;
  fontError: Error | null;
}) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Aguarda fontes e estado de auth estarem prontos
    if ((!fontsLoaded && !fontError) || authLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inAppGroup = segments[0] === "(app)";

    // ✅ Bug #3: Lógica explícita e segura para cada cenário
    if (!isAuthenticated && inAppGroup) {
      // Usuário não autenticado tentou acessar área protegida
      router.replace("/(auth)/sign-in");
    } else if (isAuthenticated && inAuthGroup) {
      // Usuário já autenticado tentou acessar tela de auth
      router.replace("/(app)/");
    } else if (!inAuthGroup && !inAppGroup) {
      // Rota raiz ou desconhecida — redireciona baseado no estado de auth
      router.replace(isAuthenticated ? "/(app)/" : "/(auth)/sign-in");
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

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <InitialLayout fontsLoaded={fontsLoaded} fontError={fontError} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
