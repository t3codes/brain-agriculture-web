# 🧩 Pull Request: Atualizações no banco de dados, Autenticação e Estrutura do WEBSITE

## 📋 Descrição

Este PR contempla uma série de melhorias e implementações fundamentais para a estrutura e segurança da aplicação, incluindo:

- ✅ Configuração de estado da aplicação inicialmente usando o ngrx, descontinuei o uso explicação em OBS abaixo
- ✅ criação de consultas a dashboard e pagina de dashboard

# Observação
Porque resolvi nao usar o NGXR:
- Antes: Você estava usando NgRx para gerenciar o estado do Dashboard, com Store e Effects.
- Agora: Substituímos o NgRx por um serviço reativo (DashboardService) que gerencia o estado do dashboard diretamente, usando BehaviorSubject.
- No app.config.ts:
- Removemos a configuração do NgRx (provideStore e provideEffects).
- Adicionamos o DashboardService para fornecer o gerenciamento de estado de forma reativa.
- Essa mudança torna a aplicação mais simples e mais fácil de manter, sem perder a reatividade necessária.
- E por ultimo solucionao o problema do bug da tela branca (não sei ainda do que se trata) Ao assinar um effect no provider a aplicação nao emite erros mas não renderiza a tela


