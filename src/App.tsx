/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ContactsView } from './components/ContactsView';
import { LeadsPipelineView } from './components/LeadsPipelineView';
import { MeetingStudioView } from './components/MeetingStudioView';
import { AutomatedFollowUpsView } from './components/AutomatedFollowUpsView';
import { ReportsView } from './components/ReportsView';
import { AdvisorsAdminView } from './components/AdvisorsAdminView';
import { SettingsView } from './components/SettingsView';
import { SgpBusinessModal } from './components/SgpBusinessModal';

import { 
  Advisor, 
  SMECompany, 
  Lead, 
  MeetingNote, 
  FollowUpAutomation, 
  CommunicationLog 
} from './types/crm';

import { 
  INITIAL_ADVISORS, 
  INITIAL_COMPANIES, 
  INITIAL_LEADS, 
  INITIAL_MEETING_NOTES, 
  INITIAL_FOLLOW_UPS, 
  INITIAL_COMMUNICATIONS 
} from './data/initialData';

import { supabaseService } from './services/supabaseClient';

export default function App() {
  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sme_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Active Navigation
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Core CRM Datasets (Synced with Resilient Store + Supabase)
  const [advisors, setAdvisors] = useState<Advisor[]>(() => 
    supabaseService.getStoredData('advisors', INITIAL_ADVISORS)
  );

  const [currentAdvisor, setCurrentAdvisor] = useState<Advisor>(() => {
    const savedId = localStorage.getItem('sme_current_advisor_id');
    const found = advisors.find(a => a.id === savedId);
    return found || advisors[0];
  });

  const [companies, setCompanies] = useState<SMECompany[]>(() => 
    supabaseService.getStoredData('companies', INITIAL_COMPANIES)
  );

  const [leads, setLeads] = useState<Lead[]>(() => 
    supabaseService.getStoredData('leads', INITIAL_LEADS)
  );

  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>(() => 
    supabaseService.getStoredData('meeting_notes', INITIAL_MEETING_NOTES)
  );

  const [followUps, setFollowUps] = useState<FollowUpAutomation[]>(() => 
    supabaseService.getStoredData('followups', INITIAL_FOLLOW_UPS)
  );

  const [communications, setCommunications] = useState<CommunicationLog[]>(() => 
    supabaseService.getStoredData('communications', INITIAL_COMMUNICATIONS)
  );

  // Modal & Navigation Context
  const [isSgpModalOpen, setIsSgpModalOpen] = useState(false);
  const [preselectedMeetingCompanyId, setPreselectedMeetingCompanyId] = useState<string | undefined>();
  const [preselectedOutlookCompany, setPreselectedOutlookCompany] = useState<SMECompany | null>(null);
  const [prefilledMeetingNote, setPrefilledMeetingNote] = useState<MeetingNote | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Handle Theme effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sme_dark_mode', String(darkMode));
  }, [darkMode]);

  // Persist Data Changes to Resilient Store & Supabase
  const handleUpdateCompanies = (updated: SMECompany[]) => {
    setCompanies(updated);
    supabaseService.saveStoredData('companies', updated);
  };

  const handleAddCompany = (newCompany: SMECompany) => {
    const updated = [newCompany, ...companies];
    handleUpdateCompanies(updated);
  };

  const handleUpdateLeads = (updated: Lead[]) => {
    setLeads(updated);
    supabaseService.saveStoredData('leads', updated);
  };

  const handleAddLead = (newLead: Lead) => {
    const updated = [newLead, ...leads];
    handleUpdateLeads(updated);
  };

  const handleSingleLeadUpdate = (lead: Lead) => {
    const updated = leads.map(l => l.id === lead.id ? lead : l);
    handleUpdateLeads(updated);
  };

  const handleSaveMeetingNote = (note: MeetingNote) => {
    const updated = [note, ...meetingNotes];
    setMeetingNotes(updated);
    supabaseService.saveStoredData('meeting_notes', updated);
  };

  const handleUpdateFollowUp = (fup: FollowUpAutomation) => {
    const updated = followUps.map(f => f.id === fup.id ? fup : f);
    setFollowUps(updated);
    supabaseService.saveStoredData('followups', updated);
  };

  const handleAddCommunication = (log: CommunicationLog) => {
    const updated = [log, ...communications];
    setCommunications(updated);
    supabaseService.saveStoredData('communications', updated);
  };

  const handleAddAdvisor = (newAdv: Advisor) => {
    const updated = [...advisors, newAdv];
    setAdvisors(updated);
    supabaseService.saveStoredData('advisors', updated);
  };

  const handleSelectAdvisor = (adv: Advisor) => {
    setCurrentAdvisor(adv);
    localStorage.setItem('sme_current_advisor_id', adv.id);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all CRM data to initial Singapore SME Centre dataset?')) {
      localStorage.clear();
      setCompanies(INITIAL_COMPANIES);
      setLeads(INITIAL_LEADS);
      setMeetingNotes(INITIAL_MEETING_NOTES);
      setFollowUps(INITIAL_FOLLOW_UPS);
      setCommunications(INITIAL_COMMUNICATIONS);
      setAdvisors(INITIAL_ADVISORS);
      setCurrentAdvisor(INITIAL_ADVISORS[0]);
    }
  };

  // Cross-View Action Handlers
  const handleStartConsultation = (companyId?: string) => {
    setPreselectedMeetingCompanyId(companyId);
    setCurrentTab('meetings');
  };

  const handleComposeOutlook = (company: SMECompany, prefilledNote?: MeetingNote) => {
    setPreselectedOutlookCompany(company);
    setPrefilledMeetingNote(prefilledNote || null);
    setCurrentTab('followups');
  };

  const handleQuickAction = (action: string) => {
    if (action === 'meeting') {
      setCurrentTab('meetings');
    } else if (action === 'sgp-lookup') {
      setIsSgpModalOpen(true);
    } else if (action === 'new-company') {
      setCurrentTab('contacts');
    } else if (action === 'new-advisor') {
      setCurrentTab('advisors');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors">
      {/* Top Header */}
      <Header
        currentAdvisor={currentAdvisor}
        allAdvisors={advisors}
        onSelectAdvisor={handleSelectAdvisor}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenQuickAction={handleQuickAction}
        onGlobalSearch={(q) => {
          setGlobalSearchQuery(q);
          if (q.trim() && currentTab !== 'contacts') {
            setCurrentTab('contacts');
          }
        }}
        supabaseConnected={true}
      />

      {/* Main Layout Canvas */}
      <div className="flex-1 flex w-full max-w-[1720px] mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          currentAdvisor={currentAdvisor}
          activeLeadCount={leads.filter(l => l.stage !== 'completed').length}
          pendingFollowUpsCount={leads.filter(l => l.priority === 'high').length}
          onOpenSgpModal={() => setIsSgpModalOpen(true)}
        />

        {/* Dynamic Main Workspace Viewport */}
        <main className="flex-1 p-6 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              currentAdvisor={currentAdvisor}
              companies={companies}
              leads={leads}
              meetingNotes={meetingNotes}
              followUps={followUps}
              onNavigateTab={setCurrentTab}
              onOpenSgpModal={() => setIsSgpModalOpen(true)}
              onStartConsultation={handleStartConsultation}
              onComposeOutlook={handleComposeOutlook}
            />
          )}

          {currentTab === 'contacts' && (
            <ContactsView
              companies={companies}
              advisors={advisors}
              currentAdvisor={currentAdvisor}
              meetingNotes={meetingNotes}
              leads={leads}
              onAddCompany={handleAddCompany}
              onUpdateCompany={(c) => {
                const updated = companies.map(item => item.id === c.id ? c : item);
                handleUpdateCompanies(updated);
              }}
              onOpenSgpModal={() => setIsSgpModalOpen(true)}
              onStartConsultation={handleStartConsultation}
              onComposeOutlook={handleComposeOutlook}
              filterQuery={globalSearchQuery}
            />
          )}

          {currentTab === 'leads' && (
            <LeadsPipelineView
              leads={leads}
              companies={companies}
              advisors={advisors}
              currentAdvisor={currentAdvisor}
              onUpdateLead={handleSingleLeadUpdate}
              onAddLead={handleAddLead}
              onStartConsultation={handleStartConsultation}
              onComposeOutlook={handleComposeOutlook}
            />
          )}

          {currentTab === 'meetings' && (
            <MeetingStudioView
              companies={companies}
              currentAdvisor={currentAdvisor}
              initialCompanyId={preselectedMeetingCompanyId}
              onSaveMeetingNote={handleSaveMeetingNote}
              onOpenSgpModal={() => setIsSgpModalOpen(true)}
              onComposeOutlook={handleComposeOutlook}
            />
          )}

          {currentTab === 'followups' && (
            <AutomatedFollowUpsView
              followUps={followUps}
              onUpdateFollowUp={handleUpdateFollowUp}
              communications={communications}
              onAddCommunication={handleAddCommunication}
              companies={companies}
              currentAdvisor={currentAdvisor}
              preselectedCompany={preselectedOutlookCompany}
              prefilledNote={prefilledMeetingNote}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              advisors={advisors}
              companies={companies}
              leads={leads}
              meetingNotes={meetingNotes}
            />
          )}

          {currentTab === 'advisors' && (
            <AdvisorsAdminView
              advisors={advisors}
              currentAdvisor={currentAdvisor}
              onSelectAdvisor={handleSelectAdvisor}
              onAddAdvisor={handleAddAdvisor}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              currentAdvisor={currentAdvisor}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* SGP Business Directory (ACRA) Search Modal */}
      <SgpBusinessModal
        isOpen={isSgpModalOpen}
        onClose={() => setIsSgpModalOpen(false)}
        onImportCompany={handleAddCompany}
        currentAdvisor={currentAdvisor}
      />
    </div>
  );
}
