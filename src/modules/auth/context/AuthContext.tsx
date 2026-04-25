import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '@/config/Storage';
import { getUserInfo, UserProfile } from '../services/AuthService';

interface AuthContextData {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    // Agora o signIn recebe os dois tokens e nós mesmos buscamos o UserProfile
    signIn: (accessToken: string, refreshToken: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            try {
                // ATUALIZAÇÃO: Buscando especificamente o Access Token
                const token = await storage.getAccessToken();

                if (token) {
                    // Chamando o serviço centralizado em vez do axios direto aqui
                    const profile = await getUserInfo();
                    setUser(profile);
                }
            } catch (error) {
                console.error("Erro ao validar sessão na inicialização.", error);
                await storage.removeTokens(); 
                setUser(null);
            } finally {
                setIsLoading(false); 
            }
        }
        loadStorageData();
    }, []);

    const signIn = async (accessToken: string, refreshToken: string) => {
        // 1. Salva AMBOS os tokens via SecureStore
        await storage.saveTokens(accessToken, refreshToken);
        
        try {
            // 2. Busca na API quem é o dono desse token recém-salvo
            const profile = await getUserInfo();
            setUser(profile);
        } catch (error) {
            console.error("Falha ao puxar info do usuário logo após login.", error);
            await storage.removeTokens();
            throw new Error("Sessão criada, mas falha ao carregar perfil.");
        }
    };

    const signOut = async () => {
        // ATUALIZAÇÃO: removeTokens plural, para limpar Access e Refresh
        await storage.removeTokens();
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
    if(!context) throw new Error('useAuth precisa estar com um AuthProvider');
    return context;
}