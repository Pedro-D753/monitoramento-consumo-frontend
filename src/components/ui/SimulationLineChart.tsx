
import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { ChartDataPoint } from '@/modules/consumos/schemas/ConsumptionSchema';
import { theme } from '@/config/Theme';
import { ChartContainer } from './ChartContainer';

interface SimulationLineChartProps {
  data: ChartDataPoint[];
  isLoading?: boolean;
}

const screenWidth = Dimensions.get('window').width;

export function SimulationLineChart({ data, isLoading }: SimulationLineChartProps) {
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
        width={screenWidth - 80}
        height={180}
        // Suavização da linha
        curved
        curvature={0.2}
        // Cores da linha e dos pontos
        color={theme.colors.primary.light} // Verde água do Liqua
        dataPointsColor={theme.colors.primary.main}
        dataPointsRadius={4}
        thickness={3}
        // Efeito de fundo preenchido (gradiente visual)
        startFillColor={theme.colors.primary.light}
        endFillColor={theme.colors.primary.light}
        startOpacity={0.3}
        endOpacity={0.05}
        areaChart
        // Limpeza dos eixos
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