# Deploy e Produção

## Vercel

O projeto foi preparado para deploy com repositórios separados de front e back, mantendo variáveis por ambiente.

## Frontend

Variáveis esperadas:

```env
VITE_API_URL=https://sua-api.vercel.app
```

Build:

```bash
npm run build
```

Output:

```text
dist/
```

## Backend

Variáveis esperadas:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
CORS_ORIGIN=https://seu-front.vercel.app
```

Executar Prisma no deploy:

```bash
npm run prisma:migrate
```

## CORS

O backend deve permitir a origem exata do frontend em produção. Evitar `*` quando houver autenticação por token.

## Banco

Produção usa PostgreSQL gerenciado. A URL deve vir de variável de ambiente e nunca ser commitada.

## Checklist de publicação

- `npm run build` passa no frontend.
- Migrations aplicadas no banco.
- `VITE_API_URL` aponta para a API correta.
- `CORS_ORIGIN` aponta para o domínio do frontend.
- Login, checklist, histórico, dashboard, relatórios e gestão testados em produção.
