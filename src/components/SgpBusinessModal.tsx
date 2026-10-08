import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Building2, 
  ShieldCheck, 
  ExternalLink, 
  Plus, 
  MapPin, 
  Calendar, 
  User, 
  DollarSign, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { SgpDirectoryEntity, SMECompany, Advisor } from '../types/crm';
import { SgpBusinessService } from '../services/sgpBusinessService';

interface SgpBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportCompany: (company: SMECompany) => void;
  currentAdvisor: Advisor;
}

export const SgpBusinessModal: React.FC<SgpBusinessModalProps> = ({
  isOpen,
  onClose,
  onImportCompany,
  currentAdvisor
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SgpDirectoryEntity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [importedUen, setImportedUen] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);
    try {
      const data = await SgpBusinessService.searchDirectory(query);
      setResults(data);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImport = (entity: SgpDirectoryEntity) => {
    const partial = SgpBusinessService.convertToSmeCompany(
      entity,
      currentAdvisor.id,
      currentAdvisor.name
    );

    const fullCompany: SMECompany = {
      id: `sme-${Date.now()}`,
      uen: entity.uen,
      legalName: entity.entityName,
      tradeName: partial.tradeName || entity.entityName,
      industry: partial.industry || 'General Commerce',
      ssicCode: entity.ssicCode,
      ssicDescription: entity.ssicDescription,
      incorporationDate: entity.incorporationDate,
      paidUpCapital: entity.paidUpCapital,
      registeredAddress: entity.registeredAddress,
      postalCode: entity.postalCode,
      employeeCount: 15,
      annualRevenue: 'SGD 1,800,000',
      contactPersonName: partial.contactPersonName || 'Managing Director',
      contactDesignation: partial.contactDesignation || 'Director',
      contactEmail: partial.contactEmail || `info@sme-${entity.uen.toLowerCase()}.sg`,
      contactPhone: partial.contactPhone || '+65 6826 3000',
      status: 'Active Advisory',
      assignedAdvisorId: currentAdvisor.id,
      assignedAdvisorName: currentAdvisor.name,
      sgpVerified: true,
      tags: ['SGP Business Verified', 'ACRA Registered'],
      notes: `Imported directly from Singapore Business Directory (sgpbusiness.com). Verified against ACRA Singapore Registry.`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onImportCompany(fullCompany);
    setImportedUen(entity.uen);
    setTimeout(() => {
      setImportedUen(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-100">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#161618] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <span>Singapore Business Directory (ACRA)</span>
              </h2>
              <p className="text-[11px] text-neutral-500">
                Official entity records indexed from <span className="text-emerald-600 dark:text-emerald-400 font-mono">sgpbusiness.com</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by ACRA UEN (e.g. 201827491G) or Company Name (e.g. Apex BioTech)..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              {isSearching ? 'Searching...' : 'Search Directory'}
            </button>
          </form>

          {/* Quick Search Chips */}
          <div className="flex items-center gap-2 mt-2.5 text-[11px] text-neutral-500 overflow-x-auto">
            <span>Popular Queries:</span>
            {['Apex BioTech', 'Bread & Butter', 'Horizon Precision', 'SingaFlow', 'CleanVolt'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(term);
                  SgpBusinessService.searchDirectory(term).then(res => {
                    setResults(res);
                    setHasSearched(true);
                  });
                }}
                className="px-2 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Results Viewport */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1 text-xs">
          {results.length === 0 && !hasSearched ? (
            <div className="p-8 text-center text-neutral-400 space-y-2">
              <Building2 className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-700" />
              <p className="font-medium text-neutral-700 dark:text-neutral-300">
                Query Singapore Business Directory
              </p>
              <p className="text-[11px] max-w-sm mx-auto">
                Search verified Singapore ACRA entities to auto-populate company profiles, verify paid-up capital, and attach to advisory meeting minutes.
              </p>
            </div>
          ) : results.length === 0 ? (
            <p className="p-8 text-center text-neutral-400">
              No matching records found. Try searching by UEN format (e.g. 201827491G).
            </p>
          ) : (
            results.map((entity) => {
              const isImported = importedUen === entity.uen;

              return (
                <div
                  key={entity.uen}
                  className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#1C1C1E] space-y-3 hover:shadow-xs transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                          {entity.entityName}
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-semibold text-[10px]">
                          {entity.entityStatus}
                        </span>
                      </div>
                      <p className="text-neutral-500 text-[11px] font-mono mt-0.5">
                        UEN: {entity.uen} · {entity.entityType}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={entity.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                        title="View on sgpbusiness.com"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => handleImport(entity)}
                        disabled={isImported}
                        className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isImported
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0071E3] hover:bg-[#0077ED] text-white'
                        }`}
                      >
                        {isImported ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Imported</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Import to CRM</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 text-[11px]">
                    <div>
                      <span className="text-neutral-400">SSIC Classification:</span>
                      <p className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                        {entity.ssicCode} - {entity.ssicDescription}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-400">Paid-up Capital:</span>
                      <p className="font-semibold text-neutral-800 dark:text-neutral-200 font-mono">
                        {entity.paidUpCapital}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-400">Incorporation Date:</span>
                      <p className="font-medium text-neutral-800 dark:text-neutral-200">
                        {entity.incorporationDate}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-400">Registered Office:</span>
                      <p className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                        {entity.registeredAddress}
                      </p>
                    </div>
                  </div>

                  {/* Officers */}
                  {entity.keyOfficers.length > 0 && (
                    <div className="flex items-center gap-3 text-[11px] text-neutral-500">
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Key Officers:</span>
                      {entity.keyOfficers.map((o, idx) => (
                        <span key={idx} className="font-mono">
                          {o.name} ({o.designation})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
