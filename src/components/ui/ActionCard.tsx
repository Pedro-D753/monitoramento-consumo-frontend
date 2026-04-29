/**
 * Card de ação touchable com título e background custom.
 * Shadow/elevation para depth visual.
 */

import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TouchableOpacityProps,
} from "react-native";
import { Typography } from "./Typography";
import { theme } from "@/config/Theme";

interface ActionCardProps extends TouchableOpacityProps {
  /** Título do card */
  title: string;
  /** Cor de background */
  backgroundColor: string;
  /** Altura custom (px ou %) */
  height?: number | `${number}%`;
  /** Estilos adicionais */
  style?: ViewStyle;
}

export function ActionCard({
  title,
  backgroundColor,
  height = 120,
  style,
  ...rest
}: ActionCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor, height }, style]}
      activeOpacity={0.8}
      {...rest}
    >
      <Typography variant="bold" size="md" color="#FFFFFF">
        {title}
      </Typography>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
