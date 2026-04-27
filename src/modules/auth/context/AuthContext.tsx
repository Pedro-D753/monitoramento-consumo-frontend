import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { storage } from "@/config/Storage";
import {
  getUserInfo,
  logoutUser,
  UserProfile,
} from "../services/AuthService";
import { boolean } from "zod";

interface AuthContextData {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (accessToken: string, refreshToken: string) => Promise<void>;
  signOut: (localOnly?: boolean) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

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
    async function loadStorageData() {
      try {
        const token = await storage.getAccessToken();

        if (token) {
          await refreshUser();
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
  }, [refreshUser]);

  const signIn = async (accessToken: string, refreshToken: string) => {
    await storage.saveTokens(accessToken, refreshToken);

    try {
      await refreshUser();
    } catch (error) {
      console.error("Falha ao carregar o perfil após o login.", error);
      await storage.removeTokens();
      throw new Error("Sessão criada, mas falha ao carregar perfil.");
    }
  };

  const signOut = async (localOnly: boolean = false) => {
    try {
      // Só tenta bater na API se NÃO for um logout estritamente local
      if (!localOnly) {
        const refreshToken = await storage.getRefreshToken();
        if (refreshToken) {
          await logoutUser(refreshToken);
        }
      }
    } catch (error) {
      console.warn("Falha ao invalidar a sessão no servidor.", error);
    } finally {
      // Limpa os tokens do dispositivo silenciosamente
      await storage.removeTokens();
      setUser(null);
    }
  };;

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

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de AuthProvider.");
  }

  return context;
}
