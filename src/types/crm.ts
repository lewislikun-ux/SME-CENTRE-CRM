export type UserRole = 
  | 'Super Admin / Centre Director'
  | 'Senior Business Advisor'
  | 'Business Advisor'
  | 'Associate Advisor';

export interface Advisor {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  phone: string;
  active: boolean;
  zoomConnected: boolean;
  zoomPersonalId: string;
  outlookConnected: boolean;
  outlookEmail: string;
  assignedSmeCount: number;
  totalGrantsFacilitated: number;
  createdAt: string;
}

export type EntityStatus = 'Live Company' | 'In Liquidation' | 'Struck Off';

export interface SMECompany {
  id: string;
  uen: string; // Singapore Unique Entity Number
  legalName: string;
  tradeName?: string;
  industry: string;
  ssicCode: string;
  ssicDescription: string;
  incorporationDate: string;
  paidUpCapital: string;
  registeredAddress: string;
  postalCode: string;
  employeeCount: number;
  annualRevenue: string;
  contactPersonName: string;
  contactDesignation: string;
  contactEmail: string;
  contactPhone: string;
  status: 'Active Advisory' | 'Pending Review' | 'Graduated' | 'Dormant';
  assignedAdvisorId: string;
  assignedAdvisorName: string;
  sgpVerified: boolean;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadStage = 
  | 'inquiry'
  | 'diagnostic'
  | 'grant_scoping'
  | 'application'
  | 'completed';

export type LeadPriority = 'high' | 'medium' | 'low';

export interface Lead {
  id: string;
  companyId: string;
  companyName: string;
  uen: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  stage: LeadStage;
  priority: LeadPriority;
  targetGrant: string; // e.g., 'EDG (Enterprise Development Grant)', 'PSG (Productivity Solutions Grant)'
  estimatedGrantValue: number;
  readinessScore: number; // 0-100
  assignedAdvisorId: string;
  assignedAdvisorName: string;
  source: 'Online Portal' | 'Walk-in' | 'Enterprise SG Referral' | 'Partner Trade Association';
  nextFollowUpDate: string;
  lastContactedAt: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActionItem {
  id: string;
  task: string;
  owner: string; // Advisor or SME Contact
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface GrantRecommendation {
  name: string;
  administeringAgency: string; // Enterprise Singapore, IMDA, WSG, etc.
  supportCoverage: string; // e.g. Up to 50% or 70% funding support
  eligibilityNotes: string;
  recommendedScope: string;
}

export interface MeetingNote {
  id: string;
  companyId: string;
  companyName: string;
  uen: string;
  advisorId: string;
  advisorName: string;
  meetingTitle: string;
  meetingDate: string;
  durationMinutes: number;
  channel: 'Zoom Video' | 'In-Person (SME Centre)' | 'Microsoft Teams' | 'Phone Call';
  zoomMeetingUrl?: string;
  attendees: string[];
  rawTranscript: string;
  executiveSummary: string;
  keyDiscussionPoints: string[];
  sentimentScore: number; // 0 - 100
  sentimentTone: 'Very Positive' | 'Receptive & Growth-Oriented' | 'Cautious' | 'Stressed / Struggling' | 'Neutral';
  sentimentObservations: string;
  actionItems: ActionItem[];
  grantRecommendations: GrantRecommendation[];
  sgpDataAttached: boolean;
  pdfExportedAt?: string;
  createdAt: string;
}

export interface FollowUpAutomation {
  id: string;
  name: string;
  description: string;
  triggerEvent: 'Post-Advisory Consultation' | 'Lead Inactive 7 Days' | 'Grant Submission Due' | 'Quarterly Check-In';
  delayDays: number;
  channel: 'Outlook Email' | 'Advisor Task Alert' | 'SMS Reminder';
  emailSubjectTemplate: string;
  emailBodyTemplate: string;
  active: boolean;
  lastRun?: string;
  sendsCount: number;
}

export interface CommunicationLog {
  id: string;
  companyId: string;
  companyName: string;
  advisorId: string;
  advisorName: string;
  type: 'outlook_email' | 'zoom_meeting' | 'advisory_call' | 'in_person_note';
  subject: string;
  content: string;
  timestamp: string;
  direction: 'outbound' | 'inbound';
  status: 'delivered' | 'read' | 'scheduled';
}

export interface SgpDirectoryEntity {
  uen: string;
  entityName: string;
  entityStatus: EntityStatus;
  entityType: string;
  ssicCode: string;
  ssicDescription: string;
  incorporationDate: string;
  paidUpCapital: string;
  registeredAddress: string;
  postalCode: string;
  keyOfficers: { name: string; designation: string }[];
  sourceUrl: string;
  verifiedFromDirectory: boolean;
}
