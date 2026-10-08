import React from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp, 
  Award,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { Advisor, SMECompany, Lead, MeetingNote } from '../types/crm';

interface ReportsViewProps {
  advisors: Advisor[];
  companies: SMECompany[];
  leads: Lead[];
  meetingNotes: MeetingNote[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  advisors,
  companies,
  leads,
  meetingNotes
}) => {
  const totalGrants = leads.reduce((acc, curr) => acc + curr.estimatedGrantValue, 0);
  const totalCompletedLeads = leads.filter(l => l.stage === 'completed').length;
  const grantConversionRate = leads.length > 0 ? Math.round((totalCompletedLeads / leads.length) * 100) : 0;

  const exportReportCsv = () => {
    const headers = ['Company Name', 'ACRA UEN', 'Industry', 'Assigned Advisor', 'Target Grant', 'Estimated Grant (SGD)', 'Stage', 'Readiness'];
    const rows = leads.map(l => [
      `"${l.companyName}"`,
      `"${l.uen}"`,
      `"${companies.find(c => c.id === l.companyId)?.industry || 'General'}"`,
      `"${l.assignedAdvisorName}"`,
      `"${l.targetGrant}"`,
      l.estimatedGrantValue,
      `"${l.stage}"`,
      `${l.readinessScore}%`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SME_Centre_Advisory_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            SME Centre Performance & Advisory Reports
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Official operational reporting metrics aligned with Enterprise Singapore standards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={exportReportCsv}
            className="px-3.5 py-1.5 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* High-Level Executive KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="apple-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Total Pipeline Value</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
            ${(totalGrants / 1000).toFixed(0)}k
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">
            Enterprise Singapore grant applications
          </p>
        </div>

        <div className="apple-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Advisory Consultations</span>
            <Calendar className="w-4 h-4 text-[#0071E3]" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
            {meetingNotes.length}
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">
            AI minutes transcribed
          </p>
        </div>

        <div className="apple-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Active SMEs Advised</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
            {companies.length}
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">
            Across 5 trade sectors
          </p>
        </div>

        <div className="apple-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Grant Application Rate</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
            82%
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">
            Diagnostic-to-submission ratio
          </p>
        </div>
      </div>

      {/* Grant Distribution Breakdown */}
      <div className="apple-card rounded-2xl p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Grant Allocation by Enterprise Singapore Scheme
          </h2>
          <p className="text-xs text-neutral-500">
            Current pipeline breakdown across national enterprise schemes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: 'Enterprise Development Grant (EDG)',
              desc: 'Core Capabilities, Innovation & Productivity, Market Access',
              value: '$260,000',
              count: '3 Projects',
              percent: '75%'
            },
            {
              name: 'Productivity Solutions Grant (PSG)',
              desc: 'Pre-scoped IT & automation equipment packages',
              value: '$35,000',
              count: '1 Project',
              percent: '15%'
            },
            {
              name: 'Market Readiness Assistance (MRA)',
              desc: 'Overseas market setup, licensing, and marketing',
              value: '$40,000',
              count: '1 Project',
              percent: '10%'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{item.name}</span>
                <span className="text-xs font-mono font-semibold text-[#0071E3]">{item.percent}</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-tight">{item.desc}</p>
              <div className="pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50 flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-800 dark:text-neutral-200 font-mono">{item.value}</span>
                <span className="text-neutral-400">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advisor Performance Comparison Table */}
      <div className="apple-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Business Advisor Performance & Caseload
          </h2>
          <p className="text-xs text-neutral-500">
            Advisory sessions, grant facilitation, and enterprise accounts by advisor
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-neutral-500">
                <th className="py-3 px-4 font-semibold">ADVISOR NAME</th>
                <th className="py-3 px-4 font-semibold">ROLE</th>
                <th className="py-3 px-4 font-semibold">DEPARTMENT</th>
                <th className="py-3 px-4 font-semibold">ACTIVE SMES</th>
                <th className="py-3 px-4 font-semibold">GRANTS FACILITATED</th>
                <th className="py-3 px-4 font-semibold">ZOOM STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {advisors.map((adv) => (
                <tr key={adv.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{adv.name}</p>
                    <p className="text-[10px] text-neutral-500">{adv.email}</p>
                  </td>
                  <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                    {adv.role}
                  </td>
                  <td className="py-3 px-4 text-neutral-500">
                    {adv.department}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-neutral-800 dark:text-neutral-200 tabular-nums">
                    {adv.assignedSmeCount}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    ${adv.totalGrantsFacilitated.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 font-mono">
                      {adv.zoomPersonalId}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
