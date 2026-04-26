import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { PageLayout } from '@/components/layout/PageLayout';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { theme } from '@/config/Theme';
import { useAuth } from '@/modules/auth/context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  // Dados do Usuário (Simulando o retorno da API)
  const [realName, setRealName] = useState("Paulo Demeris");
  const [username, setUsername] = useState("paulo_demeris");
  const [email] = useState("paulo@exemplo.com.br");
  const createdAt = "2024-04-20T17:37:00Z"; 

  // Estados para controlar o modo de edição de cada campo
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  return (
    <PageLayout userName="Configurações" showHeader={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Typography variant="bold" size="xl">Gestão de Perfil</Typography>
          <Typography variant="regular" size="sm" color={theme.colors.text.secondary}>
            Visualize ou atualize seus dados
          </Typography>
        </View>

        {/* Card Central Estilizado */}
        <View style={styles.mainCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Feather name="user" size={48} color={theme.colors.primary.main} />
            </View>
          </View>

          <View style={styles.infoSection}>
            
            {/* Campo: Nome Completo */}
            <View style={styles.fieldContainer}>
              <Typography variant="regular" size="xs" color={theme.colors.text.secondary} style={styles.label}>
                Nome Completo
              </Typography>
              {isEditingName ? (
                <View style={styles.editRow}>
                  <Input 
                    label=''
                    value={realName} 
                    onChangeText={setRealName} 
                    autoFocus 
                    style={{ flex: 1, marginBottom: 0 }} 
                  />
                  <TouchableOpacity onPress={() => setIsEditingName(false)} style={styles.checkButton}>
                    <Feather name="check" size={20} color={theme.colors.primary.main} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setIsEditingName(true)} style={styles.viewRow}>
                  <Typography variant="medium" size="md" color={theme.colors.text.primary}>
                    {realName}
                  </Typography>
                  <Feather name="edit-2" size={16} color={theme.colors.text.secondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Campo: Nome de Usuário */}
            <View style={styles.fieldContainer}>
              <Typography variant="regular" size="xs" color={theme.colors.text.secondary} style={styles.label}>
                Nome de Usuário
              </Typography>
              {isEditingUsername ? (
                <View style={styles.editRow}>
                  <Input
                    label='' 
                    value={username} 
                    onChangeText={setUsername} 
                    autoFocus 
                    autoCapitalize="none"
                    style={{ flex: 1, marginBottom: 0 }} 
                  />
                  <TouchableOpacity onPress={() => setIsEditingUsername(false)} style={styles.checkButton}>
                    <Feather name="check" size={20} color={theme.colors.primary.main} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setIsEditingUsername(true)} style={styles.viewRow}>
                  <Typography variant="medium" size="md" color={theme.colors.text.primary}>
                    @{username}
                  </Typography>
                  <Feather name="edit-2" size={16} color={theme.colors.text.secondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Campo: E-mail (Apenas Leitura) */}
            <View style={styles.fieldContainer}>
              <Typography variant="regular" size="xs" color={theme.colors.text.secondary} style={styles.label}>
                E-mail
              </Typography>
              <View style={[styles.viewRow, { borderBottomWidth: 0, opacity: 0.6 }]}>
                <Typography variant="medium" size="md" color={theme.colors.text.secondary}>
                  {email}
                </Typography>
                <Feather name="lock" size={14} color={theme.colors.text.disabled} />
              </View>
            </View>
          </View>

          {/* Footer do Card com data de criação */}
          <View style={styles.footerInfo}>
            <Typography variant="regular" size="xs" color={theme.colors.text.secondary}>
              Conta criada em: <Typography variant="medium" size="xs" color={theme.colors.text.primary}>
                {formatDate(createdAt)}
              </Typography>
            </Typography>
          </View>
        </View>

        <View style={styles.secondaryActions}>
          <Button
          title="Alterar"
          variant='outline'
          style={styles.changeButton}
        />
          <Button 
            title="Sair da Conta" 
            onPress={handleLogout}
            variant="danger"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: { 
    paddingBottom: 40 
  },
  header: { 
    marginBottom: theme.spacing.sm 
  },
  mainCard: {
    backgroundColor: theme.colors.card.infoCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    elevation: 4,
  },
  avatarWrapper: { 
    marginBottom: theme.spacing.xl 
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: theme.colors.primary.main,
  },
  infoSection: { width: '100%', gap: theme.spacing.lg },
  fieldContainer: { width: '90%' },
  label: { marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  viewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkButton: {
    padding: 8,
    backgroundColor: theme.colors.background.primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  footerInfo: {
    marginTop: 0,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    width: '100%',
    alignItems: 'center',
  },
  secondaryActions: { marginTop: theme.spacing.xl },
  logoutButton: {
    width: '100%',
    borderColor: theme.colors.danger.main,
  },
  changeButton: {
    width: '100%',
    marginTop: -15,
    marginVertical: 25
  }
});