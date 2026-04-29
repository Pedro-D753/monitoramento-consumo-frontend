/**
 * Componente tipográfico escalável com variants de font, size, lineHeight.
 * Integra theme para consistência visual.
 * Suporte a hyphenation/break strategy para texto longo.
 */

import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { theme } from "@/config/Theme";

interface TypographyProps extends TextProps {
  /** Variante da fonte (regular, medium, bold) */
  variant?: keyof typeof theme.fonts;
  /** Tamanho da fonte */
  size?: keyof typeof theme.fontSizes;
  /** Altura da linha */
  lineHeight?: keyof typeof theme.lineHeights;
  /** Cor customizada */
  color?: string;
  /** Alinhamento texto */
  align?: TextStyle["textAlign"];
  /** Hifenização/quebra de palavras */
  hyphenate?: boolean;
}

export function Typography({
  variant = "regular",
  size = "md",
  lineHeight = "normal",
  color,
  align = "left",
  hyphenate = false,
  style,
  children,
  ...rest
}: TypographyProps) {
  const fontSize = theme.fontSizes[size];
  const calculatedLineHeight = fontSize * theme.lineHeights[lineHeight];

  // Props para quebra de palavras otimizada (Android)
  const hyphenationProps = hyphenate
    ? { textBreakStrategy: "balanced" as const }
    : {};

  return (
    <Text
      {...hyphenationProps}
      style={[
        {
          fontFamily: theme.fonts[variant],
          fontSize,
          lineHeight: calculatedLineHeight,
          color: color || theme.colors.text.primary,
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
