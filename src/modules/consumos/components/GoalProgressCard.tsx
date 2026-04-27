import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { theme } from '@/config/Theme';
import { ConsumptionRecord, parseApiDate } from '../schemas/ConsumptionSchema';
import { getUnitLabel } from '../utils/UnitUtils';

interface GoalProgressCardProps {
  goal: ConsumptionRecord;
  currentSpent: number;
  percentage: number;
  isOverLimit: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function GoalProgressCard({
  goal, currentSpent, percentage, isOverLimit, onEdit, onDelete,
}: GoalProgressCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  let barColor = theme.colors.primary.main;
  if (percentage >= 85 && !isOverLimit) barColor = theme.colors.status.warning;
  if (isOverLimit)                       barColor = theme.colors.danger.main;

  const endDate   = parseApiDate(goal.ending_date).toLocaleDateString('pt-BR');
  const unitLabel = getUnitLabel(goal.si_measurement_unit);

  return (
    <View style={styles.card}>
      {/* Cabeçalho com título e ações */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Typography variant="bold" size="lg">Meta de {unitLabel}</Typography>
          <Typography variant="regular" size="xs" color={theme.colors.text.secondary}>
            Válida até {endDate}
          </Typography>
        </View>
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
              <Feather name="edit-2" size={16} color={theme.colors.primary.main} />
            </TouchableOpacity>
          )}
          {onDelete && !confirmDelete && (
            <TouchableOpacity onPress={() => setConfirmDelete(true)} style={styles.actionBtn}>
              <Feather name="trash-2" size={16} color={theme.colors.danger.main} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Progresso numérico */}
      <View style={styles.progressTextRow}>
        <Typography
          variant="medium"
          size="md"
          color={isOverLimit ? theme.colors.danger.main : theme.colors.text.primary}
        >
          {currentSpent.toFixed(2)} / {goal.value} {goal.si_measurement_unit}
        </Typography>
        <Typography variant="bold" size="md" color={barColor}>
          {percentage.toFixed(1)}%
        </Typography>
      </View>

      {/* Barra de progresso */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: barColor }]} />
      </View>

      {isOverLimit && (
        <Typography variant="regular" size="xs" color={theme.colors.danger.main} style={styles.overLimitText}>
          Atenção: Você ultrapassou o limite projetado!
        </Typography>
      )}

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
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  headerText: { flex: 1, marginRight: theme.spacing.sm },
  actions: { flexDirection: 'row', gap: theme.spacing.sm },
  actionBtn: { padding: 6 },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  progressBarBg: {
    height: 10,
    width: '100%',
    backgroundColor: theme.colors.background.input,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 5 },
  overLimitText: { marginTop: theme.spacing.sm },
  confirmRow: {
    marginTop: theme.spacing.sm,
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