# Regras do MVP

## SAST

- `JS-EVAL-001`: detecta `eval` e `new Function`.
- `SQL-CONCAT-001`: detecta SQL montado por concatenação/interpolação.
- `CMD-EXEC-001`: detecta execução de comandos do sistema.
- `WEAK-CRYPTO-001`: detecta MD5/SHA-1.
- `RANDOM-TOKEN-001`: detecta token com RNG fraco.
- `DANGEROUS-HTML-001`: detecta `dangerouslySetInnerHTML`.
- `EMPTY-CATCH-001`: detecta `catch` vazio.
- `LOGGING-SECRETS-001`: detecta possível log de segredo.

## Configuração

- `CORS-WILDCARD-001`: detecta CORS wildcard.
- `HARDCODED-SECRET-001`: detecta segredo hardcoded.
- `TLS-DISABLED-001`: detecta validação TLS desativada.
- `DOCKER-ROOT-001`: detecta `USER root` no Dockerfile.

## Supply Chain

- `NPM-LOOSE-VERSION-001`: detecta versão npm `*`, `latest` ou `x`.
- `NPM-DANGEROUS-SCRIPT-001`: detecta scripts npm com download/execução remota.

## Evolução recomendada

- Integrar OSV/NVD para vulnerabilidades reais de dependências.
- Adicionar Semgrep/CodeQL como motor complementar.
- Criar baseline de falsos positivos.
- Adicionar saída SARIF para GitHub Advanced Security e pipelines.
