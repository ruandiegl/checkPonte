# Rotas, Autenticação e Permissões

## Rotas principais

- `/login`: autenticação.
- `/checklist`: criação de inspeção pelo operador.
- `/my-history`: histórico do operador.
- `/dashboard`: indicadores administrativos.
- `/history`: histórico completo e detalhes.
- `/reports`: relatórios PDF/Excel.
- `/management`: cadastros e ações administrativas.

## Navegação

As rotas visíveis devem ser derivadas de `src/utils/navigation.js`, respeitando o papel do usuário.

No mobile, o fluxo acompanha a bottom navigation. A navegação por gesto horizontal deve seguir a mesma ordem das rotas disponíveis.

## Autenticação

O diretório `src/context/` concentra:

- usuário autenticado;
- token;
- login;
- logout;
- persistência local.

Use sempre a porta pública:

```js
import { AuthProvider, useAuth } from '../context';
```

Chamadas autenticadas devem passar por `src/services/api.js`, que injeta o token no Axios.

## Perfis

- `master`: acesso administrativo completo.
- `operator`: checklist e histórico próprio.

Qualquer permissão crítica deve ser validada também no backend.
