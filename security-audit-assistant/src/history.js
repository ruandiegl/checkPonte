import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function saveRunAndCompare(targetPath, scan) {
  const historyDir = path.join(targetPath, '.security-auditor', 'runs');
  await mkdir(historyDir, { recursive: true });

  const previousRun = await readPreviousRun(historyDir);
  const currentFingerprints = new Set(scan.findings.map((finding) => finding.fingerprint));
  const previousFingerprints = new Set(previousRun?.findings?.map((finding) => finding.fingerprint) || []);

  const comparison = {
    previousRunId: previousRun?.runId || null,
    newFindings: scan.findings.filter((finding) => !previousFingerprints.has(finding.fingerprint)).length,
    resolvedFindings: previousRun
      ? previousRun.findings.filter((finding) => !currentFingerprints.has(finding.fingerprint)).length
      : 0,
    unchangedFindings: scan.findings.filter((finding) => previousFingerprints.has(finding.fingerprint)).length,
  };

  await writeFile(path.join(historyDir, `${scan.runId}.json`), JSON.stringify(scan, null, 2), 'utf8');
  return comparison;
}

async function readPreviousRun(historyDir) {
  try {
    const files = (await readdir(historyDir))
      .filter((file) => file.endsWith('.json'))
      .sort();
    const previous = files.at(-1);
    if (!previous) return null;
    return JSON.parse(await readFile(path.join(historyDir, previous), 'utf8'));
  } catch {
    return null;
  }
}
