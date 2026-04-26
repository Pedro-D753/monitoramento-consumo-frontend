import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { PageLayout } from '@/components/layout/PageLayout';
import { Typography } from '@/components/ui/Typography';
import { theme } from '@/config/Theme';

import { useSimulations } from '@/modules/consumos/hooks/UseSimulations';
import { parseApiDate } from '@/modules/consumos/schemas/ConsumptionSchema';

export default function SimulationsScreen() {
  const router = useRouter();
  const { simulations, isLoading } = useSimulations();

  const getDailyProjection = (startStr: string, endStr: string, totalValue: number) => {
    const start = parseApiDate(startStr).getTime();
    const end = parseApiDate(endStr).getTime();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

    if (diffDays <= 0) return totalValue;
    return totalValue / diffDays;
  };

  return (
    <PageLayout showHeader={false}>
      <View style={styles.headerContainer}>
        <View>
          <Typography variant="bold" size="xl">Simulações</Typography>
          <Typography variant="regular" size="sm" color={theme.colors.text.secondary}>
            Projeções e cenários de consumo futuro
          </Typography>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {isLoading ? (
          <Typography variant="regular" align="center" color={theme.colors.text.disabled} style={{ marginTop: 40 }}>
            A calcular projeções...
          </Typography>
        ) : simulations.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="trending-up" size={48} color={theme.colors.text.disabled} style={{ marginBottom: 16 }} />
            <Typography variant="regular" align="center" color={theme.colors.text.secondary}>
              Nenhuma simulação ativa no momento.
            </Typography>
            <Typography variant="regular" size="sm" align="center" color={theme.colors.primary.main} style={{ marginTop: 8 }}>
              Vá ao Dashboard e use o botão "Nova Simulação" para criar cenários.
            </Typography>
          </View>
        ) : (
          simulations.map((sim) => {
            const startDateStr = parseApiDate(sim.starting_date).toLocaleDateString('pt-BR');
            const endDateStr = parseApiDate(sim.ending_date).toLocaleDateString('pt-BR');
            const dailyRate = getDailyProjection(sim.starting_date, sim.ending_date, sim.value);

            return (
              <View key={sim.id.toString()} style={styles.simulationCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconWrapper}>
                    <Feather name="activity" size={20} color={theme.colors.primary.main} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Typography variant="bold" size="md">
                      Cenário Projetado ({sim.si_measurement_unit})
                    </Typography>
                    <Typography variant="regular" size="xs" color={theme.colors.text.secondary}>
                      {startDateStr} a {endDateStr}
                    </Typography>
                  </View>
                </View>

                <View style={styles.dataGrid}>
                  <View style={styles.dataBox}>
                    <Typography variant="regular" size="xs" color={theme.colors.text.secondary} style={styles.label}>
                      Total Estimado
                    </Typography>
                    <Typography variant="bold" size="lg" color={theme.colors.text.primary}>
                      {sim.value} <Typography variant="medium" size="sm" color={theme.colors.text.secondary}>{sim.si_measurement_unit}</Typography>
                    </Typography>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.dataBox}>
                    <Typography variant="regular" size="xs" color={theme.colors.text.secondary} style={styles.label}>
                      Ritmo Diário
                    </Typography>
                    <Typography variant="bold" size="lg" color={theme.colors.status.warning}>
                      ~{dailyRate.toFixed(2)} <Typography variant="medium" size="sm" color={theme.colors.text.secondary}>{sim.si_measurement_unit}/dia</Typography>
                    </Typography>
                  </View>
                </View>

              </View>
            );
          })
        )}
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  scrollContent: { paddingBottom: 110 },
  emptyState: { marginTop: 60, alignItems: 'center', padding: theme.spacing.xl },
  simulationCard: {
    backgroundColor: theme.colors.card.subCard,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary.main, 
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.card.subCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dataGrid: {
    flexDirection: 'row',
    padding: theme.spacing.md,
  },
  dataBox: {
    flex: 1,
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },
  label: {
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }
});