import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export function createMarkdownReport(scan) {
  const lines = [
    `# Relatório de Auditoria de Segurança`,
    ``,
    `Run ID: \`${scan.runId}\``,
    `Alvo: \`${scan.targetPath}\``,
    `Arquivos analisados: ${scan.scannedFiles}`,
    `Duração: ${scan.durationMs} ms`,
    ``,
    `## Sumário Executivo`,
    ``,
    `Total de achados: **${scan.summary.total}**`,
    ``,
    `### Por severidade`,
    ``,
    createTable(['Severidade', 'Quantidade'], Object.entries(scan.summary.bySeverity)),
    ``,
    `### Por categoria OWASP`,
    ``,
    createTable(['Categoria', 'Quantidade'], Object.entries(scan.summary.byCategory)),
    ``,
  ];

  if (scan.comparison) {
    lines.push(
      `## Comparação com execução anterior`,
      ``,
      `Run anterior: ${scan.comparison.previousRunId ? `\`${scan.comparison.previousRunId}\`` : 'nenhum'}`,
      ``,
      createTable(['Métrica', 'Quantidade'], [
        ['Novos achados', scan.comparison.newFindings],
        ['Achados corrigidos', scan.comparison.resolvedFindings],
        ['Achados mantidos', scan.comparison.unchangedFindings],
      ]),
      ``,
    );
  }

  lines.push(
    `## Achados`,
    ``,
    createTable(
      ['ID', 'Severidade', 'Confiança', 'OWASP', 'CWE', 'Local', 'Título'],
      scan.findings.map((finding) => [
        finding.id,
        finding.severity,
        finding.confidence,
        finding.owasp,
        finding.cwe,
        `${finding.file}:${finding.line}`,
        finding.title,
      ]),
    ),
    ``,
  );

  for (const finding of scan.findings) {
    lines.push(renderFinding(finding), ``);
  }

  return lines.join('\n');
}

export async function createRemediationDocuments(scan, outDir) {
  await mkdir(outDir, { recursive: true });
  for (const finding of scan.findings) {
    const fileName = `${finding.id}-${slugify(finding.title)}.md`;
    await writeFile(path.join(outDir, fileName), renderFinding(finding), 'utf8');
  }
}

function renderFinding(finding) {
  return [
    `## ${finding.id} - ${finding.title}`,
    ``,
    `- Categoria OWASP: ${finding.owasp}`,
    `- CWE: ${finding.cwe}`,
    `- Severidade: ${finding.severity}`,
    `- Confiança: ${finding.confidence}`,
    `- Local: \`${finding.file}:${finding.line}\``,
    ``,
    `### Evidência`,
    ``,
    '```text',
    finding.evidence || 'Sem trecho disponível.',
    '```',
    ``,
    `### Descrição`,
    ``,
    finding.description,
    ``,
    `### Risco`,
    ``,
    finding.risk,
    ``,
    `### Recomendação`,
    ``,
    finding.recommendation,
    ``,
    `### Exemplo de correção`,
    ``,
    createRemediationExample(finding),
    ``,
    `### Referências`,
    ``,
    ...finding.references.map((reference) => `- ${reference}`),
  ].join('\n');
}

function createRemediationExample(finding) {
  if (finding.ruleId.includes('SQL')) {
    return [
      'Antes:',
      '```js',
      'db.query("SELECT * FROM users WHERE id = " + userId);',
      '```',
      'Depois:',
      '```js',
      'db.query("SELECT * FROM users WHERE id = ?", [userId]);',
      '```',
    ].join('\n');
  }
  if (finding.ruleId.includes('HARDCODED')) {
    return [
      'Antes:',
      '```js',
      'const jwtSecret = "minha-chave-fixa";',
      '```',
      'Depois:',
      '```js',
      'const jwtSecret = process.env.JWT_SECRET;',
      'if (!jwtSecret) throw new Error("JWT_SECRET não configurado");',
      '```',
    ].join('\n');
  }
  if (finding.ruleId.includes('EMPTY-CATCH')) {
    return [
      'Antes:',
      '```js',
      'try { await action(); } catch (err) {}',
      '```',
      'Depois:',
      '```js',
      'try {',
      '  await action();',
      '} catch (err) {',
      '  logger.warn({ err, operation: "action" }, "Falha operacional");',
      '  throw new AppError("Não foi possível concluir a operação");',
      '}',
      '```',
    ].join('\n');
  }
  return 'Aplique a recomendação acima no ponto indicado e valide com teste automatizado ou revisão AppSec.';
}

function createTable(headers, rows) {
  const safeRows = rows.length > 0 ? rows : [['-', '0']];
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...safeRows.map((row) => `| ${row.map((cell) => String(cell).replaceAll('|', '\\|')).join(' | ')} |`),
  ].join('\n');
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}
