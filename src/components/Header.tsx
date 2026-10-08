import React, { useState } from 'react';
import { Advisor } from '../types/crm';
import { 
  Building2, 
  Search, 
  Sun, 
  Moon, 
  Video, 
  Mail, 
  Database, 
  ChevronDown, 
  UserCheck, 
  Plus, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentAdvisor: Advisor;
  allAdvisors: Advisor[];
  onSelectAdvisor: (advisor: Advisor) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenQuickAction: (action: string) => void;
  onGlobalSearch: (query: string) => void;
  supabaseConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentAdvisor,
  allAdvisors,
  onSelectAdvisor,
  darkMode,
  onToggleDarkMode,
  onOpenQuickAction,
  onGlobalSearch,
  supabaseConnected
}) => {
  const [showAdvisorMenu, setShowAdvisorMenu] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onGlobalSearch(e.target.value);
  };

  return (
    <header className="sticky top-0 z-40 w-full apple-glass border-b border-black/[0.08] dark:border-white/[0.08] transition-colors duration-200">
      <div className="flex items-center justify-between px-6 py-2.5 max-w-[1720px] mx-auto gap-4">
        {/* Zone 1: Brand Mark (Strict single text element / brand mark) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#0071E3] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            <Building2 className="w-4 h-4" />
          </div>
          <a href="#" className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <span>SME Centre Advisor CRM</span>
          </a>
        </div>

        {/* Zone 2: Search & Status Indicators */}
        <div className="flex-1 max-w-xl mx-auto flex items-center gap-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
            <input
              type="text"
              value={searchVal}
              onChange={handleSearchChange}
              placeholder="Search SME companies, UEN, contacts, or grant schemes..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-neutral-100/90 dark:bg-neutral-800/90 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 focus:bg-white dark:focus:bg-neutral-900 border border-transparent focus:border-[#0071E3]/50 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 outline-none transition-all"
            />
          </div>

          {/* Integration Status Badges */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 shrink-0">
            <div 
              title="Supabase Cloud: https://utwcrmqxwddbgfeppirq.supabase.co" 
              className="flex items-center gap-1.5 cursor-help"
            >
              <Database className={`w-3.5 h-3.5 ${supabaseConnected ? 'text-emerald-500' : 'text-neutral-400'}`} />
              <span className="text-[11px] font-medium">Supabase</span>
              <span className={`w-1.5 h-1.5 rounded-full ${supabaseConnected ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
            </div>

            <span className="text-neutral-300 dark:text-neutral-700">·</span>

            <div 
              title="Zoom Meetings Synchronized" 
              className="flex items-center gap-1.5 cursor-help"
            >
              <Video className="w-3.5 h-3.5 text-[#0071E3]" />
              <span className="text-[11px] font-medium">Zoom</span>
            </div>

            <span className="text-neutral-300 dark:text-neutral-700">·</span>

            <div 
              title="Outlook Business Email Connected" 
              className="flex items-center gap-1.5 cursor-help"
            >
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[11px] font-medium">Outlook</span>
            </div>
          </div>
        </div>

        {/* Zone 3: Actions, Dark Mode & Advisor Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Action Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-lg text-xs font-medium shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Action</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {showQuickMenu && (
              <div 
                className="absolute right-0 mt-1.5 w-56 rounded-xl apple-card py-1.5 z-50 text-xs shadow-xl animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setShowQuickMenu(false)}
              >
                <button
                  onClick={() => onOpenQuickAction('meeting')}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>Start AI Advisory Meeting</span>
                </button>
                <button
                  onClick={() => onOpenQuickAction('sgp-lookup')}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
                >
                  <Search className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Search SGP Business Directory</span>
                </button>
                <button
                  onClick={() => onOpenQuickAction('new-company')}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Register SME Company</span>
                </button>
                <button
                  onClick={() => onOpenQuickAction('new-advisor')}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Add Advisor Profile</span>
                </button>
              </div>
            )}
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
          </button>

          {/* Advisor Selector / Profile Button */}
          <div className="relative">
            <button
              onClick={() => setShowAdvisorMenu(!showAdvisorMenu)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-neutral-200/80 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer text-left"
            >
              {currentAdvisor.avatarUrl ? (
                <img
                  src={currentAdvisor.avatarUrl}
                  alt={currentAdvisor.name}
                  className="w-6 h-6 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-[11px] font-semibold flex items-center justify-center">
                  {currentAdvisor.name.charAt(0)}
                </div>
              )}
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate max-w-[130px]">
                  {currentAdvisor.name}
                </p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate max-w-[130px]">
                  {currentAdvisor.role}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {showAdvisorMenu && (
              <div 
                className="absolute right-0 mt-1.5 w-64 rounded-xl apple-card py-2 z-50 text-xs shadow-xl animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setShowAdvisorMenu(false)}
              >
                <div className="px-3 pb-2 mb-1 border-b border-neutral-100 dark:border-neutral-800">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">Switch Active Advisor</p>
                  <p className="text-[10px] text-neutral-500">Test Role-Based Access Control (RBAC)</p>
                </div>
                {allAdvisors.map((adv) => (
                  <button
                    key={adv.id}
                    onClick={() => onSelectAdvisor(adv)}
                    className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-neutral-800 dark:text-neutral-200">{adv.name}</p>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{adv.role}</p>
                    </div>
                    {adv.id === currentAdvisor.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
