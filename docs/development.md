# Ambiente Local

## Requisitos

- Node.js compatível com Vite 8.
- Docker Desktop.
- npm.

## Banco local

O PostgreSQL local fica em Docker Compose.

```bash
docker compose up -d postgres
```

Configuração atual:

- container: `vulcano-postgres`
- banco: `vulcano_checklist`
- usuário: `postgres`
- senha: `postgres`
- porta local: `5434`

## Backend

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:dev
npm run prisma:seed
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Validação antes de entregar

```bash
cd frontend
npm run build
npm run lint
npm run typecheck
```

Quando alterar backend, validar também migrations, seed e rotas impactadas.
