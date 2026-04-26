import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { theme } from '@/config/Theme';

export type ConsumptionType = 'water' | 'energy' | 'gas' | 'money' | 'other';

interface ConsumptionCardProps {
  id: number;           // Novo: ID retornado da API
  description?: string; // Novo: Nome customizado/Identificador opcional
  type: ConsumptionType;
  title: string;
  value: number;        // Ex: 400 
  unit: string;         // Ex: 'kWh' ou 'L'
  date: string;         // Ex: "Hoje, 14:30"
  cost?: number;        // Ex: 45.90 (opcional)
}

// Um dicionário de mapeamento para os ícones e cores baseado no tipo de consumo
const typeConfig = {
  water: { icon: 'droplet', color: '#3498db' },       // Azul
  energy: { icon: 'zap', color: '#f1c40f' },          // Amarelo
  gas: { icon: 'wind', color: '#e74c3c' },            // Vermelho
  money: { icon: 'dollar-sign', color: '#0bc53a'},    // Verde (Corrigido para dollar-sign)
  other: { icon: 'box', color: '#95a5a6' },           // Cinza
} as const;

export function ConsumptionCard({ id, description, type, title, value, unit, date, cost }: ConsumptionCardProps) {
  const config = typeConfig[type];

  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
          <Feather name={config.icon as any} size={24} color={config.color} />
        </View>
        
        <View>
          {/* Prioriza a descrição personalizada, senão usa o título da categoria */}
          <Typography variant="bold" size="md">
            {description ? description : title}
          </Typography>
          <Typography variant="regular" size="xs" color={theme.colors.text.secondary}>
            ID: #{id} • {date}
          </Typography>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Typography variant="bold" size="lg" color={theme.colors.text.primary}>
          {value} <Typography variant="regular" size="sm" color={theme.colors.text.secondary}>{unit}</Typography>
        </Typography>
        {/* Se a API mandar o custo, renderiza pequenininho embaixo */}
        {cost && (
          <Typography variant="regular" size="xs" color={theme.colors.text.secondary}>
            R$ {cost.toFixed(2).replace('.', ',')}
          </Typography>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.card.subCard, // Fundo escuro do seu Figma
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  iconContainer: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  rightSection: { alignItems: 'flex-end' }
});