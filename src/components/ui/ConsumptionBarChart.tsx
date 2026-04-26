
import React from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { ChartDataPoint } from '@/modules/consumos/schemas/ConsumptionSchema';
import { theme } from '@/config/Theme';
import { ChartContainer } from './ChartContainer';

interface ConsumptionBarChartProps {
  data: ChartDataPoint[];
  isLoading?: boolean;
}

const screenWidth = Dimensions.get('window').width;

export function ConsumptionBarChart({ data, isLoading }: ConsumptionBarChartProps) {
  const { width } = useWindowDimensions();
  const isEmpty = data.length === 0;

  const chartWidth = width - 130

  return (
    <ChartContainer 
      title="Histórico de Consumo" 
      subtitle="Últimos meses registrados"
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
<BarChart
        data={data}
        width={chartWidth}
        height={180}
        barWidth={28}
        spacing={24}
        hideRules
        xAxisThickness={1}
        yAxisThickness={0}
        yAxisLabelWidth={20} // <-- ESSENCIAL: Impede que os números na esquerda empurrem o gráfico pra fora
        xAxisColor={theme.colors.border}
        yAxisTextStyle={{ color: theme.colors.text.secondary, fontSize: 12 }}
        xAxisLabelTextStyle={{ color: theme.colors.text.primary, fontSize: 12 }}
        barBorderRadius={4}
        isAnimated
        animationDuration={600}
        topLabelTextStyle={{ color: theme.colors.text.primary, fontSize: 10, marginBottom: 4 }}
      />
    </ChartContainer>
  );
}
