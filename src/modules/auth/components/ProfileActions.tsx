import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { theme } from "@/config/Theme";

interface Props {
  hasChanges: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  showDeleteConfirm: boolean;
  deleteError: string | null;
  onChangePassword: () => void;
  onSave: () => void;
  onLogout: () => void;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

export function ProfileActions({
  hasChanges, isSaving, isDeleting,
  showDeleteConfirm, deleteError,
  onChangePassword, onSave, onLogout,
  onDeleteRequest, onDeleteConfirm, onDeleteCancel,
}: Props) {
  return (
    <View style={styles.container}>
      <Button
        title="Alterar Senha"
        variant="outline"
        onPress={onChangePassword}
        style={styles.btn}
      />
      <View style={styles.buttonRow}>
        <Button
          title="Salvar"
          variant="outline"
          onPress={onSave}
          isLoading={isSaving}
          disabled={!hasChanges}
          style={{width: "45%", marginBottom: theme.spacing.md}}
        />
        <Button
          title="Sair da Conta"
          variant="outline"
          onPress={onLogout}
          style={styles.dangerBtn}
        />
      </View>
      {!showDeleteConfirm ? (
        <Button
          title="Excluir Conta"
          variant="danger"
          onPress={onDeleteRequest}
          style={{ alignSelf: 'center' }}
        />
      ) : (
        <View style={styles.confirmBox}>
          <Typography variant="bold" size="sm" color={theme.colors.danger.main} align="center">
            Isso é irreversível. Confirmar exclusão?
          </Typography>
          {deleteError && (
            <Typography variant="regular" size="xs" color={theme.colors.danger.main} align="center">
              {deleteError}
            </Typography>
          )}
          <View style={styles.confirmRow}>
            <Button title="Cancelar" variant="outline" onPress={onDeleteCancel} style={{ flex: 1 }} />
            <Button title="Confirmar" variant="danger" onPress={onDeleteConfirm} isLoading={isDeleting} style={{ flex: 1 }} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: theme.spacing.xl },
  btn: { width: "100%", marginBottom: theme.spacing.md },
  dangerBtn: { width: "45%", borderWidth: 2, borderColor: theme.colors.danger.main },
  confirmBox: {
    borderWidth: 1, borderColor: theme.colors.danger.main,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  confirmRow: { flexDirection: "row", gap: theme.spacing.sm },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
});