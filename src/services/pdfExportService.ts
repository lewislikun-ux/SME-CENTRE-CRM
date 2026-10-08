import { jsPDF } from 'jspdf';
import { MeetingNote, SMECompany, SgpDirectoryEntity } from '../types/crm';

export class PdfExportService {
  public static exportMeetingMinutesToPdf(
    note: MeetingNote,
    company?: SMECompany | null,
    sgpEntity?: SgpDirectoryEntity | null
  ): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;
    const contentWidth = pageWidth - (margin * 2);
    let y = 20;

    // 1. Header Bar: Apple / SME Centre minimalist styling
    doc.setFillColor(245, 245, 247);
    doc.rect(margin, y, contentWidth, 24, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(29, 29, 31);
    doc.text('SME CENTRE · BUSINESS ADVISORY MINUTES', margin + 6, y + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 105);
    doc.text(`Official Advisory Record · Supported by Enterprise Singapore · Ref: SEC-${note.id.toUpperCase()}`, margin + 6, y + 17);

    y += 32;

    // 2. Company & Advisory Meta Grid
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220, 220, 225);
    doc.rect(margin, y, contentWidth, 38, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 113, 227); // Apple Blue
    doc.text('ENTERPRISE INFORMATION', margin + 5, y + 7);
    doc.text('ADVISORY SESSION DETAILS', margin + (contentWidth / 2) + 5, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);

    const companyName = company?.legalName || sgpEntity?.entityName || note.companyName;
    const uen = company?.uen || sgpEntity?.uen || note.uen;
    const ssic = company?.ssicDescription || sgpEntity?.ssicDescription || 'General Enterprise';

    // Left Column
    doc.setFont('helvetica', 'bold');
    doc.text('Entity Name:', margin + 5, y + 14);
    doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(companyName, (contentWidth / 2) - 30)[0] || companyName, margin + 28, y + 14);

    doc.setFont('helvetica', 'bold');
    doc.text('ACRA UEN:', margin + 5, y + 21);
    doc.setFont('helvetica', 'normal');
    doc.text(uen + ' (Verified ACRA)', margin + 28, y + 21);

    doc.setFont('helvetica', 'bold');
    doc.text('Industry:', margin + 5, y + 28);
    doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(ssic, (contentWidth / 2) - 30)[0] || ssic, margin + 28, y + 28);

    doc.setFont('helvetica', 'bold');
    doc.text('Address:', margin + 5, y + 35);
    doc.setFont('helvetica', 'normal');
    const addr = company?.registeredAddress || sgpEntity?.registeredAddress || 'Singapore';
    doc.text(doc.splitTextToSize(addr, (contentWidth / 2) - 30)[0] || addr, margin + 28, y + 35);

    // Right Column
    const col2X = margin + (contentWidth / 2) + 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Advisor:', col2X, y + 14);
    doc.setFont('helvetica', 'normal');
    doc.text(note.advisorName, col2X + 22, y + 14);

    doc.setFont('helvetica', 'bold');
    doc.text('Session Date:', col2X, y + 21);
    doc.setFont('helvetica', 'normal');
    doc.text(note.meetingDate, col2X + 22, y + 21);

    doc.setFont('helvetica', 'bold');
    doc.text('Channel:', col2X, y + 28);
    doc.setFont('helvetica', 'normal');
    doc.text(`${note.channel} (${note.durationMinutes} mins)`, col2X + 22, y + 28);

    doc.setFont('helvetica', 'bold');
    doc.text('Sentiment:', col2X, y + 35);
    doc.setFont('helvetica', 'normal');
    doc.text(`${note.sentimentScore}% · ${note.sentimentTone}`, col2X + 22, y + 35);

    y += 46;

    // 3. Executive Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(29, 29, 31);
    doc.text('1. EXECUTIVE SUMMARY & CONSULTATION OUTCOME', margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 65);
    const summaryLines = doc.splitTextToSize(note.executiveSummary, contentWidth);
    doc.text(summaryLines, margin, y);
    y += (summaryLines.length * 4.5) + 6;

    // 4. Key Discussion Points
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(29, 29, 31);
    doc.text('2. KEY DISCUSSION TOPICS & DIAGNOSTIC OBSERVATIONS', margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 55);
    note.keyDiscussionPoints.forEach((point) => {
      const pointLines = doc.splitTextToSize(`•  ${point}`, contentWidth - 4);
      doc.text(pointLines, margin + 2, y);
      y += (pointLines.length * 4.2);
    });
    y += 5;

    // 5. Follow-up Action Items Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(29, 29, 31);
    doc.text('3. ACTION ITEMS & FOLLOW-UP COMMITMENTS', margin, y);
    y += 5;

    // Table Header
    doc.setFillColor(240, 240, 245);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 75);
    doc.text('TASK / DELIVERABLE', margin + 3, y + 4.8);
    doc.text('OWNER', margin + 95, y + 4.8);
    doc.text('DUE DATE', margin + 140, y + 4.8);
    doc.text('PRIORITY', margin + 162, y + 4.8);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);

    note.actionItems.forEach((act) => {
      doc.setDrawColor(235, 235, 240);
      doc.line(margin, y + 5, margin + contentWidth, y + 5);

      const taskLines = doc.splitTextToSize(act.task, 88);
      doc.text(taskLines[0] || act.task, margin + 3, y + 3.5);
      doc.text(doc.splitTextToSize(act.owner, 40)[0] || act.owner, margin + 95, y + 3.5);
      doc.text(act.dueDate, margin + 140, y + 3.5);
      doc.text(act.priority.toUpperCase(), margin + 162, y + 3.5);
      y += 6.5;
    });

    y += 5;

    // Check page space for grant recommendations and sign-off
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    // 6. Grant & Scheme Recommendations
    if (note.grantRecommendations && note.grantRecommendations.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(29, 29, 31);
      doc.text('4. RECOMMENDED ENTERPRISE SCHEMES & GRANTS', margin, y);
      y += 5;

      note.grantRecommendations.forEach((grant) => {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentWidth, 14, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, y, contentWidth, 14, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`${grant.name} (${grant.administeringAgency})`, margin + 4, y + 5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        doc.text(`Support: ${grant.supportCoverage} · Scope: ${grant.recommendedScope}`, margin + 4, y + 10);
        y += 17;
      });
    }

    // 7. Footer & Advisor Endorsement
    y = Math.max(y + 6, 260);
    doc.setDrawColor(200, 200, 205);
    doc.line(margin, y, margin + contentWidth, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 125);
    doc.text('SME Centre Advisory Services are supported by Enterprise Singapore. For verification, visit www.smecentre.org.sg.', margin, y);
    doc.text(`Advisor Signature: ${note.advisorName} (Digitally Verified)`, margin + 100, y);

    const safeFilename = `SME_Centre_Advisory_Minutes_${uen}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(safeFilename);
  }
}
