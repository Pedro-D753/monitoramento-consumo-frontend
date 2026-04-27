import { theme } from '@/config/Theme';
import { ConsumptionRecord, ChartDataPoint, parseApiDate } from '../schemas/ConsumptionSchema';

export const getUnitColor = (unit: string): string => {
  const u = unit.toLowerCase();
  if (u.includes('r$'))                           return theme.colors.status.success;
  if (u.includes('kwh') || u.includes('wh'))      return theme.colors.status.warning;
  if (u === 'l' || u.includes('litro'))           return theme.colors.status.info;
  if (u.includes('m³') || u.includes('m3'))       return theme.colors.primary.light;
  return theme.colors.primary.main;
};

export const formatToMonthlyChartData = (records: ConsumptionRecord[]): ChartDataPoint[] => {
  const monthlyData: Record<string, ChartDataPoint & { sortKey: string; unitSignature: string }> = {};

  records
    .slice()
    .sort((a, b) => parseApiDate(a.ending_date).getTime() - parseApiDate(b.ending_date).getTime())
    .forEach((record) => {
      const date      = parseApiDate(record.ending_date);
      const sortKey   = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
      const label     = `${monthLabel.charAt(0).toUpperCase()}${monthLabel.slice(1)}/${String(date.getFullYear()).slice(-2)}`;

      if (!monthlyData[sortKey]) {
        monthlyData[sortKey] = {
          sortKey,
          unitSignature: record.si_measurement_unit.toLowerCase(),
          label,
          value: 0,
          frontColor: getUnitColor(record.si_measurement_unit),
        };
      } else if (monthlyData[sortKey].unitSignature !== record.si_measurement_unit.toLowerCase()) {
        monthlyData[sortKey].frontColor = theme.colors.primary.main;
      }

      monthlyData[sortKey].value += record.value;
    });

  return Object.values(monthlyData)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ sortKey: _s, unitSignature: _u, ...point }) => point);
};