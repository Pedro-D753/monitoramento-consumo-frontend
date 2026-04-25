import React, { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '@/config/Storage'
import { api } from '@/config/Api'
import { ENDPOINTS } from '@/config/Endpoints'

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
                    // Como o token existe, o interceptor do Api.ts vai injetá-lo nesta chamada!
                    const response = await api.get(ENDPOINTS.auth.userInfo);
                    
                    // Mapeia os dados reais vindos do backend
                    setUser({
                        id: String(response.data.id),
                        email: response.data.email,
                        name: response.data.real_name || response.data.username
                    });
                }
            } catch (error) {
                console.error("Erro ao validar sessão. O token pode estar expirado.", error);
                // Se der erro 401 aqui, o interceptor já vai apagar o token e redirecionar
                await storage.removeToken(); 
                setUser(null);
            } finally {
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