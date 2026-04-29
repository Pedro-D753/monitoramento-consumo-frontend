import * as SecureStore from 'expo-secure-store';

const INDEX_KEY = 'liqua_desc_index';
const KEY_PREFIX = 'liqua_desc_';

/** Cache em memória para evitar leituras repetidas no SecureStore */
let memoryCache: Record<number, string> | null = null;

export const descriptionCache = {
  /**
   * Retorna todas as descrições salvas localmente.
   * Usa o cache em memória quando disponível para evitar I/O desnecessário.
   */
  async getAll(): Promise<Record<number, string>> {
    if (memoryCache !== null) return { ...memoryCache };

    const indexRaw = await SecureStore.getItemAsync(INDEX_KEY);
    const ids: number[] = indexRaw ? JSON.parse(indexRaw) : [];

    const entries = await Promise.all(
      ids.map(async (id) => {
        const val = await SecureStore.getItemAsync(`${KEY_PREFIX}${id}`);
        return val ? ([id, val] as const) : null;
      }),
    );

    memoryCache = Object.fromEntries(
      entries.filter((e): e is readonly [number, string] => e !== null),
    );

    return { ...memoryCache };
  },

  /**
   * Salva a descrição de um consumo específico.
   * Atualiza o índice de IDs e o cache em memória.
   */
  async save(id: number, description: string): Promise<void> {
    await SecureStore.setItemAsync(`${KEY_PREFIX}${id}`, description);

    const indexRaw = await SecureStore.getItemAsync(INDEX_KEY);
    const ids: number[] = indexRaw ? JSON.parse(indexRaw) : [];
    if (!ids.includes(id)) {
      ids.push(id);
      await SecureStore.setItemAsync(INDEX_KEY, JSON.stringify(ids));
    }

    if (memoryCache === null) memoryCache = {};
    memoryCache[id] = description;
  },

  /**
   * Invalida o cache em memória.
   * Deve ser chamado no signOut para evitar dados residuais entre sessões.
   */
  invalidate(): void {
    memoryCache = null;
  },
};