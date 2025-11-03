import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import logoImage from '../assets/img/bb-logo.png';
import signatureImage from '../assets/img/sign.png';
import fallbackAvatarImage from '../assets/img/fallback-avatar.png';

// Helper function to escape CSV fields
const escapeCSVField = (field) => {
  if (field === null || field === undefined) {
    return '';
  }
  
  const stringField = String(field);
  
  // If field contains comma, double quote, or newline, wrap in quotes and escape quotes
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  
  return stringField;
};

export const downloadTeachersTableCSV = (teachers) => {
  if (teachers.length === 0) {
    throw new Error('No teachers data to export');
  }

  // Define CSV headers
  const headers = ['#', 'Teacher ID', 'Name', 'Designation', 'Email', 'Mobile', 'Address'];
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  // Add data rows
  teachers.forEach((teacher, index) => {
    const row = [
      index + 1,
      escapeCSVField(teacher.teacherId || 'N/A'),
      escapeCSVField(teacher.name || 'N/A'),
      escapeCSVField(teacher.designation || 'N/A'),
      escapeCSVField(teacher.email || 'N/A'),
      escapeCSVField(teacher.mobile || 'N/A'),
      escapeCSVField(teacher.address || 'N/A')
    ];
    csvContent += row.join(',') + '\n';
  });

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    // Create download link
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `teachers_list_${timestamp}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    // Append to document, click, and cleanup
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
};

export const downloadTeachersTableExcel = (teachers) => {
  if (teachers.length === 0) {
    throw new Error('No teachers data to export');
  }

  // Prepare data for Excel
  const headers = ['#', 'Teacher ID', 'Name', 'Designation', 'Email', 'Mobile', 'Address'];
  
  // Create worksheet data
  const worksheetData = [
    headers,
    ...teachers.map((teacher, index) => [
      index + 1,
      teacher.teacherId || 'N/A',
      teacher.name || 'N/A',
      teacher.designation || 'N/A',
      teacher.email || 'N/A',
      teacher.mobile || 'N/A',
      teacher.address || 'N/A'
    ])
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths (in characters)
  worksheet['!cols'] = [
    { wch: 5 },   // #
    { wch: 20 },  // Teacher ID
    { wch: 25 },  // Name
    { wch: 20 },  // Designation
    { wch: 30 },  // Email
    { wch: 15 },  // Mobile
    { wch: 35 }   // Address
  ];

  // Style the header row
  const headerCellStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "1E40AF" } },
    alignment: { horizontal: "center", vertical: "center" }
  };

  // Apply header styles
  headers.forEach((_, index) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = headerCellStyle;
    }
  });

  // Add auto-filter to header row
  worksheet['!autofilter'] = { ref: `A1:G${teachers.length + 1}` };

  // Create workbook and add worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Teachers List');

  // Add metadata
  workbook.Props = {
    Title: 'Teachers List',
    Subject: 'Teachers Data Export',
    Author: 'Teachers Management System',
    CreatedDate: new Date()
  };

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `teachers_list_${timestamp}.xlsx`;

  // Write and download file
  XLSX.writeFile(workbook, filename);
};

export const downloadTeachersTablePDF = async (teachers) => {
  if (teachers.length === 0) {
    throw new Error('No teachers data to export');
  }

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Add header with logo and title
  try {
    const logoWidth = 35;
    const logoHeight = 10;
    const logoX = 10;
    const logoY = 10;
    doc.addImage(logoImage, 'PNG', logoX, logoY, logoWidth, logoHeight);
  } catch (error) {
    console.warn('Could not load logo image:', error);
  }

  // Title with decorative line
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Teachers List', pageWidth / 2, 17, { align: 'center' });
  
  // Decorative line under title
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(0.8);
  const lineStartX = pageWidth / 2 - 30;
  const lineEndX = pageWidth / 2 + 30;
  doc.line(lineStartX, 19.5, lineEndX, 19.5);

  // Subtitle with date
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Generated on: ${currentDate}`, pageWidth / 2, 25, { align: 'center' });

  // Prepare table data
  const tableData = teachers.map((teacher, index) => [
    index + 1,
    teacher.teacherId || 'N/A',
    teacher.name || 'N/A',
    teacher.designation || 'N/A',
    teacher.email || 'N/A',
    teacher.mobile || 'N/A',
    teacher.address || 'N/A'
  ]);

  // Add table using autoTable plugin
  try {
    autoTable(doc, {
    startY: 38,
    head: [['#', 'Teacher ID', 'Name', 'Designation', 'Email', 'Mobile', 'Address']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: { top: 4, right: 5, bottom: 4, left: 5 },
      overflow: 'linebreak',
      halign: 'left',
      valign: 'middle',
      lineColor: [200, 210, 220],
      lineWidth: 0.2,
      textColor: [40, 40, 40],
      font: 'helvetica'
    },
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 11,
      cellPadding: { top: 6, right: 5, bottom: 6, left: 5 },
      lineWidth: 0.3,
      lineColor: [20, 50, 150]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    bodyStyles: {
      fillColor: [255, 255, 255]
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center', fontStyle: 'bold', fontSize: 11 },
      1: { cellWidth: 38, fontSize: 10, fontStyle: 'bold' },
      2: { cellWidth: 45, fontSize: 10, fontStyle: 'bold', textColor: [30, 64, 175] },
      3: { cellWidth: 38, fontSize: 10 },
      4: { cellWidth: 55, fontSize: 9.5, textColor: [80, 80, 80] },
      5: { cellWidth: 32, fontSize: 10, fontStyle: 'bold' },
      6: { cellWidth: 60, fontSize: 9.5 }
    },
    margin: { top: 30, right: 10, bottom: 20, left: 10 },
    didDrawPage: (data) => {
      // Enhanced Footer
      const pageCount = doc.internal.getNumberOfPages();
      const currentPageNumber = doc.internal.getCurrentPageInfo().pageNumber;
      
      // Footer background bar
      doc.setFillColor(248, 250, 252);
      doc.rect(0, pageHeight - 18, pageWidth, 18, 'F');
      
      // Footer top line
      doc.setDrawColor(30, 64, 175);
      doc.setLineWidth(0.6);
      doc.line(10, pageHeight - 18, pageWidth - 10, pageHeight - 18);
      
      // Page number
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 64, 175);
      doc.text(
        `Page ${currentPageNumber} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      
      // Footer text on sides
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
    }
    });
  } catch (error) {
    console.error('PDF Generator - Error adding table:', error);
    throw new Error('Failed to generate table: ' + error.message);
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `teachers_list_${timestamp}.pdf`;

  doc.save(filename);
};

export const downloadTeacherCardsPDF = async (selectedTeacherIds, allTeachers) => {
  const selectedTeachers = allTeachers.filter(teacher =>
    selectedTeacherIds.includes(teacher.id)
  );

  if (selectedTeachers.length === 0) {
    throw new Error('No teachers selected');
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [85.6, 127]
  });

  const cardWidth = 85.6;
  const cardHeight = 127;
  const primaryBlue = '#1e40af';
  const lightBlue = '#3b82f6';
  const footerBlue = '#2563eb';

  selectedTeachers.forEach((teacher, index) => {
    if (index > 0) {
      doc.addPage();
    }

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, cardWidth, cardHeight, 'F');

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(1, 1, cardWidth - 2, cardHeight - 2);

    // Logo image - centered with proper aspect ratio
    const logoWidth = 42;
    const logoHeight = 12; // Maintain proper aspect ratio (2:1)
    const logoX = (cardWidth - logoWidth) / 2;
    const logoY = 7;
    
    try {
      // Add the logo image with proper dimensions to prevent compression
      doc.addImage(logoImage, 'PNG', logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
      console.warn('Could not load logo image, using fallback:', error);
      // Fallback to drawn logo if image fails to load
      doc.setFillColor(100, 116, 139);
      doc.rect(logoX, logoY, logoWidth, logoHeight, 'F');
      doc.setFillColor(30, 64, 175);
      doc.rect(logoX + 2, logoY + 2, logoWidth - 2, logoHeight - 2, 'F');
    }
    
    // Margin bottom after logo: 8mm (~20px) of empty space for better layout
    const logoMarginBottom = 7;

    const avatarCenterX = cardWidth / 2;
    const avatarCenterY = 35 + logoMarginBottom;
    const avatarRadius = 12;

    // Try to use teacher's profile image if available and valid string
    if (typeof teacher.profileImage === 'string' && teacher.profileImage.trim() !== '') {
      try {
        // Add teacher's profile image as avatar
        doc.addImage(teacher.profileImage, 'PNG', avatarCenterX - avatarRadius, avatarCenterY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
      } catch (error) {
        console.warn('Could not load teacher profile image, using fallback avatar image:', error);
        // Fallback to fallback avatar image if teacher image fails to load
        try {
          doc.addImage(fallbackAvatarImage, 'PNG', avatarCenterX - avatarRadius, avatarCenterY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
        } catch (fallbackError) {
          console.error('Could not load fallback avatar image:', fallbackError);
        }
      }
    } else {
      // Use fallback avatar image if no profile image is provided
      try {
        doc.addImage(fallbackAvatarImage, 'PNG', avatarCenterX - avatarRadius, avatarCenterY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
      } catch (error) {
        console.error('Could not load fallback avatar image:', error);
      }
    }

    // Teacher name - dynamic
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    const teacherName = teacher.name || 'Unknown Teacher';
    const nameWidth = doc.getTextWidth(teacherName);
    doc.text(teacherName, (cardWidth - nameWidth) / 2, 54 + logoMarginBottom);

    // Teacher ID - dynamic
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    const teacherId = teacher.teacherId || 'N/A';
    const idWidth = doc.getTextWidth(teacherId);
    doc.text(teacherId, (cardWidth - idWidth) / 2, 62 + logoMarginBottom);

    // Mobile number - dynamic
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const mobile = teacher.mobile || 'N/A';
    const mobileWidth = doc.getTextWidth(mobile);
    doc.text(mobile, (cardWidth - mobileWidth) / 2, 70 + logoMarginBottom);

    // Signature image
    const signatureWidth = 25;
    const signatureHeight = 8;
    const signatureX = (cardWidth - signatureWidth) / 2;
    const signatureY = 78 + logoMarginBottom;
    
    try {
      doc.addImage(signatureImage, 'PNG', signatureX, signatureY, signatureWidth, signatureHeight);
    } catch (error) {
      console.warn('Could not load signature image, using fallback:', error);
      // Fallback to text if image fails to load
      doc.setFontSize(11);
      doc.setFont('times', 'italic');
      doc.setTextColor(0, 0, 0);
      const signatureText = 'Bbnepal';
      const sigWidth = doc.getTextWidth(signatureText);
      doc.text(signatureText, (cardWidth - sigWidth) / 2, 85 + logoMarginBottom);
    }

    // Authorized Signature label
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    const authText = 'Authorized Signature';
    const authWidth = doc.getTextWidth(authText);
    doc.text(authText, (cardWidth - authWidth) / 2, 91 + logoMarginBottom);

    // Footer with address - dynamic
    doc.setFillColor(37, 99, 235);
    doc.rect(0, cardHeight - 15, cardWidth, 15, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    const addressText = typeof teacher.address === 'string' && teacher.address.trim() ? teacher.address : 'N/A';
    const addressWidth = doc.getTextWidth(addressText);
    doc.text(addressText, (cardWidth - addressWidth) / 2, cardHeight - 6);
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `teacher_cards_${timestamp}.pdf`;

  doc.save(filename);
};
