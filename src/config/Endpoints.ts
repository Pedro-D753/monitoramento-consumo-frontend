export const ENDPOINTS = {
    auth: {
        login:          '/api/usuarios/login_usuario', // OAuth2 form
        register:       '/api/usuarios/criar_usuario',
        refreshToken:   '/api/usuarios/regerar_token',       // query param
        userInfo:       '/api/usuarios/info_usuario_logado',
        editUser:       '/api/usuarios/editar_usuario',
        deleteUser:     '/api/usuarios/deletar_usuario',
        forgotPassword: '/api/usuarios/esqueci_a_senha',     // query param
        resetPassword:  '/api/usuarios/recuperar_senha',     // query params
    },
    consumos: {
        criar:   '/api/consumos/criar_consumo',
        listar:  '/api/consumos/listar_consumos',
        editar:  (id: number) => `/api/consumos/editar_consumo/${id}`,
        deletar: (id: number) => `/api/consumos/deletar_consumo/${id}`,
    },
    simulacoes: {
        criar:   '/api/simulacoes/criar_simulacao',
        listar:  '/api/simulacoes/listar_simulacoes',
        editar:  (id: number) => `/api/simulacoes/editar_simulacao/${id}`,
        deletar: (id: number) => `/api/simulacoes/deletar_simulacao/${id}`,
    },
    metas: {
        criar:   '/api/metas/criar_meta',
        listar:  '/api/metas/listar_metas',
        editar:  (id: number) => `/api/metas/editar_meta/${id}`,
        deletar: (id: number) => `/api/metas/deletar_meta/${id}`,
    },
    dicas: {
        aleatoria: (unit: string) => `/api/dicas/pegar_dica_aleatoria/${unit}`,
    },
} as const;