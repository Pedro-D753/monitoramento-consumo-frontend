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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

SplashScreen.preventAutoHideAsync();

function InitialLayout({ fontsLoaded, fontError }: { fontsLoaded: boolean; fontError: Error | null }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!fontsLoaded && !fontError) return;
    if (authLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(app)/');
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