import { useEffect } from 'react';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts, 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_700Bold 
} from '@expo-google-fonts/inter';

// Impede que a tela de splash suma automaticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  useEffect(() => {
    // Se as fontes carregaram com sucesso ou deram erro definitivo, podemos esconder a splash
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Se ainda não carregou, não renderiza a aplicação
  if (!fontsLoaded && !fontError) {
    return null; 
  }

  // O <Slot /> renderiza as rotas filhas (como o (auth) ou o (app))
  return <Slot />;
}