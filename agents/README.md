# Agentes de IA do Check Ponte

Esta pasta define agentes especializados para apoiar o desenvolvimento do Check Ponte. Use estes arquivos como contrato de comportamento para revisar, planejar ou executar tarefas com IA sem perder os padroes do projeto.

## Como usar

1. Escolha o agente mais proximo do problema.
2. Entregue contexto objetivo: arquivos, rota, tela, bug, requisito ou decisao pendente.
3. Peca saidas concretas: plano, diff esperado, checklist de revisao, riscos ou criterios de aceite.
4. Para tarefas sensiveis, combine agentes. Exemplo: `backend-api` + `security-lgpd` + `qa`.

## Indice

- [Product Owner](./product-owner.md): use para transformar demanda em requisito claro, prioridade, fluxo e criterio de aceite.
- [Tech Lead / Arquiteto](./tech-lead-architect.md): use para decisoes de arquitetura, separacao de responsabilidades e impacto entre frontend, backend, banco e deploy.
- [Frontend Engineer](./frontend-engineer.md): use para telas React/Vite, componentes, styled-components, shadcn local, mobile-first e integracao via API.
- [Backend Engineer](./backend-engineer.md): use para API Express, Prisma, PostgreSQL, regras de negocio, relatorios PDF/Excel e contratos HTTP.
- [QA Engineer](./qa-engineer.md): use para cenarios de teste, regressao, validacao de fluxo e criterios de aceite verificaveis.
- [DevOps / Release Engineer](./devops-release.md): use para Docker, Vercel, variaveis de ambiente, build, deploy, CORS e banco.
- [Security & Privacy Engineer](./security-lgpd.md): use para revisar riscos OWASP, LGPD, autenticacao, autorizacao, dados pessoais e incidentes.
- [Code Reviewer](./code-reviewer.md): use antes de merge/deploy para revisar bugs, legibilidade, padroes e riscos de regressao.
- [Documentation Engineer](./documentation-engineer.md): use para manter `docs/`, README, guias de setup, arquitetura e onboarding.

## Ordem sugerida por tipo de trabalho

- Nova funcionalidade: Product Owner -> Tech Lead -> Frontend/Backend -> QA -> Security -> Code Reviewer -> Docs.
- Bug em producao: QA -> Tech Lead -> Frontend/Backend -> Security quando envolver auth/dados -> DevOps se envolver ambiente -> Code Reviewer.
- Deploy/infra: DevOps -> Backend/Frontend conforme impacto -> QA -> Security se envolver segredos, CORS ou dados.
- Refatoracao: Tech Lead -> Frontend/Backend -> QA -> Code Reviewer -> Docs.

## Regras globais

- Respeitar a documentacao em `docs/README.md`.
- Preservar a estrutura por pasta com `index.tsx` e `styles.ts` no frontend.
- Evitar CSS global para estilos que pertencem a uma unica tela ou componente.
- Validar permissoes criticas tambem no backend.
- Usar toast para feedback assincrono e modal de confirmacao para acoes destrutivas.
- Nunca sugerir commit de segredo, credencial, URL privada de banco ou token.
