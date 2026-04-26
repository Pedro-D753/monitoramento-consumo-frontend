import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { theme } from "@/config/Theme";

interface TypographyProps extends TextProps {
  variant?: keyof typeof theme.fonts;
  size?: keyof typeof theme.fontSizes;
  lineHeight?: keyof typeof theme.lineHeights;
  color?: string;
  align?: TextStyle['textAlign'];
}

export function Typography({
  variant = "regular",
  size = "md",
  lineHeight = "normal",
  color,
  align = "left",
  style,
  children,
  ...rest
}: TypographyProps) {
  const fontSize = theme.fontSizes[size];
  const calculatedLineHeight = fontSize * theme.lineHeights[lineHeight];

  return (
    <Text
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
