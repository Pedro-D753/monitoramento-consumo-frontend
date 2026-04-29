/**
 * LineChart simulação tendência com gifted-charts.
 * Curved area fill animated.
 * Responsive.
 */

import React from "react";
import { useWindowDimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { ChartDataPoint } from "@/modules/consumos/schemas/ConsumptionSchema";
import { theme } from "@/config/Theme";
import { ChartContainer } from "./ChartContainer";

interface SimulationLineChartProps {
  /** Dados linha */
  data: ChartDataPoint[];
  /** Loading */
  isLoading?: boolean;
}

export function SimulationLineChart({
  data,
  isLoading,
}: SimulationLineChartProps) {
  const { width } = useWindowDimensions();
  const isEmpty = data.length === 0;

  // Remove props incompatíveis com LineChart
  const lineData = data.map(
    ({ frontColor: _fc, dataPointColor: _dc, ...rest }) => rest,
  );

  return (
    <ChartContainer
      title="Simulação e Tendência"
      subtitle="Projeção do seu consumo"
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
      <LineChart
        data={lineData}
        width={width - 80}
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
        xAxisLabelTextStyle={{
          color: theme.colors.text.primary,
          fontSize: 12,
        }}
        isAnimated
        animationDuration={800}
      />
    </ChartContainer>
  );
}
