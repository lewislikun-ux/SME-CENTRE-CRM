import React from 'react';
import { 
  Building2, 
  GitPullRequest, 
  Clock, 
  DollarSign, 
  Video, 
  Sparkles, 
  Mail, 
  FileText, 
  ArrowUpRight, 
  Search, 
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Advisor, SMECompany, Lead, MeetingNote, FollowUpAutomation } from '../types/crm';
import { PdfExportService } from '../services/pdfExportService';

interface DashboardViewProps {
  currentAdvisor: Advisor;
  companies: SMECompany[];
  leads: Lead[];
  meetingNotes: MeetingNote[];
  followUps: FollowUpAutomation[];
  onNavigateTab: (tab: any) => void;
  onOpenSgpModal: () => void;
  onStartConsultation: (companyId?: string) => void;
  onComposeOutlook: (company: SMECompany) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentAdvisor,
  companies,
  leads,
  meetingNotes,
  followUps,
  onNavigateTab,
  onOpenSgpModal,
  onStartConsultation,
  onComposeOutlook
}) => {
  // Aggregate Metrics
  const activeSmesCount = companies.filter(c => c.status === 'Active Advisory').length;
  const activeLeadsCount = leads.filter(l => l.stage !== 'completed').length;
  const totalGrantPotential = leads.reduce((acc, curr) => acc + (curr.estimatedGrantValue || 0), 0);
  const totalRecordedSessions = meetingNotes.length;

  // Follow-up Queue (leads needing attention soon)
  const urgentFollowUps = leads
    .filter(l => l.priority === 'high' || l.stage === 'grant_scoping')
    .slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome & Context Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.08] apple-glass p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span>SME Centre Advisory Network</span>
              <span aria-hidden="true">·</span>
              <span>Enterprise Singapore Partner</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#0071E3] font-medium">{currentAdvisor.department}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Welcome back, {currentAdvisor.name.split(' ')[0]}
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-2xl">
              You currently manage {currentAdvisor.assignedSmeCount} enterprise accounts. Review your upcoming Zoom consultations, automated follow-up dispatches, and recent AI minutes below.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenSgpModal}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-emerald-600" />
              <span>SGP Business Lookup</span>
            </button>
            <button
              onClick={() => onStartConsultation()}
              className="px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Advisory Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metric Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="apple-card rounded-2xl p-4 transition-all">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">Active SMEs</span>
            <Building2 className="w-4 h-4 text-[#0071E3]" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
            {activeSmesCount}
          </p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            Across 5 key industries
          </p>
        </div>

        <div className="apple-card rounded-2xl p-4 transition-all">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">Grant Pipeline</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
            ${(totalGrantPotential / 1000).toFixed(0)}k
          </p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            EDG & PSG co-funding
          </p>
        </div>

        <div className="apple-card rounded-2xl p-4 transition-all">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">Active Leads</span>
            <GitPullRequest className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
            {activeLeadsCount}
          </p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            In scoping & application
          </p>
        </div>

        <div className="apple-card rounded-2xl p-4 transition-all">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">AI Minutes Recorded</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
            {totalRecordedSessions}
          </p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            Parakeet & Meetily transcribed
          </p>
        </div>
      </div>

      {/* Main Grid: Priority Follow-up Queue & Recent AI Minutes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Follow-up Action Queue & Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Follow-up Queue */}
          <div className="apple-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Priority Follow-up Queue
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Automated reminders and pending actions for active SME advisory cases
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('followups')}
                className="text-xs text-[#0071E3] hover:underline font-medium cursor-pointer"
              >
                View all cadences →
              </button>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {urgentFollowUps.map((lead) => {
                const targetCompany = companies.find(c => c.id === lead.companyId);
                return (
                  <div key={lead.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                          {lead.companyName}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {lead.uen}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate mt-0.5">
                        {lead.targetGrant} · Contact: {lead.contactName}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-1">
                        <span>Readiness: <strong className="text-neutral-700 dark:text-neutral-300 tabular-nums">{lead.readinessScore}%</strong></span>
                        <span>·</span>
                        <span>Next due: <strong className="text-neutral-700 dark:text-neutral-300 font-mono">{lead.nextFollowUpDate}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {targetCompany && (
                        <button
                          onClick={() => onComposeOutlook(targetCompany)}
                          title="Send Outlook Email"
                          className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onStartConsultation(lead.companyId)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium transition-colors cursor-pointer"
                      >
                        Launch Advisory
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Singapore SME Industry Overview */}
          <div className="apple-card rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              SME Portfolio by Industry Sector
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Distribution of companies currently engaged across Enterprise Singapore capability pillars
            </p>

            <div className="space-y-3">
              {[
                { sector: 'Food & Beverage / Manufacturing', count: 14, percent: 27 },
                { sector: 'Precision Engineering & Industrial Automation', count: 12, percent: 23 },
                { sector: 'Biomedical & Healthcare', count: 10, percent: 19 },
                { sector: 'Logistics & Supply Chain Solutions', count: 9, percent: 17 },
                { sector: 'Clean Energy & Green Tech', count: 7, percent: 14 }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">{item.sector}</span>
                    <span className="text-neutral-500 font-mono tabular-nums">{item.count} SMEs ({item.percent}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#0071E3] rounded-full" 
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Recent Meeting Minutes & PDF Export */}
        <div className="space-y-6">
          <div className="apple-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Recent AI Meeting Minutes
              </h2>
              <button
                onClick={() => onNavigateTab('meetings')}
                className="text-xs text-[#0071E3] hover:underline font-medium cursor-pointer"
              >
                Studio →
              </button>
            </div>

            <div className="space-y-3">
              {meetingNotes.map((note) => {
                const targetCompany = companies.find(c => c.id === note.companyId);
                return (
                  <div
                    key={note.id}
                    className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          {note.companyName}
                        </p>
                        <p className="text-[11px] text-neutral-500 font-mono">
                          {note.meetingDate} · {note.channel}
                        </p>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                        {note.sentimentTone}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2">
                      {note.executiveSummary}
                    </p>

                    <div className="pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-500">
                        {note.actionItems.length} action items
                      </span>
                      <button
                        onClick={() => PdfExportService.exportMeetingMinutesToPdf(note, targetCompany)}
                        className="flex items-center gap-1.5 text-xs text-[#0071E3] hover:underline font-medium cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Export PDF</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Zoom & Outlook Integration Status Card */}
          <div className="apple-card rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Advisor Digital Workplace
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#0071E3]" />
                  <div>
                    <p className="font-medium text-neutral-800 dark:text-neutral-200">Zoom Cloud Scheduling</p>
                    <p className="text-[10px] text-neutral-500">ID: {currentAdvisor.zoomPersonalId}</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Synced
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="font-medium text-neutral-800 dark:text-neutral-200">Outlook 365 Mailbox</p>
                    <p className="text-[10px] text-neutral-500">{currentAdvisor.email}</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
