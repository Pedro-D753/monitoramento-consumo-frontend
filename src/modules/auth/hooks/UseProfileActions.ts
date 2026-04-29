import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { updateUser, deleteUser, UserProfile } from '@/modules/auth/services/AuthService';
import { storage } from '@/config/Storage';
import { descriptionCache } from '@/config/DescriptionCache';

interface ProfileActionsState {
  // Dados do usuário editável
  user: UserProfile | null;
  realName: string;
  username: string;
  setRealName: (v: string) => void;
  setUsername: (v: string) => void;
  hasChanges: boolean;
  // Estado de edição inline
  isEditingName: boolean;
  isEditingUsername: boolean;
  setIsEditingName: (v: boolean | ((prev: boolean) => boolean)) => void;
  setIsEditingUsername: (v: boolean | ((prev: boolean) => boolean)) => void;
  // Estado de salvamento
  isSaving: boolean;
  profileError: string | null;
  // Estado de exclusão
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (v: boolean) => void;
  isDeleting: boolean;
  deleteError: string | null;
  // Ações
  handleSaveProfile: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

export function useProfileActions(): ProfileActionsState {
  const router = useRouter();
  const { user, signOut, refreshUser } = useAuth();

  const [realName, setRealName]               = useState('');
  const [username, setUsername]               = useState('');
  const [isEditingName, setIsEditingName]     = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isSaving, setIsSaving]               = useState(false);
  const [profileError, setProfileError]       = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting]           = useState(false);
  const [deleteError, setDeleteError]         = useState<string | null>(null);

  // Sincroniza os campos editáveis quando o objeto user muda
  useEffect(() => {
    setRealName(user?.real_name ?? '');
    setUsername(user?.username ?? '');
  }, [user?.real_name, user?.username]);

  const hasChanges = useMemo(
    () =>
      !!user &&
      (realName.trim() !== user.real_name || username.trim() !== user.username),
    [realName, username, user],
  );

  const handleSaveProfile = useCallback(async () => {
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
      const detail = axios.isAxiosError(error)
        ? error.response?.data?.detail
        : null;
      setProfileError(
        typeof detail === 'string' ? detail : 'Não foi possível atualizar o perfil.',
      );
    } finally {
      setIsSaving(false);
    }
  }, [user, realName, username, refreshUser]);

  const handleDeleteAccount = useCallback(async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);

      const refreshToken = await storage.getRefreshToken();
      if (!refreshToken) throw new Error('Sessão inválida.');

      await deleteUser(refreshToken);

      // Limpa cache de descrições ao excluir conta
      descriptionCache.invalidate();

      // ✅ Bug #4: signOut local (conta já não existe no server) + redirect obrigatório
      await signOut(true);
      router.replace('/(auth)/sign-in');
    } catch (error) {
      const detail = axios.isAxiosError(error)
        ? error.response?.data?.detail
        : null;
      setDeleteError(
        typeof detail === 'string' ? detail : 'Não foi possível excluir a conta.',
      );
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  }, [signOut, router]);

  const handleLogout = useCallback(async () => {
    descriptionCache.invalidate();
    await signOut();
    router.replace('/(auth)/sign-in');
  }, [signOut, router]);

  return {
    user,
    realName, username, setRealName, setUsername, hasChanges,
    isEditingName, isEditingUsername, setIsEditingName, setIsEditingUsername,
    isSaving, profileError,
    showDeleteConfirm, setShowDeleteConfirm,
    isDeleting, deleteError,
    handleSaveProfile, handleDeleteAccount, handleLogout,
  };
}