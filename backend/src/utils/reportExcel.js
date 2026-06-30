import ExcelJS from 'exceljs';

export async function buildExcelReport(report) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Vulcano Checklist';
  const sheet = workbook.addWorksheet('Relatório Detalhado');

  sheet.columns = [
    { header: 'Data', key: 'date', width: 22 },
    { header: 'Operador', key: 'operator', width: 28 },
    { header: 'Ponte', key: 'crane', width: 24 },
    { header: 'Local', key: 'location', width: 22 },
    { header: 'Item de Verificação', key: 'item', width: 48 },
    { header: 'Imp.', key: 'imperative', width: 10 },
    { header: 'Resultado', key: 'result', width: 12 },
    { header: 'Status Geral', key: 'generalStatus', width: 14 },
    { header: 'Observação', key: 'observation', width: 42 },
  ];

  sheet.getRow(1).font = { bold: true, color: { argb: 'FF111111' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5C400' } };

  report.inspections.forEach((inspection) => {
    inspection.results.forEach((result) => {
      const row = sheet.addRow({
        date: new Date(inspection.created_at).toLocaleString('pt-BR'),
        operator: inspection.userName,
        crane: inspection.equipmentName,
        location: inspection.location || '',
        item: result.itemDescription,
        imperative: result.is_imperative ? 'Sim' : 'Não',
        result: result.answer,
        generalStatus: inspection.status,
        observation: result.observation || '',
      });

      const resultCell = row.getCell('result');
      resultCell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      resultCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: result.answer === 'C' ? 'FF27AE60' : 'FFE74C3C' },
      };
    });
  });

  const summaryStart = sheet.rowCount + 3;
  sheet.getCell(`A${summaryStart}`).value = 'RESUMO';
  sheet.getCell(`A${summaryStart}`).font = { bold: true };
  sheet.addRow(['Total de registros', report.summary.total]);
  sheet.addRow(['Total C', report.summary.conform]);
  sheet.addRow(['Total NC', report.summary.nonConform]);
  sheet.addRow(['OK', report.summary.ok]);
  sheet.addRow(['NC', report.summary.nc]);
  sheet.addRow(['IMP', report.summary.imp]);

  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        left: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        right: { style: 'thin', color: { argb: 'FFDDDDDD' } },
      };
      cell.alignment = { vertical: 'middle', wrapText: true };
    });
  });

  return workbook.xlsx.writeBuffer();
}
