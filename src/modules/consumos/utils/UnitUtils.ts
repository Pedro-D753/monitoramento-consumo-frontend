/**
 * Centraliza a tradução de símbolos de unidade para labels legíveis em PT-BR.
 * Utilizado por todos os componentes que exibem dados de consumo ao usuário.
 */
const UNIT_LABEL_MAP: Record<string, string> = {
  l:       'Água',
  litro:   'Água',
  litros:  'Água',
  kwh:     'Energia',
  wh:      'Energia',
  'm³':    'Gás',
  m3:      'Gás',
  'r$':    'Financeiro',
  brl:     'Financeiro',
};

export function getUnitLabel(unit: string): string {
  return UNIT_LABEL_MAP[unit.trim().toLowerCase()] ?? unit;
}

export function formatUnitSymbol(unit: string): string {
  const lower = unit.toLowerCase().trim();
  if (lower === 'kwh') return 'kWh';
  if (lower === 'l')   return 'L';
  if (lower === 'r$')  return 'R$';
  if (lower === 'm³' || lower === 'm3') return 'm³';
  return unit;
}