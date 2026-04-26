import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";

import { PageLayout } from "@/components/layout/PageLayout";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { theme } from "@/config/Theme";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { updateUser } from "@/modules/auth/services/AuthService";
import { deleteUser } from "@/modules/auth/services/AuthService";
import { storage } from "@/config/Storage";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, refreshUser } = useAuth();
  const [realName, setRealName] = useState("");
  const [username, setUsername] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setRealName(user?.real_name ?? "");
    setUsername(user?.username ?? "");
  }, [user?.real_name, user?.username]);

  const hasChanges = useMemo(() => {
    return (
      !!user &&
      (realName.trim() !== user.real_name || username.trim() !== user.username)
    );
  }, [realName, user, username]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleSaveProfile = async () => {
    if (!user) {
      return;
    }

    const trimmedRealName = realName.trim();
    const trimmedUsername = username.trim();
    const payload = {
      ...(trimmedRealName !== user.real_name
        ? { new_real_name: trimmedRealName }
        : {}),
      ...(trimmedUsername !== user.username
        ? { new_username: trimmedUsername }
        : {}),
    };

    if (!payload.new_real_name && !payload.new_username) {
      setIsEditingName(false);
      setIsEditingUsername(false);
      setProfileError(null);
      return;
    }

    try {
      setIsSaving(true);
      setProfileError(null);
      await updateUser(payload);
      await refreshUser();
      setIsEditingName(false);
      setIsEditingUsername(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        const message =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail[0]?.msg || "Não foi possível atualizar o perfil."
              : "Não foi possível atualizar o perfil.";

        setProfileError(message);
      } else {
        setProfileError("Não foi possível atualizar o perfil.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      const refreshToken = await storage.getRefreshToken();
      if (!refreshToken) throw new Error("Sessão inválida.");
      await deleteUser(refreshToken);
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        setDeleteError(typeof detail === "string" ? detail : "Não foi possível excluir a conta.");
      } else {
        setDeleteError("Não foi possível excluir a conta.");
      }
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <PageLayout userName="Configurações" showHeader={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Typography variant="bold" size="xl">
            Gestao de Perfil
          </Typography>
          <Typography
            variant="regular"
            size="sm"
            color={theme.colors.text.secondary}
          >
            Visualize ou atualize seus dados
          </Typography>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Feather
                name="user"
                size={48}
                color={theme.colors.primary.main}
              />
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.fieldContainer}>
              <Typography
                variant="regular"
                size="xs"
                color={theme.colors.text.secondary}
                style={styles.label}
              >
                Nome Completo
              </Typography>
              {isEditingName ? (
                <View style={styles.editRow}>
                  <Input
                    label=""
                    value={realName}
                    onChangeText={setRealName}
                    autoFocus
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                  <TouchableOpacity
                    onPress={() => setIsEditingName(false)}
                    style={styles.checkButton}
                  >
                    <Feather
                      name="check"
                      size={20}
                      color={theme.colors.primary.main}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsEditingName(true)}
                  style={styles.viewRow}
                >
                  <Typography
                    variant="medium"
                    size="md"
                    color={theme.colors.text.primary}
                  >
                    {realName || "Sem nome"}
                  </Typography>
                  <Feather
                    name="edit-2"
                    size={16}
                    color={theme.colors.text.secondary}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Typography
                variant="regular"
                size="xs"
                color={theme.colors.text.secondary}
                style={styles.label}
              >
                Nome de Usuario
              </Typography>
              {isEditingUsername ? (
                <View style={styles.editRow}>
                  <Input
                    label=""
                    value={username}
                    onChangeText={setUsername}
                    autoFocus
                    autoCapitalize="none"
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                  <TouchableOpacity
                    onPress={() => setIsEditingUsername(false)}
                    style={styles.checkButton}
                  >
                    <Feather
                      name="check"
                      size={20}
                      color={theme.colors.primary.main}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsEditingUsername(true)}
                  style={styles.viewRow}
                >
                  <Typography
                    variant="medium"
                    size="md"
                    color={theme.colors.text.primary}
                  >
                    @{username || "usuario"}
                  </Typography>
                  <Feather
                    name="edit-2"
                    size={16}
                    color={theme.colors.text.secondary}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Typography
                variant="regular"
                size="xs"
                color={theme.colors.text.secondary}
                style={styles.label}
              >
                E-mail
              </Typography>
              <View style={[styles.viewRow, styles.readOnlyRow]}>
                <Typography
                  variant="medium"
                  size="md"
                  color={theme.colors.text.secondary}
                >
                  {user?.email ?? "Sem e-mail"}
                </Typography>
                <Feather
                  name="lock"
                  size={14}
                  color={theme.colors.text.disabled}
                />
              </View>
            </View>
          </View>

          <View style={styles.footerInfo}>
            <Typography
              variant="regular"
              size="xs"
              color={theme.colors.text.secondary}
            >
              Conta criada em:{" "}
              <Typography
                variant="medium"
                size="xs"
                color={theme.colors.text.primary}
              >
                {user?.created_at ? formatDate(user.created_at) : "Data indisponivel"}
              </Typography>
            </Typography>
          </View>
        </View>

        {profileError && (
          <Typography variant="regular" size="sm" style={styles.errorText}>
            {profileError}
          </Typography>
        )}

      <View style={styles.secondaryActions}>
        <Button
          title="Alterar Senha"
          variant="outline"
          onPress={() => router.push("/(app)/change-password")}
          style={styles.changeButton}
        />
        <Button
          title="Salvar Alterações"
          variant="outline"
          onPress={handleSaveProfile}
          isLoading={isSaving}
          disabled={!hasChanges}
          style={styles.changeButton}
        />

        <Button
          title="Sair da Conta"
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutButton}
        />

        {!showDeleteConfirm ? (
          <Button
            title="Excluir Conta"
            variant="danger"
            onPress={() => setShowDeleteConfirm(true)}
            style={styles.logoutButton}
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
              <Button
                title="Cancelar"
                variant="outline"
                onPress={() => setShowDeleteConfirm(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Confirmar"
                variant="danger"
                onPress={handleDeleteAccount}
                isLoading={isDeleting}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        )}
      </View>
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    marginBottom: theme.spacing.sm,
  },
  mainCard: {
    backgroundColor: theme.colors.card.infoCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    elevation: 4,
  },
  avatarWrapper: {
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  infoSection: {
    width: "100%",
    gap: theme.spacing.lg,
  },
  fieldContainer: {
    width: "90%",
  },
  label: {
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  viewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  readOnlyRow: {
    borderBottomWidth: 0,
    opacity: 0.6,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkButton: {
    padding: 8,
    backgroundColor: theme.colors.background.primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  footerInfo: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    width: "100%",
    alignItems: "center",
  },
  errorText: {
    color: theme.colors.danger.main,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
  secondaryActions: {
    marginTop: theme.spacing.xl,
  },
  logoutButton: {
    width: "100%",
    borderColor: theme.colors.danger.main,
    marginBottom: 20
  },
  changeButton: {
    width: "100%",
    marginTop: -15,
    marginVertical: 25,
  },
  confirmBox: {
    borderWidth: 1,
    borderColor: theme.colors.danger.main,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
},
  confirmRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
},
});
