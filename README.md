# Documentacao Tecnica do Frontend do Liqua

Esta documentacao descreve a organizacao do frontend do Liqua, os requisitos para execucao local e as convencoes adotadas no repositorio. O objetivo e permitir que qualquer integrante da equipe configure o ambiente, localize os principais pontos de extensao do projeto e contribua com previsibilidade.

## 1. Visao Geral do Projeto
- O Liqua e um aplicativo mobile desenvolvido com React Native e Expo para acompanhamento de consumo domestico.
- O repositorio, no estado atual, concentra a base do fluxo de autenticacao: tela de login, primeira etapa do cadastro, validacao de formularios e integracao inicial com a API.
- A estrutura para rotas autenticadas e cadastro em etapas ja existe, mas parte desses arquivos ainda esta em implementacao e nao representa fluxos concluidos.

## 2. Tecnologias Utilizadas
- Expo (SDK 55)
- React Native 0.83.6
- React 19.2
- Expo Router
- TypeScript com `strict: true`
- React Hook Form
- Zod
- Axios
- `react-native-safe-area-context`

## 3. Estrutura do Projeto

```text
.
├── app
│   ├── (app)
│   │   ├── history.tsx
│   │   ├── index.tsx
│   │   ├── profile.tsx
│   │   └── _layout.tsx
│   ├── (auth)
│   │   ├── sign-in.tsx
│   │   ├── sign-up
│   │   │   ├── step-1.tsx
│   │   │   ├── step-2.tsx
│   │   │   └── step-3.tsx
│   │   └── _layout.tsx
│   └── _layout.tsx
├── src
│   ├── assets
│   ├── components
│   │   ├── layout
│   │   └── ui
│   ├── config
│   └── modules
│       └── auth
│           ├── context
│           ├── schemas
│           └── services
├── .env.example
├── app.json
├── package.json
└── tsconfig.json
```

- `app/` concentra as rotas do Expo Router.
- `src/components/` contem componentes reutilizaveis de layout e interface.
- `src/config/` centraliza configuracoes compartilhadas, como tema e cliente HTTP.
- `src/modules/auth/` concentra o contexto, os esquemas de validacao e os servicos relacionados a autenticacao.
- Os arquivos `app/_layout.tsx`, `app/(app)/_layout.tsx`, `app/(app)/history.tsx`, `app/(app)/profile.tsx`, `app/(auth)/sign-up/step-2.tsx` e `app/(auth)/sign-up/step-3.tsx` ainda estao em estagio inicial e nao devem ser tratados como fluxos finalizados.

## 4. Pre-requisitos
- Node.js 18+ ou 20 LTS
- NPM
- Git
- Expo Go em dispositivo fisico ou emulador Android
- macOS com Xcode para uso do simulador iOS

## 5. Instalacao e Configuracao

**Passo 1: Clonar o repositorio**

```bash
git clone <url-do-repositorio>
cd <nome-da-pasta-do-projeto>
```

**Passo 2: Instalar as dependencias**

```bash
npm install
```

**Passo 3: Configurar variaveis de ambiente**

Crie um arquivo `.env` na raiz do projeto com base em `.env.example`:

```env
EXPO_PUBLIC_API_URL=http://seu-ip-local:porta
```

Se a aplicacao for executada em dispositivo fisico, utilize o IP da maquina na rede local. O valor `localhost` nao funcionara nesse cenario.

## 6. Execucao do Projeto

Para iniciar o servidor de desenvolvimento:

```bash
npm run start
```

Comandos adicionais disponiveis no projeto:

```bash
npm run android
npm run web
npm run ios
```

O comando `npm run ios` depende de macOS com Xcode.

No estado atual, a rota inicial redireciona para `/(auth)/sign-in`.

Se o bundle permanecer desatualizado apos alteracoes em rotas ou arquivos de configuracao, execute:

```bash
npx expo start -c
```

## 7. Padroes de Codigo e Boas Praticas
- Mantenha a definicao de telas e navegacao em `app/`.
- Mantenha regras de negocio, esquemas de validacao e servicos em `src/modules/`.
- Utilize o alias `@/` para imports internos, conforme definido em `tsconfig.json`.
- Centralize cores, espacos e tokens visuais em `src/config/Theme.ts`.
- Mantenha formularios sob `react-hook-form` e Zod, evitando duplicacao de validacao na camada de interface.

## 8. Guia de Componentes e Interface
- `src/components/layout/AuthLayout.tsx` padroniza as telas de autenticacao com fundo visual, area segura e tratamento de teclado.
- `src/components/ui/Button.tsx` oferece as variantes `primary`, `danger` e `outline`.
- `src/components/ui/Input.tsx` oferece label flutuante, exibicao de erro e alternancia de visibilidade para senha.
- Os recursos visuais do projeto ficam em `src/assets/`.
- As telas de autenticacao utilizam limites de largura para manter consistencia entre dispositivo movel e execucao na Web.

## 9. Gerenciamento de Estado
- O estado local dos formularios e controlado por `react-hook-form`.
- O estado compartilhado do cadastro em etapas e mantido por `src/modules/auth/context/SignUpContext.tsx`.
- O repositorio nao possui, neste momento, uma camada global de sessao persistida.

## 10. Integracao com APIs
- O cliente HTTP fica em `src/config/api.ts`.
- A URL base da API e lida a partir de `EXPO_PUBLIC_API_URL`.
- O cliente esta configurado para trafego JSON e `timeout` de 15000 ms.
- As chamadas de autenticacao ficam em `src/modules/auth/services/authService.ts`.
- O tratamento tipado de falhas deve priorizar `axios.isAxiosError`.
- O armazenamento persistente de tokens e a protecao efetiva das rotas ainda nao estao concluidos no repositorio atual.

## 11. Boas Praticas de Colaboracao (Co-work)
- Utilize commits semanticos, como `feat:`, `fix:`, `refactor:` e `docs:`.
- Mantenha pull requests focados em uma unica mudanca funcional ou estrutural.
- Atualize a documentacao sempre que houver alteracao em rotas, variaveis de ambiente ou organizacao de modulos.
- O `package.json` nao possui, neste momento, scripts de lint ou testes automatizados; valide as alteracoes executando a aplicacao e percorrendo o fluxo afetado.

## 12. Problemas Comuns e Solucoes (Troubleshooting)

1. **A aplicacao nao alcanca a API**
   Verifique se `EXPO_PUBLIC_API_URL` esta definido corretamente no arquivo `.env`. Em dispositivo fisico, utilize o IP da maquina na rede local.

2. **As alteracoes nao aparecem na tela**
   Reinicie o servidor com `npx expo start -c` para limpar o cache do Metro Bundler.

3. **`npm run ios` nao funciona no ambiente atual**
   O simulador iOS depende de macOS com Xcode. Em Windows ou Linux, utilize `npm run android`, `npm run web` ou um dispositivo fisico com Expo Go.

4. **Erro de resolucao de import apos renomear arquivos**
   Mantenha o uso consistente de maiusculas e minusculas nos nomes de arquivos e imports, especialmente em ambientes ou pipelines com sensibilidade a caixa.

## 13. Materiais de Estudo e Apoio
- [Expo](https://expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Axios](https://axios-http.com/)

---

Documentacao mantida pela equipe de frontend. Ultima atualizacao: abril de 2026.
