const asyncHandler = require('express-async-handler');
const PharmacyBill = require('../models/PharmacyBill');
const InventoryItem = require('../models/InventoryItem');
const PDFDocument = require('pdfkit');

const generateBillNumber = async () => {
  const date = new Date();
  const prefix = `PHY-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const lastBill = await PharmacyBill.findOne({ billNumber: new RegExp(`^${prefix}`) }).sort({ billNumber: -1 });
  let seq = 1;
  if (lastBill) {
    const parts = lastBill.billNumber.split('-');
    seq = parseInt(parts[3] || '0', 10) + 1;
  }
  return `${prefix}-${String(seq).padStart(3, '0')}`;
};

const createBill = asyncHandler(async (req, res) => {
  const { patient, hospital, items } = req.body;
  if (!patient || !patient.name || !items || items.length === 0) {
    res.status(400);
    throw new Error('Patient name and at least one item are required');
  }

  let subtotal = 0, totalGst = 0;
  const billItems = items.map((item, idx) => {
    const amount = item.quantity * item.rate;
    const gstAmount = (amount * item.gst) / 100;
    const totalAmount = amount + gstAmount;
    subtotal += amount;
    totalGst += gstAmount;
    return {
      serialNo: idx + 1,
      medicineName: item.medicineName,
      batch: item.batch || '',
      expiryDate: item.expiryDate || '',
      quantity: item.quantity,
      rate: item.rate,
      gst: item.gst,
      amount: Math.round(amount * 100) / 100,
      gstAmount: Math.round(gstAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
    };
  });

  const billNumber = await generateBillNumber();
  const bill = await PharmacyBill.create({
    billNumber,
    patient: {
      name: patient.name,
      address: patient.address || '',
      phone: patient.phone || '',
    },
    hospital: {
      name: hospital?.name || 'MediCare Hospital',
      address: hospital?.address || '',
      phone: hospital?.phone || '',
      gstNo: hospital?.gstNo || '',
      accountNo: hospital?.accountNo || '',
    },
    items: billItems,
    subtotal: Math.round(subtotal * 100) / 100,
    totalGst: Math.round(totalGst * 100) / 100,
    grandTotal: Math.round((subtotal + totalGst) * 100) / 100,
    createdBy: req.user._id,
  });

  // Reduce inventory quantities
  for (const item of items) {
    if (item.inventoryItemId) {
      await InventoryItem.findByIdAndUpdate(item.inventoryItemId, {
        $inc: { quantity: -item.quantity },
      });
    }
  }

  res.status(201).json(bill);
});

const getBills = asyncHandler(async (req, res) => {
  const bills = await PharmacyBill.find()
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
  res.json(bills);
});

const getBill = asyncHandler(async (req, res) => {
  const bill = await PharmacyBill.findById(req.params.id).populate('createdBy', 'name');
  if (bill) {
    res.json(bill);
  } else {
    res.status(404);
    throw new Error('Bill not found');
  }
});

const generatePDF = asyncHandler(async (req, res) => {
  const bill = await PharmacyBill.findById(req.params.id);
  if (!bill) {
    res.status(404);
    throw new Error('Bill not found');
  }

  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const filename = `Invoice-${bill.billNumber}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  doc.pipe(res);

  const pageWidth = doc.page.width - 80;
  const leftMargin = 40;

  // Helper to draw a line
  const drawLine = (y) => {
    doc.moveTo(leftMargin, y).lineTo(leftMargin + pageWidth, y).stroke('#333');
  };

  // Hospital Header
  doc.fontSize(20).font('Helvetica-Bold').text(bill.hospital.name, leftMargin, 40, { align: 'center' });
  doc.fontSize(9).font('Helvetica').text(
    [`${bill.hospital.address}`, `Phone: ${bill.hospital.phone}`, `GST No: ${bill.hospital.gstNo}`, `Account No: ${bill.hospital.accountNo}`].filter(Boolean).join(' | '),
    leftMargin, 65, { align: 'center', width: pageWidth }
  );

  drawLine(95);

  // Title
  doc.fontSize(16).font('Helvetica-Bold').text('PHARMACY INVOICE', leftMargin, 105, { align: 'center' });
  doc.fontSize(10).font('Helvetica').text(`Bill No: ${bill.billNumber}`, leftMargin, 125, { align: 'center' });
  doc.fontSize(10).text(`Date: ${new Date(bill.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, leftMargin, 140, { align: 'center' });

  drawLine(160);

  // Customer details
  doc.fontSize(11).font('Helvetica-Bold').text('Bill To:', leftMargin, 170);
  doc.fontSize(10).font('Helvetica').text(bill.patient.name, leftMargin, 185);
  if (bill.patient.address) doc.text(bill.patient.address, leftMargin, 200);
  if (bill.patient.phone) doc.text(`Phone: ${bill.patient.phone}`, leftMargin, bill.patient.address ? 215 : 200);

  drawLine(bill.patient.address || bill.patient.phone ? 235 : 210);

  // Table Header
  const tableTop = (bill.patient.address || bill.patient.phone ? 235 : 210) + 15;
  const colWidths = [22, 108, 60, 55, 35, 48, 38, 55, 70];
  const headers = ['#', 'Medicine Name', 'Batch', 'Expiry', 'Qty', 'Rate', 'GST%', 'GST Amt', 'Total'];

  doc.fontSize(8).font('Helvetica-Bold');
  let xPos = leftMargin;
  headers.forEach((h, i) => {
    doc.text(h, xPos, tableTop, { width: colWidths[i], align: i === 0 ? 'center' : 'left' });
    xPos += colWidths[i];
  });

  drawLine(tableTop + 15);

  // Table rows
  let yPos = tableTop + 22;
  doc.fontSize(8).font('Helvetica');
  bill.items.forEach((item, idx) => {
    if (yPos > doc.page.height - 60) {
      doc.addPage();
      yPos = 40;
    }

    const row = [
      String(item.serialNo),
      item.medicineName,
      item.batch,
      item.expiryDate,
      String(item.quantity),
      `Rs.${item.rate.toFixed(2)}`,
      `${item.gst}%`,
      `Rs.${item.gstAmount.toFixed(2)}`,
      `Rs.${item.totalAmount.toFixed(2)}`,
    ];

    xPos = leftMargin;
    row.forEach((val, i) => {
      doc.text(val, xPos, yPos, { width: colWidths[i], align: i === 0 ? 'center' : 'left' });
      xPos += colWidths[i];
    });

    yPos += 18;
  });

  drawLine(yPos);
  yPos += 10;

  // Totals section - right aligned
  const totalsX = leftMargin + pageWidth - 200;
  doc.fontSize(10);
  doc.font('Helvetica').text('Subtotal:', totalsX, yPos, { width: 100, align: 'right' });
  doc.text(`Rs.${bill.subtotal.toFixed(2)}`, totalsX + 105, yPos, { width: 95, align: 'right' });
  yPos += 18;

  doc.text('Total GST:', totalsX, yPos, { width: 100, align: 'right' });
  doc.text(`Rs.${bill.totalGst.toFixed(2)}`, totalsX + 105, yPos, { width: 95, align: 'right' });
  yPos += 18;

  doc.font('Helvetica-Bold').text('Grand Total:', totalsX, yPos, { width: 100, align: 'right' });
  doc.text(`Rs.${bill.grandTotal.toFixed(2)}`, totalsX + 105, yPos, { width: 95, align: 'right' });

  // Footer
  yPos = doc.page.height - 50;
  drawLine(yPos);
  doc.fontSize(8).font('Helvetica').text('Thank you for your visit! This is a computer-generated invoice.', leftMargin, yPos + 8, { align: 'center', width: pageWidth });

  doc.end();
});

module.exports = { createBill, getBills, getBill, generatePDF };
