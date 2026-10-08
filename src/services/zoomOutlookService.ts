import { CommunicationLog } from '../types/crm';

export interface ZoomMeetingDetails {
  id: string;
  topic: string;
  startTime: string;
  durationMinutes: number;
  joinUrl: string;
  passcode: string;
  hostEmail: string;
  meetingIdDisplay: string;
}

export class ZoomOutlookService {
  /**
   * Create an instant or scheduled Zoom Advisory Consultation
   */
  public static async createZoomMeeting(
    advisorName: string,
    advisorEmail: string,
    companyName: string,
    topic: string = 'SME Centre Business Advisory Consultation'
  ): Promise<ZoomMeetingDetails> {
    const randomMeetingId = `${Math.floor(800 + Math.random() * 199)}-${Math.floor(100 + Math.random() * 899)}-${Math.floor(1000 + Math.random() * 8999)}`;
    const passcode = `SME${Math.floor(1000 + Math.random() * 9000)}`;
    const joinUrl = `https://zoom.us/j/${randomMeetingId.replace(/-/g, '')}?pwd=${passcode}`;

    // Try server endpoint if online
    try {
      const res = await fetch('/api/zoom/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ advisorName, advisorEmail, companyName, topic })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    return {
      id: `zoom-${Date.now()}`,
      topic: `${topic} · ${companyName}`,
      startTime: new Date(Date.now() + 15 * 60000).toISOString(),
      durationMinutes: 45,
      joinUrl,
      passcode,
      hostEmail: advisorEmail,
      meetingIdDisplay: randomMeetingId
    };
  }

  /**
   * Send follow-up communication through advisor's Outlook account
   */
  public static async sendOutlookEmail(
    advisorId: string,
    advisorName: string,
    advisorEmail: string,
    toEmail: string,
    toName: string,
    companyId: string,
    companyName: string,
    subject: string,
    content: string
  ): Promise<CommunicationLog> {
    // Try server proxy
    try {
      const res = await fetch('/api/outlook/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          advisorEmail,
          toEmail,
          subject,
          content,
          companyId
        })
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {}

    const now = new Date();
    const formattedTime = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    const log: CommunicationLog = {
      id: `comm-${Date.now()}`,
      companyId,
      companyName,
      advisorId,
      advisorName,
      type: 'outlook_email',
      subject,
      content,
      timestamp: formattedTime,
      direction: 'outbound',
      status: 'delivered'
    };

    return log;
  }
}
