import React, { useState } from 'react';
import { 
  Clock, 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Video, 
  FileText, 
  Calendar, 
  ChevronRight, 
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { FollowUpAutomation, CommunicationLog, SMECompany, Advisor, MeetingNote } from '../types/crm';
import { ZoomOutlookService } from '../services/zoomOutlookService';

interface AutomatedFollowUpsViewProps {
  followUps: FollowUpAutomation[];
  onUpdateFollowUp: (followUp: FollowUpAutomation) => void;
  communications: CommunicationLog[];
  onAddCommunication: (log: CommunicationLog) => void;
  companies: SMECompany[];
  currentAdvisor: Advisor;
  preselectedCompany?: SMECompany | null;
  prefilledNote?: MeetingNote | null;
}

export const AutomatedFollowUpsView: React.FC<AutomatedFollowUpsViewProps> = ({
  followUps,
  onUpdateFollowUp,
  communications,
  onAddCommunication,
  companies,
  currentAdvisor,
  preselectedCompany,
  prefilledNote
}) => {
  // Outlook Composer State
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    preselectedCompany?.id || companies[0]?.id || ''
  );
  const [emailSubject, setEmailSubject] = useState(
    prefilledNote 
      ? `SME Centre Advisory Minutes & Action Plan - ${prefilledNote.companyName}` 
      : 'Follow-up: Capability Upgrading & Grant Scoping - SME Centre'
  );
  const [emailBody, setEmailBody] = useState(
    prefilledNote
      ? `Dear ${preselectedCompany?.contactPersonName || 'Founder'},\n\nThank you for attending our SME Centre consultation today. As discussed, please find our agreed action items and grant advisory summary below.\n\nSummary:\n${prefilledNote.executiveSummary}\n\nImmediate Action Items:\n${prefilledNote.actionItems.map(a => `• ${a.task} (Due: ${a.dueDate})`).join('\n')}\n\nRecommended Grant: Enterprise Development Grant (EDG) / Productivity Solutions Grant (PSG)\n\nPlease let me know if you require any assistance preparing your proposal.\n\nWarm regards,\n${currentAdvisor.name}\n${currentAdvisor.role}\nSME Centre`
      : `Dear Client,\n\nFollowing up on our recent SME Centre consultation. Please review the attached guidelines for your grant application.\n\nBest regards,\n${currentAdvisor.name}`
  );
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const targetCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCompany) return;
    setIsSending(true);
    setSendSuccess(false);

    try {
      const log = await ZoomOutlookService.sendOutlookEmail(
        currentAdvisor.id,
        currentAdvisor.name,
        currentAdvisor.email,
        targetCompany.contactEmail,
        targetCompany.contactPersonName,
        targetCompany.id,
        targetCompany.legalName,
        emailSubject,
        emailBody
      );

      onAddCommunication(log);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 4000);
    } finally {
      setIsSending(false);
    }
  };

  const toggleCadence = (fup: FollowUpAutomation) => {
    onUpdateFollowUp({
      ...fup,
      active: !fup.active
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Automated Follow-ups & Outlook Integration
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Scheduled cadence rules and live communication sync across business advisors
        </p>
      </div>

      {/* Automated Cadences List */}
      <div className="apple-card rounded-2xl p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Active Follow-up Automation Cadences
          </h2>
          <p className="text-xs text-neutral-500">
            Automated triggers that engage SME founders post-consultation and prevent pipeline drop-off
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {followUps.map((cadence) => (
            <div
              key={cadence.id}
              className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-neutral-500 font-mono">
                    Delay: {cadence.delayDays} Days
                  </span>
                  <button
                    onClick={() => toggleCadence(cadence)}
                    className="cursor-pointer"
                    title={cadence.active ? 'Disable Cadence' : 'Enable Cadence'}
                  >
                    {cadence.active ? (
                      <span className="text-xs text-emerald-600 font-medium">Active</span>
                    ) : (
                      <span className="text-xs text-neutral-400 font-medium">Paused</span>
                    )}
                  </button>
                </div>

                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {cadence.name}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {cadence.description}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Dispatches: {cadence.sendsCount} sent</span>
                <span className="text-[#0071E3] font-medium">{cadence.channel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Direct Outlook Email Composer (Left) + Communication Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Direct Outlook 365 Composer */}
        <div className="apple-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>Outlook 365 Advisor Mailbox</span>
              </h2>
              <p className="text-xs text-neutral-500">
                Send official follow-up from {currentAdvisor.email}
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-medium">
              Connected
            </span>
          </div>

          <form onSubmit={handleSendEmail} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Recipient SME Company
              </label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer font-medium"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.legalName} — {c.contactPersonName} ({c.contactEmail})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Email Subject
              </label>
              <input
                type="text"
                required
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Message Body & Minutes Summary
              </label>
              <textarea
                rows={9}
                required
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none font-mono text-[11px] leading-relaxed resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {sendSuccess ? (
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Email sent via Outlook and logged to CRM!</span>
                </div>
              ) : (
                <span className="text-[11px] text-neutral-400">
                  Logs automatically to SME company profile
                </span>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending via Outlook...' : 'Send Follow-up Email'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Communication Timeline */}
        <div className="apple-card rounded-2xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Communication Timeline & History
            </h2>
            <p className="text-xs text-neutral-500">
              Complete audit trail of Outlook emails and Zoom consultations
            </p>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto">
            {communications.map((comm) => (
              <div
                key={comm.id}
                className="p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {comm.type === 'outlook_email' ? (
                      <Mail className="w-3.5 h-3.5 text-blue-500" />
                    ) : (
                      <Video className="w-3.5 h-3.5 text-[#0071E3]" />
                    )}
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {comm.companyName}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {comm.timestamp}
                  </span>
                </div>

                <p className="font-medium text-neutral-800 dark:text-neutral-200">
                  {comm.subject}
                </p>

                <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {comm.content}
                </p>

                <div className="pt-1.5 border-t border-neutral-200/40 dark:border-neutral-800/40 flex items-center justify-between text-[10px] text-neutral-400">
                  <span>Advisor: {comm.advisorName}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium capitalize">
                    {comm.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
