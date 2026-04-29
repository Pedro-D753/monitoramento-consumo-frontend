/**
 * Container para gráficos com loading/empty states.
 * Header title/subtitle.
 * Altura mínima evita layout shift.
 */

import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Typography } from "./Typography";
import { theme } from "@/config/Theme";

interface ChartContainerProps {
  /** Título chart */
  title: string;
  /** Subtítulo opcional */
  subtitle?: string;
  /** Loading spinner */
  isLoading?: boolean;
  /** Estado vazio */
  isEmpty?: boolean;
  /** Conteúdo gráfico */
  children: React.ReactNode;
}

export function ChartContainer({
  title,
  subtitle,
  isLoading = false,
  isEmpty = false,
  children,
}: ChartContainerProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Typography variant="bold" size="lg" color={theme.colors.text.primary}>
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="regular"
            size="sm"
            color={theme.colors.text.secondary}
          >
            {subtitle}
          </Typography>
        )}
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
        ) : isEmpty ? (
          <Typography
            variant="regular"
            align="center"
            color={theme.colors.text.disabled}
          >
            Nenhum dado disponível para este período.
          </Typography>
        ) : (
          children
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card.subCard,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    width: "100%",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  content: {
    minHeight: 220,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
