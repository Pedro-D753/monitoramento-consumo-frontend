import React from 'react';
import { useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { ChartDataPoint } from '@/modules/consumos/schemas/ConsumptionSchema';
import { theme } from '@/config/Theme';
import { ChartContainer } from './ChartContainer';

interface SimulationLineChartProps {
  data: ChartDataPoint[];
  isLoading?: boolean;
}

export function SimulationLineChart({ data, isLoading }: SimulationLineChartProps) {
  const { width } = useWindowDimensions();
  const isEmpty = data.length === 0;

  // 1. Largura calculada idêntica à do BarChart
  const chartWidth = width - 130;

  // Remove propriedades incompatíveis com o LineChart
  const lineData = data.map(({ frontColor: _fc, dataPointColor: _dc, ...rest }) => rest);

  // 2. Força um espaçamento mínimo de 60px para ativar o scroll nativo da biblioteca
  const pointsCount = lineData.length;
  const dynamicSpacing = pointsCount > 1 
    ? Math.max(60, (chartWidth - 40) / (pointsCount - 1))
    : 60;

  return (
    <ChartContainer
      title="Simulação e Tendência"
      subtitle="Projeção do seu consumo"
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
      <LineChart
        data={lineData}
        width={chartWidth}
        height={180}
        
        yAxisLabelWidth={20} 
        initialSpacing={20}
        endSpacing={20}
        
        curved
        curvature={0.2}
        color={theme.colors.primary.light}
        dataPointsColor={theme.colors.primary.main}
        dataPointsRadius={4}
        thickness={3}
        startFillColor={theme.colors.primary.light}
        endFillColor={theme.colors.primary.light}
        startOpacity={0.3}
        endOpacity={0.05}
        areaChart
        hideRules
        xAxisThickness={1}
        yAxisThickness={0}
        xAxisColor={theme.colors.border}
        yAxisTextStyle={{ color: theme.colors.text.secondary, fontSize: 12 }}
        xAxisLabelTextStyle={{ color: theme.colors.text.primary, fontSize: 12 }}
        isAnimated
        animationDuration={800}
      />
    </ChartContainer>
  );
}