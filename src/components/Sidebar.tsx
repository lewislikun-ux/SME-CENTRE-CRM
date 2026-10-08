import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  GitPullRequest, 
  Sparkles, 
  Clock, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut,
  ShieldAlert,
  Search
} from 'lucide-react';
import { Advisor } from '../types/crm';

export type NavTab = 
  | 'dashboard'
  | 'contacts'
  | 'leads'
  | 'meetings'
  | 'followups'
  | 'reports'
  | 'advisors'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentAdvisor: Advisor;
  activeLeadCount: number;
  pendingFollowUpsCount: number;
  onOpenSgpModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentAdvisor,
  activeLeadCount,
  pendingFollowUpsCount,
  onOpenSgpModal
}) => {
  const isSuperAdmin = currentAdvisor.role === 'Super Admin / Centre Director';

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'contacts' as NavTab,
      label: 'SME Companies',
      icon: Building2,
      badge: null
    },
    {
      id: 'leads' as NavTab,
      label: 'Lead Pipeline',
      icon: GitPullRequest,
      badge: activeLeadCount > 0 ? activeLeadCount : null
    },
    {
      id: 'meetings' as NavTab,
      label: 'Advisory Studio & AI',
      icon: Sparkles,
      badge: 'Meetily'
    },
    {
      id: 'followups' as NavTab,
      label: 'Automated Follow-ups',
      icon: Clock,
      badge: pendingFollowUpsCount > 0 ? pendingFollowUpsCount : null
    },
    {
      id: 'reports' as NavTab,
      label: 'Reporting & Analytics',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'advisors' as NavTab,
      label: 'Advisors & RBAC',
      icon: Users,
      badge: isSuperAdmin ? 'Admin' : null
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings & Cloud',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-64 shrink-0 h-[calc(100vh-50px)] sticky top-[50px] flex flex-col justify-between p-3 border-r border-black/[0.08] dark:border-white/[0.08] bg-neutral-50/50 dark:bg-neutral-950/50 transition-colors">
      <div className="space-y-4">
        {/* SGP Business Quick Launcher Button */}
        <button
          onClick={onOpenSgpModal}
          className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/15 hover:to-teal-500/15 border border-emerald-500/20 rounded-xl text-xs font-medium text-emerald-800 dark:text-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>SGP Business Directory</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            ACRA
          </span>
        </button>

        {/* Primary Navigation List */}
        <nav className="space-y-0.5">
          <p className="px-3 text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
            Workspace
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-neutral-800 text-[#0071E3] dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0071E3]' : 'text-neutral-500 dark:text-neutral-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md tabular-nums ${
                      isActive
                        ? 'bg-[#0071E3]/10 text-[#0071E3] dark:text-[#388bfd]'
                        : 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Advisor Account Footer Card */}
      <div className="p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300">
              Active Advisor
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">
            {currentAdvisor.department.split(' ')[0]}
          </span>
        </div>

        <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
          {currentAdvisor.name}
        </p>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
          {currentAdvisor.email}
        </p>

        <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
          <span>Assigned SMEs</span>
          <span className="font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">
            {currentAdvisor.assignedSmeCount}
          </span>
        </div>
      </div>
    </aside>
  );
};
