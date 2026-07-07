# Arquitetura

O Check Ponte é uma aplicação web para checklist de inspeção de pontes rolantes, com experiência mobile-first para operadores e telas administrativas para gestão.

## Camadas

- `frontend/`: interface web em React + Vite.
- `backend/`: API em Node.js + Express.
- `backend/prisma/`: schema, migrations e seed do banco.
- `docker-compose.yml`: PostgreSQL local em container.

## Fluxo principal

1. Usuário autentica no frontend.
2. Frontend salva o token e usa Axios para chamadas autenticadas.
3. Operador cria checklists e acompanha seu próprio histórico.
4. Administrador acompanha dashboard, histórico, relatórios, auditoria e cadastros.
5. API persiste os dados no PostgreSQL via Prisma.
6. Relatórios PDF e Excel são gerados pela API e baixados pelo frontend.

## Princípios

- Frontend desacoplado da API por uma camada única em `src/services/api.js`.
- Regra de negócio sensível fica no backend.
- Telas e componentes devem ser pequenos, com estilos locais.
- Toasts são o padrão para feedback assíncrono.
- Modais devem fechar ao clicar fora, salvo quando houver risco de perda de dados sem confirmação.
