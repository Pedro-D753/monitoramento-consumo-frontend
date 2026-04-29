/**
 * Barra de progresso linear com clamp 0-100%.
 * Customizável height/cor.
 * Smooth border radius via dynamic calc.
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "@/config/Theme";

interface ProgressBarProps {
  /** Progresso em % (0-100, clamped) */
  progress: number;
  /** Cor da barra preenchida */
  color?: string;
  /** Altura da barra */
  height?: number;
}

export const ProgressBar = ({
  progress,
  color = theme.colors.primary.main,
  height = 8,
}: ProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View
      style={[
        styles.container,
        { height, backgroundColor: theme.colors.background.primary },
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress}%`,
            backgroundColor: color,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});
