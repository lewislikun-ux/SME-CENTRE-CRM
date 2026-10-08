import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Advisor, SMECompany, Lead, MeetingNote, FollowUpAutomation, CommunicationLog } from '../types/crm';
import { INITIAL_ADVISORS, INITIAL_COMPANIES, INITIAL_LEADS, INITIAL_MEETING_NOTES, INITIAL_FOLLOW_UPS, INITIAL_COMMUNICATIONS } from '../data/initialData';

const SUPABASE_PROJECT_URL = 'https://utwcrmqxwddbgfeppirq.supabase.co';
// Default anonymous public key placeholder or read from user config / env
const DEFAULT_ANON_KEY = typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY 
  ? process.env.VITE_SUPABASE_ANON_KEY 
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0d2NybXF4d2RkYmdmZXBwaXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAwMDAwMDAsImV4cCI6MjAyNTU2MDAwMH0.mockKeyForResilientSync';

class SupabaseService {
  private client: SupabaseClient | null = null;
  private isConfigured: boolean = false;
  private currentUrl: string = SUPABASE_PROJECT_URL;
  private currentKey: string = DEFAULT_ANON_KEY;

  constructor() {
    this.init();
  }

  public init(url?: string, key?: string) {
    const savedUrl = localStorage.getItem('sme_supabase_url') || url || SUPABASE_PROJECT_URL;
    const savedKey = localStorage.getItem('sme_supabase_anon_key') || key || DEFAULT_ANON_KEY;

    this.currentUrl = savedUrl;
    this.currentKey = savedKey;

    try {
      if (savedUrl && savedKey) {
        this.client = createClient(savedUrl, savedKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
          }
        });
        this.isConfigured = true;
      }
    } catch (err) {
      console.warn('Supabase initialization fallback to local resilient store:', err);
      this.client = null;
      this.isConfigured = false;
    }
  }

  public getClient(): SupabaseClient | null {
    return this.client;
  }

  public getStatus() {
    return {
      url: this.currentUrl,
      isConfigured: this.isConfigured,
      hasKey: !!this.currentKey && this.currentKey !== DEFAULT_ANON_KEY,
    };
  }

  public updateCredentials(url: string, key: string) {
    localStorage.setItem('sme_supabase_url', url);
    localStorage.setItem('sme_supabase_anon_key', key);
    this.init(url, key);
  }

  // Resilient Local + Remote Sync Store
  public getStoredData<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(`sme_crm_${key}`);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
    }
    this.saveStoredData(key, fallback);
    return fallback;
  }

  public saveStoredData<T>(key: string, data: T): void {
    try {
      localStorage.setItem(`sme_crm_${key}`, JSON.stringify(data));
      // Try to sync with Supabase in background if client configured
      this.syncToSupabase(key, data).catch(() => {});
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  }

  private async syncToSupabase(tableKey: string, data: any) {
    if (!this.client || !this.isConfigured) return;
    try {
      // Map local keys to Supabase table names
      const tableMap: Record<string, string> = {
        'companies': 'sme_companies',
        'leads': 'sme_leads',
        'meeting_notes': 'meeting_minutes',
        'advisors': 'advisor_profiles'
      };
      const tableName = tableMap[tableKey];
      if (!tableName || !Array.isArray(data)) return;

      // Upsert in background
      await this.client.from(tableName).upsert(data, { onConflict: 'id' });
    } catch {
      // Supabase remote table might not yet exist; local storage persists reliably
    }
  }
}

export const supabaseService = new SupabaseService();
