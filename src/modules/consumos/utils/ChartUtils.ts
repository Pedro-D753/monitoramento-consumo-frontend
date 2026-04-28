import { ConsumptionRecord, ChartDataPoint, parseApiDate } from "../schemas/ConsumptionSchema";
import { theme } from "@/config/Theme";


export const formatToMonthlyChartData = (records: ConsumptionRecord[]): ChartDataPoint[] => {
  const monthlyData: Record<string, ChartDataPoint & { sortKey: string; unitSignature: string }> = {};

  records.forEach((record) => {
    // 1. Extração das datas
    const start = parseApiDate(record.starting_date);
    const end = parseApiDate(record.ending_date);
    
    // 2. Cálculo de dias (inclusivo) e do ritmo diário (Daily Rate)
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
    
    const valueNum = Number(record.value) || 0;
    const dailyValue = valueNum / totalDays;

    // 3. Distribuição temporal dia a dia
    for (let i = 0; i < totalDays; i++) {
      const currentDay = new Date(start.getTime() + i * (1000 * 60 * 60 * 24));
      const sortKey = `${currentDay.getFullYear()}-${String(currentDay.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[sortKey]) {
        const monthLabel = currentDay.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
        const label = `${monthLabel.charAt(0).toUpperCase()}${monthLabel.slice(1)}/${String(currentDay.getFullYear()).slice(-2)}`;
        
        monthlyData[sortKey] = {
          sortKey,
          unitSignature: record.si_measurement_unit.toLowerCase(),
          label,
          value: 0,
          frontColor: theme.colors.primary.main, // Adapte para a sua função de cor (ex: getUnitColor)
        };
      } else if (monthlyData[sortKey].unitSignature !== record.si_measurement_unit.toLowerCase()) {
        monthlyData[sortKey].frontColor = theme.colors.primary.light; // Mistura de tipos no mesmo mês
      }

      // Adiciona a fatia do dia ao mês correspondente
      monthlyData[sortKey].value += dailyValue;
    }
  });

  // Retorna os dados ordenados cronologicamente e formatados
  return Object.values(monthlyData)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ sortKey: _s, unitSignature: _u, ...point }) => ({
       ...point,
       // Arredonda a soma final para 2 casas decimais, evitando dizimas periódicas
       value: Number(point.value.toFixed(2)) 
    }));
};