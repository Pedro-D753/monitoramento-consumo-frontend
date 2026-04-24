import React from 'react';
import { Text, TextProps } from 'react-native';
import { theme } from '@/config/Theme';

interface TypographyProps extends TextProps {
  variant?: 'regular' | 'medium' | 'bold';
  size?: keyof typeof theme.fontSizes;
  color?: string; // Permite passar uma cor customizada, mas terá um padrão
}

export function Typography({ 
  variant = 'regular', 
  size = 'md', 
  color = theme.colors.text.primary, 
  style, 
  children, 
  ...rest 
}: TypographyProps) {
  return (
    <Text
      style={[
        {
          fontFamily: theme.fonts[variant],
          fontSize: theme.fontSizes[size],
          color: color,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}