
import React from 'react';
import { Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { ChartDataPoint } from '@/modules/consumos/schemas/ConsumptionSchema';
import { theme } from '@/config/Theme';
import { ChartContainer } from './ChartContainer';

interface ConsumptionBarChartProps {
  data: ChartDataPoint[];
  isLoading?: boolean;
}

// Pegamos a largura da tela para o gráfico não transbordar e calcular o espaçamento dinâmico
const screenWidth = Dimensions.get('window').width;

export function ConsumptionBarChart({ data, isLoading }: ConsumptionBarChartProps) {
  const isEmpty = data.length === 0;

  return (
    <ChartContainer 
      title="Histórico de Consumo" 
      subtitle="Últimos meses registrados"
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
      <BarChart
        data={data}
        // Dimensionamento
        width={screenWidth - 80} // Desconta o padding das laterais
        height={180}
        barWidth={28}
        spacing={24}
        // Estilização dos Eixos (Clean UI)
        hideRules // Remove linhas de grade horizontais
        xAxisThickness={1} // Linha base visível
        yAxisThickness={0} // Remove linha vertical esquerda
        xAxisColor={theme.colors.border}
        yAxisTextStyle={{ color: theme.colors.text.secondary, fontSize: 12 }}
        xAxisLabelTextStyle={{ color: theme.colors.text.primary, fontSize: 12 }}
        // Personalização visual das barras
        barBorderRadius={4}
        isAnimated // Suavidade ao abrir
        animationDuration={600}
        // Mostra o valor no topo de cada barra
        showValuesAsTopLabel
        topLabelTextStyle={{ color: theme.colors.text.primary, fontSize: 10, marginBottom: 4 }}
      />
    </ChartContainer>
  );
}