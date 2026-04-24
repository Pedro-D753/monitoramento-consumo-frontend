// src/config/theme.ts

export const theme = {
  colors: {
    // Cores de Fundo (Backgrounds)
    //todas as cores recebem tipagem para string
    //isso existe para permitir que ela seja susbtituida por variaveis futuras
    background: {
      primary: <string>'#696969',
      secondary: <string>'#ffffff',  // O azul muito escuro do fundo das telas
      paper: <string>'#1A1F26',   // O fundo dos modais/cards mais claros
      input: <string>'#eee9e9',   // O fundo dos inputs e áreas de texto
    },
    // Cores de Cards e Pop-ups
    card: {
      primary: <string>'#1A1F26',
      subCard: <string>'rgba(4, 17, 42, 0.65)', // O fundo dos modais
      infoCard: <string>'rgba(0, 0, 0, 0.6)', // O fundo dos modais de informações
    },
    // Cores de Marca/Ação
    primary: {
      main: <string>'#4D59DE',    // O azul claro dos botões "Entrar"
      light: <string>'#28A18D',   // O verde água usado no logo e detalhes
    },
    // Cores de Feedback (Erros, Sucesso)
    danger: {
      main: <string>'#B42525',    // O vermelho do botão "Sair" e "Excluir"
    },
    // Tipografia (Textos)
    text: {
      primary: <string>'#FFFFFF', // Textos principais (Títulos, labels)
      secondary: <string>'#61ABD9', // Textos secundários ou placeholders
      neutral: <string>'#050505', // Textos neutros ou de baixo contraste
    },
    // Elementos de UI
    border: <string>'#2C3E50',
  },
  // Tipografia
  fonts: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    bold: 'Inter_700Bold',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16, // Tamanho padrão para leitura
    lg: 20,
    xl: 24, // Para os títulos principais
    xxl: 32,
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