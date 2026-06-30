import PDFDocument from 'pdfkit';

function statusColor(status) {
  if (status === 'OK') return '#27AE60';
  if (status === 'NC') return '#F39C12';
  return '#E74C3C';
}

export function buildPdfReport(report) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    doc.rect(0, 0, doc.page.width, 74).fill('#F5C400');
    doc.fillColor('#111111').fontSize(20).font('Helvetica-Bold').text('VULCANO', 40, 24);
    doc.fontSize(10).font('Helvetica').text('Relatório de Inspeções de Pontes Rolantes', 40, 48);

    doc.moveDown(4);
    doc.fillColor('#111111').fontSize(10).text(
      `Período: ${report.period.from.toLocaleDateString('pt-BR')} a ${report.period.to.toLocaleDateString('pt-BR')} | Registros: ${report.summary.total} | C: ${report.summary.conform} | NC: ${report.summary.nonConform}`,
    );

    report.inspections.forEach((inspection) => {
      if (doc.y > 690) doc.addPage();

      doc.moveDown(1);
      const headerY = doc.y;
      doc.rect(40, headerY, doc.page.width - 80, 24).fill('#2C2C2C');
      doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica-Bold').text(
        `${new Date(inspection.created_at).toLocaleString('pt-BR')} - ${inspection.equipmentName}`,
        48,
        headerY + 7,
      );

      doc.y = headerY + 32;
      doc.fillColor('#111111').fontSize(9).font('Helvetica').text(
        `Operador: ${inspection.userName} | Local: ${inspection.location || '-'} | Status: ${inspection.status}`,
      );

      inspection.results.forEach((result) => {
        if (doc.y > 740) doc.addPage();
        const rowY = doc.y + 5;
        doc.fillColor('#111111').fontSize(8).text(result.itemDescription, 48, rowY, { width: 330 });
        doc.fillColor(result.is_imperative ? '#F39C12' : '#777777').text(result.is_imperative ? 'Sim' : 'Não', 400, rowY);
        doc.fillColor(result.answer === 'C' ? '#27AE60' : '#E74C3C').font('Helvetica-Bold').text(result.answer, 462, rowY);
        doc.font('Helvetica');
        doc.y = Math.max(doc.y, rowY + 12);
      });

      doc.moveDown(0.5);
      doc.fillColor(statusColor(inspection.status)).font('Helvetica-Bold').text(`Status geral: ${inspection.status}`);
      doc.font('Helvetica');
    });

    doc.addPage();
    doc.fillColor('#111111').fontSize(16).font('Helvetica-Bold').text('RESUMO DO PERÍODO');
    doc.moveDown();
    doc.fontSize(11).font('Helvetica').text(`Total de registros: ${report.summary.total}`);
    doc.text(`Inspeções OK: ${report.summary.ok}`);
    doc.text(`Inspeções NC: ${report.summary.nc}`);
    doc.text(`Inspeções IMP: ${report.summary.imp}`);
    doc.text(`Itens conformes: ${report.summary.conform}`);
    doc.text(`Itens não conformes: ${report.summary.nonConform}`);

    doc.end();
  });
}
