import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { theme } from '@/config/Theme'
import { useRouter } from 'expo-router'

interface HeaderProps {
    userName?: string;
    tips?: string
}

export function Header({ userName = 'Usuário', tips = 'Continue se esforçando para economizar!' }: HeaderProps) {
    const router = useRouter()
    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        <Feather name='user' size={24} color={theme.colors.text.primary}/>
                    </View>

                    <View>
                        <Typography variant="regular" size="sm" color={theme.colors.text.secondary}>
                            Bem-vindo de volta,
                        </Typography>
                        <Typography variant="bold" size="lg" color={theme.colors.text.primary}>
                            {userName}
                        </Typography>
                    </View>
                </View>

                <TouchableOpacity activeOpacity={0.8} style={styles.actionButton} onPress={() => router.push('/(app)/profile')}>
                    <Feather name='settings' size={20} color={theme.colors.text.primary}/>
                </TouchableOpacity>
            </View>

            <View style={styles.tips}>
                <Typography variant='bold' size='lg'>Dica do dia:</Typography>
                <Typography variant='regular' size='sm' style={styles.tipText}>{tips}</Typography>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignSelf: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card.infoCard,
    borderRadius: theme.borderRadius.lg,
    height: 200,
    width: '90%'
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.card.subCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.tools,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tips: {
    backgroundColor: theme.colors.tools,
    borderRadius: theme.borderRadius.xl, 
    alignItems: 'flex-start',
    alignSelf: 'center',
    width: '100%',
    paddingLeft: theme.spacing.sm,
  },
  tipText: {
    margin: 5
  }
});
