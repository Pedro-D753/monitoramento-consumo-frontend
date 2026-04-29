/**
 * Componente de botão reutilizável com variantes primary, danger e outline.
 * Suporta loading state com spinner.
 * Segue princípios de clean code com props tipadas e estilos centralizados.
 */

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";
import { theme } from "@/config/Theme";

interface ButtonProps extends TouchableOpacityProps {
  /** Texto exibido no botão */
  title: string;
  /** Variante do botão: primary, danger, outline */
  variant?: "primary" | "danger" | "outline";
  /** Estado de loading - mostra spinner */
  isLoading?: boolean;
}

/**
 * Renderiza botão com lógica de variante e loading.
 * Calcula cores dinamicamente baseado em variant.
 */
export function Button({
  title,
  variant = "primary",
  isLoading = false,
  style,
  ...rest
}: ButtonProps) {
  // Determina se é variante outline para estilos condicionais
  const isOutLine = variant === "outline";

  // Cores de background dinâmicas por variante
  const backgroundColor = isOutLine
    ? theme.colors.background.secondary
    : theme.colors[variant === "primary" ? "primary" : "danger"].main;

  // Cores de texto contrastantes
  const textColor = isOutLine
    ? theme.colors.text.secondary
    : theme.colors.text.primary;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor: isOutLine ? theme.colors.primary.main : "transparent",
        },
        style,
      ]}
      activeOpacity={0.8}
      disabled={isLoading || rest.disabled}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "70%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
