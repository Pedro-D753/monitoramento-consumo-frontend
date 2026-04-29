***

```markdown

  # Liqua - Monitoramento de Consumo

  O **Liqua** é um aplicativo móvel avançado para monitoramento, controle financeiro e simulação de gastos utilitários (Água, Energia, Gás). Desenvolvido com foco em performance e *Mobile-First*.

  ![React Native]
  ![Expo]
  ![TypeScript]

## 📖 Visão Geral

O Liqua tem como objetivo fornecer aos usuários e corporações uma visão clara e preditiva de seus gastos essenciais. Através de uma arquitetura modular moderna e foco rigoroso em UI/UX, o aplicativo permite o acompanhamento histórico em gráficos fluidos, criação de metas limitantes e simulação de cenários futuros.

<div align="center">
  <img src="https://via.placeholder.com/250x500.png?text=Tela+Home" width="200" /> &nbsp;&nbsp;&nbsp;
  <img src="https://via.placeholder.com/250x500.png?text=Tela+Simulacao" width="200" /> &nbsp;&nbsp;&nbsp;
  <img src="https://via.placeholder.com/250x500.png?text=Tela+Metas" width="200" />
</div>

---

## ✨ Principais Funcionalidades

- **🔒 Autenticação Robusta:** Gestão de sessão JWT segura, com renovação de tokens (*Refresh Token*) imune a *Race Conditions* graças a interceptadores assíncronos no Axios.
- **📊 Dashboards e Gráficos:** Visualização analítica construída sob o `react-native-gifted-charts`, otimizada para 60 FPS.
- **🎯 Metas de Consumo:** Definição de tetos de gastos com cálculo algorítmico preciso de porcentagem atingida.
- **🔮 Cenários e Simulações:** Projeção de ritmos de consumo diários e previsão de faturas no fim do mês.
- **⚡ Cache Híbrido:** Algoritmo *Memory Cache* (RAM) atuando em conjunto com o `Expo SecureStore` para carregamento instantâneo de listas e metadados customizados sem estrangular I/O do dispositivo.

---

## 🛠️ Stack Tecnológica

O projeto foi inteiramente construído sobre ecossistemas modernos e escaláveis:

| Tecnologia | Finalidade |
| :--- | :--- |
| **[Expo / React Native](https://expo.dev/)** | Framework Mobile e compilação nativa. |
| **[Expo Router](https://docs.expo.dev/router/introduction/)** | Roteamento nativo baseado em sistema de arquivos (*file-based routing*). |
| **[TypeScript](https://www.typescriptlang.org/)** | Tipagem estática e detecção precoce de erros no ambiente de desenvolvimento. |
| **[Zod](https://zod.dev/)** | Validação estrutural de *schemas* e blindagem de *payloads*. |
| **[React Hook Form](https://react-hook-form.com/)** | Formulários performáticos com arquitetura não-controlada (previne *re-renders* excessivos). |
| **[Axios](https://axios-http.com/)** | Cliente HTTP com interceptadores globais de requisição e resposta. |

---

## 🏗️ Arquitetura de Diretórios

A arquitetura de software adota os princípios do **Feature-Sliced Design (FSD)**, isolando responsabilidades de domínio da camada de UI genérica.

```text
├── app/                  # Rotas gerenciadas pelo Expo Router /(app) e /(auth)
├── src/
│   ├── assets/           # Imagens, vetores e ícones (e.g., logos, backgrounds)
│   ├── components/       
│   │   ├── layout/       # Componentes estruturais (Header, PageLayout)
│   │   └── ui/           # Design System Base (Botões, Cards, Tipografia, Modais)
│   ├── config/           # Configurações globais (Api.ts, Theme.ts, DescriptionCache.ts)
│   └── modules/          # Núcleo da Lógica de Negócio separado por Domínio
│       ├── auth/         # Funcionalidades de login, cadastro, troca de senha
│       ├── consumos/     # Lógica de histórico, simulações, metas e gráficos
│       └── tips/         # Módulo de dicas e recomendações
├── app.json              # Manifesto do Expo
└── package.json          # Dependências e scripts de automação
```

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar o aplicativo em seu ambiente local.

### 1. Pré-requisitos
Certifique-se de ter as ferramentas instaladas:
* [Node.js](https://nodejs.org/) (versão LTS recomendada, 18+).
* [Git](https://git-scm.com/).
* Aplicativo **Expo Go** instalado no seu smartphone ou um emulador (Android Studio/Xcode) configurado.

### 2. Instalação

Clone o repositório e instale as dependências:

```bash
# Clone o repositório
git clone [https://github.com/pedro-d753/monitoramento-consumo-frontend.git](https://github.com/pedro-d753/monitoramento-consumo-frontend.git)

# Acesse o diretório do frontend
cd monitoramento-consumo-frontend/monitoramento-consumo-frontend-FED

# Instale as dependências (recomendado usar npm que está no package-lock)
npm install
```

### 3. Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto, baseado no arquivo de exemplo incluído no repositório:

```bash
cp .env.example .env
```
Preencha a URL da API no arquivo `.env`:
```env
EXPO_PUBLIC_API_URL=http://seu-ip-local:porta
```

### 4. Executando o Servidor

Inicie o Metro Bundler do Expo:

```bash
npx expo start
```
Após executar este comando, um QR Code será gerado no terminal. Escaneie-o com o aplicativo **Expo Go** no seu celular, ou pressione `a` para abrir no Android e `i` para abrir no iOS.

---

## 📜 Scripts Úteis

O `package.json` inclui comandos prontos para facilitar o dia a dia:

| Comando | Descrição |
| :--- | :--- |
| `npm start` | Inicia o Metro Bundler com o Expo. |
| `npm run android` | Inicia a aplicação diretamente no emulador Android. |
| `npm run ios` | Inicia a aplicação diretamente no simulador iOS (Apenas Mac). |
| `npm run lint` | Roda o ESLint para encontrar e corrigir erros de padronização no código. |

---

## 👨‍💻 Autoria e Manutenção

Projeto desenvolvido em 2026.

* **Engenheiro Front-end:** Paulo Demeris Cavalcante Diniz Melo.
* **Repositório:** `pedro-d753/monitoramento-consumo-frontend`

---
