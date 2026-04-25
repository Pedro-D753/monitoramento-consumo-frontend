import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'liqua_access_token'

export const storage = {
    async saveToken(token: string): Promise<void>{
        await SecureStore.setItemAsync(TOKEN_KEY, token)
    },
    async getToken(): Promise<string | null> {
        return await SecureStore.getItemAsync(TOKEN_KEY);
    },
    async removeToken(): Promise<void> {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    },
}