import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { theme } from "@/config/Theme";

interface TypographyProps extends TextProps {
  variant?:    keyof typeof theme.fonts;
  size?:       keyof typeof theme.fontSizes;
  lineHeight?: keyof typeof theme.lineHeights;
  color?:      string;
  align?:      TextStyle['textAlign'];
  hyphenate?:  boolean;
}

export function Typography({
  variant    = "regular",
  size       = "md",
  lineHeight = "normal",
  color,
  align      = "left",
  hyphenate  = false,
  style,
  children,
  ...rest
}: TypographyProps) {
  const fontSize            = theme.fontSizes[size];
  const calculatedLineHeight = fontSize * theme.lineHeights[lineHeight];

  // ✅ Bug #13: hyphenationFactor não existe no RN — removido.
  // textBreakStrategy funciona no Android para melhorar quebra de palavras.
  const hyphenationProps = hyphenate
    ? { textBreakStrategy: "balanced" as const }
    : {};

  return (
    <Text
      {...hyphenationProps}
      style={[
        {
          fontFamily:  theme.fonts[variant],
          fontSize,
          lineHeight:  calculatedLineHeight,
          color:       color || theme.colors.text.primary,
          textAlign:   align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}