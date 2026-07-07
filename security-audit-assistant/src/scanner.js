import { createHash, randomUUID } from 'node:crypto';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { confidenceRank, severityRank } from './owasp.js';
import { runLineRules, runManifestRules } from './rules.js';

const ignoredDirectories = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.next',
  '.vercel',
  '.security-auditor',
  'security-audit-assistant',
]);

const maxFileSizeBytes = 1024 * 1024;
const supportedExtensions = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.py',
  '.php',
  '.java',
  '.json',
  '.yaml',
  '.yml',
  '.env',
  '.sh',
  '',
]);

const ignoredLocalEnvFiles = new Set([
  '.env',
  '.env.local',
  '.env.production',
  '.env.production.local',
]);

export async function scanTarget(targetPath, options = {}) {
  const startedAt = new Date();
  const files = await collectFiles(targetPath);
  const findings = [];

  for (const filePath of files) {
    const file = await readAuditFile(filePath, targetPath);
    if (!file) continue;
    const fileFindings = [...runLineRules(file), ...runManifestRules(file)].map((item) => ({
      ...item,
      file: file.relativePath,
      fingerprint: fingerprint(`${item.ruleId}:${file.relativePath}:${item.line}:${item.evidence}`),
    }));
    findings.push(...fileFindings);
  }

  const orderedFindings = findings
    .map((item, index) => ({ ...item, id: `ACHADO-${String(index + 1).padStart(3, '0')}` }))
    .sort((a, b) => {
      const severityDelta = (severityRank[b.severity] || 0) - (severityRank[a.severity] || 0);
      if (severityDelta) return severityDelta;
      return (confidenceRank[b.confidence] || 0) - (confidenceRank[a.confidence] || 0);
    })
    .map((item, index) => ({ ...item, id: `ACHADO-${String(index + 1).padStart(3, '0')}` }));

  const finishedAt = new Date();
  return {
    runId: `run-${startedAt.toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`,
    targetPath,
    language: options.language || 'pt-BR',
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    scannedFiles: files.length,
    findings: orderedFindings,
    summary: summarize(orderedFindings),
  };
}

async function collectFiles(rootPath) {
  const result = [];
  async function walk(currentPath) {
    const currentStat = await stat(currentPath);
    if (currentStat.isDirectory()) {
      const base = path.basename(currentPath);
      if (ignoredDirectories.has(base) && path.resolve(currentPath) !== path.resolve(rootPath)) return;
      const entries = await readdir(currentPath);
      await Promise.all(entries.map((entry) => walk(path.join(currentPath, entry))));
      return;
    }

    if (!currentStat.isFile() || currentStat.size > maxFileSizeBytes) return;
    const ext = path.extname(currentPath).toLowerCase();
    const base = path.basename(currentPath).toLowerCase();
    if (ignoredLocalEnvFiles.has(base)) return;
    if (!supportedExtensions.has(ext) && base !== 'dockerfile' && !base.includes('.env')) return;
    result.push(currentPath);
  }

  await walk(rootPath);
  return result;
}

async function readAuditFile(filePath, rootPath) {
  try {
    const content = await readFile(filePath, 'utf8');
    if (content.includes('\u0000')) return null;
    return {
      path: filePath,
      relativePath: path.relative(rootPath, filePath).replaceAll('\\', '/'),
      content,
      lines: content.split(/\r?\n/),
    };
  } catch {
    return null;
  }
}

function summarize(findings) {
  const bySeverity = {};
  const byCategory = {};
  for (const finding of findings) {
    bySeverity[finding.severity] = (bySeverity[finding.severity] || 0) + 1;
    byCategory[finding.owasp] = (byCategory[finding.owasp] || 0) + 1;
  }
  return {
    total: findings.length,
    bySeverity,
    byCategory,
  };
}

function fingerprint(value) {
  return createHash('sha256').update(value).digest('hex').slice(0, 24);
}
