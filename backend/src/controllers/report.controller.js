import { parseDateRange } from '../utils/dateRange.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as reportService from '../services/report.service.js';
import { buildExcelReport } from '../utils/reportExcel.js';
import { buildPdfReport } from '../utils/reportPdf.js';

export const list = asyncHandler(async (req, res) => {
  const range = parseDateRange(req.query);
  res.json(await reportService.getReportData(range));
});

export const pdf = asyncHandler(async (req, res) => {
  const range = parseDateRange(req.query);
  const report = await reportService.getReportData(range);
  const buffer = await buildPdfReport(report);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="relatorio-vulcano.pdf"');
  res.send(buffer);
});

export const excel = asyncHandler(async (req, res) => {
  const range = parseDateRange(req.query);
  const report = await reportService.getReportData(range);
  const buffer = await buildExcelReport(report);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="relatorio-vulcano.xlsx"');
  res.send(buffer);
});
