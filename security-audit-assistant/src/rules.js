import path from 'node:path';
import { OWASP_TOP_10_2025 } from './owasp.js';

const cheatSheets = {
  injection: 'https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html',
  sqlInjection: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html',
  auth: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html',
  secrets: 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html',
  crypto: 'https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html',
  logging: 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html',
  docker: 'https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html',
  xss: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html',
};

function finding(rule, overrides = {}) {
  const category = OWASP_TOP_10_2025[rule.owaspKey];
  return {
    ruleId: rule.id,
    title: rule.title,
    owasp: `${category.id} - ${category.name}`,
    owaspUrl: category.url,
    cwe: rule.cwe,
    severity: rule.severity,
    confidence: rule.confidence,
    description: rule.description,
    risk: rule.risk,
    recommendation: rule.recommendation,
    references: [category.url, ...(rule.references || [])],
    ...overrides,
  };
}

const lineRules = [
  {
    id: 'JS-EVAL-001',
    languages: ['js', 'ts', 'jsx', 'tsx'],
    pattern: /\beval\s*\(|new\s+Function\s*\(/,
    owaspKey: 'A05',
    cwe: 'CWE-95 (Improper Neutralization of Directives in Dynamically Evaluated Code)',
    severity: 'Critico',
    confidence: 'Alta',
    title: 'Execução dinâmica de código',
    description: 'O código usa avaliação dinâmica, permitindo execução de conteúdo manipulável em tempo de execução.',
    risk: 'Entrada controlada por atacante pode virar execução de código arbitrário.',
    recommendation: 'Remova eval/new Function. Use parsers, maps de comandos permitidos ou validação estrutural rígida.',
    references: [cheatSheets.injection],
  },
  {
    id: 'SQL-CONCAT-001',
    languages: ['js', 'ts', 'jsx', 'tsx', 'py', 'php', 'java'],
    pattern: /["'`]\s*(select|insert|update|delete)\b[\s\S]{0,120}(\+|\$\{|%s|\.format\s*\()/i,
    owaspKey: 'A05',
    cwe: 'CWE-89 (SQL Injection)',
    severity: 'Critico',
    confidence: 'Media',
    title: 'Query SQL possivelmente montada por concatenação/interpolação',
    description: 'A linha parece construir SQL dinamicamente com concatenação ou interpolação.',
    risk: 'Um atacante pode manipular entradas para alterar comandos SQL.',
    recommendation: 'Troque concatenação por consultas parametrizadas/prepared statements no ORM ou driver em uso.',
    references: [cheatSheets.sqlInjection],
  },
  {
    id: 'CMD-EXEC-001',
    languages: ['js', 'ts', 'py', 'php', 'java'],
    pattern: /\b(exec|execSync|spawn|shell_exec|system|Runtime\.getRuntime\(\)\.exec|subprocess\.(run|Popen|call))\s*\(/,
    owaspKey: 'A05',
    cwe: 'CWE-78 (OS Command Injection)',
    severity: 'Alto',
    confidence: 'Media',
    title: 'Execução de comando do sistema',
    description: 'O código executa comandos do sistema. Quando argumentos vêm de entrada externa, há risco de command injection.',
    risk: 'Pode permitir execução de comandos arbitrários no servidor.',
    recommendation: 'Evite shell. Use APIs nativas, allowlist de argumentos e execução sem interpolação de strings.',
    references: [cheatSheets.injection],
  },
  {
    id: 'WEAK-CRYPTO-001',
    languages: ['js', 'ts', 'py', 'php', 'java'],
    pattern: /\b(md5|sha1|createHash\(['"]md5|createHash\(['"]sha1|MessageDigest\.getInstance\(['"]MD5|MessageDigest\.getInstance\(['"]SHA-1)/i,
    owaspKey: 'A04',
    cwe: 'CWE-327 (Use of a Broken or Risky Cryptographic Algorithm)',
    severity: 'Alto',
    confidence: 'Alta',
    title: 'Algoritmo criptográfico fraco',
    description: 'Foi encontrado uso de MD5/SHA-1 ou algoritmo criptográfico obsoleto.',
    risk: 'Hashes fracos podem ser quebrados por colisão ou força bruta, comprometendo integridade/senhas/tokens.',
    recommendation: 'Use algoritmos modernos. Para senhas, prefira Argon2id/bcrypt/scrypt; para integridade, SHA-256/HMAC conforme contexto.',
    references: [cheatSheets.crypto],
  },
  {
    id: 'RANDOM-TOKEN-001',
    languages: ['js', 'ts', 'py'],
    pattern: /\b(Math\.random\(\)|random\.random\(\))[\s\S]{0,80}(token|secret|password|senha|session|jwt)/i,
    owaspKey: 'A04',
    cwe: 'CWE-338 (Use of Cryptographically Weak Pseudo-Random Number Generator)',
    severity: 'Alto',
    confidence: 'Media',
    title: 'Token possivelmente gerado com RNG fraco',
    description: 'A linha sugere uso de gerador pseudoaleatório não criptográfico para material sensível.',
    risk: 'Tokens previsíveis podem permitir sequestro de sessão ou bypass de autenticação.',
    recommendation: 'Use crypto.randomBytes/randomUUID no Node ou secrets/token_urlsafe no Python.',
    references: [cheatSheets.crypto],
  },
  {
    id: 'CORS-WILDCARD-001',
    languages: ['js', 'ts', 'json', 'yaml', 'yml'],
    pattern: /(origin\s*:\s*['"]\*['"]|Access-Control-Allow-Origin['"]?\s*[:=]\s*['"]\*)/,
    owaspKey: 'A02',
    cwe: 'CWE-942 (Permissive Cross-domain Policy)',
    severity: 'Medio',
    confidence: 'Alta',
    title: 'CORS permissivo',
    description: 'Configuração permite origem wildcard.',
    risk: 'Pode expor APIs autenticadas a origens não confiáveis.',
    recommendation: 'Restrinja CORS aos domínios reais do frontend por ambiente e evite wildcard com credenciais.',
    references: [cheatSheets.auth],
  },
  {
    id: 'HARDCODED-SECRET-001',
    languages: ['js', 'ts', 'py', 'php', 'java', 'env', 'json', 'yaml', 'yml'],
    pattern: /(jwt_secret|secret_key|api_key|private_key|password|senha|token)\s*[:=]\s*(["'][^"']{8,}["']|[A-Za-z0-9_\-+/=]{16,})/i,
    ignore: (line) => /(troque|change|example|placeholder|development-only|sua-chave|sua_senha|set_postgres_password|process\.env|env\.)/i.test(line),
    owaspKey: 'A07',
    cwe: 'CWE-798 (Use of Hard-coded Credentials)',
    severity: 'Alto',
    confidence: 'Media',
    title: 'Segredo ou credencial hardcoded',
    description: 'Foi encontrado um valor sensível aparentemente codificado em arquivo.',
    risk: 'Credenciais no repositório podem vazar e permitir acesso indevido.',
    recommendation: 'Remova o segredo do código, rotacione a credencial e use variáveis de ambiente ou cofre de segredos.',
    references: [cheatSheets.secrets],
  },
  {
    id: 'HARDCODED-SEED-PASSWORD-001',
    languages: ['js', 'ts'],
    pattern: /\b(hash|hashSync)\s*\(\s*['"][^'"]{6,}['"]\s*,/i,
    owaspKey: 'A07',
    cwe: 'CWE-798 (Use of Hard-coded Credentials)',
    severity: 'Alto',
    confidence: 'Alta',
    title: 'Senha padrão hardcoded em seed ou hash',
    description: 'Foi encontrado hash de senha com valor literal no código.',
    risk: 'Credenciais padrão podem vazar, ser reutilizadas e permitir acesso indevido após deploy ou seed em ambiente compartilhado.',
    recommendation: 'Leia a senha inicial de variável de ambiente, gere valor forte por ambiente e force troca quando aplicável.',
    references: [cheatSheets.secrets],
  },
  {
    id: 'TLS-DISABLED-001',
    languages: ['js', 'ts', 'env', 'sh', 'yaml', 'yml'],
    pattern: /(NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*0|rejectUnauthorized\s*:\s*false|verify\s*=\s*false)/i,
    owaspKey: 'A02',
    cwe: 'CWE-295 (Improper Certificate Validation)',
    severity: 'Alto',
    confidence: 'Alta',
    title: 'Validação TLS desativada',
    description: 'A configuração desativa validação de certificado TLS.',
    risk: 'Conexões ficam vulneráveis a interceptação e ataques man-in-the-middle.',
    recommendation: 'Reative validação TLS e corrija certificados no ambiente em vez de ignorar falhas.',
    references: [cheatSheets.crypto],
  },
  {
    id: 'DANGEROUS-HTML-001',
    languages: ['jsx', 'tsx'],
    pattern: /dangerouslySetInnerHTML/,
    owaspKey: 'A05',
    cwe: 'CWE-79 (Cross-site Scripting)',
    severity: 'Alto',
    confidence: 'Media',
    title: 'Renderização de HTML bruto',
    description: 'Uso de dangerouslySetInnerHTML pode introduzir XSS se o conteúdo não for sanitizado corretamente.',
    risk: 'Scripts maliciosos podem executar no navegador do usuário.',
    recommendation: 'Evite HTML bruto. Quando inevitável, sanitize com biblioteca confiável e política de conteúdo restritiva.',
    references: [cheatSheets.xss],
  },
  {
    id: 'EMPTY-CATCH-001',
    languages: ['js', 'ts', 'jsx', 'tsx', 'java'],
    pattern: /catch\s*\([^)]*\)\s*\{\s*\}/,
    owaspKey: 'A10',
    cwe: 'CWE-390 (Detection of Error Condition Without Action)',
    severity: 'Medio',
    confidence: 'Alta',
    title: 'Exceção ignorada silenciosamente',
    description: 'Um bloco catch vazio foi encontrado.',
    risk: 'Falhas podem passar despercebidas, dificultando detecção, auditoria e resposta a incidentes.',
    recommendation: 'Registre o erro com contexto seguro, trate o fluxo de falha e evite expor detalhes sensíveis ao usuário.',
    references: [cheatSheets.logging],
  },
  {
    id: 'LOGGING-SECRETS-001',
    languages: ['js', 'ts', 'py', 'php', 'java'],
    pattern: /(console\.log|logger\.|print\(|System\.out\.println)[\s\S]{0,100}(password|senha|token|secret|authorization)/i,
    owaspKey: 'A09',
    cwe: 'CWE-532 (Insertion of Sensitive Information into Log File)',
    severity: 'Medio',
    confidence: 'Media',
    title: 'Possível vazamento de segredo em log',
    description: 'A linha sugere registro de dados sensíveis em logs.',
    risk: 'Logs costumam ser replicados e acessados por múltiplos sistemas, ampliando vazamento de credenciais.',
    recommendation: 'Mascare segredos, remova tokens dos logs e aplique política de retenção/acesso.',
    references: [cheatSheets.logging],
  },
  {
    id: 'DOCKER-ROOT-001',
    languages: ['dockerfile'],
    pattern: /^\s*USER\s+root\b/i,
    owaspKey: 'A02',
    cwe: 'CWE-250 (Execution with Unnecessary Privileges)',
    severity: 'Medio',
    confidence: 'Alta',
    title: 'Container executando como root',
    description: 'Dockerfile define execução como root.',
    risk: 'Comprometimento do app pode ganhar mais privilégios dentro do container.',
    recommendation: 'Crie usuário não privilegiado e use USER appuser no estágio final.',
    references: [cheatSheets.docker],
  },
];

const manifestRules = [
  {
    id: 'NPM-LOOSE-VERSION-001',
    fileNames: ['package.json'],
    owaspKey: 'A03',
    cwe: 'CWE-1104 (Use of Unmaintained Third Party Components)',
    severity: 'Medio',
    confidence: 'Media',
    title: 'Dependência npm com versão não fixada',
    references: ['https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html'],
    test(file) {
      const data = safeJson(file.content);
      if (!data) return [];
      const sections = ['dependencies', 'devDependencies', 'optionalDependencies'];
      const results = [];
      for (const section of sections) {
        for (const [name, version] of Object.entries(data[section] || {})) {
          if (version === '*' || version === 'latest' || String(version).includes('x')) {
            results.push({
              line: findLine(file.lines, `"${name}"`),
              evidence: `${section}.${name}: ${version}`,
            });
          }
        }
      }
      return results;
    },
    description: 'Manifesto npm usa versão ampla demais para dependência.',
    risk: 'Atualizações não controladas podem introduzir regressões ou pacotes vulneráveis.',
    recommendation: 'Fixe versões ou use ranges conservadores com lockfile e revisão de atualização.',
  },
  {
    id: 'NPM-DANGEROUS-SCRIPT-001',
    fileNames: ['package.json'],
    owaspKey: 'A08',
    cwe: 'CWE-494 (Download of Code Without Integrity Check)',
    severity: 'Alto',
    confidence: 'Media',
    title: 'Script npm com download/execução remota',
    references: ['https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html'],
    test(file) {
      const data = safeJson(file.content);
      if (!data?.scripts) return [];
      return Object.entries(data.scripts)
        .filter(([, script]) => /(curl|wget).*(\||sh|bash|node)|npx\s+[^ ]+/i.test(String(script)))
        .map(([name, script]) => ({
          line: findLine(file.lines, `"${name}"`),
          evidence: `${name}: ${script}`,
        }));
    },
    description: 'Script npm baixa ou executa código remoto.',
    risk: 'Pode introduzir execução de código não revisado durante install/build/deploy.',
    recommendation: 'Evite scripts remotos; fixe ferramentas como dependências versionadas e valide checksums quando aplicável.',
  },
];

export function getLanguage(filePath) {
  const base = path.basename(filePath).toLowerCase();
  if (base === 'dockerfile') return 'dockerfile';
  if (base.endsWith('.env') || base.includes('.env.')) return 'env';
  const ext = path.extname(filePath).toLowerCase().replace('.', '');
  return ext || base;
}

export function runLineRules(file) {
  const language = getLanguage(file.path);
  const findings = [];
  for (const [index, line] of file.lines.entries()) {
    for (const rule of lineRules) {
      if (!rule.languages.includes(language)) continue;
      if (!rule.pattern.test(line)) continue;
      if (rule.ignore?.(line, file)) continue;
      findings.push(finding(rule, {
        line: index + 1,
        evidence: line.trim().slice(0, 240),
      }));
    }
  }
  return findings;
}

export function runManifestRules(file) {
  const fileName = path.basename(file.path).toLowerCase();
  const findings = [];
  for (const rule of manifestRules) {
    if (!rule.fileNames.includes(fileName)) continue;
    for (const match of rule.test(file)) {
      findings.push(finding(rule, match));
    }
  }
  return findings;
}

function safeJson(content) {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function findLine(lines, needle) {
  const index = lines.findIndex((line) => line.includes(needle));
  return index >= 0 ? index + 1 : 1;
}
