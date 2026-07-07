export function createJsonReport(scan) {
  return {
    metadata: {
      runId: scan.runId,
      targetPath: scan.targetPath,
      startedAt: scan.startedAt,
      finishedAt: scan.finishedAt,
      durationMs: scan.durationMs,
      scannedFiles: scan.scannedFiles,
      language: scan.language,
    },
    summary: scan.summary,
    comparison: scan.comparison,
    findings: scan.findings,
  };
}
