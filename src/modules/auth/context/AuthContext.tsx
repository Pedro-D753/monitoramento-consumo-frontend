import React, { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '@/config/Storage'

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (token: string, user: User) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // CORREÇÃO 1: Removido o '>' extra no final
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            try {
                const token = await storage.getToken();

                if (token) {
                    // CORREÇÃO 2: Respeitando a interface 'User'. 
                    // TODO: Substituir no futuro por uma chamada à API (ex: api.get('/me')) 
                    // ou decodificação do JWT para pegar os dados reais.
                    setUser({
                        id: 'mock-id-temporario',
                        email: 'usuario@liqua.com',
                        name: 'Usuário'
                    });
                }
            } catch (error) {
                console.error("Erro ao carregar dados do storage", error);
            } finally {
                // Garantimos que o loading termine mesmo se der erro no SecureStore
                setIsLoading(false); 
            }
        }
        loadStorageData();
    }, []);

    const signIn = async (token: string, userData: User) => {
        await storage.saveToken(token);
        setUser(userData);
    };

    const signOut = async () => {
        await storage.removeToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            signIn,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if(!context) throw new Error('useAuth precisa estar com um AuthProvider')
    return context
}