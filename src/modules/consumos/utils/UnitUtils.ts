/**
 * Mapa de tradução de símbolos de unidade SI para labels legíveis em PT-BR.
 * Centraliza todas as conversões de unidade do aplicativo.
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

/** Converte símbolo técnico para label legível. Ex: "L" → "Água" */
export function getUnitLabel(unit: string): string {
  return UNIT_LABEL_MAP[unit.trim().toLowerCase()] ?? unit;
}

/** Normaliza capitalização do símbolo. Ex: "kwh" → "kWh", "l" → "L" */
export function formatUnitSymbol(unit: string): string {
  const lower = unit.toLowerCase().trim();
  if (lower === 'kwh')                    return 'kWh';
  if (lower === 'l')                      return 'L';
  if (lower === 'r$')                     return 'R$';
  if (lower === 'm³' || lower === 'm3')   return 'm³';
  return unit;
}