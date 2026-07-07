# Guidelines de Estilo e UX

## Direção visual

A aplicação é operacional e mobile-first. A interface deve ser escura, objetiva e densa o bastante para trabalho repetido, sem parecer landing page.

## Tokens

Usar variáveis de `index.css` sempre que possível:

- `--color-bg-primary`
- `--color-bg-card`
- `--color-bg-header`
- `--color-accent`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-success`
- `--color-warning`
- `--color-danger`
- `--color-border`

## Mobile-first

- Evitar tabelas horizontais no mobile; preferir cards resumidos.
- Bottom navigation é o padrão mobile.
- Botões precisam ter área de toque confortável.
- Evitar conteúdo que dependa de arrastar horizontalmente para ser compreendido.

## Formulários

- Labels sempre visíveis.
- Campos com foco usando borda/acento.
- Validações aparecem por toast e, quando necessário, a tela deve rolar até o campo relevante.

## Motion

Movimentos devem ser sutis e rápidos. Respeitar `prefers-reduced-motion`.

## Logos

A logo da Vulcano deve ser tratada como elemento de marca integrado à interface. No topo, usar superfície branca intencional, alinhada à navbar, e não como imagem “colada” em fundo escuro.
