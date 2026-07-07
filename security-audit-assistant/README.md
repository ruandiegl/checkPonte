# Security Audit Assistant

MVP de assistente para auditoria estática de segurança de aplicações, baseado em OWASP Top 10:2025.

Esta versão executa uma varredura local, sem enviar código para serviços externos. Ela gera:

- relatório JSON;
- relatório Markdown consolidado;
- documentos Markdown de remediação por achado;
- histórico local de execuções para comparação.

## Uso

```bash
cd security-audit-assistant
node src/cli.js scan ../frontend --out reports --format all
```

Opções:

```bash
node src/cli.js scan <alvo> \
  --out reports \
  --format json|md|all \
  --lang pt-BR|en \
  --history true|false
```

## Cobertura V1

Linguagens e arquivos suportados:

- JavaScript / TypeScript / JSX / TSX;
- Python;
- PHP;
- Java;
- JSON / YAML / env;
- Dockerfile;
- package.json.

Categorias OWASP mapeadas:

- A01:2025 - Broken Access Control
- A02:2025 - Security Misconfiguration
- A03:2025 - Software Supply Chain Failures
- A04:2025 - Cryptographic Failures
- A05:2025 - Injection
- A06:2025 - Insecure Design
- A07:2025 - Authentication Failures
- A08:2025 - Software or Data Integrity Failures
- A09:2025 - Security Logging and Alerting Failures
- A10:2025 - Mishandling of Exceptional Conditions

## Saída

O comando cria arquivos como:

```text
reports/
  run-2026-07-07T...json
  run-2026-07-07T...md
  remediations/
    ACHADO-001-*.md
```

O histórico fica no alvo analisado:

```text
<alvo>/.security-auditor/runs/
```

## Limitações

Este MVP usa heurísticas estáticas. Ele não substitui revisão humana, SAST comercial, DAST ou pentest. Os achados devem ser triados por AppSec/Tech Lead antes de virarem correção obrigatória.

## Referências

- https://owasp.org/Top10/2025/
- https://cheatsheetseries.owasp.org/
- https://owasp.org/www-project-application-security-verification-standard/
