# Documentação do Check Ponte

Este diretório centraliza as guidelines técnicas e de produto para manter o projeto consistente.

## Stack

- Tipo: Web
- Frontend: React 19, Vite 8, React Router, Axios, React Toastify, Lucide React, styled-components
- Backend: Node.js, Express, Prisma, PostgreSQL
- Infra local: Docker Compose com PostgreSQL
- Deploy: Vercel para front e API

## Índice

- [Arquitetura](./architecture.md)
- [Estrutura do frontend](./frontend-structure.md)
- [Padrões de componentes](./component-patterns.md)
- [Guidelines de estilo e UX](./styling-guidelines.md)
- [Rotas, autenticação e permissões](./routing-auth.md)
- [Integração com API](./api-integration.md)
- [Ambiente local](./development.md)
- [Deploy e produção](./deployment.md)

## Regra principal

O projeto deve favorecer manutenção simples: cada tela ou componente fica em sua própria pasta, com `index.tsx` para lógica/renderização e `styles.ts` para styled-components. CSS global deve ser usado apenas para tokens, reset e utilitários realmente compartilhados.
