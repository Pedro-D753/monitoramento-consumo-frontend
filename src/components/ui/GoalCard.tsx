import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../config/Theme';
import { Typography } from './Typography';
import { ProgressBar } from './ProgressBar';
import { Feather } from '@expo/vector-icons';

interface GoalCardProps {
  title: string;
  currentValue: string;
  limitValue: string;
  percentage: number;
  icon: keyof typeof Feather.glyphMap;
}

export const GoalCard = ({ title, currentValue, limitValue, percentage, icon }: GoalCardProps) => {
  const isOverLimit = percentage > 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Feather name={icon} size={18} color={theme.colors.background.primary} />
          <Typography variant="regular" style={styles.title}>{title}</Typography>
        </View>
        <Typography variant="regular" color={isOverLimit ? theme.colors.danger.main : theme.colors.text.primary}>
          {percentage.toFixed(0)}%
        </Typography>
      </View>

      <ProgressBar 
        progress={percentage} 
        color={isOverLimit ? theme.colors.danger.main : theme.colors.primary.main} 
      />

      <View style={styles.footer}>
        <Typography variant="bold">
          <Typography variant="bold">{currentValue}</Typography> de {limitValue}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
  },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
});
