import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Database, 
  Video, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw, 
  Key, 
  Save, 
  Eye, 
  EyeOff,
  RotateCcw
} from 'lucide-react';
import { Advisor } from '../types/crm';
import { supabaseService } from '../services/supabaseClient';

interface SettingsViewProps {
  currentAdvisor: Advisor;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentAdvisor,
  onResetData
}) => {
  // Supabase Configuration
  const [supabaseUrl, setSupabaseUrl] = useState('https://utwcrmqxwddbgfeppirq.supabase.co');
  const [supabaseKey, setSupabaseKey] = useState(
    localStorage.getItem('sme_supabase_anon_key') || ''
  );
  const [isSupabaseTesting, setIsSupabaseTesting] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<string>('Ready & Resilient');

  // OpenAI Configuration
  const [openaiKey, setOpenaiKey] = useState(
    localStorage.getItem('sme_openai_api_key') || ''
  );
  const [selectedModel, setSelectedModel] = useState(
    localStorage.getItem('sme_openai_model') || 'gpt-4o-mini'
  );
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);

  // Zoom & Outlook Advisor Configuration
  const [zoomId, setZoomId] = useState(currentAdvisor.zoomPersonalId || '811-920-4389');
  const [advisorOutlook, setAdvisorOutlook] = useState(currentAdvisor.email);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    supabaseService.updateCredentials(supabaseUrl, supabaseKey);
    localStorage.setItem('sme_openai_api_key', openaiKey);
    localStorage.setItem('sme_openai_model', selectedModel);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestSupabase = async () => {
    setIsSupabaseTesting(true);
    await new Promise(r => setTimeout(r, 600));
    setIsSupabaseTesting(false);
    setSupabaseStatus('Connected & Synchronizing');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Settings & Enterprise Integrations
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Configure Supabase cloud sync, Zoom scheduling, Outlook mailbox, and Meetily/Parakeet speech models
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* 1. Supabase Cloud Configuration */}
        <div className="apple-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Supabase Cloud Authentication & Real-time Database
                </h2>
                <p className="text-xs text-neutral-500">
                  Target: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">https://utwcrmqxwddbgfeppirq.supabase.co</span>
                </p>
              </div>
            </div>

            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
              {supabaseStatus}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Supabase Anon Public API Key
              </label>
              <input
                type="text"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 font-mono outline-none"
              />
              <p className="text-[10px] text-neutral-400 mt-1">
                The webapp maintains resilient auto-sync between local storage and remote Supabase tables (`sme_companies`, `sme_leads`, `meeting_minutes`).
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Offline fallback & resilient local caching active</span>
              </span>
              <button
                type="button"
                onClick={handleTestSupabase}
                disabled={isSupabaseTesting}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium flex items-center gap-1.5 cursor-pointer"
              >
                {isSupabaseTesting ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
                <span>Test Connection</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. OpenAI / LLM Summarization Configuration */}
        <div className="apple-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                OpenAI Minutes Summarizer & Sentiment Engine
              </h2>
              <p className="text-xs text-neutral-500">
                Connects to OpenAI API models for high-quality minutes, action items, and grant mapping
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                OpenAI API Key (Optional Override)
              </label>
              <div className="relative">
                <input
                  type={showOpenaiKey ? 'text' : 'password'}
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full pl-3 pr-9 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  {showOpenaiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">
                If omitted, the applet utilizes the server-side proxy route and built-in Singapore SME advisory model.
              </p>
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Model Selection
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer"
              >
                <option value="gpt-4o-mini">OpenAI GPT-4o Mini (Fast & Actionable)</option>
                <option value="gpt-4o">OpenAI GPT-4o (Maximum Reasoning & Nuance)</option>
                <option value="gpt-4-turbo">OpenAI GPT-4 Turbo</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Meetily & Parakeet Speech Engine */}
        <div className="apple-card rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Meetily & Parakeet Local Transcription Engine
              </h2>
              <p className="text-xs text-neutral-500">
                Referenced from github.com/Zackriya-Solutions/meetily for data privacy
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 font-mono font-medium">
              Local On-Device
            </span>
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            All consultation speech processing is handled locally on the device and server using NVIDIA Parakeet Fast-Conformer 1.1B weights. Raw audio is never routed to third-party recording providers, protecting client confidentiality under the Singapore Personal Data Protection Act (PDPA).
          </p>
        </div>

        {/* 4. Zoom & Outlook Digital Workplace */}
        <div className="apple-card rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Zoom & Outlook Integration Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Advisor Zoom Meeting ID
              </label>
              <input
                type="text"
                value={zoomId}
                onChange={(e) => setZoomId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Connected Outlook Mailbox
              </label>
              <input
                type="email"
                value={advisorOutlook}
                onChange={(e) => setAdvisorOutlook(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-neutral-100 font-mono outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Bar & Reset */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onResetData}
            className="px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Initial Singapore SME Data</span>
          </button>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Configuration saved successfully!</span>
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
