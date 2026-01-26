import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { 
  ArrowLeft, 
  Calendar, 
  GitBranch, 
  RotateCcw, 
  FileText, 
  Play, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Upload,
  Settings,
  BarChart3,
  Cpu,
  Package,
  History,
  Home
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type RunStatus = 'draft' | 'pending' | 'generated' | 'scheduled' | 'running' | 'completed' | 'failed';
type Shift = 'A' | 'B' | 'C';
type TabType = 'overview' | 'inputs' | 'events' | 'schedule' | 'kpis' | 'agent' | 'artifacts' | 'history';

interface RunDetail {
  id: string;
  date: string;
  shift: Shift;
  status: RunStatus;
  trigger: 'original' | 'reschedule';
  parentRunId?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  version: number;
  notes?: string;
  hasSchedule: boolean;
  hasDraftReport: boolean;
}

interface KPICard {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: any;
  color: string;
}

interface ActivityItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  icon: any;
}

const mockRun: RunDetail = {
  id: 'RUN-2401',
  date: '2026-01-01',
  shift: 'A',
  status: 'completed',
  trigger: 'original',
  createdAt: '2026-01-01 06:00',
  createdBy: 'Ravi Rampaul',
  updatedAt: '2026-01-01 14:30',
  version: 1,
  notes: 'Regular production run for Shift A',
  hasSchedule: true,
  hasDraftReport: false,
};

const mockRunWithParent: RunDetail = {
  id: 'RUN-2412',
  date: '2026-01-01',
  shift: 'A',
  status: 'completed',
  trigger: 'reschedule',
  parentRunId: 'RUN-2401',
  createdAt: '2026-01-01 08:30',
  createdBy: 'Amit Mishra',
  updatedAt: '2026-01-01 16:45',
  version: 2,
  notes: 'Rescheduled from RUN-2401 - Material shortage',
  hasSchedule: true,
  hasDraftReport: true,
};

// Extended mock data for all runs from RunsListPage
const allMockRuns: Record<string, RunDetail> = {
  'RUN-2401': mockRun,
  'RUN-2402': {
    id: 'RUN-2402',
    date: '2026-01-01',
    shift: 'B',
    status: 'running',
    trigger: 'original',
    createdAt: '2026-01-01 14:00',
    createdBy: 'Ravi Rampaul',
    updatedAt: '2026-01-01 18:30',
    version: 1,
    hasSchedule: true,
    hasDraftReport: false,
  },
  'RUN-2403': {
    id: 'RUN-2403',
    date: '2026-01-01',
    shift: 'C',
    status: 'pending',
    trigger: 'original',
    createdAt: '2026-01-01 18:00',
    createdBy: 'Ravi Rampaul',
    updatedAt: '2026-01-01 18:00',
    version: 1,
    hasSchedule: false,
    hasDraftReport: false,
  },
  'RUN-2304': {
    id: 'RUN-2304',
    date: '2025-12-31',
    shift: 'A',
    status: 'completed',
    trigger: 'original',
    createdAt: '2025-12-31 06:00',
    createdBy: 'Ravi Rampaul',
    updatedAt: '2025-12-31 14:30',
    version: 1,
    hasSchedule: true,
    hasDraftReport: false,
  },
  'RUN-2305': {
    id: 'RUN-2305',
    date: '2025-12-31',
    shift: 'A',
    status: 'completed',
    trigger: 'reschedule',
    parentRunId: 'RUN-2304',
    createdAt: '2025-12-31 08:30',
    createdBy: 'Amit Mishra',
    updatedAt: '2025-12-31 16:45',
    version: 2,
    notes: 'Rescheduled from RUN-2304 due to equipment delay',
    hasSchedule: true,
    hasDraftReport: true,
  },
  'RUN-2306': {
    id: 'RUN-2306',
    date: '2025-12-31',
    shift: 'B',
    status: 'completed',
    trigger: 'original',
    createdAt: '2025-12-31 14:00',
    createdBy: 'Ravi Rampaul',
    updatedAt: '2025-12-31 22:00',
    version: 1,
    hasSchedule: true,
    hasDraftReport: false,
  },
  'RUN-2307': {
    id: 'RUN-2307',
    date: '2025-12-31',
    shift: 'C',
    status: 'completed',
    trigger: 'original',
    createdAt: '2025-12-31 22:00',
    createdBy: 'Ravi Rampaul',
    updatedAt: '2026-01-01 06:00',
    version: 1,
    hasSchedule: true,
    hasDraftReport: false,
  },
  'RUN-2208': {
    id: 'RUN-2208',
    date: '2025-12-30',
    shift: 'A',
    status: 'completed',
    trigger: 'original',
    createdAt: '2025-12-30 06:00',
    createdBy: 'Ravi Rampaul',
    updatedAt: '2025-12-30 14:00',
    version: 1,
    hasSchedule: true,
    hasDraftReport: false,
  },
  'RUN-2209': {
    id: 'RUN-2209',
    date: '2025-12-30',
    shift: 'B',
    status: 'failed',
    trigger: 'original',
    createdAt: '2025-12-30 14:00',
    createdBy: 'Ravi Rampaul',
    updatedAt: '2025-12-30 15:30',
    version: 1,
    hasSchedule: true,
    hasDraftReport: false,
  },
  'RUN-2210': {
    id: 'RUN-2210',
    date: '2025-12-30',
    shift: 'B',
    status: 'completed',
    trigger: 'reschedule',
    parentRunId: 'RUN-2209',
    createdAt: '2025-12-30 15:30',
    createdBy: 'Amit Mishra',
    updatedAt: '2025-12-30 23:00',
    version: 2,
    notes: 'Rescheduled from RUN-2209 - System failure recovery',
    hasSchedule: true,
    hasDraftReport: true,
  },
  'RUN-2211': {
    id: 'RUN-2211',
    date: '2025-12-30',
    shift: 'C',
    status: 'completed',
    trigger: 'original',
    createdAt: '2025-12-30 22:00',
    createdBy: 'Ravi Rampaul',
    updatedAt: '2025-12-31 06:00',
    version: 1,
    hasSchedule: true,
    hasDraftReport: false,
  },
  'RUN-2412': mockRunWithParent,
};

const mockKPIs: KPICard[] = [
  {
    label: 'On-Time Delivery',
    value: '94.2%',
    change: 2.3,
    changeLabel: 'vs parent',
    icon: CheckCircle2,
    color: 'green',
  },
  {
    label: 'Setup Time',
    value: '127 min',
    change: -8.5,
    changeLabel: 'vs parent',
    icon: Clock,
    color: 'blue',
  },
  {
    label: 'First-Piece Rejects',
    value: '2.4%',
    change: 0.8,
    changeLabel: 'vs parent',
    icon: XCircle,
    color: 'red',
  },
  {
    label: 'OEE-Lite',
    value: '78.3%',
    change: 3.1,
    changeLabel: 'vs parent',
    icon: BarChart3,
    color: 'purple',
  },
];

const mockActivity: ActivityItem[] = [
  {
    id: '1',
    timestamp: '2026-01-01 16:45',
    user: 'Ravi Rampaul',
    action: 'Marked run as completed',
    details: 'All production tasks finished successfully',
  },
  {
    id: '2',
    timestamp: '2026-01-01 14:20',
    user: 'Priya Patel',
    action: 'Updated order status',
    details: 'ORD-1234 marked as in-progress',
  },
  {
    id: '3',
    timestamp: '2026-01-01 12:10',
    user: 'Priya Patel',
    action: 'Logged first piece quality check',
    details: 'ORD-1234 passed FPI with zero defects',
  },
  {
    id: '4',
    timestamp: '2026-01-01 10:35',
    user: 'Amit Mishra',
    action: 'Added comment',
    details: 'Please prioritize ORD-1234 for early completion',
  },
  {
    id: '5',
    timestamp: '2026-01-01 08:30',
    user: 'Ravi Rampaul',
    action: 'Updated schedule',
    details: 'Adjusted for material availability',
  },
  {
    id: '6',
    timestamp: '2026-01-01 06:45',
    user: 'Ravi Rampaul',
    action: 'Approved run for execution',
    details: 'All pre-execution checks passed',
  },
  {
    id: '7',
    timestamp: '2026-01-01 06:00',
    user: 'Ravi Rampaul',
    action: 'Created run',
    details: 'Initial setup for Shift A production',
  },
];

const statusConfig: Record<RunStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Draft', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  pending: { label: 'Pending', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  generated: { label: 'Generated', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  scheduled: { label: 'Scheduled', color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
  running: { label: 'Running', color: 'text-green-700', bgColor: 'bg-green-100' },
  completed: { label: 'Completed', color: 'text-gray-700', bgColor: 'bg-gray-200' },
  failed: { label: 'Failed', color: 'text-red-700', bgColor: 'bg-red-100' },
};

export function RunDetailPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { runId } = useParams<{ runId: string }>();
  const location = useLocation();
  
  // Get run from allMockRuns or return null if not found
  const run = runId ? allMockRuns[runId] || null : null;
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Show error state if run not found
  if (!run || !runId) {
    return (
      <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <button
            onClick={() => navigate('/app/runs')}
            className={`flex items-center gap-2 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Runs</span>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className={`inline-flex p-4 rounded-full mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <XCircle className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>
            <h2 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Run Not Found</h2>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              The run with ID <span className="font-mono text-blue-600">{runId || 'unknown'}</span> could not be found.
            </p>
            <button
              onClick={() => navigate('/app/runs')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Runs
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = statusConfig[run.status];

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'inputs', label: 'Inputs', icon: Upload },
    { id: 'events', label: 'Events', icon: AlertTriangle },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'kpis', label: 'KPIs', icon: BarChart3 },
    { id: 'agent', label: 'Agent', icon: Cpu },
    { id: 'artifacts', label: 'Artifacts', icon: Package },
    { id: 'history', label: 'History', icon: History },
  ];

  const canSchedule = run.status === 'generated';
  const canGenerateBrief = run.status === 'completed';
  const canReschedule = run.status === 'completed';

  const handleSchedule = () => {
    navigate(`/app/runs/${runId}/schedule`);
  };

  const handleGenerateBrief = () => {
    navigate(`/app/runs/${runId}/brief`);
  };

  const handleCreateReschedule = () => {
    navigate('/app/runs/create', { state: { parentRun: run, isReschedule: true } });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <button
          onClick={() => navigate('/app/runs')}
          className={`flex items-center gap-2 mb-4 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Runs</span>
        </button>

        {/* Run Title & Meta */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>{formatDate(run.date)} - Shift {run.shift}</h1>
              <span className={`px-2 py-1 text-sm rounded ${status.bgColor} ${status.color}`}>
                {status.label}
              </span>
              <span className={`px-2 py-1 text-sm rounded ${
                run.trigger === 'original' 
                  ? 'bg-gray-100 text-gray-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {run.trigger === 'original' ? 'Original' : 'Reschedule'}
              </span>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                v{run.version}
              </span>
            </div>

            <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Run ID: <span className="font-mono text-blue-600">{run.id}</span>
            </p>

            {run.parentRunId && (
              <div className="flex items-center gap-2 text-sm">
                <GitBranch className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Parent run:</span>
                <button
                  onClick={() => navigate(`/app/runs/${run.parentRunId}`)}
                  className="font-mono text-blue-600 hover:text-blue-700"
                >
                  {run.parentRunId}
                </button>
                <button
                  onClick={() => navigate(`/app/runs/${run.id}/lineage`)}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>View lineage</span>
                  <GitBranch className="w-4 h-4" />
                </button>
              </div>
            )}

            {run.notes && (
              <p className={`text-sm mt-2 italic ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>"{run.notes}"</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Events - Always available for flow */}
            <button
              onClick={() => navigate(`/app/runs/${runId}/events`)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>View Events</span>
            </button>

            {/* View Schedule - Available if run has schedule */}
            {run.hasSchedule && (
              <button
                onClick={() => navigate(`/app/runs/${runId}/schedule`)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span>View Schedule</span>
              </button>
            )}

            {/* Compare Runs - Available if has parent */}
            {run.parentRunId && (
              <button
                onClick={() => navigate(`/app/runs/compare?run1=${run.parentRunId}&run2=${runId}`)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Compare Runs</span>
              </button>
            )}

            {/* Generate AI Brief - Available for completed runs */}
            {canGenerateBrief && (
              <button
                onClick={handleGenerateBrief}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Cpu className="w-5 h-5" />
                <span>AI Brief</span>
              </button>
            )}

            {/* View Draft Report - Available if hasDraftReport */}
            {run.hasDraftReport && (
              <button
                onClick={() => navigate(`/app/runs/${runId}/impact-report`)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                <span>Draft Report</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabs - Desktop */}
        <div className={`hidden lg:flex items-center gap-1 border-b -mb-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-700'
                    : isDarkMode
                      ? 'border-transparent text-gray-400 hover:text-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tabs - Mobile/Tablet (Horizontal Scroll) */}
        <div className="lg:hidden overflow-x-auto -mb-4">
          <div className={`flex items-center gap-1 border-b min-w-max ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-700'
                      : isDarkMode
                        ? 'border-transparent text-gray-400 hover:text-white'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* KPI Cards */}
            <div>
              <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Key Performance Indicators</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockKPIs.map((kpi, idx) => {
                  const Icon = kpi.icon;
                  const isPositive = kpi.change && kpi.change > 0;
                  const isNegative = kpi.change && kpi.change < 0;
                  
                  return (
                    <div key={idx} className={`border rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${
                          kpi.color === 'green' ? 'bg-green-100' :
                          kpi.color === 'blue' ? 'bg-blue-100' :
                          kpi.color === 'red' ? 'bg-red-100' :
                          'bg-purple-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            kpi.color === 'green' ? 'text-green-600' :
                            kpi.color === 'blue' ? 'text-blue-600' :
                            kpi.color === 'red' ? 'text-red-600' :
                            'text-purple-600'
                          }`} />
                        </div>
                        {run.parentRunId && kpi.change !== undefined && (
                          <div className={`flex items-center gap-1 text-sm ${
                            isPositive && kpi.label !== 'First-Piece Rejects' ? 'text-green-600' :
                            isNegative && kpi.label === 'Setup Time' ? 'text-green-600' :
                            'text-red-600'
                          }`}>
                            {(isPositive && kpi.label !== 'First-Piece Rejects') || (isNegative && kpi.label === 'Setup Time') ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            <span>{Math.abs(kpi.change)}%</span>
                          </div>
                        )}
                      </div>
                      <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{kpi.label}</p>
                      <p className={`text-2xl mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{kpi.value}</p>
                      {run.parentRunId && kpi.changeLabel && (
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{kpi.changeLabel}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* What Changed vs Parent */}
            {run.parentRunId && (
              <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-orange-900/30 border-orange-800' : 'bg-orange-50 border-orange-200'}`}>
                <div className="flex items-start gap-4 mb-4">
                  <GitBranch className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className={`mb-2 ${isDarkMode ? 'text-orange-300' : 'text-orange-900'}`}>What changed vs parent run?</h3>
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-orange-200' : 'text-orange-800'}`}>
                      Comparing {run.id} (v{run.version}) with {run.parentRunId} (v{run.version - 1})
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/app/runs/compare?a=${run.parentRunId}&b=${run.id}`)}
                    className="px-3 py-1.5 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    View Comparison
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-gray-800 border-orange-700' : 'bg-white border-orange-200'}`}>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>Schedule Changes</p>
                    <p className={`text-xl ${isDarkMode ? 'text-orange-200' : 'text-orange-900'}`}>12 operations</p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>resequenced</p>
                  </div>
                  <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-gray-800 border-orange-700' : 'bg-white border-orange-200'}`}>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>Material Updates</p>
                    <p className={`text-xl ${isDarkMode ? 'text-orange-200' : 'text-orange-900'}`}>4 items</p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>substituted</p>
                  </div>
                  <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-gray-800 border-orange-700' : 'bg-white border-orange-200'}`}>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>Machine Changes</p>
                    <p className={`text-xl ${isDarkMode ? 'text-orange-200' : 'text-orange-900'}`}>2 machines</p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>reassigned</p>
                  </div>
                </div>
              </div>
            )}

            {/* Draft Impact Report */}
            {run.hasDraftReport && (
              <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-start gap-4">
                  <FileText className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className={`mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-900'}`}>Draft Impact Report Available</h3>
                    <p className={`text-sm mb-4 ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                      AI-generated analysis of schedule changes and predicted impacts on production metrics.
                      Review before finalizing the schedule.
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => navigate(`/app/runs/${run.id}/impact-report`)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View Report</span>
                      </button>
                      <button className={`px-4 py-2 border rounded-lg transition-colors ${isDarkMode ? 'bg-gray-800 border-green-700 text-green-300 hover:bg-gray-700' : 'bg-white border-green-300 text-green-700 hover:bg-green-50'}`}>
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity Timeline */}
            <div>
              <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
              <div className={`border rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {mockActivity.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className={`p-4 transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <Icon className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-1">
                              <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.action}</p>
                              <span className={`text-xs whitespace-nowrap ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                {item.timestamp}
                              </span>
                            </div>
                            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.details}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>by {item.user}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'overview' && (
          <div className="max-w-7xl mx-auto">
            <div className={`border rounded-lg p-12 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="max-w-md mx-auto">
                {tabs.find(t => t.id === activeTab) && (() => {
                  const tab = tabs.find(t => t.id === activeTab)!;
                  const Icon = tab.icon;
                  return (
                    <>
                      <div className={`inline-flex p-4 rounded-full mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <Icon className={`w-8 h-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{tab.label} Tab</h3>
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        This section will display {tab.label.toLowerCase()} information for the run.
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}