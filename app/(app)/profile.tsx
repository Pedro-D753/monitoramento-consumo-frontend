import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons'
import { useRouter } from "expo-router";
import axios from "axios";

import { PageLayout } from "@/components/layout/PageLayout";
import { Typography } from "@/components/ui/Typography";
import { theme } from "@/config/Theme";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { updateUser, deleteUser } from "@/modules/auth/services/AuthService";
import { storage } from "@/config/Storage";
import { ProfileInfoCard } from "@/modules/auth/components/ProfileInfoCard";
import { ProfileActions } from "@/modules/auth/components/ProfileActions";

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

  const hasChanges = useMemo(() =>
    !!user && (realName.trim() !== user.real_name || username.trim() !== user.username),
    [realName, username, user]
  );

  const handleSaveProfile = async () => {
    if (!user) return;
    const payload = {
      ...(realName.trim() !== user.real_name ? { new_real_name: realName.trim() } : {}),
      ...(username.trim() !== user.username ? { new_username: username.trim() } : {}),
    };
    if (!payload.new_real_name && !payload.new_username) {
      setIsEditingName(false);
      setIsEditingUsername(false);
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
        setProfileError(typeof detail === "string" ? detail : "Não foi possível atualizar o perfil.");
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
    <PageLayout showHeader={false}>
      <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          
          </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Typography variant="bold" size="xl" style={styles.title}>
          Gestão de Perfil
        </Typography>
        <Typography variant="regular" size="sm" color={theme.colors.text.secondary} style={styles.subtitle}>
          Visualize ou atualize seus dados
        </Typography>

        <ProfileInfoCard
          user={user}
          realName={realName}
          username={username}
          isEditingName={isEditingName}
          isEditingUsername={isEditingUsername}
          onChangeName={setRealName}
          onChangeUsername={setUsername}
          onToggleEditName={() => setIsEditingName((v) => !v)}
          onToggleEditUsername={() => setIsEditingUsername((v) => !v)}
        />

        {profileError && (
          <Typography variant="regular" size="sm" style={styles.error}>
            {profileError}
          </Typography>
        )}

        <ProfileActions
          hasChanges={hasChanges}
          isSaving={isSaving}
          isDeleting={isDeleting}
          showDeleteConfirm={showDeleteConfirm}
          deleteError={deleteError}
          onChangePassword={() => router.push("/(app)/change-password")}
          onSave={handleSaveProfile}
          onLogout={handleLogout}
          onDeleteRequest={() => setShowDeleteConfirm(true)}
          onDeleteConfirm={handleDeleteAccount}
          onDeleteCancel={() => setShowDeleteConfirm(false)}
        />
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 40 },
  title: { marginBottom: theme.spacing.xs },
  subtitle: { marginBottom: theme.spacing.lg },
  error: { color: theme.colors.danger.main, textAlign: "center", marginTop: theme.spacing.md },
  headerContainer: {
    alignItems: 'flex-start',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray[900],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});