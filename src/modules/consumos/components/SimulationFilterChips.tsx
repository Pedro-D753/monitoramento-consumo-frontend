import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { theme } from '@/config/Theme';

const FILTER_OPTIONS: { label: string; key: string }[] = [
  { label: 'Todas', key: 'all' },
  { label: 'kWh',   key: 'kWh' },
  { label: 'L',     key: 'L'   },
  { label: 'm³',    key: 'm³'  },
  { label: 'R$',    key: 'R$'  },
];

interface SimulationFilterChipsProps {
  activeUnit: string;
  onSelect: (unit: string) => void;
}

export function SimulationFilterChips({ activeUnit, onSelect }: SimulationFilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      nestedScrollEnabled={true}
      contentContainerStyle={styles.scroll}
      style={styles.container}
    >
      {FILTER_OPTIONS.map(({ label, key }) => {
        const isActive = activeUnit === key;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => onSelect(key)}
            activeOpacity={0.8}
            style={[
              styles.chip,
              {
                backgroundColor: isActive
                  ? theme.colors.primary.main
                  : theme.colors.card.subCard,
                borderColor: isActive
                  ? theme.colors.primary.main
                  : theme.colors.border,
              },
            ]}
          >
            <Typography
              variant="medium"
              size="sm"
              color={isActive ? '#ffffff' : theme.colors.text.secondary}
            >
              {label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  scroll: {
    paddingRight: theme.spacing.lg,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
});