import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, TouchableOpacityProps } from 'react-native';
// Supondo que você tenha o componente Typography que usou na Header
import { Typography } from './Typography'; 
import { theme } from '@/config/Theme';

// Estendemos TouchableOpacityProps para herdar propriedades nativas como activeOpacity
interface ActionCardProps extends TouchableOpacityProps {
  title: string;
  backgroundColor: string;
  height?: number | `${number}%`; // Permite altura fixa ou porcentagem
  style?: ViewStyle;
}

export function ActionCard({ 
  title, 
  backgroundColor, 
  height = 120, // Altura padrão caso não seja informada
  style, 
  ...rest 
}: ActionCardProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { backgroundColor, height }, 
        style
      ]} 
      activeOpacity={0.8} // Efeito de clique mais suave
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
    width: '100%',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    // Como o texto na sua imagem fica no topo esquerdo:
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // Sombras leves (opcional, dá um destaque legal)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  }
});