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

  return (
    <ChartContainer
      title="Simulação e Tendência"
      subtitle="Projeção do seu consumo"
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
      <LineChart
        data={data}
        width={width - 140}
        height={180}
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