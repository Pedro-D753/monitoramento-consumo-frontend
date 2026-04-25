import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { theme } from '@/config/Theme'

interface HeaderProps {
    userName?: string;
    tips?: string
}

export function Header({ userName = 'Usuário', tips = 'Continue se esforçando para economizar!' }: HeaderProps) {
    return (
        <View style={styles.container}>
            
            {/* LINHA SUPERIOR: Usuário à esquerda e Botões à direita */}
            <View style={styles.topRow}>
                <View style={styles.userInfo}>
                    {/* Avatar PlaceHolder */}
                    <View style={styles.avatar}>
                        <Feather name='user' size={24} color={theme.colors.text.primary}/>
                    </View>

                    {/* Saudação */}
                    <View>
                        <Typography variant="regular" size="sm" color={theme.colors.text.secondary}>
                            Bem-vindo de volta,
                        </Typography>
                        <Typography variant="bold" size="lg" color={theme.colors.text.primary}>
                            {userName}
                        </Typography>
                    </View>
                </View>

                {/* Botão de config ou qualquer outra coisa */}
                <TouchableOpacity style={styles.actionButton}>
                    <Feather name='settings' size={20} color={theme.colors.text.primary}/>
                </TouchableOpacity>
            </View>

            {/* BASE: Dicas */}
            <View style={styles.tips}>
                <Typography variant='bold' size='lg'>Dica do dia:</Typography>
                <Typography variant='regular' size='md'>{tips}</Typography>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    // O flexDirection padrão já é 'column'. 
    // Com space-between, o topRow vai pro topo e as tips vão pra base.
    justifyContent: 'space-between',
    alignSelf: 'center',
    padding: theme.spacing.md, // Centraliza o padding para todos os lados
    backgroundColor: theme.colors.card.infoCard,
    borderRadius: theme.borderRadius.lg,
    height: 200,
    width: '90%'
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Mantém o botão alinhado ao topo caso os textos fiquem grandes
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
    // Como está num container do tipo column, ele vai se alinhar naturalmente à esquerda.
    backgroundColor: theme.colors.tools,
    borderRadius: theme.borderRadius.sm, 
    alignItems: 'flex-start',
    alignSelf: 'center',
    width: '100%',
    paddingLeft: theme.spacing.sm,
  }
});