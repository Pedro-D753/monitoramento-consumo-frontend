import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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
  onEdit?: () => void;
  onDelete?: () => void;
}

const typeConfig = {
  water: { icon: 'droplet', color: '#3498db' },
  energy: { icon: 'zap', color: '#f1c40f' },
  gas: { icon: 'wind', color: '#e74c3c' },
  money: { icon: 'dollar-sign', color: '#0bc53a' },
  other: { icon: 'box', color: '#95a5a6' },
} as const;

export function ConsumptionCard({
  id, description, type, title, value, unit, date, cost, onEdit, onDelete,
}: ConsumptionCardProps) {
  const config = typeConfig[type];
  const [confirmDelete, setConfirmDelete] = useState(false);
  const hasActions = !!onEdit || !!onDelete;

  // ✅ FORMATAÇÃO LIMPA: Remove ".00" inúteis e adiciona pontuação de milhar (ex: 20000 -> 20.000)
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
  }).format(value);

  return (
    <View style={styles.card}>
      <View style={styles.mainRow}>
        
        {/* LADO ESQUERDO: Texto descritivo (Ocupa até 60% do espaço) */}
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
            <Feather name={config.icon as any} size={24} color={config.color} />
          </View>
          
          <View style={styles.textContainer}>
            <Typography 
              variant="bold" 
              size="md" 
              numberOfLines={2} 
              ellipsizeMode="tail" 
              hyphenate 
            >
              {(description ?? title).toUpperCase()}
            </Typography>
            <Typography variant="regular" size="xs" color={theme.colors.text.secondary} numberOfLines={1}>
              #{id} • {date}
            </Typography>
          </View>
        </View>

        {/* LADO DIREITO: Valor e botões (Ocupa até 40% do espaço) */}
        <View style={styles.rightSection}>
          <Typography variant="bold" size="lg" numberOfLines={1} adjustsFontSizeToFit>
            {formattedValue}{" "}
            <Typography variant="regular" size="sm" color={theme.colors.text.secondary}>
              {unit?.toLowerCase() === 'kwh' ? 'kWh' : 
                unit?.toLowerCase() === 'l' || 
                unit?.toLowerCase() === 'r$' || 
                unit?.toLowerCase() === 'm³' ? 
                unit?.toUpperCase() : unit }
            </Typography>
          </Typography>
          
          {cost !== undefined && (
            <Typography variant="regular" size="xs" color={theme.colors.text.secondary}>
              R$ {cost.toFixed(2).replace(".", ",")}
            </Typography>
          )}
          
          {hasActions && (
            <View style={styles.actions}>
              {onEdit && (
                <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
                  <Feather name="edit-2" size={14} color={theme.colors.primary.main} />
                </TouchableOpacity>
              )}
              {onDelete && !confirmDelete && (
                <TouchableOpacity onPress={() => setConfirmDelete(true)} style={styles.actionBtn}>
                  <Feather name="trash-2" size={14} color={theme.colors.danger.main} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Confirmação inline de deleção */}
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
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", 
  },
  leftSection: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: theme.spacing.md, 
    flex: 1, 
    maxWidth: '65%', // 🛡️ BARREIRA FÍSICA: Nunca passará da metade da tela
    paddingRight: theme.spacing.sm 
  },
  iconContainer: { 
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  textContainer: {
    flex: 1, // 🛡️ VITAL: Passa o limite do maxWidth para o Typography saber onde cortar o texto
  },
  rightSection: { 
    alignItems: "flex-end",
    justifyContent: "center",
    flexShrink: 0, 
    maxWidth: '40%', // 🛡️ BARREIRA FÍSICA: Protege o valor de ser esmagado
  },
  actions: { 
    flexDirection: "row", 
    gap: theme.spacing.sm, 
    marginTop: 6 
  },
  actionBtn: { padding: 4 },
  confirmRow: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  confirmActions: { flexDirection: "row", gap: theme.spacing.sm },
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