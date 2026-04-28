import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { theme } from "@/config/Theme";

interface TypographyProps extends TextProps {
  variant?: keyof typeof theme.fonts;
  size?: keyof typeof theme.fontSizes;
  lineHeight?: keyof typeof theme.lineHeights;
  color?: string;
  align?: TextStyle['textAlign'];
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
  const hyphenationProps = hyphenate ? {
    hyphenationFactor: 1, // iOS
    textBreakStrategy: "balanced" as const, // Android
  } : {};

  return (
    <Text
      {...hyphenationProps}
      style={[
        {
          fontFamily: theme.fonts[variant],
          fontSize: fontSize,
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
