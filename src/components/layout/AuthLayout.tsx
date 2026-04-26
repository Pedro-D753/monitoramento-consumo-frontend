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
  children: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
}

export function AuthLayout({ children, footer, header }: AuthLayoutProps) {
  return (
    <ImageBackground
      resizeMode="cover"
      source={require("@/assets/authBackground.webp")}
      style={styles.ImageBackground}
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
          {header}
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              {children}
            </View>
            {footer && (
              <View
                style={{
                  width: "100%",
                  marginTop: theme.spacing.lg,
                  alignItems: "center",
                  alignSelf: "center",
                  maxWidth: 300,
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
    maxWidth: 400,
    alignSelf: "center",
    alignItems: "center",
  },
  logo: {
    marginTop: theme.spacing.md,
    width: 250,
    height: 250,
    alignSelf: "center",
  },
});
