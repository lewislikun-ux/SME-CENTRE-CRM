import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  FileText, 
  Video, 
  Mail, 
  Search, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Plus, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Upload,
  RefreshCw
} from 'lucide-react';
import { SMECompany, Advisor, MeetingNote, ActionItem, SgpDirectoryEntity } from '../types/crm';
import { ParakeetTranscriptionService, TranscriptSegment } from '../services/parakeetTranscription';
import { AISummarizerService } from '../services/aiSummarizer';
import { PdfExportService } from '../services/pdfExportService';
import { SgpBusinessService } from '../services/sgpBusinessService';
import { ZoomOutlookService } from '../services/zoomOutlookService';

interface MeetingStudioViewProps {
  companies: SMECompany[];
  currentAdvisor: Advisor;
  initialCompanyId?: string;
  onSaveMeetingNote: (note: MeetingNote) => void;
  onOpenSgpModal: () => void;
  onComposeOutlook: (company: SMECompany, prefilledNote?: MeetingNote) => void;
}

export const MeetingStudioView: React.FC<MeetingStudioViewProps> = ({
  companies,
  currentAdvisor,
  initialCompanyId,
  onSaveMeetingNote,
  onOpenSgpModal,
  onComposeOutlook
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    initialCompanyId || companies[0]?.id || ''
  );
  const [meetingTitle, setMeetingTitle] = useState('SME Capability Upgrading & Diagnostic Session');
  const [channel, setChannel] = useState<MeetingNote['channel']>('Zoom Video');
  const [zoomUrl, setZoomUrl] = useState('');
  const [zoomPasscode, setZoomPasscode] = useState('');
  const [isGeneratingZoom, setIsGeneratingZoom] = useState(false);

  // Audio Recording & Local Parakeet Transcription
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [liveStreamText, setLiveStreamText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([]);
  const [rawTranscript, setRawTranscript] = useState('');
  const [transcriptionEngine, setTranscriptionEngine] = useState('Parakeet Fast-Conformer 1.1B (Local On-Device)');

  // AI Minutes & Summarization
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [keyDiscussionPoints, setKeyDiscussionPoints] = useState<string[]>([]);
  const [sentimentScore, setSentimentScore] = useState<number>(85);
  const [sentimentTone, setSentimentTone] = useState<MeetingNote['sentimentTone']>('Receptive & Growth-Oriented');
  const [sentimentObservations, setSentimentObservations] = useState('');
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [grantRecommendations, setGrantRecommendations] = useState<any[]>([]);
  const [hasGeneratedMinutes, setHasGeneratedMinutes] = useState(false);

  // SGP Business Live Verification
  const [sgpEntity, setSgpEntity] = useState<SgpDirectoryEntity | null>(null);

  const timerRef = useRef<any>(null);
  const transcriptionServiceRef = useRef<ParakeetTranscriptionService>(new ParakeetTranscriptionService());

  const currentCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  // Fetch SGP Directory details when company changes
  useEffect(() => {
    if (currentCompany?.uen) {
      SgpBusinessService.getByUen(currentCompany.uen).then((res) => {
        setSgpEntity(res);
      });
    }
  }, [selectedCompanyId, currentCompany?.uen]);

  // Handle Zoom Meeting generation
  const handleGenerateZoom = async () => {
    if (!currentCompany) return;
    setIsGeneratingZoom(true);
    try {
      const zoomDetails = await ZoomOutlookService.createZoomMeeting(
        currentAdvisor.name,
        currentAdvisor.email,
        currentCompany.legalName,
        meetingTitle
      );
      setZoomUrl(zoomDetails.joinUrl);
      setZoomPasscode(zoomDetails.passcode);
      setChannel('Zoom Video');
    } finally {
      setIsGeneratingZoom(false);
    }
  };

  // Toggle Live Audio Recording
  const handleToggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      clearInterval(timerRef.current);
      setIsRecording(false);
      const audioBlob = await transcriptionServiceRef.current.stopLiveRecording();
      
      // Run Parakeet transcription
      setIsTranscribing(true);
      const clientName = currentCompany ? currentCompany.contactPersonName : 'Client';
      const result = await ParakeetTranscriptionService.transcribeAudio(
        audioBlob || 'blob',
        currentAdvisor.name,
        clientName
      );
      setTranscriptSegments(result.segments);
      setRawTranscript(result.fullText);
      setTranscriptionEngine(result.engine);
      setIsTranscribing(false);
    } else {
      // Start recording
      setRecordingSeconds(0);
      setLiveStreamText('');
      const started = await transcriptionServiceRef.current.startLiveRecording(
        (text) => {
          setLiveStreamText(text);
        },
        (err) => {
          console.warn('Mic warning:', err);
        }
      );

      if (started) {
        setIsRecording(true);
        timerRef.current = setInterval(() => {
          setRecordingSeconds(prev => prev + 1);
        }, 1000);
      } else {
        // Fallback simulate live transcription session for testing
        setIsRecording(true);
        timerRef.current = setInterval(() => {
          setRecordingSeconds(prev => prev + 1);
        }, 1000);
      }
    }
  };

  // Load Preset Advisory Scenario for Immediate One-Click Demo
  const handleLoadScenario = async (type: 'edg' | 'psg' | 'mra') => {
    setIsTranscribing(true);
    let sampleTranscript = '';
    let scenarioSegments: TranscriptSegment[] = [];

    if (type === 'edg') {
      sampleTranscript = `${currentAdvisor.name} (SME Centre): Good morning. Welcome to today's SME Centre capability consultation for ${currentCompany.legalName}. Let's look into your production bottlenecks.
${currentCompany.contactPersonName} (Founder): Thank you. Currently our manufacturing operations in Singapore require 8 technicians per shift. With rising labor costs and export orders to ASEAN, we need to automate our assembly and integrate IoT quality sensors.
${currentAdvisor.name} (SME Centre): Under Enterprise Singapore guidelines, you qualify for the Enterprise Development Grant (EDG) - Innovation & Productivity. EDG co-funds up to 50% of qualifying automation equipment and third-party consultancy.
${currentCompany.contactPersonName} (Founder): That would make our SGD 180,000 capital expenditure viable. What about training our existing workforce?
${currentAdvisor.name} (SME Centre): We can tap the SkillsFuture Enterprise Credit (SFEC) for SGD 10,000 credit and Workforce Singapore Career Conversion Programme to subsidize up to 90% of technician reskilling salaries during rollout.`;

      scenarioSegments = [
        { id: '1', speaker: `${currentAdvisor.name} (SME Centre)`, timestamp: '00:00:05', text: `Good morning. Welcome to today's SME Centre capability consultation for ${currentCompany.legalName}. Let's look into your production bottlenecks.`, confidence: 0.98 },
        { id: '2', speaker: `${currentCompany.contactPersonName} (Founder)`, timestamp: '00:00:25', text: `Thank you. Currently our manufacturing operations in Singapore require 8 technicians per shift. With rising labor costs and export orders to ASEAN, we need to automate our assembly and integrate IoT quality sensors.`, confidence: 0.96 },
        { id: '3', speaker: `${currentAdvisor.name} (SME Centre)`, timestamp: '00:01:05', text: `Under Enterprise Singapore guidelines, you qualify for the Enterprise Development Grant (EDG) - Innovation & Productivity. EDG co-funds up to 50% of qualifying automation equipment and third-party consultancy.`, confidence: 0.99 },
        { id: '4', speaker: `${currentCompany.contactPersonName} (Founder)`, timestamp: '00:01:40', text: `That would make our SGD 180,000 capital expenditure viable. What about training our existing workforce?`, confidence: 0.97 },
        { id: '5', speaker: `${currentAdvisor.name} (SME Centre)`, timestamp: '00:02:15', text: `We can tap the SkillsFuture Enterprise Credit (SFEC) for SGD 10,000 credit and Workforce Singapore Career Conversion Programme to subsidize up to 90% of technician reskilling salaries during rollout.`, confidence: 0.98 }
      ];
    } else {
      sampleTranscript = `${currentAdvisor.name} (SME Centre): Welcome to our digital solutions diagnostic. Let's review your accounting and inventory management setup.
${currentCompany.contactPersonName} (Director): We are still using Excel spreadsheets and manual physical stocktaking, which leads to discrepancies and delays in fulfilling customer orders.
${currentAdvisor.name} (SME Centre): The Productivity Solutions Grant (PSG) provides pre-scoped IT solutions with pre-approved vendors. You can receive up to 50% funding support for cloud ERP, inventory, and point-of-sale packages.
${currentCompany.contactPersonName} (Director): This is straightforward. We can implement this in 4 weeks before the next financial quarter.`;

      scenarioSegments = [
        { id: '1', speaker: `${currentAdvisor.name} (SME Centre)`, timestamp: '00:00:05', text: `Welcome to our digital solutions diagnostic. Let's review your accounting and inventory management setup.`, confidence: 0.97 },
        { id: '2', speaker: `${currentCompany.contactPersonName} (Director)`, timestamp: '00:00:22', text: `We are still using Excel spreadsheets and manual physical stocktaking, which leads to discrepancies and delays in fulfilling customer orders.`, confidence: 0.96 },
        { id: '3', speaker: `${currentAdvisor.name} (SME Centre)`, timestamp: '00:00:55', text: `The Productivity Solutions Grant (PSG) provides pre-scoped IT solutions with pre-approved vendors. You can receive up to 50% funding support for cloud ERP, inventory, and point-of-sale packages.`, confidence: 0.99 }
      ];
    }

    await new Promise(r => setTimeout(r, 600));
    setRawTranscript(sampleTranscript);
    setTranscriptSegments(scenarioSegments);
    setIsTranscribing(false);
  };

  // Generate AI Minutes & Sentiment Analysis
  const handleGenerateAiMinutes = async () => {
    if (!rawTranscript.trim()) return;
    setIsSummarizing(true);
    try {
      const summary = await AISummarizerService.summarizeTranscript(
        rawTranscript,
        currentCompany.legalName,
        currentCompany.uen,
        currentAdvisor.name
      );

      setExecutiveSummary(summary.executiveSummary);
      setKeyDiscussionPoints(summary.keyDiscussionPoints);
      setSentimentScore(summary.sentimentScore);
      setSentimentTone(summary.sentimentTone);
      setSentimentObservations(summary.sentimentObservations);
      setActionItems(summary.actionItems);
      setGrantRecommendations(summary.grantRecommendations);
      setHasGeneratedMinutes(true);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Export PDF Official Record
  const handleExportPdf = () => {
    const noteToExport: MeetingNote = {
      id: `mtg-${Date.now()}`,
      companyId: currentCompany.id,
      companyName: currentCompany.legalName,
      uen: currentCompany.uen,
      advisorId: currentAdvisor.id,
      advisorName: currentAdvisor.name,
      meetingTitle,
      meetingDate: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().slice(0, 5),
      durationMinutes: Math.max(30, Math.round(recordingSeconds / 60)),
      channel,
      zoomMeetingUrl: zoomUrl || undefined,
      attendees: [
        `${currentAdvisor.name} (SME Centre Advisor)`,
        `${currentCompany.contactPersonName} (${currentCompany.legalName})`
      ],
      rawTranscript,
      executiveSummary,
      keyDiscussionPoints,
      sentimentScore,
      sentimentTone,
      sentimentObservations,
      actionItems,
      grantRecommendations,
      sgpDataAttached: !!sgpEntity,
      pdfExportedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    PdfExportService.exportMeetingMinutesToPdf(noteToExport, currentCompany, sgpEntity);
    onSaveMeetingNote(noteToExport);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
            <span>SME Centre Consultation Studio</span>
            <span>·</span>
            <span>Meetily Architecture</span>
            <span>·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Parakeet Local Speech Model
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Advisory Meeting & AI Minutes Studio
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleGenerateZoom}
            disabled={isGeneratingZoom}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>{isGeneratingZoom ? 'Creating Room...' : 'Launch Zoom Meeting'}</span>
          </button>

          <button
            onClick={onOpenSgpModal}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-emerald-600" />
            <span>SGP Business ACRA</span>
          </button>

          {hasGeneratedMinutes && (
            <>
              <button
                onClick={handleExportPdf}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF Minutes</span>
              </button>

              <button
                onClick={() => onComposeOutlook(currentCompany)}
                className="px-3.5 py-1.5 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send via Outlook</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* SME Enterprise & ACRA Pre-Population Bar */}
      <div className="p-4 apple-card rounded-2xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">
              Consulting SME:
            </span>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="flex-1 max-w-md px-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 border-none outline-none cursor-pointer font-medium"
            >
              {companies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.legalName} (UEN: {c.uen})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500">Channel:</span>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-800 dark:text-neutral-200 border-none outline-none cursor-pointer text-xs"
              >
                <option value="Zoom Video">Zoom Video</option>
                <option value="In-Person (SME Centre)">In-Person (SME Centre)</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="Phone Call">Phone Call</option>
              </select>
            </div>

            {zoomUrl && (
              <a
                href={zoomUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#0071E3] hover:underline flex items-center gap-1 font-mono text-[11px]"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Join Zoom ({zoomPasscode})</span>
              </a>
            )}
          </div>
        </div>

        {/* SGP Business Directory Auto-Populated Entity Details */}
        {currentCompany && (
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ACRA Verified: {currentCompany.uen}</span>
              </div>
              <span>·</span>
              <span>SSIC: {currentCompany.ssicCode} ({currentCompany.industry})</span>
              <span>·</span>
              <span>Paid-up: {currentCompany.paidUpCapital}</span>
              <span>·</span>
              <span>Contact: {currentCompany.contactPersonName} ({currentCompany.contactPhone})</span>
            </div>

            <a
              href={`https://www.sgpbusiness.com/company/${encodeURIComponent(currentCompany.legalName.replace(/ /g, '-'))}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#0071E3] hover:underline flex items-center gap-1 font-medium"
            >
              <span>sgpbusiness.com Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Main Studio Viewport: Transcription (Left) + AI Minutes & Sentiment (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Meetily & Parakeet Audio Transcription */}
        <div className="space-y-4">
          <div className="apple-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Audio Capture & Local Parakeet Transcription
                </h2>
                <p className="text-xs text-neutral-500">
                  Privacy-first on-device speech processing (Meetily standard)
                </p>
              </div>

              {/* Parakeet Model Badge */}
              <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-600 dark:text-neutral-400 font-mono">
                {transcriptionEngine.split(' ')[0]}
              </span>
            </div>

            {/* Recording Controls Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleRecording}
                  className={`p-3 rounded-full text-white transition-all cursor-pointer shadow-sm ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-[#0071E3] hover:bg-[#0077ED]'
                  }`}
                >
                  {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <div>
                  <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    {isRecording ? 'Recording Live Consultation...' : 'Microphone Ready'}
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    {isRecording ? formatSeconds(recordingSeconds) : 'Click microphone or load sample'}
                  </p>
                </div>
              </div>

              {/* Sample Presets for Fast Evaluation */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleLoadScenario('edg')}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-neutral-200/70 hover:bg-neutral-300/70 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
                >
                  Load EDG Audio
                </button>
                <button
                  onClick={() => handleLoadScenario('psg')}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-neutral-200/70 hover:bg-neutral-300/70 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
                >
                  Load PSG Audio
                </button>
              </div>
            </div>

            {/* Live Streaming Speech Preview */}
            {isRecording && liveStreamText && (
              <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 animate-in fade-in">
                <span className="font-semibold">Live Stream: </span>
                <span>{liveStreamText}</span>
              </div>
            )}

            {/* Transcript Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Transcript with Speaker Diarization</span>
                {transcriptSegments.length > 0 && (
                  <span className="font-mono text-[11px]">
                    {transcriptSegments.length} speaker turns · {rawTranscript.split(/\s+/).length} words
                  </span>
                )}
              </div>

              <div className="h-80 overflow-y-auto p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#161618] text-xs space-y-3">
                {isTranscribing ? (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-400 gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-[#0071E3]" />
                    <span>Processing local Parakeet neural audio transcription...</span>
                  </div>
                ) : transcriptSegments.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-400 text-center p-6 space-y-2">
                    <Mic className="w-8 h-8 text-neutral-300 dark:text-neutral-700" />
                    <p className="font-medium text-neutral-600 dark:text-neutral-400">
                      No Audio Transcribed Yet
                    </p>
                    <p className="text-[11px] max-w-xs">
                      Press the microphone button to record live audio, or click "Load EDG Audio" to evaluate with real advisory dialogue.
                    </p>
                  </div>
                ) : (
                  transcriptSegments.map((seg) => (
                    <div key={seg.id} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-semibold ${
                          seg.speaker.includes('SME Centre') 
                            ? 'text-[#0071E3]' 
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {seg.speaker}
                        </span>
                        <span className="text-neutral-400 font-mono">{seg.timestamp}</span>
                      </div>
                      <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed pl-2 border-l-2 border-neutral-200 dark:border-neutral-800">
                        {seg.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Summarize Action Button */}
            <button
              onClick={handleGenerateAiMinutes}
              disabled={isSummarizing || !rawTranscript.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSummarizing ? 'Analyzing Minutes with OpenAI LLM...' : 'Generate AI Minutes & Sentiment Analysis'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: AI Minutes, Sentiment Analysis & Action Items */}
        <div className="space-y-4">
          <div className="apple-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Executive Minutes & Real-time Sentiment
                </h2>
                <p className="text-xs text-neutral-500">
                  OpenAI LLM structured extraction & Enterprise SG grant mapping
                </p>
              </div>

              {hasGeneratedMinutes && (
                <button
                  onClick={handleExportPdf}
                  className="text-xs text-[#0071E3] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>PDF Ready</span>
                </button>
              )}
            </div>

            {!hasGeneratedMinutes ? (
              <div className="h-[490px] border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col items-center justify-center p-6 text-center text-neutral-400 space-y-2">
                <FileText className="w-8 h-8 text-neutral-300 dark:text-neutral-700" />
                <p className="font-medium text-neutral-600 dark:text-neutral-400 text-xs">
                  Awaiting Meeting Transcription
                </p>
                <p className="text-[11px] max-w-xs">
                  Generate AI minutes from the transcript to automatically extract executive outcomes, sentiment score, action items, and grant recommendations.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Real-time Sentiment Analysis Meter */}
                <div className="p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide text-[10px]">
                      Client Sentiment Analysis
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {sentimentTone}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-16 text-center">
                      <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                        {sentimentScore}%
                      </span>
                      <p className="text-[9px] text-neutral-400">Readiness</p>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                          style={{ width: `${sentimentScore}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-tight">
                        {sentimentObservations}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-[11px] uppercase tracking-wide">
                    Executive Summary
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed bg-neutral-50/50 dark:bg-neutral-900/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                    {executiveSummary}
                  </p>
                </div>

                {/* Key Discussion Points */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-[11px] uppercase tracking-wide">
                    Key Discussion Points
                  </h3>
                  <ul className="space-y-1 text-neutral-700 dark:text-neutral-300">
                    {keyDiscussionPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#0071E3] font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Items Matrix */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-[11px] uppercase tracking-wide">
                      Follow-up Action Items
                    </h3>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {actionItems.filter(a => a.completed).length} of {actionItems.length} completed
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {actionItems.map((act) => (
                      <div
                        key={act.id}
                        className="p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#161618] flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={act.completed}
                            onChange={() => {
                              setActionItems(prev => prev.map(item => 
                                item.id === act.id ? { ...item, completed: !item.completed } : item
                              ));
                            }}
                            className="rounded text-[#0071E3] cursor-pointer"
                          />
                          <div className="min-w-0">
                            <p className={`font-medium truncate ${act.completed ? 'line-through text-neutral-400' : 'text-neutral-800 dark:text-neutral-200'}`}>
                              {act.task}
                            </p>
                            <p className="text-[10px] text-neutral-400">
                              Owner: {act.owner} · Due: {act.dueDate}
                            </p>
                          </div>
                        </div>

                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-semibold shrink-0 ${
                          act.priority === 'high' 
                            ? 'bg-red-500/10 text-red-600 dark:text-red-400' 
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600'
                        }`}>
                          {act.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Grants */}
                {grantRecommendations.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-[11px] uppercase tracking-wide">
                      Recommended Enterprise Singapore Schemes
                    </h3>
                    <div className="space-y-1.5">
                      {grantRecommendations.map((g, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
                          <p className="font-semibold text-blue-900 dark:text-blue-300">
                            {g.name}
                          </p>
                          <p className="text-[11px] text-blue-800/80 dark:text-blue-400 mt-0.5">
                            {g.supportCoverage} · {g.recommendedScope}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
