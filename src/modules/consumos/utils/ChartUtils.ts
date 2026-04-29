import { ConsumptionRecord, ChartDataPoint, parseApiDate } from "../schemas/ConsumptionSchema";
import { theme } from "@/config/Theme";

/**
 * Distribui o valor de cada consumo proporcionalmente pelos meses
 * que o período abrange, usando iteração mensal (O(n × meses))
 * em vez de iteração diária (O(n × dias)).
 */
export const formatToMonthlyChartData = (
  records: ConsumptionRecord[],
): ChartDataPoint[] => {
  const monthlyData: Record<
    string,
    ChartDataPoint & { sortKey: string; unitSignature: string }
  > = {};

  records.forEach((record) => {
    const start     = parseApiDate(record.starting_date);
    const end       = parseApiDate(record.ending_date);
    const valueNum  = Number(record.value) || 0;

    // Duração total em dias (inclusiva) para calcular a proporção de cada mês
    const totalMs   = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.max(1, Math.ceil(totalMs / 86_400_000) + 1);

    // Itera MÊS A MÊS — o cursor aponta para o 1º dia de cada mês
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

    while (cursor <= endMonth) {
      const year  = cursor.getFullYear();
      const month = cursor.getMonth();
      const sortKey = `${year}-${String(month + 1).padStart(2, "0")}`;

      // Intervalo real deste mês que está dentro do período do consumo
      const sliceStart = new Date(Math.max(cursor.getTime(), start.getTime()));
      const sliceEnd   = new Date(
        Math.min(new Date(year, month + 1, 0).getTime(), end.getTime()),
      );
      const sliceDays = Math.max(
        1,
        Math.ceil((sliceEnd.getTime() - sliceStart.getTime()) / 86_400_000) + 1,
      );

      // Proporção do valor total para este mês
      const sliceValue = (valueNum / totalDays) * sliceDays;

      if (!monthlyData[sortKey]) {
        const monthLabel = cursor
          .toLocaleString("pt-BR", { month: "short" })
          .replace(".", "");
        monthlyData[sortKey] = {
          sortKey,
          unitSignature: record.si_measurement_unit.toLowerCase(),
          label: `${monthLabel.charAt(0).toUpperCase()}${monthLabel.slice(1)}/${String(year).slice(-2)}`,
          value: 0,
          frontColor: theme.colors.primary.main,
        };
      } else if (
        monthlyData[sortKey].unitSignature !== record.si_measurement_unit.toLowerCase()
      ) {
        // Mês com registros de unidades diferentes → cor neutra
        monthlyData[sortKey].frontColor = theme.colors.primary.light;
      }

      monthlyData[sortKey].value += sliceValue;

      // Avança para o próximo mês
      cursor.setMonth(cursor.getMonth() + 1);
    }
  });

  return Object.values(monthlyData)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ sortKey: _s, unitSignature: _u, ...point }) => ({
      ...point,
      value: Number(point.value.toFixed(2)),
    }));
};