import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ChevronRight,
  AlertCircle,
  XCircle,
  Clock,
  Zap,
  FileText,
  ExternalLink,
  Copy,
  Download,
  ChevronLeft,
  Settings,
  Database,
  Shield,
  Activity,
  CheckCircle2,
  X,
  AlertTriangle,
  RotateCcw,
  Send
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface AgentJobDetailFailedPageProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

type TabType = 'summary' | 'inputs' | 'outputs' | 'validation' | 'evidence' | 'logs';

// Mock failed job data
const jobData = {
  id: 'AJ-98325',
  status: 'failed' as const,
  jobType: 'Disruption Replan',
  trigger: 'Event Logged',
  runId: 'RUN-2402',
  createdAt: 'Jan 25, 2:15 PM',
  duration: '8.7s',
  validation: 'Failed',
  fallback: 'Used',
  failureReasons: [
    { 
      id: 1, 
      description: 'Unknown ID detected (example: machine M99)', 
      status: 'failed' as const 
    },
    { 
      id: 2, 
      description: 'Time window invalid', 
      status: 'failed' as const 
    },
    { 
      id: 3, 
      description: 'Feasibility check (CP-SAT)', 
      status: 'blocked' as const 
    }
  ],
  fallbackOutput: {
    actions: [
      'Kept parent run RUN-2402 active (no schedule change)',
      'Posted warning to planner dashboard: "Replan validation failed"',
      'Created alert: ALT-5623 - Validation error on disruption replan',
      'Agent output discarded (not published to production)'
    ]
  },
  logs: [
    { timestamp: '2026-01-25T14:15:12.234Z', level: 'INFO', message: 'Job AJ-98325 started: type=disruption_replan, trigger=event_logged' },
    { timestamp: '2026-01-25T14:15:12.456Z', level: 'INFO', message: 'Loading scenario metadata from RUN-2402' },
    { timestamp: '2026-01-25T14:15:13.789Z', level: 'INFO', message: 'Invoking AI model for replan suggestion...' },
    { timestamp: '2026-01-25T14:15:18.123Z', level: 'INFO', message: 'Model response received (4.3s)' },
    { timestamp: '2026-01-25T14:15:18.345Z', level: 'WARN', message: 'Validation started: checking IDs against scenario metadata' },
    { timestamp: '2026-01-25T14:15:18.567Z', level: 'ERROR', message: 'Validation FAILED: Unknown machine ID "M99" detected in model output' },
    { timestamp: '2026-01-25T14:15:18.789Z', level: 'ERROR', message: 'Validation FAILED: Time window [2026-01-25T22:00:00Z - 2026-01-25T20:00:00Z] is invalid (end before start)' },
    { timestamp: '2026-01-25T14:15:18.901Z', level: 'WARN', message: 'CP-SAT feasibility check skipped (validation failed upstream)' },
    { timestamp: '2026-01-25T14:15:19.012Z', level: 'INFO', message: 'Fallback triggered: using rules-based safe response' },
    { timestamp: '2026-01-25T14:15:19.234Z', level: 'INFO', message: 'Fallback action: keeping parent run RUN-2402 active' },
    { timestamp: '2026-01-25T14:15:19.456Z', level: 'INFO', message: 'Fallback action: posted warning to planner dashboard' },
    { timestamp: '2026-01-25T14:15:19.678Z', level: 'INFO', message: 'Fallback action: created alert ALT-5623' },
    { timestamp: '2026-01-25T14:15:20.890Z', level: 'INFO', message: 'Job AJ-98325 completed with status: FAILED' },
    { timestamp: '2026-01-25T14:15:20.901Z', level: 'INFO', message: 'Total duration: 8.7s, validation_pass=false, fallback_used=true' }
  ]
};

export function AgentJobDetailFailedPage({ userRole = 'planner' }: AgentJobDetailFailedPageProps) {
  const navigate = useNavigate();
  const params = useParams();
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<TabType>('validation');
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  const tabs: { id: TabType; label: string; disabled?: boolean }[] = [
    { id: 'summary', label: 'Summary' },
    { id: 'inputs', label: 'Inputs' },
    { id: 'outputs', label: 'Outputs', disabled: true },
    { id: 'validation', label: 'Validation' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'logs', label: 'Logs' }
  ];

  const formatTimestamp = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
  };

  const handleCopyLogs = () => {
    const logsText = jobData.logs
      .map(log => `[${formatTimestamp(log.timestamp)}] ${log.level.padEnd(5)} ${log.message}`)
      .join('\n');
    navigator.clipboard.writeText(logsText);
  };

  const handleRetryJob = () => {
    // Handle retry logic
    console.log('Retrying job...');
  };

  const handleDownloadDebug = () => {
    const debugData = {
      job: jobData,
      timestamp: new Date().toISOString(),
      userRole
    };
    const dataStr = JSON.stringify(debugData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${jobData.id}-debug-bundle.json`;
    link.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'blocked':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'failed':
        return isDarkMode 
          ? 'bg-red-900/30 text-red-400 border-red-700' 
          : 'bg-red-50 text-red-700 border-red-200';
      case 'blocked':
        return isDarkMode 
          ? 'bg-amber-900/30 text-amber-400 border-amber-700' 
          : 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return isDarkMode 
          ? 'bg-gray-700 text-gray-300 border-gray-600' 
          : 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return isDarkMode ? 'text-red-400' : 'text-red-600';
      case 'WARN':
        return isDarkMode ? 'text-amber-400' : 'text-amber-600';
      case 'INFO':
        return isDarkMode ? 'text-gray-400' : 'text-gray-600';
      default:
        return isDarkMode ? 'text-gray-500' : 'text-gray-500';
    }
  };

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate('/app/agent/home')}
              className={`hover:underline ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Agent
            </button>
            <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <button
              onClick={() => navigate('/app/agent/jobs')}
              className={`hover:underline ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Agent Jobs
            </button>
            <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>Job Detail (Failed)</span>
          </div>

          {/* Title & Status */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Job {jobData.id}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                  <XCircle className="w-4 h-4" />
                  Failed
                </span>
              </div>

              {/* Metadata Row */}
              <div className="flex items-center gap-4 text-sm">
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Job Type: </span>
                  <span className="font-medium">{jobData.jobType}</span>
                </div>
                <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Trigger: </span>
                  <span className="font-medium">{jobData.trigger}</span>
                </div>
                <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Run ID: </span>
                  <button
                    onClick={() => navigate(`/app/runs/${jobData.runId}`)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {jobData.runId}
                  </button>
                </div>
                <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Created: </span>
                  <span className="font-medium">{jobData.createdAt}</span>
                </div>
                <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Duration: </span>
                  <span className="font-medium">{jobData.duration}</span>
                </div>
              </div>

              {/* Metric Chips */}
              <div className="flex items-center gap-3 mt-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm font-medium">
                  <XCircle className="w-4 h-4" />
                  Validation: {jobData.validation}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-sm font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  Fallback: {jobData.fallback}
                </div>
              </div>
            </div>
          </div>

          {/* Red Banner */}
          <div className={`rounded-xl border-2 p-4 ${
            isDarkMode 
              ? 'bg-red-900/20 border-red-700' 
              : 'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-start gap-3">
              <AlertCircle className={`w-6 h-6 flex-shrink-0 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>
                  Validation failed — job output was not executed. No silent failures.
                </h3>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                  The agent's proposed changes did not pass validation checks. The system used fallback logic to ensure safe operation.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                    tab.disabled
                      ? isDarkMode 
                        ? 'text-gray-600 cursor-not-allowed' 
                        : 'text-gray-400 cursor-not-allowed'
                      : activeTab === tab.id
                        ? isDarkMode 
                          ? 'text-blue-400' 
                          : 'text-blue-600'
                        : isDarkMode 
                          ? 'text-gray-400 hover:text-gray-300' 
                          : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  {tab.disabled && <span className="ml-1 text-xs">(disabled)</span>}
                  {activeTab === tab.id && !tab.disabled && (
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'validation' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Failure Reason Card */}
              <div className={`rounded-xl border p-6 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <XCircle className="w-5 h-5 text-red-600" />
                  Failure reason
                </h3>
                <div className="space-y-3">
                  {jobData.failureReasons.map((reason) => (
                    <div key={reason.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getStatusIcon(reason.status)}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          {reason.description}
                        </div>
                        <div className="mt-1">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(reason.status)}`}>
                            {reason.status === 'failed' ? 'Failed' : 'Not run / Blocked'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fallback Output Card */}
              <div className={`rounded-xl border p-6 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Shield className="w-5 h-5 text-amber-600" />
                  Fallback output
                </h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  What the system did instead:
                </p>
                <ul className="space-y-2">
                  {jobData.fallbackOutput.actions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                        isDarkMode ? 'bg-amber-400' : 'bg-amber-600'
                      }`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {action}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className={`rounded-xl border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className={`px-6 py-4 border-b flex items-center justify-between ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Execution Logs
                </h3>
                <button
                  onClick={handleCopyLogs}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  Copy logs
                </button>
              </div>
              <div className={`p-6 font-mono text-xs ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                <div className="space-y-1">
                  {jobData.logs.map((log, idx) => (
                    <div key={idx} className="flex gap-4">
                      <span className={isDarkMode ? 'text-gray-600' : 'text-gray-500'}>
                        [{formatTimestamp(log.timestamp)}]
                      </span>
                      <span className={`w-12 ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className={`rounded-xl border p-6 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Summary content will be displayed here.
              </p>
            </div>
          )}

          {activeTab === 'inputs' && (
            <div className={`rounded-xl border p-6 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Input data and parameters will be displayed here.
              </p>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className={`rounded-xl border p-6 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Evidence references and sources will be displayed here.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={handleRetryJob}
                disabled={userRole !== 'planner'}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  userRole === 'planner'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                Retry job
              </button>
              <button
                onClick={() => navigate('/app/agent/jobs')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                View Agent Jobs
              </button>
              <button
                onClick={handleDownloadDebug}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Download className="w-4 h-4" />
                Download debug bundle
              </button>
              <button
                onClick={() => navigate('/app/settings')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Send className="w-4 h-4" />
                Escalate to admin
              </button>
            </div>
            
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} flex items-center gap-2`}>
              <AlertCircle className="w-4 h-4" />
              Only Planner can re-run or publish schedules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}