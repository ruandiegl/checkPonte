# Padrões de Componentes

## Estrutura padrão

```tsx
import { Wrapper } from './styles';

const Example = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default Example;
```

```ts
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: grid;
  gap: 12px;
`;
```

## Nomes

- Componentes React em PascalCase.
- Styled-components com nomes semânticos: `PageRoot`, `Header`, `ActionButton`, `CardGrid`.
- Props apenas visuais em styled-components devem usar prefixo `$`, como `$variant`, para não vazar atributos inválidos no DOM.

## Feedback

- Sucesso: `toast.success`.
- Erro: `toast.error`.
- Atenção/validação: `toast.warning`.
- Evitar `alert()`, mensagens soltas no DOM e erros silenciosos.

## Ações destrutivas

Ações como excluir, desativar ou logout devem usar modal de confirmação no padrão do projeto.

## Ícones

Usar `lucide-react` para botões de ação e navegação. Ícones devem ter `aria-label` no botão quando não houver texto visível.
