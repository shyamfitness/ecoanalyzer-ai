import PDFDocument from 'pdfkit';
import dayjs from 'dayjs';

const formatScore = (score) => `${score.toFixed(1)} / 100`;

export const pdfService = {
  buildAnalysisReport(analysis) {
    if (!analysis) {
      throw new Error('Analysis data is required to generate PDF');
    }

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    doc.fontSize(20).fillColor('#0f172a').text('EcoAnalyzer AI Report', { align: 'left' });
    doc.moveDown();

    doc.fontSize(12).fillColor('#475569');
    doc.text(`Generated: ${dayjs().format('MMM D, YYYY h:mm A')}`);
    doc.text(`Analysis ID: ${analysis.id || analysis._id}`);
    doc.moveDown();

    doc.fontSize(16).fillColor('#0f172a').text('Product Overview');
    doc.fontSize(12).fillColor('#1e293b');
    doc.text(`Name: ${analysis.product?.name}`);
    if (analysis.product?.brand) doc.text(`Brand: ${analysis.product.brand}`);
    if (analysis.product?.category) doc.text(`Category: ${analysis.product.category}`);
    if (analysis.product?.barcode) doc.text(`Barcode: ${analysis.product.barcode}`);
    doc.moveDown();

    doc.fontSize(16).fillColor('#0f172a').text('Environmental Score');
    doc.fontSize(48).fillColor('#059669').text(formatScore(analysis.environmentalScore));
    doc.fontSize(14).fillColor('#047857').text(`Grade ${analysis.grade}`);
    doc.moveDown();

    doc.fontSize(16).fillColor('#0f172a').text('Impact Breakdown');
    doc.moveDown(0.5);

    Object.entries(analysis.breakdown || {}).forEach(([key, value]) => {
      doc.fontSize(14).fillColor('#0f172a').text(value.label || key, { continued: true });
      doc.fontSize(14).fillColor('#059669').text(`  ${value.score?.toFixed(1)}`);
      doc.fontSize(11).fillColor('#475569').text(value.notes || '');
      doc.moveDown(0.5);
    });

    doc.moveDown();
    doc.fontSize(16).fillColor('#0f172a').text('Key Metrics');
    doc.moveDown(0.5);

    Object.entries(analysis.metrics || {}).forEach(([label, metric]) => {
      doc.fontSize(13).fillColor('#0f172a').text(`${label.toUpperCase()}:`, { continued: true });
      doc.fillColor('#0d9488').text(` ${metric.value} ${metric.unit}`);
      doc.fontSize(11).fillColor('#475569').text(metric.context || '');
      doc.moveDown(0.3);
    });

    doc.moveDown();
    doc.fontSize(16).fillColor('#0f172a').text('Explainability Summary');
    doc.fontSize(12).fillColor('#1e293b').text(analysis.explainability?.summary || 'No summary available.');

    if (analysis.explainability?.positives?.length) {
      doc.moveDown(0.5);
      doc.fontSize(13).fillColor('#065f46').text('Strengths');
      analysis.explainability.positives.forEach((item) => doc.fontSize(11).text(`• ${item}`));
    }

    if (analysis.explainability?.negatives?.length) {
      doc.moveDown(0.5);
      doc.fontSize(13).fillColor('#b45309').text('Risks');
      analysis.explainability.negatives.forEach((item) => doc.fontSize(11).text(`• ${item}`));
    }

    if (analysis.recommendations?.length) {
      doc.moveDown();
      doc.fontSize(16).fillColor('#0f172a').text('Recommendations');
      analysis.recommendations.forEach((rec) => doc.fontSize(11).fillColor('#1e293b').text(`• ${rec}`));
    }

    doc.end();

    return doc;
  },
};

