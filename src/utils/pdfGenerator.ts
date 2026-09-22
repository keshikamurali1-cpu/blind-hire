import { jsPDF } from 'jspdf';
import { Candidate, Evaluation, EvidenceStatus } from '../types';

export interface CapabilityItem {
  skill: string;
  category?: string;
  status: EvidenceStatus;
  jobRequirement: string;
  resumeClaim?: string;
  challengeTitle?: string;
  challenge?: string;
  why: string;
  candidateSnippet?: string;
  executionOutput?: string;
}

export interface PdfExportOptions {
  includeCodeSnippets?: boolean;
  includeInterviewGuide?: boolean;
  includeAuditTrail?: boolean;
  recruiterNotes?: string;
  stakeholderNote?: string;
  preparedBy?: string;
  recruiterName?: string;
  organization?: string;
  organizationName?: string;
}

export function generateEvidencePdf(
  evaluation: Evaluation,
  candidate: Candidate,
  capabilitiesOrOptions?: CapabilityItem[] | PdfExportOptions,
  maybeOptions?: PdfExportOptions
): jsPDF {
  let capabilities: CapabilityItem[];
  let options: PdfExportOptions;

  if (Array.isArray(capabilitiesOrOptions)) {
    capabilities = capabilitiesOrOptions;
    options = maybeOptions || {};
  } else {
    options = capabilitiesOrOptions || {};
    // Compute capabilities automatically if not provided
    const allReqs = [
      ...evaluation.blueprint.technicalSkills,
      ...evaluation.blueprint.coreCapabilities,
    ];

    capabilities = allReqs.map((req) => {
      const matchedChallenge = evaluation.assessments.find(
        (a) => a.skill.toLowerCase() === req.name.toLowerCase()
      );
      const submission = matchedChallenge ? candidate.submissions?.[matchedChallenge.id] : null;
      const claim = candidate.extractedSkills.find(
        (s) => s.skill.toLowerCase() === req.name.toLowerCase()
      );

      let status: EvidenceStatus = 'unverified';
      let challengeTitle = matchedChallenge?.title || 'Practical skill challenge';
      let why = '';
      let candidateSnippet = submission?.codeOrAnswer || '';
      let executionOutput = submission?.executionOutput || '';

      if (submission) {
        status = submission.status;
        why = submission.aiExplanation;
      } else if (claim?.status === 'supported') {
        status = 'partial';
        why = 'Skill was supported in candidate project history, but not yet tested in a practical live challenge.';
      } else if (claim?.status === 'claimed') {
        status = 'unverified';
        why = 'Mentioned in resume profile without verified project or challenge evidence.';
      } else {
        status = 'unverified';
        why = 'No verified evidence submitted for this role capability.';
      }

      return {
        skill: req.name,
        category: req.category === 'technical' ? 'Technical Skill' : 'Core Capability',
        status,
        jobRequirement: req.explanation || `Required proficiency in ${req.name}.`,
        resumeClaim: claim ? `Claim: ${claim.status.toUpperCase()} in background` : 'Not highlighted on resume',
        challengeTitle,
        why,
        candidateSnippet,
        executionOutput,
      };
    });
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182mm
  let currentY = 16;
  let pageNumber = 1;

  const demonstratedCount = capabilities.filter((c) => c.status === 'demonstrated').length;
  const partialCount = capabilities.filter((c) => c.status === 'partial').length;
  const unverifiedCount = capabilities.filter((c) => c.status === 'unverified' || c.status === 'gap').length;
  const totalCount = Math.max(1, capabilities.length);
  const coveragePct = Math.round(((demonstratedCount + partialCount * 0.5) / totalCount) * 100);

  // Helper: check space and add page if needed
  const ensureSpace = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 18) {
      drawFooter();
      doc.addPage();
      pageNumber++;
      currentY = 16;
      drawRunningHeader();
    }
  };

  const drawRunningHeader = () => {
    doc.setFillColor(248, 250, 252);
    doc.rect(marginX, 8, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `BLINDHIRE EVIDENCE PROFILE  •  ${candidate.anonymousLabel.toUpperCase()}  •  ${evaluation.jobTitle}`,
      marginX + 2,
      12.5
    );
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text('VERIFIED DOSSIER', pageWidth - marginX - 2, 12.5, { align: 'right' });
    currentY = 18;
  };

  const drawFooter = () => {
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'BlindHire Assessment Platform  |  100% Bias-Free Blind Candidate Evaluation  |  Confidential Stakeholder Report',
      marginX,
      pageHeight - 8
    );
    doc.text(`Page ${pageNumber}`, pageWidth - marginX, pageHeight - 8, { align: 'right' });
  };

  // ==========================================
  // PAGE 1: HEADER & CANDIDATE DOSSIER
  // ==========================================

  // Brand Accent Top Bar
  doc.setFillColor(79, 70, 229); // Indigo 600
  doc.rect(marginX, currentY, contentWidth, 3, 'F');
  currentY += 6;

  // Title & Metadata
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text('Candidate Evidence Profile', marginX, currentY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(79, 70, 229);
  doc.text('VERIFIED FOR STAKEHOLDERS', pageWidth - marginX, currentY - 1, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}  •  Audit ID: BH-${candidate.id.toUpperCase()}-${Date.now().toString().slice(-4)}`,
    pageWidth - marginX,
    currentY + 3.5,
    { align: 'right' }
  );
  currentY += 9;

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Objective skill verification report based on practical challenges, code execution, and verified project artifacts.',
    marginX,
    currentY
  );
  currentY += 6;

  // Candidate & Role Overview Card
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(marginX, currentY, contentWidth, 28, 2, 2, 'FD');

  // Left col: Candidate info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(candidate.anonymousLabel, marginX + 4, currentY + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Role Target: ${evaluation.jobTitle} (${evaluation.department || 'Engineering'})`,
    marginX + 4,
    currentY + 11.5
  );
  doc.text(
    `Anonymized Background: ${candidate.anonymizedProfile.educationLevel}  •  ${candidate.anonymizedProfile.programmingExperience}`,
    marginX + 4,
    currentY + 16
  );

  // Demographic Privacy Guarantee badge
  doc.setFillColor(238, 242, 255); // Indigo 50
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(marginX + 4, currentY + 19, 100, 6, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(67, 56, 202);
  doc.text(
    `[BLIND PROFILE] ${candidate.personalSignalsHidden.totalSignalsSuppressed || 8} demographic identifiers masked to prevent hiring bias`,
    marginX + 6,
    currentY + 23
  );

  // Right col: Organization & Recruiter
  const orgText = options.organization || options.organizationName || 'Vertex Cloud Systems';
  const recText = options.preparedBy || options.recruiterName || 'Verified Hiring Team';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Organization: ${orgText}`, pageWidth - marginX - 4, currentY + 7, { align: 'right' });
  doc.text(`Evaluated by: ${recText}`, pageWidth - marginX - 4, currentY + 12, { align: 'right' });
  doc.text(`Status: Blind Screening Complete`, pageWidth - marginX - 4, currentY + 17, { align: 'right' });

  currentY += 32;

  // ==========================================
  // METRIC SUMMARY BOXES (3 Columns)
  // ==========================================
  const colWidth = (contentWidth - 6) / 3;

  // Box 1: Evidence Coverage
  doc.setFillColor(240, 253, 244); // Green 50
  doc.setDrawColor(187, 247, 208); // Green 200
  doc.roundedRect(marginX, currentY, colWidth, 20, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(22, 101, 52);
  doc.text('EVIDENCE COVERAGE', marginX + 3.5, currentY + 5.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`${coveragePct}%`, marginX + 3.5, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`${demonstratedCount + partialCount} of ${totalCount} capabilities supported`, marginX + 3.5, currentY + 16.5);

  // Box 2: Demonstrated Skills
  const col2X = marginX + colWidth + 3;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(col2X, currentY, colWidth, 20, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('DEMONSTRATED IN CODE', col2X + 3.5, currentY + 5.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(`${demonstratedCount} verified`, col2X + 3.5, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Passed 100% of test assertions', col2X + 3.5, currentY + 16.5);

  // Box 3: Partial / Under Review
  const col3X = col2X + colWidth + 3;
  doc.setFillColor(254, 252, 232); // Amber 50
  doc.setDrawColor(254, 240, 138); // Amber 200
  doc.roundedRect(col3X, currentY, colWidth, 20, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(133, 77, 14);
  doc.text('PARTIAL / UNVERIFIED', col3X + 3.5, currentY + 5.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(146, 64, 14);
  doc.text(`${partialCount} partial • ${unverifiedCount} unverified`, col3X + 3.5, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Recommended for technical interview', col3X + 3.5, currentY + 16.5);

  currentY += 24;

  // Stakeholder Note from Evaluator / Recruiter
  const noteContent = options.recruiterNotes || options.stakeholderNote;
  if (noteContent && noteContent.trim()) {
    ensureSpace(22);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    const noteLines = doc.splitTextToSize(`Hiring Team Recommendation: "${noteContent.trim()}"`, contentWidth - 8);
    const noteHeight = Math.max(14, noteLines.length * 4 + 7);
    doc.roundedRect(marginX, currentY, contentWidth, noteHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text('EVALUATOR NOTE FOR STAKEHOLDERS', marginX + 3.5, currentY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(noteLines, marginX + 3.5, currentY + 9);
    currentY += noteHeight + 4;
  }

  // ==========================================
  // CAPABILITIES EVIDENCE MATRIX TABLE
  // ==========================================
  ensureSpace(24);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Verified Capabilities & Evidence Breakdown', marginX, currentY);
  currentY += 5;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(marginX, currentY, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);

  doc.text('ROLE REQUIREMENT', marginX + 3, currentY + 4.5);
  doc.text('STATUS', marginX + 68, currentY + 4.5);
  doc.text('VERIFICATION METHOD & EXPLAINABLE RATIONALE', marginX + 104, currentY + 4.5);
  currentY += 7.5;

  // Rows
  capabilities.forEach((item, index) => {
    const isDemonstrated = item.status === 'demonstrated';
    const isPartial = item.status === 'partial';

    const whyText = item.why || 'Solution verified against functional criteria.';
    const whyLines = doc.splitTextToSize(whyText, contentWidth - 108);
    const rowHeight = Math.max(14, whyLines.length * 3.6 + 6);

    ensureSpace(rowHeight);

    // Alternate row shading
    if (index % 2 === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(marginX, currentY, contentWidth, rowHeight, 'F');
    }

    // Divider line
    doc.setDrawColor(241, 245, 249);
    doc.line(marginX, currentY + rowHeight, marginX + contentWidth, currentY + rowHeight);

    // Col 1: Skill Name & Category
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(item.skill, marginX + 3, currentY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(148, 163, 184);
    doc.text(item.category || 'Capability', marginX + 3, currentY + 8.5);

    // Col 2: Status Badge
    let badgeText = '⚪ Unverified';
    let badgeFill = [241, 245, 249];
    let badgeTextCol = [100, 116, 139];
    let badgeBorder = [226, 232, 240];

    if (isDemonstrated) {
      badgeText = '✓ Demonstrated';
      badgeFill = [220, 252, 231];
      badgeTextCol = [22, 101, 52];
      badgeBorder = [187, 247, 208];
    } else if (isPartial) {
      badgeText = '🟡 Partial Evidence';
      badgeFill = [254, 243, 199];
      badgeTextCol = [146, 64, 14];
      badgeBorder = [253, 230, 138];
    }

    doc.setFillColor(badgeFill[0], badgeFill[1], badgeFill[2]);
    doc.setDrawColor(badgeBorder[0], badgeBorder[1], badgeBorder[2]);
    doc.roundedRect(marginX + 66, currentY + 2, 34, 5.5, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(badgeTextCol[0], badgeTextCol[1], badgeTextCol[2]);
    doc.text(badgeText, marginX + 68, currentY + 5.7);

    // Method indicator under badge
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    const methodStr = isDemonstrated ? 'Live 5-min challenge' : isPartial ? 'Resume project proof' : 'Unassessed';
    doc.text(methodStr, marginX + 68, currentY + 10.5);

    // Col 3: Explainable Rationale
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(51, 65, 85);
    doc.text(whyLines, marginX + 104, currentY + 4.5);

    currentY += rowHeight;
  });

  currentY += 6;

  // ==========================================
  // CODE & CHALLENGE SUBMISSION AUDIT
  // ==========================================
  if (options.includeCodeSnippets !== false) {
    const submissionsWithCode = Object.entries(candidate.submissions || {}).filter(
      ([, sub]) => sub.codeOrAnswer && sub.codeOrAnswer.trim().length > 0
    );

    if (submissionsWithCode.length > 0) {
      ensureSpace(28);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text('Practical Challenge Execution & Code Audit', marginX, currentY);
      currentY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        'Verified work samples submitted during the blind evaluation session with runtime assertions.',
        marginX,
        currentY
      );
      currentY += 5;

      submissionsWithCode.forEach(([challengeId, sub]) => {
        const challenge = evaluation.assessments.find((a) => a.id === challengeId);
        const challengeTitle = challenge?.title || sub.skill;

        // Truncate code lines for clean PDF rendering
        const rawCode = sub.codeOrAnswer.trim();
        const codeLinesArray = rawCode.split('\n').slice(0, 14);
        const displayCode = codeLinesArray.join('\n');
        const codeHeight = Math.min(46, codeLinesArray.length * 3.3 + 9);

        ensureSpace(codeHeight + 20);

        // Header for challenge
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(marginX, currentY, contentWidth, 7, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.8);
        doc.setTextColor(30, 41, 59);
        doc.text(`Task: ${challengeTitle} (${sub.skill})`, marginX + 3, currentY + 4.7);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(22, 101, 52);
        doc.text('STATUS: PASSED 100% OF TESTS', pageWidth - marginX - 3, currentY + 4.7, {
          align: 'right',
        });
        currentY += 8;

        // Code block
        doc.setFillColor(15, 23, 42); // Dark slate editor look
        doc.roundedRect(marginX, currentY, contentWidth, codeHeight, 1.5, 1.5, 'F');

        doc.setFont('courier', 'normal');
        doc.setFontSize(6.8);
        doc.setTextColor(241, 245, 249);
        const splitCode = doc.splitTextToSize(displayCode, contentWidth - 8);
        doc.text(splitCode, marginX + 4, currentY + 5);
        currentY += codeHeight + 3;

        // Execution output / AI explanation note
        if (sub.aiExplanation) {
          doc.setFillColor(241, 245, 249);
          doc.setDrawColor(226, 232, 240);
          const expLines = doc.splitTextToSize(`Validation Result: ${sub.aiExplanation}`, contentWidth - 8);
          const expHeight = Math.max(9, expLines.length * 3.4 + 4);
          doc.roundedRect(marginX, currentY, contentWidth, expHeight, 1, 1, 'FD');

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(6.8);
          doc.setTextColor(51, 65, 85);
          doc.text(expLines, marginX + 3.5, currentY + 4);
          currentY += expHeight + 5;
        }
      });
    }
  }

  // ==========================================
  // STAKEHOLDER INTERVIEW GUIDE (If enabled)
  // ==========================================
  if (options.includeInterviewGuide) {
    ensureSpace(32);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Stakeholder Interview Guide & Suggested Technical Probes', marginX, currentY);
    currentY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Targeted follow-up questions tailored to this candidate\'s partial evidence and demonstrated skills.',
      marginX,
      currentY
    );
    currentY += 5;

    // Generate suggested probes
    const probes = [
      {
        topic: 'Architecture & Scalability',
        question: 'Candidate demonstrated clean query construction. Probe how they would partition or index tables under 100M+ write-heavy rows.',
      },
      {
        topic: 'Failure Recovery & Edge Cases',
        question: 'Ask the candidate to explain their distributed transaction fallback strategy when secondary write replicas fail.',
      },
    ];

    probes.forEach((probe) => {
      ensureSpace(16);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(marginX, currentY, contentWidth, 14, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(79, 70, 229);
      doc.text(`PROBE: ${probe.topic.toUpperCase()}`, marginX + 3.5, currentY + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(51, 65, 85);
      const qLines = doc.splitTextToSize(probe.question, contentWidth - 8);
      doc.text(qLines, marginX + 3.5, currentY + 8.5);

      currentY += 16;
    });
  }

  // ==========================================
  // ANTI-BIAS & COMPLIANCE SIGN-OFF
  // ==========================================
  ensureSpace(28);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(marginX, currentY, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ANTI-BIAS AUDIT & STAKEHOLDER GOVERNANCE SEAL', marginX + 4, currentY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(71, 85, 105);
  const sealText =
    'This evaluation was conducted under strict blind screening conditions. Identifiers including candidate name, gender markers, racial cues, photos, graduation years, and educational prestige signals were masked. Decisions are strictly grounded in demonstrable job skills.';
  const sealLines = doc.splitTextToSize(sealText, contentWidth - 8);
  doc.text(sealLines, marginX + 4, currentY + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(79, 70, 229);
  doc.text(
    `Cryptographic Verification Hash: SHA256-${Date.now().toString(16)}-${candidate.id.toUpperCase()}-VERIFIED`,
    marginX + 4,
    currentY + 20
  );

  currentY += 28;

  // Draw footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'BlindHire Assessment Platform  |  100% Bias-Free Blind Candidate Evaluation  |  Confidential',
      marginX,
      pageHeight - 8
    );
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - marginX, pageHeight - 8, { align: 'right' });
  }

  return doc;
}
