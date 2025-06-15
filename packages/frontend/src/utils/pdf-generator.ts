import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { QuoteWithFullDetails } from '@/services/quote.service';

export const generateQuotePDF = (quote: QuoteWithFullDetails) => {
  const doc = new jsPDF();
  
  // Company header
  doc.setFontSize(20);
  doc.text('Al Laith Projects Services', 20, 20);
  doc.setFontSize(10);
  doc.text('Equipment Rental Services', 20, 28);
  doc.text('Phone: 0800 123 4567', 20, 34);
  doc.text('Email: quotes@allaithprojects.com', 20, 40);
  
  // Quote title
  doc.setFontSize(16);
  doc.text(`Quote #${quote.quoteNumber}`, 20, 60);
  
  // Quote details
  doc.setFontSize(10);
  doc.text(`Date: ${format(new Date(quote.createdAt), 'dd/MM/yyyy')}`, 20, 70);
  doc.text(`Status: ${quote.status.toUpperCase()}`, 20, 76);
  
  // Customer section
  doc.setFontSize(12);
  doc.text('Customer Details', 20, 90);
  doc.setFontSize(10);
  // Note: In real implementation, customer details would come from the quote
  doc.text('Customer name and details would appear here', 20, 98);
  
  // Equipment items table
  let yPosition = 115;
  doc.setFontSize(12);
  doc.text('Equipment Items', 20, yPosition);
  yPosition += 10;
  
  // Table headers
  doc.setFontSize(10);
  doc.text('Equipment', 20, yPosition);
  doc.text('Period', 80, yPosition);
  doc.text('Days', 120, yPosition);
  doc.text('Rate', 140, yPosition);
  doc.text('Total', 170, yPosition);
  
  // Draw line
  doc.line(20, yPosition + 2, 190, yPosition + 2);
  yPosition += 8;
  
  // Table rows
  quote.items.forEach((item) => {
    doc.text(item.equipment.name, 20, yPosition);
    doc.text(
      `${format(new Date(item.startDate), 'dd/MM')} - ${format(new Date(item.endDate), 'dd/MM')}`,
      80,
      yPosition
    );
    doc.text(item.duration.toString(), 120, yPosition);
    doc.text(`£${item.dailyRate.toFixed(2)}`, 140, yPosition);
    doc.text(`£${item.totalPrice.toFixed(2)}`, 170, yPosition);
    yPosition += 6;
  });
  
  // Services section (if any)
  if (quote.services && quote.services.length > 0) {
    yPosition += 10;
    doc.setFontSize(12);
    doc.text('Additional Services', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    quote.services.forEach((service) => {
      doc.text(service.service.name, 20, yPosition);
      doc.text(`£${service.totalPrice.toFixed(2)}`, 170, yPosition);
      yPosition += 6;
    });
  }
  
  // Totals
  yPosition += 10;
  doc.line(140, yPosition, 190, yPosition);
  yPosition += 6;
  
  const subtotal = quote.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const servicesTotal = quote.services?.reduce((sum, service) => sum + service.totalPrice, 0) || 0;
  const totalBeforeVAT = subtotal + servicesTotal;
  const vatAmount = totalBeforeVAT * quote.vatRate;
  const totalAmount = totalBeforeVAT + vatAmount;
  
  doc.text('Subtotal:', 140, yPosition);
  doc.text(`£${totalBeforeVAT.toFixed(2)}`, 170, yPosition);
  yPosition += 6;
  
  doc.text(`VAT (${(quote.vatRate * 100).toFixed(0)}%):`, 140, yPosition);
  doc.text(`£${vatAmount.toFixed(2)}`, 170, yPosition);
  yPosition += 6;
  
  doc.setFontSize(12);
  doc.text('Total:', 140, yPosition);
  doc.text(`£${totalAmount.toFixed(2)}`, 170, yPosition);
  
  // Notes section
  if (quote.notes) {
    yPosition += 15;
    doc.setFontSize(12);
    doc.text('Notes:', 20, yPosition);
    yPosition += 8;
    doc.setFontSize(10);
    
    // Split notes into lines
    const notes = doc.splitTextToSize(quote.notes, 170);
    notes.forEach((line: string) => {
      doc.text(line, 20, yPosition);
      yPosition += 6;
    });
  }
  
  // Footer
  doc.setFontSize(8);
  doc.text('This quote is valid for 30 days from the date of issue.', 20, 270);
  doc.text('Terms and conditions apply.', 20, 275);
  
  // Save the PDF
  doc.save(`quote-${quote.quoteNumber}.pdf`);
}; 