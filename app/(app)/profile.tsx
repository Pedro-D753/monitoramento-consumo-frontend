import React from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';
import { useRouter } from "expo-router";

import { PageLayout } from "@/components/layout/PageLayout";
import { Typography } from "@/components/ui/Typography";
import { theme } from "@/config/Theme";
import { ProfileInfoCard } from "@/modules/auth/components/ProfileInfoCard";
import { ProfileActions } from "@/modules/auth/components/ProfileActions";
import { useProfileActions } from "@/modules/auth/hooks/UseProfileActions";

export default function ProfileScreen() {
  const router = useRouter();
  const {
    user,
    realName, username, setRealName, setUsername, hasChanges,
    isEditingName, isEditingUsername, setIsEditingName, setIsEditingUsername,
    isSaving, profileError,
    showDeleteConfirm, setShowDeleteConfirm,
    isDeleting, deleteError,
    handleSaveProfile, handleDeleteAccount, handleLogout,
  } = useProfileActions();

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
  scroll:    { paddingBottom: 40 },
  title:     { marginBottom: theme.spacing.xs },
  subtitle:  { marginBottom: theme.spacing.lg },
  error:     { color: theme.colors.danger.main, textAlign: "center", marginTop: theme.spacing.md },
  headerContainer: {
    alignItems: 'flex-start',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: theme.colors.gray[900],
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: theme.colors.border,
  },
});