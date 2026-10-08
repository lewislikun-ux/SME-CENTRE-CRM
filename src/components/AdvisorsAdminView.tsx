import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Video, 
  Phone, 
  CheckCircle2, 
  X, 
  UserCheck, 
  Key,
  Shield,
  Building
} from 'lucide-react';
import { Advisor, UserRole } from '../types/crm';

interface AdvisorsAdminViewProps {
  advisors: Advisor[];
  currentAdvisor: Advisor;
  onSelectAdvisor: (advisor: Advisor) => void;
  onAddAdvisor: (advisor: Advisor) => void;
}

const ROLES: UserRole[] = [
  'Super Admin / Centre Director',
  'Senior Business Advisor',
  'Business Advisor',
  'Associate Advisor'
];

export const AdvisorsAdminView: React.FC<AdvisorsAdminViewProps> = ({
  advisors,
  currentAdvisor,
  onSelectAdvisor,
  onAddAdvisor
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Business Advisor');
  const [department, setDepartment] = useState('Digitalisation & Capability Upgrading');
  const [phone, setPhone] = useState('+65 6826 3088');
  const [zoomId, setZoomId] = useState('800-123-4567');
  const [successMsg, setSuccessMsg] = useState(false);

  const isSuperAdmin = currentAdvisor.role === 'Super Admin / Centre Director';

  const handleCreateAdvisor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;

    const newAdv: Advisor = {
      id: `adv-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      department,
      phone,
      active: true,
      zoomConnected: true,
      zoomPersonalId: zoomId,
      outlookConnected: true,
      outlookEmail: email.trim().toLowerCase(),
      assignedSmeCount: 0,
      totalGrantsFacilitated: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddAdvisor(newAdv);
    setShowAddModal(false);
    setName('');
    setEmail('');
    setPassword('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Advisor Profiles & Role-Based Access Control
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Manage advisor accounts, security credentials, and Enterprise Singapore permission tiers
          </p>
        </div>

        <div className="flex items-center gap-3">
          {successMsg && (
            <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Advisor profile registered!
            </span>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Business Advisor</span>
          </button>
        </div>
      </div>

      {/* Role-Based Access Control Privileges Guide */}
      <div className="apple-card rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0071E3]" />
          <span>Role-Based Access Control (RBAC) Matrix</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 text-xs">
          {[
            {
              role: 'Super Admin / Centre Director',
              desc: 'Full administrative governance, advisor credential onboarding, system integrations (Supabase, Zoom, Outlook), and enterprise performance reporting.',
              badge: 'Highest Clearance'
            },
            {
              role: 'Senior Business Advisor',
              desc: 'Leads complex Enterprise Development Grant (EDG) diagnostics, reviews junior advisor minutes, oversees cross-sector capability projects.',
              badge: 'Senior Clearance'
            },
            {
              role: 'Business Advisor',
              desc: 'Conducts diagnostic consultations, generates AI meeting minutes, manages assigned SME accounts, and dispatches automated follow-up cadences.',
              badge: 'Standard Clearance'
            },
            {
              role: 'Associate Advisor',
              desc: 'Intake triage, preliminary company profile verification via SGP Business Directory, assists with grant documentation checklists.',
              badge: 'Advisory Associate'
            }
          ].map((r, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {r.badge}
              </span>
              <p className="font-bold text-neutral-900 dark:text-neutral-100">
                {r.role}
              </p>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Advisors Roster Table */}
      <div className="apple-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Registered SME Centre Advisors ({advisors.length})
            </h2>
            <p className="text-xs text-neutral-500">
              Switch current advisor to simulate different user roles across the webapp
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-neutral-500">
                <th className="py-3 px-4 font-semibold">ADVISOR & WORK EMAIL</th>
                <th className="py-3 px-4 font-semibold">ROLE</th>
                <th className="py-3 px-4 font-semibold">DEPARTMENT</th>
                <th className="py-3 px-4 font-semibold">INTEGRATIONS</th>
                <th className="py-3 px-4 font-semibold">ASSIGNED SMES</th>
                <th className="py-3 px-4 font-semibold text-right">SESSION SIMULATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {advisors.map((adv) => {
                const isCurrent = adv.id === currentAdvisor.id;

                return (
                  <tr key={adv.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {adv.avatarUrl ? (
                          <img
                            src={adv.avatarUrl}
                            alt={adv.name}
                            className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold flex items-center justify-center">
                            {adv.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {adv.name}
                          </p>
                          <p className="text-[11px] text-neutral-500 font-mono">
                            {adv.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                        adv.role.includes('Director') 
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          : adv.role.includes('Senior')
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                      }`}>
                        {adv.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400">
                      {adv.department}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 text-neutral-500">
                        <span className="flex items-center gap-1 text-[11px] text-[#0071E3]">
                          <Video className="w-3 h-3" />
                          Zoom
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-[11px] text-blue-500">
                          <Mail className="w-3 h-3" />
                          Outlook
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-neutral-800 dark:text-neutral-200 tabular-nums">
                      {adv.assignedSmeCount}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isCurrent ? (
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Logged In
                        </span>
                      ) : (
                        <button
                          onClick={() => onSelectAdvisor(adv)}
                          className="px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium transition-colors cursor-pointer"
                        >
                          Switch User
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Advisor Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-lg bg-white dark:bg-[#161618] rounded-2xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Register New Business Advisor
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAdvisor} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jason Koh Zhi Wei"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jason.koh@smecentre.org.sg"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Password / Credentials
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Advisor Role Tier
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer"
                  >
                    {ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Advisory Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer"
                  >
                    <option value="Digitalisation & Capability Upgrading">Digitalisation & Capability</option>
                    <option value="Productivity & Automation">Productivity & Automation</option>
                    <option value="Market Access & Overseas Expansion">Market Access & Expansion</option>
                    <option value="Executive Leadership & Strategy">Leadership & Strategy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Office Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+65 6826 3000"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Personal Zoom ID
                  </label>
                  <input
                    type="text"
                    value={zoomId}
                    onChange={(e) => setZoomId(e.target.value)}
                    placeholder="923-441-2091"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 font-mono outline-none"
                  />
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
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
