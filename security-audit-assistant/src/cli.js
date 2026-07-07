#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { scanTarget } from './scanner.js';
import { createJsonReport } from './reporters/json.js';
import { createMarkdownReport, createRemediationDocuments } from './reporters/markdown.js';
import { saveRunAndCompare } from './history.js';

function printHelp() {
  console.log(`
Security Audit Assistant

Uso:
  node src/cli.js scan <alvo> [--out reports] [--format json|md|all] [--lang pt-BR|en] [--history true|false]

Exemplos:
  node src/cli.js scan ../frontend --out reports --format all
  npm run scan -- ../backend --out reports
`);
}

function parseArgs(argv) {
  const [command, target = '.'] = argv;
  const options = {
    command,
    target,
    out: 'reports',
    format: 'all',
    language: 'pt-BR',
    history: true,
  };

  for (let index = 2; index < argv.length; index += 1) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === '--out') {
      options.out = value;
      index += 1;
    }
    if (key === '--format') {
      options.format = value;
      index += 1;
    }
    if (key === '--lang') {
      options.language = value;
      index += 1;
    }
    if (key === '--history') {
      options.history = value !== 'false';
      index += 1;
    }
  }

  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.command || options.command === '--help' || options.command === '-h') {
    printHelp();
    return;
  }

  if (options.command !== 'scan') {
    console.error(`Comando desconhecido: ${options.command}`);
    printHelp();
    process.exitCode = 1;
    return;
  }

  const targetPath = path.resolve(process.cwd(), options.target);
  const outDir = path.resolve(process.cwd(), options.out);
  await mkdir(outDir, { recursive: true });

  const scan = await scanTarget(targetPath, { language: options.language });
  const comparison = options.history ? await saveRunAndCompare(targetPath, scan) : null;
  scan.comparison = comparison;

  const jsonReport = createJsonReport(scan);
  const markdownReport = createMarkdownReport(scan);

  if (options.format === 'json' || options.format === 'all') {
    await writeFile(path.join(outDir, `${scan.runId}.json`), JSON.stringify(jsonReport, null, 2), 'utf8');
  }

  if (options.format === 'md' || options.format === 'all') {
    await writeFile(path.join(outDir, `${scan.runId}.md`), markdownReport, 'utf8');
    await createRemediationDocuments(scan, path.join(outDir, 'remediations'));
  }

  console.log(`Scan concluido: ${scan.findings.length} achado(s)`);
  console.log(`Run ID: ${scan.runId}`);
  console.log(`Saida: ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
