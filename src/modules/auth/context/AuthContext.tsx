/**
 * Context de autenticação global.
 * Gerencia estado de user, login/logout, storage de tokens.
 * Lazy loading na inicialização.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { storage } from "@/config/Storage";
import { getUserInfo, logoutUser, UserProfile } from "../services/AuthService";

interface AuthContextData {
  /** Perfil do usuário logado */
  user: UserProfile | null;
  /** Flag de autenticação ativa */
  isAuthenticated: boolean;
  /** Loading inicial/auth */
  isLoading: boolean;
  /** Login com tokens */
  signIn: (accessToken: string, refreshToken: string) => Promise<void>;
  /** Logout (local ou server) */
  signOut: (localOnly?: boolean) => Promise<void>;
  /** Refresh perfil user */
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

/**
 * Provider principal de auth.
 * Carrega sessão do storage na init.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const profile = await getUserInfo();
    setUser(profile);
  }, []);

  useEffect(() => {
    /** Carrega tokens do storage e valida user na inicialização */
    async function loadStorageData() {
      try {
        const token = await storage.getAccessToken();
        if (token) await refreshUser();
      } catch (error) {
        console.error("Erro ao validar sessão na inicialização.", error);
        await storage.removeTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadStorageData();
  }, [refreshUser]);

  const signIn = async (
    accessToken: string,
    refreshToken: string,
  ): Promise<void> => {
    await storage.saveTokens(accessToken, refreshToken);
    try {
      await refreshUser();
    } catch (error) {
      console.error("Falha ao carregar o perfil após o login.", error);
      await storage.removeTokens();
      throw new Error("Sessão criada, mas falha ao carregar perfil.");
    }
  };

  const signOut = async (localOnly: boolean = false): Promise<void> => {
    try {
      if (!localOnly) {
        const refreshToken = await storage.getRefreshToken();
        if (refreshToken) await logoutUser(refreshToken);
      }
    } catch (error) {
      console.warn("Falha ao invalidar a sessão no servidor.", error);
    } finally {
      await storage.removeTokens();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para consumir auth context.
 * Throw error se usado fora do Provider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de AuthProvider.");
  }
  return context;
}
