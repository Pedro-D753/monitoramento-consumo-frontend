import React, { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';

import { PageLayout } from '@/components/layout/PageLayout';
import { BottomSheetModal } from '@/components/ui/BottomSheetModal';
import { ActionCard } from '@/components/ui/ActionCard';
import { Typography } from '@/components/ui/Typography';
import { ConsumptionBarChart } from '@/components/ui/ConsumptionBarChart';

import { useConsumptionHistory } from '@/modules/consumos/hooks/UseConsumptionHistory';
import { CreateConsumptionForm } from '@/modules/consumos/components/CreateConsumptionForm';
import { EntryType } from '@/modules/consumos/services/ConsumptionService';
import { theme } from '@/config/Theme';

export default function DashboardScreen() {
  const router = useRouter();
  
  // Extraímos rawData para calcular o resumo financeiro localmente
  const { data, rawData, isLoading, refetch } = useConsumptionHistory(); 
  
  // Substituímos o booleano por um estado tipado que controla qual formulário a gaveta deve renderizar
  const [modalType, setModalType] = useState<EntryType | null>(null);

  // Cálculo Dinâmico do Resumo Financeiro (Latência Zero)
  const currentMonthTotal = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return rawData
      .filter((item) => {
        const isMoney = item.measurement_unit.toUpperCase() === 'R$';
        const itemDate = new Date(item.ending_date);
        const isThisMonth = itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
        
        return isMoney && isThisMonth;
      })
      .reduce((acc, item) => acc + item.value, 0);
  }, [rawData]);

  // Formatação alinhada com o padrão do resto do app
  const formattedTotal = `R$ ${currentMonthTotal.toFixed(2).replace('.', ',')}`;

  // Disparado quando qualquer formulário (Real, Simulação ou Meta) tem sucesso na API
  const handleSuccess = () => {
    setModalType(null); // Fecha a gaveta
    refetch(); // Atualiza os gráficos e o resumo financeiro com o novo dado
  };

  return (
    <>
      <PageLayout userName="User">
        
        {/* Bloco de Resumo Financeiro Reativo */}
        <View style={styles.summaryCard}>
          <Typography variant="regular" size="sm" color={theme.colors.text.secondary}>
            Gasto Total (Este Mês)
          </Typography>
          <Typography variant="bold" size="xxl" color={theme.colors.text.primary} style={styles.summaryValue}>
            {formattedTotal}
          </Typography>
        </View>

        <View style={styles.gridContainer}>
          {/* Coluna da Esquerda */}
          <View style={styles.column}>
            <ActionCard 
              title="Registrar Consumo" 
              backgroundColor={theme.colors.cardButtons.leftUp} 
              height={100} 
              onPress={() => setModalType('real')}
            />
            <ActionCard 
              title="Histórico" 
              backgroundColor={theme.colors.cardButtons.leftDown}
              height={160}
              onPress={() => router.push('/(app)/history')}
            />
          </View>

          {/* Coluna da Direita */}
          <View style={styles.column}>
            <ActionCard 
              title="Simulações" 
              backgroundColor={theme.colors.cardButtons.rightUp}
              height={160} 
              onPress={() => setModalType('simulation')}
            />
            <ActionCard 
              title="Metas" 
              backgroundColor={theme.colors.cardButtons.rightDown}
              height={100} 
              onPress={() => setModalType('goal')}
            />
          </View>
        </View>

        {/* Gráfico principal renderizado DIRETAMENTE no Dashboard */}
        <View style={styles.chartSection}>
          <ConsumptionBarChart 
            data={data} 
            isLoading={isLoading} 
          />
        </View>
      </PageLayout>

      {/* A Gaveta (Modal) Dinâmica */}
      <BottomSheetModal
        visible={!!modalType}
        onClose={() => setModalType(null)}
        title={
          modalType === 'real' ? 'Registrar Consumo' :
          modalType === 'simulation' ? 'Nova Simulação' :
          modalType === 'goal' ? 'Definir Meta' : ''
        }
      >
        {/* Renderiza o formulário passando o tipo exato e a função de callback */}
        {modalType && (
          <CreateConsumptionForm type={modalType} onSuccess={handleSuccess} />
        )}
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: theme.colors.card.subCard,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  summaryValue: {
    marginTop: theme.spacing.xs,
  },
  chartSection: {
    marginTop: theme.spacing.md,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: theme.spacing.md, 
    marginTop: theme.spacing.minusSM,
  },
  column: {
    flex: 1, 
    flexDirection: 'column',
    gap: theme.spacing.md, 
  }
});