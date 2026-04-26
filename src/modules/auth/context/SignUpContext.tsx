import { createContext, useState, useContext, ReactNode } from "react";

export interface SignUpType {
  real_name?: string;
  username?: string;
  email?: string;
  password?: string;
}

interface SignUpContextData {
  data: SignUpType;
  updateData: (newData: Partial<SignUpType>) => void;
  clearData: () => void;
}

interface SignUpProviderProps {
  children: ReactNode;
}

const SignUpContext = createContext<SignUpContextData | undefined>(undefined);

export function SignUpProvider({ children }: SignUpProviderProps) {
  const [data, setData] = useState<SignUpType>({});

  const updateData = (newData: Partial<SignUpType>) => {
    setData((prevData) => ({ ...prevData, ...newData }));
  };

  const clearData = () => {
    setData({});
  };

  return (
    <SignUpContext.Provider value={{ data, updateData, clearData }}>
      {children}
    </SignUpContext.Provider>
  );
}

export const useSignUp = (): SignUpContextData => {
  const context = useContext(SignUpContext);

  if (!context) {
    throw new Error("useSignUp precisa ser usado com o SignUpProvider");
  }

  return context;
};
