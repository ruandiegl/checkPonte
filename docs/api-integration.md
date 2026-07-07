# Integração com API

O frontend conversa com a API por `frontend/src/services/api.js`.

## Padrão

- Não chamar `axios` diretamente dentro de páginas.
- Criar funções nomeadas na camada `api`.
- Tratar download de arquivos dentro da camada de serviço.
- Expor para as telas apenas métodos de negócio, como `getDashboardSummary`, `saveInspection` e `downloadReportPdf`.

## Erros

A camada de API deve normalizar mensagens de erro para que as páginas usem:

```js
toast.error(err.message || 'Não foi possível concluir a operação.');
```

## Arquivos

Downloads de PDF e Excel devem:

- usar `responseType: 'blob'`;
- criar URL temporária;
- disparar download;
- liberar URL após uso.

## Variáveis de ambiente

No Vite, variáveis públicas precisam iniciar com `VITE_`.

Exemplo:

```env
VITE_API_URL=http://localhost:3001
```
