import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { theme } from '@/config/Theme';

export type ConsumptionType = 'water' | 'energy' | 'gas' | 'money' | 'other';

interface ConsumptionCardProps {
  id: number;
  description?: string;
  type: ConsumptionType;
  title: string;
  value: number;
  unit: string;
  date: string;
  cost?: number;
}

const typeConfig = {
  water: { icon: 'droplet', color: '#3498db' },
  energy: { icon: 'zap', color: '#f1c40f' },
  gas: { icon: 'wind', color: '#e74c3c' },
  money: { icon: 'dollar-sign', color: '#0bc53a'},
  other: { icon: 'box', color: '#95a5a6' },
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
        {cost !== undefined && (
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
    backgroundColor: theme.colors.card.subCard,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  iconContainer: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  rightSection: { alignItems: 'flex-end' }
});
