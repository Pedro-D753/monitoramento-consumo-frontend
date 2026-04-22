// src/config/theme.ts

export const theme = {
  colors: {
    // Cores de Fundo (Backgrounds)
    background: {
      primary: '#696969', // O azul muito escuro do fundo das telas
      paper: '#1A1F26',   // O fundo dos modais/cards mais claros
    },
    // Cores de Marca/Ação
    primary: {
      main: '#4D59DE',    // O azul claro dos botões "Entrar"
      light: '#28A18D',   // O verde água usado no logo e detalhes
    },
    // Cores de Feedback (Erros, Sucesso)
    danger: {
      main: '#B42525',    // O vermelho do botão "Sair" e "Excluir"
    },
    // Tipografia (Textos)
    text: {
      primary: '#FFFFFF', // Textos principais (Títulos, labels)
      secondary: '#61ABD9', // Textos secundários ou placeholders
    },
    // Elementos de UI
    border: '#2C3E50',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999, // Para botões totalmente arredondados
  }
} as const; 

// A mágica do TypeScript: Exportamos o TIPO do tema para usar nos componentes
export type Theme = typeof theme;