const express = require('express');
const PDFDocument = require('pdfkit');
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, course, date } = req.body;
  if (!name || !course || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=certificate-${name}.pdf`);
  doc.pipe(res);

  // Handle PDF stream errors
  doc.on('error', (err) => {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate certificate' });
    }
  });

  // Add logo at the top (replace with your logo path if available)
  try {
    doc.image('logo.png', doc.page.width / 2 - 40, 30, { width: 80 });
  } catch (e) { /* ignore if logo not found */ }

  // Set background color (draw a filled rectangle)
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8fafc');
  doc.fillColor('#223');

  // Draw blue border
  const borderMargin = 20;
  doc.save();
  doc.lineWidth(3);
  doc.strokeColor('#2563eb');
  doc.rect(borderMargin, borderMargin, doc.page.width - 2 * borderMargin, doc.page.height - 2 * borderMargin).stroke();
  doc.restore();

  // Decorative stars (simple dots and crosses, blue and gold)
  function drawStar(x, y, color = '#2563eb') {
    doc.save();
    doc.fillColor(color);
    doc.circle(x, y, 2).fill();
    doc.restore();
  }
  function drawCross(x, y, color = '#fbbf24') {
    doc.save();
    doc.strokeColor(color);
    doc.moveTo(x - 3, y).lineTo(x + 3, y).stroke();
    doc.moveTo(x, y - 3).lineTo(x, y + 3).stroke();
    doc.restore();
  }
  // Place a few stars/crosses
  drawStar(60, 60, '#2563eb'); drawStar(doc.page.width - 60, 80, '#fbbf24');
  drawCross(100, 200, '#fbbf24'); drawCross(doc.page.width - 100, 250, '#2563eb');
  drawStar(200, 120, '#fbbf24'); drawCross(300, 400, '#2563eb'); drawStar(doc.page.width - 150, doc.page.height - 100, '#2563eb');

  // Title
  doc.font('Helvetica-Bold').fontSize(48).fillColor('#223').text('Certificate', 0, 100, { align: 'center' });
  // Horizontal line under title
  doc.save();
  doc.moveTo(doc.page.width / 2 - 120, 150).lineTo(doc.page.width / 2 + 120, 150).lineWidth(2).strokeColor('#2563eb').stroke();
  doc.restore();

  // Name (large, gold, underlined)
  doc.moveDown(2);
  doc.font('Helvetica-Bold').fontSize(36).fillColor('#fbbf24').text(name, { align: 'center', underline: true });

  // Description (centered)
  doc.moveDown(1);
  doc.font('Helvetica').fontSize(16).fillColor('#223').text(
    'This certificate is awarded to the above named for successful completion of the course/quiz.',
    { align: 'center', width: doc.page.width - 120, lineGap: 4 }
  );
  doc.moveDown(1);
  doc.font('Helvetica').fontSize(13).fillColor('#223').text(
    'We congratulate you on your achievement and wish you continued success.',
    { align: 'center', width: doc.page.width - 120, lineGap: 4 }
  );

  // Signature and Date lines (bottom, more elegant)
  const y = doc.page.height - 120;
  // Signature line
  doc.save();
  doc.strokeColor('#2563eb');
  doc.lineWidth(1.5);
  doc.moveTo(100, y).lineTo(260, y).stroke();
  doc.restore();
  doc.font('Helvetica').fontSize(13).fillColor('#223').text('Signature', 100, y + 8, { align: 'left', width: 160 });
  doc.font('Helvetica-Bold').fontSize(15).fillColor('#2563eb').text('deepak', 100, y - 28, { align: 'left', width: 160 });
  // Date value above date line
  doc.font('Helvetica-Bold').fontSize(15).fillColor('#2563eb').text(date, doc.page.width - 260, y - 28, { align: 'left', width: 160 });
  // Date line
  doc.save();
  doc.strokeColor('#2563eb');
  doc.lineWidth(1.5);
  doc.moveTo(doc.page.width - 260, y).lineTo(doc.page.width - 100, y).stroke();
  doc.restore();
  doc.font('Helvetica').fontSize(13).fillColor('#223').text('Date', doc.page.width - 260, y + 8, { align: 'left', width: 160 });

  doc.end();
});

module.exports = router; 