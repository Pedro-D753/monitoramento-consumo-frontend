// src/config/theme.ts

export const theme = {
  colors: {
    // Cores de Fundo (Backgrounds)
    //todas as cores recebem tipagem para string
    //isso existe para permitir que ela seja susbtituida por variaveis futuras
    background: {
      primary: <string>'#394653',
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
      main: <string>'#4F5DED',    // O azul claro dos botões "Entrar"
      light: <string>'#2E9E8C',   // O verde água usado no logo e detalhes
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
      disabled: <string>'#7e7a7a'
    },
    cardButtons: {
      leftUp: <string>'#F2C14E',
      leftDown: <string>'#4F5DED',
      rightUp: <string>'#2E9E8C',
      rightDown: <string>'#6D6D6D',
    },
    // Status possiveis de um elemento
    status: {
      success: <string>'#2ECC71',
      warning: <string>'#F1C40F',
      info: <string>'#3498DB',
    }, // Escala de cinza
    gray: {
      100: <string>'#F5F6F7',
      200: <string>'#E1E4E8',
      300: <string>'#C1C7D0',
      400: <string>'#97A0AF',
      500: <string>'#6B778C',
      600: <string>'#4A5568',
      700: <string>'#2D3748',
      800: <string>'#1A202C',
      900: <string>'#171923',
    },
      // Elementos de UI
      border: <string>'#2C3E50',
      tools: <string>'#585555'
    },
  // Tipografia
  fonts: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    bold: 'Inter_700Bold',
  },
  lineHeights: {
    tight: 1.2,   // Para títulos (xl, xxl)
    normal: 1.5,  // Para corpo de texto (md, sm)
    relaxed: 1.8, // Para textos longos de ajuda
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
    minusSM: -8,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xl: 6,
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999, // Para botões totalmente arredondados
  },
  opacity: {
    low: 0.12,
    medium: 0.4,
    high: 0.7,
    overlay: 0.6,
  },
  shadows: {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
},
} as const; 

// A mágica do TypeScript: Exportamos o TIPO do tema para usar nos componentes
export type Theme = typeof theme;