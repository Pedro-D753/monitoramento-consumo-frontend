import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PageLayout } from '@/components/layout/PageLayout';
import { ActionCard } from '@/components/ui/ActionCard';
import { Typography } from '@/components/ui/Typography';
import { theme } from '@/config/Theme';

export default function DashboardScreen() {
  return (
    <>
      <PageLayout userName="User">
        
        {/* Bloco de Resumo Financeiro */}
        <View style={styles.summaryCard}>
          <Typography variant="regular" size="sm" color={theme.colors.text.secondary}>
            Gasto Total (Este Mês)
          </Typography>
          <Typography variant="bold" size="xxl" color={theme.colors.text.primary} style={styles.summaryValue}>
            R$ 456,80
          </Typography>
        </View>

        {/* Cabeçalho da Lista */}
        <View style={styles.sectionHeader}>
        </View>
      <View style={styles.gridContainer}>
      
      {/* Coluna da Esquerda */}
      <View style={styles.column}>
        <ActionCard 
          title="Registrar Consumo" 
          backgroundColor={theme.colors.cardButtons.leftUp} // Use suas cores do theme aqui (ex: theme.colors.warning)
          height={100} // Card menor em cima
        />
        <ActionCard 
          title="Histórico" 
          backgroundColor={theme.colors.cardButtons.leftDown}
          height={160} // Card maior embaixo
        />
      </View>

      {/* Coluna da Direita */}
      <View style={styles.column}>
        <ActionCard 
          title="Simulações" 
          backgroundColor={theme.colors.cardButtons.rightUp}
          height={160} // Card maior em cima
          onPress={() => console.log("Simulações")}
        />
        <ActionCard 
          title="Metas" 
          backgroundColor={theme.colors.cardButtons.rightDown}
          height={100} // Card menor embaixo
          onPress={() => console.log("Metas")}
        />
      </View>
      </View>
      </PageLayout>
    </>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: theme.colors.card.subCard,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  summaryValue: {
    marginTop: theme.spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: theme.spacing.md, // Espaçamento entre as colunas
    marginTop: theme.spacing.minusSM,
  },
  column: {
    flex: 1, // Faz as duas colunas terem larguras iguais (50% cada)
    flexDirection: 'column',
    gap: theme.spacing.md, // Espaçamento vertical entre os cards da mesma coluna
  }
});