import {
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  Image,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/config/Theme";


interface AuthLayoutProps {
  children: React.ReactNode; // Define a função de renderização para o conteúdo variável dentro do layout
  footer?: React.ReactNode;
  header?: React.ReactNode;
}

export function AuthLayout({ children, footer, header }: AuthLayoutProps) {
  return (
    <ImageBackground
      resizeMode="cover"
      source={require("@/assets/authBackground.webp")} // caminho da imagem de background
      style={styles.ImageBackground} // estilo para a imagem de background
    >
      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Image
            source={require("@/assets/liquaLogo.webp")}
            style={styles.logo}
          />
          {/*Barra auxilair para customização de telas*/}
          {header}
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {/* logo aqui */}
            <View style={styles.card}>
              {/* conteúdo variável aqui */}
              {children}
            </View>
            {/* rodapé opcional aqui */}
            {footer && (
              <View
                style={{
                  width: "100%",
                  marginTop: theme.spacing.lg,
                  alignItems: "center",
                  alignSelf: "center", // Centraliza o conteúdo do rodapé
                  maxWidth: 300, // Limita a largura máxima para telas maiores
                }}
              >
                {footer}
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // estilos aqui
  ImageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  content: {
    flexGrow: 1,
    width: "100%",
    padding: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.card.subCard,
    borderRadius: theme.borderRadius.md,
    justifyContent: "center",
    padding: theme.spacing.lg,
    width: "100%",
    maxWidth: 400, // Limita a largura máxima para telas maiores
    alignSelf: "center", // Centraliza horizontalmente
    alignItems: "center", // Centraliza os itens dentro do card
  },
  logo: {
    marginTop: theme.spacing.md,
    width: 250,
    height: 250,
    alignSelf: "center",
  },
});
