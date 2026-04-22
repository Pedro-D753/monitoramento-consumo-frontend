import React from 'react'
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native'
import { theme } from '@/config/themes'

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'danger' | 'outline';
    isLoading?: boolean;
}

export function Button({
    title,
    variant = 'primary',
    isLoading = false,
    style,
    ...rest
}: ButtonProps) {
    
    const isOutLine = variant === 'outline';
    const backgroundColor = isOutLine ? '#FFFFFF' : theme.colors[variant === 'primary' ? 'primary' : 'danger'].main;
    const textColor = isOutLine ? theme.colors.text.secondary : theme.colors.text.primary

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor, borderColor: isOutLine ? theme.colors.primary.main : 'transparent' },
                style,
            ]}
            activeOpacity={0.8} // Suavidade ao clicar
            disabled={isLoading || rest.disabled}
            {...rest}
            >
            {isLoading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <Text style={[styles.text, { color: textColor }]}>
                {title}
                </Text>
            )}
            </TouchableOpacity>
        );
        }

const styles = StyleSheet.create({
  container: {
    width: '70%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm, // Arredondamento do seu Figma
    borderWidth: 1, // Usado apenas quando for 'outline'
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});