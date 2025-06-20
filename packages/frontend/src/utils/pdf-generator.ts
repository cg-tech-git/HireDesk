import jsPDF from 'jspdf';
import { SavedQuote } from '@/store/savedQuotesSlice';
import { format } from 'date-fns';

// Helper function to get rate and period information (matches frontend logic)
const getRateAndPeriod = (days: number) => {
  if (days >= 1 && days <= 7) {
    return { rate: 700, period: 'Daily' }; // Default daily rate
  } else if (days >= 8 && days <= 14) {
    return { rate: 2000, period: 'Weekly' }; // Default weekly rate
  } else if (days >= 15) {
    return { rate: 3500, period: 'Monthly' }; // Default monthly rate
  }
  return { rate: 700, period: 'Daily' };
};

// Helper function to calculate amount based on period
const calculateAmount = (rate: number, period: string, days: number) => {
  if (period === 'Daily') {
    return rate * days;
  } else if (period === 'Weekly') {
    const weeks = days / 7;
    return rate * weeks;
  } else if (period === 'Monthly') {
    const months = Math.max(1, days / 30);
    return rate * months;
  }
  return rate * days; // Fallback
};

export const generateQuotePDF = (quote: SavedQuote): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 20;

  // Helper function to add text
  const addText = (text: string, x: number, y: number, options?: any) => {
    doc.text(text, x, y, options);
  };

  // Header Section - Title and Logo Row (matching modal layout)
  doc.setFontSize(18);
  doc.setTextColor(24, 48, 87); // #183057
  addText('HireDesk Quotation', 20, currentY);
  
  // Add Alps logo on the right (centered with title text)
  try {
    const logoWidth = 30; // Width in PDF units
    const logoHeight = 15; // Height in PDF units
    const logoX = pageWidth - 20 - logoWidth;
    const logoY = currentY - (logoHeight / 2) - 3; // Center logo with title text

    // Add the actual Alps logo using direct path
    doc.addImage('/images/brands/alps_logo.png', 'PNG', logoX, logoY, logoWidth, logoHeight);
  } catch (error) {
    console.error('Failed to load logo:', error);
    doc.setFontSize(12);
    doc.setTextColor(24, 48, 87);
    addText('Al Laith Projects Services', pageWidth - 20, currentY, { align: 'right' });
  }
  
  currentY += 15;
  
  // Details Row - Two columns layout (matching modal layout)
  doc.setFontSize(9);
  doc.setTextColor(24, 48, 87);
  
  // Left column - Quote details
  const leftStartY = currentY;
  addText(`Quote #: ${quote.quoteNumber}`, 20, currentY);
  currentY += 5;
  addText(`Date: ${format(new Date(quote.createdAt), 'dd/MM/yyyy')}`, 20, currentY);
  currentY += 5;
  addText('Phone: +971 4443 6360', 20, currentY);
  currentY += 5;
  addText('Email: info@allaith.com', 20, currentY);
  
  // Right column - Customer details (aligned right)
  let rightY = leftStartY;
  addText(`Customer: ${quote.customer.company || 'Demo Customer'}`, pageWidth - 20, rightY, { align: 'right' });
  rightY += 5;
  addText(`Name: ${quote.customer.name}`, pageWidth - 20, rightY, { align: 'right' });
  rightY += 5;
  addText(`Email: ${quote.customer.email}`, pageWidth - 20, rightY, { align: 'right' });
  rightY += 5;
  addText(`Contact: ${quote.customer.phone}`, pageWidth - 20, rightY, { align: 'right' });
  
  // Set currentY to the maximum of both columns
  currentY = Math.max(currentY, rightY);
  
  currentY += 8;
  
  // Add divider line
  doc.setDrawColor(224, 224, 224);
  doc.line(20, currentY, pageWidth - 20, currentY);
  currentY += 10;
  
  // Project Reference - Above table headers (matching modal layout)
  if (quote.projectRef) {
    doc.setFontSize(11);
    doc.setTextColor(24, 48, 87);
    addText(`Project: ${quote.projectRef}`, 20, currentY);
    currentY += 15;
  }
  
  // Table Headers (matching modal layout exactly)
  doc.setFontSize(8);
  doc.setTextColor(24, 48, 87);
  doc.setFont(undefined, 'bold');
  
  addText('Equipment', 20, currentY);
  addText('Start', 80, currentY);
  addText('End', 105, currentY);
  addText('Days', 125, currentY, { align: 'center' });
  addText('Rate', 145, currentY, { align: 'right' });
  addText('Period', 165, currentY, { align: 'center' });
  addText('Amount', pageWidth - 20, currentY, { align: 'right' });
  
  // Add header underline
  currentY += 2;
  doc.setDrawColor(238, 238, 238);
  doc.line(20, currentY, pageWidth - 20, currentY);
  currentY += 8;
  
  // Reset font for items
  doc.setFont(undefined, 'normal');
  doc.setTextColor(24, 48, 87);
  


  // Add items (matching modal layout)
  quote.items.forEach((item, index) => {
    item.dates.forEach((date, dateIndex) => {
      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }
      
      // Alternate row background (matching modal)
      if ((index + dateIndex) % 2 === 0) {
        doc.setFillColor(248, 249, 250);
        doc.rect(20, currentY - 3, pageWidth - 40, 10, 'F');
      }
      
      const days = date.startDate && date.endDate 
        ? Math.ceil((new Date(date.endDate).getTime() - new Date(date.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
        : 0;

      // Get rate and period information based on days
      const { rate, period } = getRateAndPeriod(days);
      const totalAmount = calculateAmount(rate, period, days);
      
      doc.setFontSize(8);
      doc.setTextColor(24, 48, 87);
      
      // Equipment name (bold, matching modal)
      doc.setFont(undefined, 'bold');
      addText(item.modelName, 20, currentY);
      
      // Equipment category (smaller, italic, gray - matching modal)
      doc.setFont(undefined, 'italic');
      doc.setFontSize(7);
      doc.setTextColor(108, 117, 125); // #6c757d
      addText(item.category || '', 20, currentY + 4);
      
      // Reset font and color for other columns
      doc.setFont(undefined, 'normal');
      doc.setFontSize(8);
      doc.setTextColor(24, 48, 87);
      addText(date.startDate ? format(new Date(date.startDate), 'dd/MM/yyyy') : '-', 80, currentY);
      addText(date.endDate ? format(new Date(date.endDate), 'dd/MM/yyyy') : '-', 105, currentY);
      addText(days.toString(), 125, currentY, { align: 'center' });
      addText(rate.toFixed(2), 145, currentY, { align: 'right' });
      addText(period, 165, currentY, { align: 'center' });
      addText(totalAmount.toFixed(2), pageWidth - 20, currentY, { align: 'right' });
      
      currentY += 12; // Spacing to accommodate category text
    });
  });
  
  currentY += 10;
  
  // Add divider before totals
  doc.setDrawColor(224, 224, 224);
  doc.line(20, currentY, pageWidth - 20, currentY);
  currentY += 15;
  
  // Totals section (matching modal layout with right alignment)
  doc.setFontSize(9);
  doc.setTextColor(24, 48, 87);
  doc.setFont(undefined, 'normal');
  
  addText('Subtotal:', 140, currentY);
  addText(quote.totals.subtotal.toFixed(2), pageWidth - 20, currentY, { align: 'right' });
  
  currentY += 8;
  addText('VAT (5%):', 140, currentY);
  addText(quote.totals.vat.toFixed(2), pageWidth - 20, currentY, { align: 'right' });
  
  currentY += 8;
  
  // Add line above total (matching modal)
  doc.setDrawColor(224, 224, 224);
  doc.line(140, currentY, pageWidth - 20, currentY);
  currentY += 8;
  
  // Total (bold, matching modal)
  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  addText('Total:', 140, currentY);
  addText(quote.totals.total.toFixed(2), pageWidth - 20, currentY, { align: 'right' });

  // Simple demo footer
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerY = pageHeight - 20;
  
  // Add footer line
  doc.setDrawColor(224, 224, 224);
  doc.line(20, footerY - 10, pageWidth - 20, footerY - 10);
  
  // Add footer text with proper wrapping
  doc.setFont(undefined, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(24, 48, 87);
  const footerText = 'Thank you for using HireDesk quote automation. A member of our team will contact you at the earliest opportunity to discuss your project requirements. Please note that prices and equipment availability are indicative and subject to final confirmation.';
  const footerLines = doc.splitTextToSize(footerText, pageWidth - 40);
  let textY = footerY;
  footerLines.forEach((line: string) => {
    addText(line, 20, textY);
    textY += 4;
  });
  
  // Add Privacy Policy and Terms of Service links
  textY += 4; // Add some spacing
  doc.setFontSize(7);
  const linksText = 'Privacy Policy · Terms of Service';
  const textWidth = doc.getStringUnitWidth(linksText) * 7 / doc.internal.scaleFactor;
  const centerX = (pageWidth - textWidth) / 2;
  addText(linksText, centerX, textY);

  return doc;
};

export const downloadQuotePDF = (quote: SavedQuote) => {
  const pdf = generateQuotePDF(quote);
  pdf.save(`quote-${quote.quoteNumber}.pdf`);
};

export const openQuotePDFInNewTab = (quote: SavedQuote) => {
  const pdf = generateQuotePDF(quote);
  const pdfBlob = pdf.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
}; 