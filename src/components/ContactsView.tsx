import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  ExternalLink, 
  Mail, 
  Video, 
  Phone, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  Sparkles,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
import { SMECompany, Advisor, MeetingNote, Lead } from '../types/crm';
import { SgpBusinessService } from '../services/sgpBusinessService';
import { PdfExportService } from '../services/pdfExportService';

interface ContactsViewProps {
  companies: SMECompany[];
  advisors: Advisor[];
  currentAdvisor: Advisor;
  meetingNotes: MeetingNote[];
  leads: Lead[];
  onAddCompany: (company: SMECompany) => void;
  onUpdateCompany: (company: SMECompany) => void;
  onOpenSgpModal: () => void;
  onStartConsultation: (companyId: string) => void;
  onComposeOutlook: (company: SMECompany) => void;
  filterQuery?: string;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  companies,
  advisors,
  currentAdvisor,
  meetingNotes,
  leads,
  onAddCompany,
  onUpdateCompany,
  onOpenSgpModal,
  onStartConsultation,
  onComposeOutlook,
  filterQuery = ''
}) => {
  const [search, setSearch] = useState(filterQuery);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeCompany, setActiveCompany] = useState<SMECompany | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for New SME
  const [newUen, setNewUen] = useState('');
  const [newName, setNewName] = useState('');
  const [newIndustry, setNewIndustry] = useState('Food & Beverage');
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [isLookingUpUen, setIsLookingUpUen] = useState(false);

  // Filter companies
  const filteredCompanies = companies.filter((c) => {
    const matchesSearch = 
      c.legalName.toLowerCase().includes(search.toLowerCase()) ||
      c.uen.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPersonName.toLowerCase().includes(search.toLowerCase());
    
    const matchesIndustry = selectedIndustry === 'all' || c.industry.includes(selectedIndustry);
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;

    return matchesSearch && matchesIndustry && matchesStatus;
  });

  const handleLookupUen = async () => {
    if (!newUen.trim()) return;
    setIsLookingUpUen(true);
    try {
      const entity = await SgpBusinessService.getByUen(newUen);
      if (entity) {
        setNewName(entity.entityName);
        setNewAddress(entity.registeredAddress);
        if (entity.keyOfficers[0]) {
          setNewContactName(entity.keyOfficers[0].name);
        }
      }
    } finally {
      setIsLookingUpUen(false);
    }
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUen.trim() || !newName.trim()) return;

    const newSme: SMECompany = {
      id: `sme-${Date.now()}`,
      uen: newUen.toUpperCase().trim(),
      legalName: newName.trim(),
      tradeName: newName.trim(),
      industry: newIndustry,
      ssicCode: '62090',
      ssicDescription: `${newIndustry} Services & Commercial Operations`,
      incorporationDate: new Date().toISOString().split('T')[0],
      paidUpCapital: 'SGD 100,000',
      registeredAddress: newAddress || 'Singapore',
      postalCode: '139951',
      employeeCount: 10,
      annualRevenue: 'SGD 1,200,000',
      contactPersonName: newContactName || 'Managing Director',
      contactDesignation: 'Director / Founder',
      contactEmail: newContactEmail || 'contact@sme.sg',
      contactPhone: newContactPhone || '+65 6123 4567',
      status: 'Active Advisory',
      assignedAdvisorId: currentAdvisor.id,
      assignedAdvisorName: currentAdvisor.name,
      sgpVerified: true,
      tags: ['SME Advisory', 'New Client'],
      notes: 'Registered in SME Centre CRM.',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onAddCompany(newSme);
    setShowAddModal(false);
    setActiveCompany(newSme);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            SME Companies & Contact Tracking
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Enterprise database synchronized with Singapore Business Directory (ACRA)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSgpModal}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-emerald-600" />
            <span>SGP Business Directory</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add SME Company</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-2 apple-card rounded-xl">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name, UEN, or contact person..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800/80 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none"
          />
        </div>

        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="px-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800/80 rounded-lg text-neutral-800 dark:text-neutral-200 border-none outline-none cursor-pointer"
        >
          <option value="all">All Industries</option>
          <option value="Biomedical">Biomedical & Healthcare</option>
          <option value="Food & Beverage">Food & Beverage</option>
          <option value="Precision Engineering">Precision Engineering</option>
          <option value="Logistics">Logistics & Supply Chain</option>
          <option value="Clean Energy">Clean Energy</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800/80 rounded-lg text-neutral-800 dark:text-neutral-200 border-none outline-none cursor-pointer"
        >
          <option value="all">All Advisory Statuses</option>
          <option value="Active Advisory">Active Advisory</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Graduated">Graduated</option>
        </select>
      </div>

      {/* Companies Table */}
      <div className="apple-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-900/40 text-neutral-500 dark:text-neutral-400">
                <th className="py-3 px-4 font-semibold">COMPANY & ACRA UEN</th>
                <th className="py-3 px-4 font-semibold">INDUSTRY / SSIC</th>
                <th className="py-3 px-4 font-semibold">KEY CONTACT PERSON</th>
                <th className="py-3 px-4 font-semibold">ASSIGNED ADVISOR</th>
                <th className="py-3 px-4 font-semibold">STATUS</th>
                <th className="py-3 px-4 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredCompanies.map((company) => (
                <tr
                  key={company.id}
                  onClick={() => setActiveCompany(company)}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[#0071E3] flex items-center justify-center font-bold text-xs shrink-0">
                        {company.legalName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {company.legalName}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono mt-0.5">
                          <span>UEN: {company.uen}</span>
                          {company.sgpVerified && (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 text-[10px]">
                              <ShieldCheck className="w-3 h-3" />
                              ACRA
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="text-neutral-800 dark:text-neutral-200 font-medium">
                      {company.industry}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate max-w-[220px]">
                      SSIC: {company.ssicCode}
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="text-neutral-800 dark:text-neutral-200 font-medium">
                      {company.contactPersonName}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {company.contactEmail} · {company.contactPhone}
                    </p>
                  </td>

                  <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400">
                    {company.assignedAdvisorName}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${
                      company.status === 'Active Advisory'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}>
                      {company.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onComposeOutlook(company)}
                        title="Send Outlook Email"
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onStartConsultation(company.id)}
                        title="Start Advisory Session"
                        className="p-1.5 rounded-lg bg-[#0071E3] hover:bg-[#0077ED] text-white transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Profile Drawer */}
      {activeCompany && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div 
            className="w-full max-w-xl h-full bg-white dark:bg-[#161618] shadow-2xl p-6 overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-neutral-200/80 dark:border-neutral-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    {activeCompany.legalName}
                  </h2>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-mono">
                    UEN: {activeCompany.uen}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  {activeCompany.ssicDescription}
                </p>
              </div>

              <button
                onClick={() => setActiveCompany(null)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onStartConsultation(activeCompany.id);
                  setActiveCompany(null);
                }}
                className="flex-1 py-2 px-3 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Advisory Session</span>
              </button>
              <button
                onClick={() => onComposeOutlook(activeCompany)}
                className="py-2 px-3 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 text-blue-500" />
                <span>Outlook Email</span>
              </button>
              <a
                href={`https://www.sgpbusiness.com/company/${encodeURIComponent(activeCompany.legalName.replace(/ /g, '-'))}`}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-emerald-600" />
                <span>sgpbusiness.com</span>
              </a>
            </div>

            {/* Singapore ACRA Verified Entity Profile */}
            <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-3">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                ACRA Corporate Profile
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-neutral-500">Incorporation Date</span>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200 font-mono mt-0.5">
                    {activeCompany.incorporationDate}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-500">Paid-up Capital</span>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200 font-mono mt-0.5">
                    {activeCompany.paidUpCapital}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-500">Employee Headcount</span>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200 font-mono mt-0.5">
                    {activeCompany.employeeCount} local employees
                  </p>
                </div>
                <div>
                  <span className="text-neutral-500">Annual Revenue</span>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200 font-mono mt-0.5">
                    {activeCompany.annualRevenue}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50 text-xs">
                <span className="text-neutral-500">Registered Office Address</span>
                <p className="font-medium text-neutral-800 dark:text-neutral-200 mt-0.5 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                  <span>{activeCompany.registeredAddress}</span>
                </p>
              </div>
            </div>

            {/* Primary Contact Person */}
            <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-2">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                Primary Contact & Designation
              </h3>
              <div className="text-xs space-y-1">
                <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                  {activeCompany.contactPersonName}
                </p>
                <p className="text-neutral-500">
                  {activeCompany.contactDesignation}
                </p>
                <div className="pt-2 flex flex-col gap-1 text-neutral-700 dark:text-neutral-300">
                  <span className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    {activeCompany.contactEmail}
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    {activeCompany.contactPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* Advisory History & Minutes for this SME */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                Advisory Sessions & Minutes History
              </h3>
              {meetingNotes.filter(m => m.companyId === activeCompany.id).length === 0 ? (
                <p className="text-xs text-neutral-500 p-4 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-center">
                  No prior consultation recorded yet. Launch the Advisory Studio to conduct a session.
                </p>
              ) : (
                meetingNotes.filter(m => m.companyId === activeCompany.id).map(m => (
                  <div key={m.id} className="p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{m.meetingTitle}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{m.meetingDate}</span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {m.executiveSummary}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                        {m.sentimentTone} ({m.sentimentScore}%)
                      </span>
                      <button
                        onClick={() => PdfExportService.exportMeetingMinutesToPdf(m, activeCompany)}
                        className="text-[#0071E3] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Export PDF</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-lg bg-white dark:bg-[#161618] rounded-2xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Register New SME Company
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Singapore ACRA UEN
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newUen}
                    onChange={(e) => setNewUen(e.target.value)}
                    placeholder="e.g. 201827491G or 53319028A"
                    className="flex-1 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleLookupUen}
                    disabled={isLookingUpUen}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors cursor-pointer shrink-0"
                  >
                    {isLookingUpUen ? 'Checking...' : 'SGP Lookup'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Company Legal Entity Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Apex BioTech Solutions Pte. Ltd."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Industry Sector
                  </label>
                  <select
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer"
                  >
                    <option value="Biomedical & Healthcare">Biomedical & Healthcare</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Precision Engineering">Precision Engineering</option>
                    <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                    <option value="Clean Energy & Green Tech">Clean Energy & Green Tech</option>
                    <option value="Retail & E-commerce">Retail & E-commerce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Primary Contact Name
                  </label>
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="e.g. Dr. Raymond Chen"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    placeholder="founder@company.sg"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="+65 9123 4567"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Registered Address
                </label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Singapore Registered Business Address"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none"
                />
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
                  Save Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
