# Vulcano API

Backend Node.js + Express + Prisma para o Sistema Vulcano Checklist.

## Setup local

1. Instale as dependências:

```bash
npm install
```

2. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

3. Ajuste `DATABASE_URL`, `JWT_SECRET` e `CORS_ORIGIN` no `.env`.

4. Se não tiver PostgreSQL local, suba o banco pela raiz do projeto:

```bash
docker compose up -d postgres
```

5. Rode as migrations e o seed:

```bash
npm run prisma:dev
npm run prisma:seed
```

6. Inicie a API:

```bash
npm run dev
```

A API sobe em `http://localhost:3333` e o frontend Vite já faz proxy de `/api` para essa porta.

## Usuários seed

- Master: `admin` / `vulcano123`
- Operador: `operador` / `vulcano123`
