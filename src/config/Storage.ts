import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'liqua_access_token';
const REFRESH_TOKEN_KEY = 'liqua_refresh_token';
const DESCRIPTIONS_CACHE_KEY = 'liqua_desc_cache'; //temporario

export const storage = {
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },
  
  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },
  
  async removeTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },
  
  // ✅ NOVAS FUNÇÕES DE CACHE LOCAL (TODO: Remover quando DB suportar)
  async saveDescription(id: number, description: string): Promise<void> {
    const existing = await this.getDescriptions();
    existing[id] = description;
    await SecureStore.setItemAsync(DESCRIPTIONS_CACHE_KEY, JSON.stringify(existing));
  },

  async getDescriptions(): Promise<Record<number, string>> {
    const data = await SecureStore.getItemAsync(DESCRIPTIONS_CACHE_KEY);
    return data ? JSON.parse(data) : {};
  }
};
