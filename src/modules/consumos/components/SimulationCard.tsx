import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { theme } from '@/config/Theme';
import { ConsumptionRecord, parseApiDate } from '../schemas/ConsumptionSchema';
import { getUnitLabel } from '../utils/UnitUtils';

interface SimulationCardProps {
  simulation: ConsumptionRecord;
  dailyRate: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function SimulationCard({ simulation, dailyRate, onEdit, onDelete }: SimulationCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const startDateStr = parseApiDate(simulation.starting_date).toLocaleDateString('pt-BR');
  const endDateStr   = parseApiDate(simulation.ending_date).toLocaleDateString('pt-BR');
  const unitLabel    = getUnitLabel(simulation.si_measurement_unit);

  return (
    <View style={styles.card}>
      {/* Cabeçalho colorido */}
      <View style={styles.cardHeader}>
        <View style={styles.iconWrapper}>
          <Feather name="activity" size={20} color={theme.colors.primary.main} />
        </View>
        <View style={{ flex: 1 }}>
          <Typography variant="bold" size="md">Cenário de {unitLabel}</Typography>
          <Typography variant="regular" size="xs" color={theme.colors.text.secondary}>
            {startDateStr} a {endDateStr}
          </Typography>
        </View>
        {/* Ações no cabeçalho */}
        <View style={styles.headerActions}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
              <Feather name="edit-2" size={16} color={theme.colors.text.primary} />
            </TouchableOpacity>
          )}
          {onDelete && !confirmDelete && (
            <TouchableOpacity onPress={() => setConfirmDelete(true)} style={styles.actionBtn}>
              <Feather name="trash-2" size={16} color={theme.colors.danger.main} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Grid de dados */}
      <View style={styles.dataGrid}>
        <View style={styles.dataBox}>
          <Typography variant="regular" size="xs" color={theme.colors.text.secondary} style={styles.label}>
            Total Estimado
          </Typography>
          <Typography variant="bold" size="lg" color={theme.colors.text.primary}>
            {simulation.value}{' '}
            <Typography variant="medium" size="sm" color={theme.colors.text.secondary}>
              {simulation.si_measurement_unit}
            </Typography>
          </Typography>
        </View>

        <View style={styles.divider} />

        <View style={styles.dataBox}>
          <Typography variant="regular" size="xs" color={theme.colors.text.secondary} style={styles.label}>
            Ritmo Diário
          </Typography>
          <Typography variant="bold" size="lg" color={theme.colors.status.warning}>
            ~{dailyRate.toFixed(2)}{' '}
            <Typography variant="medium" size="sm" color={theme.colors.text.secondary}>
              {simulation.si_measurement_unit}/dia
            </Typography>
          </Typography>
        </View>
      </View>

      {/* Confirmação de exclusão inline */}
      {confirmDelete && (
        <View style={styles.confirmRow}>
          <Typography variant="regular" size="xs" color={theme.colors.danger.main}>
            Confirmar exclusão?
          </Typography>
          <View style={styles.confirmActions}>
            <TouchableOpacity onPress={() => setConfirmDelete(false)} style={styles.confirmBtn}>
              <Typography variant="medium" size="xs" color={theme.colors.text.secondary}>Não</Typography>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setConfirmDelete(false); onDelete?.(); }}
              style={[styles.confirmBtn, styles.confirmBtnDanger]}
            >
              <Typography variant="medium" size="xs" color={theme.colors.text.primary}>Sim, excluir</Typography>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  headerActions: { flexDirection: 'row', gap: theme.spacing.xs, marginLeft: theme.spacing.sm },
  actionBtn: { padding: 6 },
  dataGrid: { flexDirection: 'row', padding: theme.spacing.md },
  dataBox: { flex: 1, justifyContent: 'center' },
  divider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },
  label: { marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  confirmRow: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmActions: { flexDirection: 'row', gap: theme.spacing.sm },
  confirmBtn: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  confirmBtnDanger: {
    backgroundColor: theme.colors.danger.main,
    borderColor: theme.colors.danger.main,
  },
});