import React, { useState } from 'react';
import { 
  GitPullRequest, 
  Plus, 
  Search, 
  DollarSign, 
  Clock, 
  User, 
  Sparkles, 
  Mail, 
  ArrowRight, 
  X,
  ChevronRight
} from 'lucide-react';
import { Lead, SMECompany, Advisor, LeadStage } from '../types/crm';

interface LeadsPipelineViewProps {
  leads: Lead[];
  companies: SMECompany[];
  advisors: Advisor[];
  currentAdvisor: Advisor;
  onUpdateLead: (lead: Lead) => void;
  onAddLead: (lead: Lead) => void;
  onStartConsultation: (companyId: string) => void;
  onComposeOutlook: (company: SMECompany) => void;
}

const STAGES: { id: LeadStage; title: string; desc: string }[] = [
  { id: 'inquiry', title: '1. Inquiry Received', desc: 'Initial contact via portal or walk-in' },
  { id: 'diagnostic', title: '2. Needs Diagnostic', desc: 'Diagnostic questionnaire & gap analysis' },
  { id: 'grant_scoping', title: '3. Grant Scoping', desc: 'Vendor quotations & project feasibility' },
  { id: 'application', title: '4. BGP Application', desc: 'Business Grants Portal formal lodgement' },
  { id: 'completed', title: '5. Completed / Supported', desc: 'Grant awarded & advisory concluded' },
];

export const LeadsPipelineView: React.FC<LeadsPipelineViewProps> = ({
  leads,
  companies,
  advisors,
  currentAdvisor,
  onUpdateLead,
  onAddLead,
  onStartConsultation,
  onComposeOutlook
}) => {
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lead Form State
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || '');
  const [newTargetGrant, setNewTargetGrant] = useState('Enterprise Development Grant (EDG)');
  const [newEstimatedValue, setNewEstimatedValue] = useState('60000');
  const [newStage, setNewStage] = useState<LeadStage>('inquiry');

  const filteredLeads = leads.filter(l => 
    selectedPriority === 'all' || l.priority === selectedPriority
  );

  const handleStageChange = (lead: Lead, newStage: LeadStage) => {
    onUpdateLead({
      ...lead,
      stage: newStage,
      updatedAt: new Date().toISOString().split('T')[0]
    });
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const company = companies.find(c => c.id === selectedCompanyId);
    if (!company) return;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      companyId: company.id,
      companyName: company.legalName,
      uen: company.uen,
      contactName: company.contactPersonName,
      contactEmail: company.contactEmail,
      contactPhone: company.contactPhone,
      stage: newStage,
      priority: 'high',
      targetGrant: newTargetGrant,
      estimatedGrantValue: parseInt(newEstimatedValue) || 50000,
      readinessScore: 70,
      assignedAdvisorId: currentAdvisor.id,
      assignedAdvisorName: currentAdvisor.name,
      source: 'Online Portal',
      nextFollowUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      lastContactedAt: new Date().toISOString().split('T')[0],
      notes: 'New capability upgrade inquiry logged.',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onAddLead(newLead);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Advisory Lead Pipeline & Grant Scoping
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Track SME progress from initial diagnostic to Enterprise Singapore grant approval
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-800 dark:text-neutral-200 outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Advisory Lead</span>
          </button>
        </div>
      </div>

      {/* Kanban Pipeline Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-start">
        {STAGES.map((stage) => {
          const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
          const stageTotalValue = stageLeads.reduce((acc, curr) => acc + (curr.estimatedGrantValue || 0), 0);

          return (
            <div
              key={stage.id}
              className="apple-card rounded-2xl p-3 bg-neutral-100/40 dark:bg-neutral-900/40 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="pb-3 border-b border-neutral-200/60 dark:border-neutral-800/60 mb-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {stage.title}
                  </h2>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono font-medium">
                    {stageLeads.length}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  ${(stageTotalValue / 1000).toFixed(0)}k pipeline
                </p>
              </div>

              {/* Lead Cards List */}
              <div className="space-y-2.5 flex-1">
                {stageLeads.length === 0 ? (
                  <div className="h-28 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-center text-[11px] text-neutral-400">
                    No active leads
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const targetCompany = companies.find(c => c.id === lead.companyId);

                    return (
                      <div
                        key={lead.id}
                        className="apple-card rounded-xl p-3 bg-white dark:bg-[#1C1C1E] space-y-2.5 hover:shadow-md transition-all text-xs"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <div>
                            <p className="font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                              {lead.companyName}
                            </p>
                            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                              {lead.uen}
                            </p>
                          </div>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                            lead.priority === 'high'
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                              : lead.priority === 'medium'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600'
                          }`}>
                            {lead.priority}
                          </span>
                        </div>

                        <div className="space-y-1 text-[11px]">
                          <p className="text-[#0071E3] font-medium truncate">
                            {lead.targetGrant}
                          </p>
                          <div className="flex items-center justify-between text-neutral-500">
                            <span>Est. Grant:</span>
                            <span className="font-semibold text-neutral-800 dark:text-neutral-200 font-mono">
                              ${lead.estimatedGrantValue.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-neutral-500">
                            <span>Readiness:</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                              {lead.readinessScore}%
                            </span>
                          </div>
                        </div>

                        {/* Advisor Assignment */}
                        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-400">
                          <span className="truncate max-w-[100px]">{lead.assignedAdvisorName}</span>
                          <span className="font-mono">Due: {lead.nextFollowUpDate}</span>
                        </div>

                        {/* Action Buttons & Stage Selector */}
                        <div className="pt-1.5 flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onStartConsultation(lead.companyId)}
                              title="Start Consultation"
                              className="p-1 rounded bg-[#0071E3]/10 hover:bg-[#0071E3]/20 text-[#0071E3] transition-colors cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3" />
                            </button>
                            {targetCompany && (
                              <button
                                onClick={() => onComposeOutlook(targetCompany)}
                                title="Send Outlook Email"
                                className="p-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 transition-colors cursor-pointer"
                              >
                                <Mail className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* Quick Stage Progression */}
                          <select
                            value={lead.stage}
                            onChange={(e) => handleStageChange(lead, e.target.value as LeadStage)}
                            className="text-[10px] bg-neutral-100 dark:bg-neutral-800 rounded px-1.5 py-0.5 border-none outline-none text-neutral-700 dark:text-neutral-300 cursor-pointer"
                          >
                            <option value="inquiry">Stage: Inquiry</option>
                            <option value="diagnostic">Stage: Diagnostic</option>
                            <option value="grant_scoping">Stage: Scoping</option>
                            <option value="application">Stage: Application</option>
                            <option value="completed">Stage: Completed</option>
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-md bg-white dark:bg-[#161618] rounded-2xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Create Advisory Lead
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Select Registered SME Company
                </label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.legalName} (UEN: {c.uen})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Target Government Grant / Scheme
                </label>
                <select
                  value={newTargetGrant}
                  onChange={(e) => setNewTargetGrant(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer"
                >
                  <option value="Enterprise Development Grant (EDG - Innovation & Productivity)">
                    EDG - Innovation & Productivity (Up to 50% co-funding)
                  </option>
                  <option value="Productivity Solutions Grant (PSG - Pre-scoped Solutions)">
                    PSG - Pre-scoped IT & Automation (Up to 50% co-funding)
                  </option>
                  <option value="Market Readiness Assistance (MRA - Overseas Expansion)">
                    MRA - Overseas Market Access (Up to SGD 100k cap)
                  </option>
                  <option value="SkillsFuture Enterprise Credit (SFEC)">
                    SFEC - Transformation & Upskilling Credit (SGD 10,000 credit)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Estimated Grant Value (SGD)
                  </label>
                  <input
                    type="number"
                    value={newEstimatedValue}
                    onChange={(e) => setNewEstimatedValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Initial Stage
                  </label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as LeadStage)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer"
                  >
                    <option value="inquiry">1. Inquiry Received</option>
                    <option value="diagnostic">2. Needs Diagnostic</option>
                    <option value="grant_scoping">3. Grant Scoping</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium cursor-pointer"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
