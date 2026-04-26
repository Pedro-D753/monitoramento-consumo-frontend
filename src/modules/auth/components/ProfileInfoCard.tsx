import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Typography } from "@/components/ui/Typography";
import { Input } from "@/components/ui/Input";
import { theme } from "@/config/Theme";
import { UserProfile } from "../services/AuthService";

interface Props {
  user: UserProfile | null;
  realName: string;
  username: string;
  isEditingName: boolean;
  isEditingUsername: boolean;
  onChangeName: (v: string) => void;
  onChangeUsername: (v: string) => void;
  onToggleEditName: () => void;
  onToggleEditUsername: () => void;
}

export function ProfileInfoCard({
  user, realName, username,
  isEditingName, isEditingUsername,
  onChangeName, onChangeUsername,
  onToggleEditName, onToggleEditUsername,
}: Props) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric",
    });

  return (
    <View style={styles.card}>
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Feather name="user" size={48} color={theme.colors.primary.main} />
        </View>
      </View>

      <View style={styles.infoSection}>
        {/* Nome */}
        <View style={styles.fieldContainer}>
          <Typography variant="regular" size="xs" color={theme.colors.text.secondary} style={styles.label}>
            Nome Completo
          </Typography>
          {isEditingName ? (
            <View style={styles.editRow}>
              <Input label="" value={realName} onChangeText={onChangeName} autoFocus style={{ flex: 1, marginBottom: 0 }} />
              <TouchableOpacity onPress={onToggleEditName} style={styles.checkButton}>
                <Feather name="check" size={20} color={theme.colors.primary.main} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={onToggleEditName} style={styles.viewRow}>
              <Typography variant="medium" size="md">{realName || "Sem nome"}</Typography>
              <Feather name="edit-2" size={16} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Username */}
        <View style={styles.fieldContainer}>
          <Typography variant="regular" size="xs" color={theme.colors.text.secondary} style={styles.label}>
            Nome de Usuário
          </Typography>
          {isEditingUsername ? (
            <View style={styles.editRow}>
              <Input label="" value={username} onChangeText={onChangeUsername} autoFocus autoCapitalize="none" style={{ flex: 1, marginBottom: 0 }} />
              <TouchableOpacity onPress={onToggleEditUsername} style={styles.checkButton}>
                <Feather name="check" size={20} color={theme.colors.primary.main} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={onToggleEditUsername} style={styles.viewRow}>
              <Typography variant="medium" size="md">@{username || "usuario"}</Typography>
              <Feather name="edit-2" size={16} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Email (read-only) */}
        <View style={styles.fieldContainer}>
          <Typography variant="regular" size="xs" color={theme.colors.text.secondary} style={styles.label}>
            E-mail
          </Typography>
          <View style={[styles.viewRow, styles.readOnlyRow]}>
            <Typography variant="medium" size="md" color={theme.colors.text.secondary}>
              {user?.email ?? "Sem e-mail"}
            </Typography>
            <Feather name="lock" size={14} color={theme.colors.text.disabled} />
          </View>
        </View>
      </View>

      {user?.created_at && (
        <View style={styles.footerInfo}>
          <Typography variant="regular" size="xs" color={theme.colors.text.secondary}>
            Conta criada em:{" "}
            <Typography variant="medium" size="xs" color={theme.colors.text.primary}>
              {formatDate(user.created_at)}
            </Typography>
          </Typography>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card.infoCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    elevation: 4,
  },
  avatarWrapper: { marginBottom: theme.spacing.xl },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: theme.colors.background.primary,
    justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: theme.colors.primary.main,
  },
  infoSection: { width: "100%", gap: theme.spacing.lg },
  fieldContainer: { width: "90%" },
  label: { marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  viewRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  readOnlyRow: { opacity: 0.6 },
  editRow: { flexDirection: "row", alignItems: "center" },
  checkButton: {
    padding: 8, backgroundColor: theme.colors.background.primary,
    borderRadius: 8, borderWidth: 1, borderColor: theme.colors.primary.main,
  },
  footerInfo: {
    paddingTop: 16, marginTop: theme.spacing.lg,
    borderTopWidth: 1, borderTopColor: theme.colors.border,
    width: "100%", alignItems: "center",
  },
});