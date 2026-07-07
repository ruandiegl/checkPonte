# Estrutura do Frontend

O frontend segue organização por responsabilidade e por pasta.

```text
frontend/src/
  assets/
  components/
    ComponentName/
      index.tsx
      styles.ts
  context/
  pages/
    PageName/
      index.tsx
      styles.ts
  services/
  utils/
  App.jsx
  main.jsx
  index.css
```

## Componentes

Componentes reutilizáveis ficam em `src/components/<Nome>/`.

- `index.tsx`: props, renderização e comportamento.
- `styles.ts`: styled-components do componente.
- Não adicionar CSS de componente em `index.css`.

## Páginas

Páginas ficam em `src/pages/<NomeDaPagina>/`.

- `index.tsx`: orquestra dados, estado e renderização.
- `styles.ts`: raiz da página e estilos específicos da tela.
- Componentes grandes dentro de uma página devem ser extraídos quando passarem a esconder o fluxo principal.

## CSS global

`src/index.css` deve conter apenas:

- tokens CSS (`--color-*`);
- reset/base;
- animações globais;
- utilitários compartilhados por várias telas, como tabela responsiva, modal e cards mobile.

Quando um estilo pertence a uma única página ou componente, ele deve ir para `styles.ts`.
