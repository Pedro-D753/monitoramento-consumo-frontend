import { Redirect } from 'expo-router';

export default function RootIndex() {
  // 🚧 BYPASS DE DESENVOLVIMENTO:
  // Redireciona o aplicativo direto para a área logada.
  // Quando for conectar com a API real, basta trocar para "/(auth)/sign-in" 
  // ou colocar a lógica de verificar se o token existe aqui.
  
  return <Redirect href="/(app)" />;
}