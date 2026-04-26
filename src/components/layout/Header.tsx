import React, { useEffect, useState } from 'react';
import { getTip } from '@/modules/tips/services/TipService';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { theme } from '@/config/Theme'
import { useRouter } from 'expo-router'

interface HeaderProps {
    userName?: string;
    tip?: string
}

export function Header({ userName = 'Usuário'}: HeaderProps) {
    const router = useRouter()
    const [tip, setTip] = useState('Continue se esforçando para economizar!');

    useEffect(() => {
      getTip('kwh')
        .then((data) => setTip(data.tip))
        .catch(() => {}); // Silencia: fallback já está no state
    }, []);

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
                <Typography variant='bold' size='md'>Dica do dia:</Typography>
                <Typography variant='regular' size='sm' style={styles.tipText}>
                  {tip}
                </Typography>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card.infoCard,
    borderRadius: theme.borderRadius.lg,
    width: '90%',
    // NOVA SOLUÇÃO: Em vez de altura fixa, o gap garante a distância exata 
    // entre os dados do usuário e a caixa de dica. O container vai esticar sozinho.
    gap: theme.spacing.lg, 
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Centraliza o botão de config com a foto verticalmente
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
    width: '100%',
    padding: theme.spacing.md, // Adicionado padding uniforme interno na caixinha
  },
  tipText: {
    marginTop: theme.spacing.xs, // Descola a dica do título
    lineHeight: 20, // Melhora a leitura de textos muito longos
  }
});