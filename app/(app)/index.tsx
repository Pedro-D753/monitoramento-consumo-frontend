import React, { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';

import { Toast } from '@/components/ui/Toast';
import { PageLayout } from '@/components/layout/PageLayout';
import { BottomSheetModal } from '@/components/ui/BottomSheetModal';
import { ActionCard } from '@/components/ui/ActionCard';
import { Typography } from '@/components/ui/Typography';
import { ConsumptionBarChart } from '@/components/ui/ConsumptionBarChart';

import { useConsumptionHistory } from '@/modules/consumos/hooks/UseConsumptionHistory';
import { CreateConsumptionForm } from '@/modules/consumos/components/CreateConsumptionForm';
import { EntryType } from '@/modules/consumos/services/ConsumptionService';
import { parseApiDate } from '@/modules/consumos/schemas/ConsumptionSchema';
import { theme } from '@/config/Theme';

export default function DashboardScreen() {
  const router = useRouter();
  const { data, rawData, isLoading, refetch } = useConsumptionHistory(); 
  const [modalType, setModalType] = useState<EntryType | null>(null);
  
  // Estados para o sistema de Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

const currentMonthTotal = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return rawData
      .filter((item) => {
        const isMoney = item.si_measurement_unit.toLowerCase() === 'r$';
        const itemDate = parseApiDate(item.ending_date);
        const isThisMonth = itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
        
        return isMoney && isThisMonth;
      })
      .reduce((acc, item) => acc + (Number(item.value) || 0), 0);
  }, [rawData]);

  const formattedTotal = currentMonthTotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  const handleSuccess = () => {
    // 1. Define a mensagem dinâmica com base no tipo de modal que estava aberto
    let message = "Operação realizada com sucesso!";
    if (modalType === 'real') message = "Consumo registrado com sucesso!";
    if (modalType === 'simulation') message = "Simulação criada com sucesso!";
    if (modalType === 'goal') message = "Meta definida com sucesso!";

    // 2. Aciona o Toast e atualiza os dados
    setToastMessage(message);
    setShowToast(true);
    setModalType(null);
    refetch();
  };

  return (
    <>
      {/* Componente Toast renderizado no topo para flutuar sobre a UI */}
      <Toast 
        visible={showToast} 
        message={toastMessage} 
        onHide={() => setShowToast(false)} 
      />

      <PageLayout>
        <View style={styles.summaryCard}>
          <Typography variant="regular" size="sm" color={theme.colors.text.secondary}>
            Gasto Total (Este Mês)
          </Typography>
          <Typography variant="bold" size="xxl" color={theme.colors.text.primary} style={styles.summaryValue}>
            {formattedTotal}
          </Typography>
        </View>

        <View style={styles.gridContainer}>
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

        <View style={styles.chartSection}>
          <ConsumptionBarChart 
            data={data} 
            isLoading={isLoading} 
          />
        </View>
      </PageLayout>

      <BottomSheetModal
        visible={!!modalType}
        onClose={() => setModalType(null)}
        title={
          modalType === 'real' ? 'Registrar Consumo' :
          modalType === 'simulation' ? 'Nova Simulação' :
          modalType === 'goal' ? 'Definir Meta' : ''
        }
      >
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
    marginTop: theme.spacing.minusSM, // assumindo que você tem isso no theme
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    gap: theme.spacing.md,
  }
});