import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Filter,
  Search,
  Download,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  Zap,
  ExternalLink,
  Calendar,
  X,
  ArrowLeft
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface AgentJobsListProps {
  userRole: 'owner' | 'planner' | 'supervisor';
}

type JobType = 'disruption_replan' | 'shift_brief' | 'setup_guidance' | 'explain_chat' | 'impact_report';
type JobTrigger = 'event_logged' | 'shift_start' | 'setup_request' | 'planner_optimize' | 'user_chat';
type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed';

interface AgentJob {
  job_id: string;
  created_at: string;
  job_type: JobType;
  trigger: JobTrigger;
  run_id?: string;
  parent_run_id?: string;
  status: JobStatus;
  validation_pass: boolean | null;
  fallback_used: boolean;
  duration_ms: number | null;
  started_by: string;
  machine_id?: string;
}

export function AgentJobsList({ userRole }: AgentJobsListProps) {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterJobType, setFilterJobType] = useState<JobType | ''>('');
  const [filterStatus, setFilterStatus] = useState<JobStatus | ''>('');
  const [filterValidationPass, setFilterValidationPass] = useState<boolean | ''>('');
  const [filterFallbackUsed, setFilterFallbackUsed] = useState<boolean | ''>('');
  const [filterRunId, setFilterRunId] = useState('');
  const [filterMachineId, setFilterMachineId] = useState('');

  // Mock data
  const allJobs: AgentJob[] = [
    {
      job_id: 'AJ-98325',
      created_at: '2026-01-25T14:15:12Z',
      job_type: 'disruption_replan',
      trigger: 'event_logged',
      run_id: 'RUN-2402',
      parent_run_id: 'RUN-2401',
      status: 'failed',
      validation_pass: false,
      fallback_used: true,
      duration_ms: 8700,
      started_by: 'system',
      machine_id: 'M99',
    },
    {
      job_id: 'AJ-98321',
      created_at: '2026-01-25T11:30:45Z',
      job_type: 'disruption_replan',
      trigger: 'event_logged',
      run_id: 'RUN-2402',
      parent_run_id: 'RUN-2401',
      status: 'failed',
      validation_pass: false,
      fallback_used: true,
      duration_ms: 32000,
      started_by: 'system',
      machine_id: 'M03',
    },
    {
      job_id: 'AJ-98320',
      created_at: '2026-01-25T06:00:12Z',
      job_type: 'shift_brief',
      trigger: 'shift_start',
      run_id: 'RUN-2402',
      status: 'succeeded',
      validation_pass: true,
      fallback_used: false,
      duration_ms: 4200,
      started_by: 'scheduler',
    },
    {
      job_id: 'AJ-98319',
      created_at: '2026-01-25T09:45:33Z',
      job_type: 'setup_guidance',
      trigger: 'setup_request',
      run_id: 'RUN-2402',
      status: 'succeeded',
      validation_pass: true,
      fallback_used: false,
      duration_ms: 2800,
      started_by: 'john.smith',
      machine_id: 'M03',
    },
    {
      job_id: 'AJ-98318',
      created_at: '2026-01-25T10:15:22Z',
      job_type: 'explain_chat',
      trigger: 'user_chat',
      run_id: 'RUN-2402',
      status: 'succeeded',
      validation_pass: true,
      fallback_used: false,
      duration_ms: 1500,
      started_by: 'alice.johnson',
    },
    {
      job_id: 'AJ-98317',
      created_at: '2026-01-24T14:30:11Z',
      job_type: 'impact_report',
      trigger: 'event_logged',
      run_id: 'RUN-2401',
      parent_run_id: 'RUN-2400',
      status: 'succeeded',
      validation_pass: true,
      fallback_used: false,
      duration_ms: 5600,
      started_by: 'sarah.williams',
      machine_id: 'M04',
    },
    {
      job_id: 'AJ-98316',
      created_at: '2026-01-24T11:22:45Z',
      job_type: 'disruption_replan',
      trigger: 'planner_optimize',
      run_id: 'RUN-2401',
      parent_run_id: 'RUN-2400',
      status: 'failed',
      validation_pass: false,
      fallback_used: false,
      duration_ms: 28000,
      started_by: 'alice.johnson',
      machine_id: 'M05',
    },
    {
      job_id: 'AJ-98315',
      created_at: '2026-01-24T06:00:05Z',
      job_type: 'shift_brief',
      trigger: 'shift_start',
      run_id: 'RUN-2401',
      status: 'succeeded',
      validation_pass: true,
      fallback_used: true,
      duration_ms: 6200,
      started_by: 'scheduler',
    },
    {
      job_id: 'AJ-98314',
      created_at: '2026-01-25T11:35:00Z',
      job_type: 'setup_guidance',
      trigger: 'setup_request',
      status: 'running',
      validation_pass: null,
      fallback_used: false,
      duration_ms: null,
      started_by: 'john.smith',
      machine_id: 'M07',
    },
    {
      job_id: 'AJ-98313',
      created_at: '2026-01-25T11:36:00Z',
      job_type: 'shift_brief',
      trigger: 'shift_start',
      status: 'queued',
      validation_pass: null,
      fallback_used: false,
      duration_ms: null,
      started_by: 'scheduler',
    },
  ];

  // Apply filters
  const filteredJobs = allJobs.filter(job => {
    if (searchQuery && !job.job_id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !job.run_id?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterJobType && job.job_type !== filterJobType) return false;
    if (filterStatus && job.status !== filterStatus) return false;
    if (filterValidationPass !== '' && job.validation_pass !== filterValidationPass) return false;
    if (filterFallbackUsed !== '' && job.fallback_used !== filterFallbackUsed) return false;
    if (filterRunId && job.run_id !== filterRunId) return false;
    if (filterMachineId && job.machine_id !== filterMachineId) return false;
    if (filterDateFrom && new Date(job.created_at) < new Date(filterDateFrom)) return false;
    if (filterDateTo && new Date(job.created_at) > new Date(filterDateTo)) return false;
    return true;
  });

  const handleClearFilters = () => {
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterJobType('');
    setFilterStatus('');
    setFilterValidationPass('');
    setFilterFallbackUsed('');
    setFilterRunId('');
    setFilterMachineId('');
  };

  const activeFilterCount = [
    filterDateFrom,
    filterDateTo,
    filterJobType,
    filterStatus,
    filterValidationPass !== '',
    filterFallbackUsed !== '',
    filterRunId,
    filterMachineId,
  ].filter(Boolean).length;

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case 'succeeded':
        return isDarkMode ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-100 text-green-700 border-green-200';
      case 'failed':
        return isDarkMode ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-100 text-red-700 border-red-200';
      case 'running':
        return isDarkMode ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-200';
      case 'queued':
        return isDarkMode ? 'bg-gray-600 text-gray-300 border-gray-600' : 'bg-gray-200 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'queued':
        return <Clock className="w-4 h-4" />;
    }
  };

  const getJobTypeLabel = (jobType: JobType) => {
    switch (jobType) {
      case 'disruption_replan':
        return 'Disruption Replan';
      case 'shift_brief':
        return 'Shift Brief';
      case 'setup_guidance':
        return 'Setup Guidance';
      case 'explain_chat':
        return 'Explain Chat';
      case 'impact_report':
        return 'Impact Report';
    }
  };

  const getTriggerLabel = (trigger: JobTrigger) => {
    switch (trigger) {
      case 'event_logged':
        return 'Event Logged';
      case 'shift_start':
        return 'Shift Start';
      case 'setup_request':
        return 'Setup Request';
      case 'planner_optimize':
        return 'Planner Optimize';
      case 'user_chat':
        return 'User Chat';
    }
  };

  const formatDuration = (ms: number | null) => {
    if (ms === null) return '—';
    if (ms < 1000) return `${ms}ms`;
    const seconds = (ms / 1000).toFixed(1);
    return `${seconds}s`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleExportCSV = () => {
    const headers = [
      'job_id',
      'created_at',
      'job_type',
      'trigger',
      'run_id',
      'parent_run_id',
      'status',
      'validation_pass',
      'fallback_used',
      'duration_ms',
      'started_by',
      'machine_id',
    ];
    
    const rows = filteredJobs.map(job => [
      job.job_id,
      job.created_at,
      job.job_type,
      job.trigger,
      job.run_id || '',
      job.parent_run_id || '',
      job.status,
      job.validation_pass === null ? '' : job.validation_pass.toString(),
      job.fallback_used.toString(),
      job.duration_ms?.toString() || '',
      job.started_by,
      job.machine_id || '',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-jobs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/agent/home')}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
          
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Agent Jobs
            </h1>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Audit log of all AI agent operations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilterCount > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : isDarkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
          isDarkMode ? 'text-gray-500' : 'text-gray-400'
        }`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by job ID or run ID..."
          className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition-colors ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
          }`}
        />
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className={`rounded-xl border p-6 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Filters
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearFilters}
                className={`text-sm font-medium transition-colors ${
                  isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Date From
              </label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Date To
              </label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Job Type */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Job Type
              </label>
              <select
                value={filterJobType}
                onChange={(e) => setFilterJobType(e.target.value as JobType | '')}
                className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              >
                <option value="">All Types</option>
                <option value="disruption_replan">Disruption Replan</option>
                <option value="shift_brief">Shift Brief</option>
                <option value="setup_guidance">Setup Guidance</option>
                <option value="explain_chat">Explain Chat</option>
                <option value="impact_report">Impact Report</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as JobStatus | '')}
                className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              >
                <option value="">All Statuses</option>
                <option value="queued">Queued</option>
                <option value="running">Running</option>
                <option value="succeeded">Succeeded</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Validation Pass */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Validation Pass
              </label>
              <select
                value={filterValidationPass === '' ? '' : filterValidationPass.toString()}
                onChange={(e) => setFilterValidationPass(e.target.value === '' ? '' : e.target.value === 'true')}
                className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              >
                <option value="">All</option>
                <option value="true">Passed</option>
                <option value="false">Failed</option>
              </select>
            </div>

            {/* Fallback Used */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Fallback Used
              </label>
              <select
                value={filterFallbackUsed === '' ? '' : filterFallbackUsed.toString()}
                onChange={(e) => setFilterFallbackUsed(e.target.value === '' ? '' : e.target.value === 'true')}
                className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            {/* Run ID */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Run ID
              </label>
              <input
                type="text"
                value={filterRunId}
                onChange={(e) => setFilterRunId(e.target.value)}
                placeholder="e.g., RUN-2402"
                className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Machine ID */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Machine ID
              </label>
              <input
                type="text"
                value={filterMachineId}
                onChange={(e) => setFilterMachineId(e.target.value)}
                placeholder="e.g., M03"
                className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Showing {filteredJobs.length} of {allJobs.length} jobs
      </div>

      {/* Jobs Table */}
      <div className={`rounded-xl border overflow-hidden ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <tr>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Job ID
                </th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Created At
                </th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Job Type
                </th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Trigger
                </th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Run ID
                </th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Status
                </th>
                <th className={`text-center py-3 px-4 text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Validation
                </th>
                <th className={`text-center py-3 px-4 text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Fallback
                </th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Duration
                </th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Started By
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job, index) => (
                <tr
                  key={job.job_id}
                  onClick={() => navigate(`/app/agent/jobs/${job.job_id}`)}
                  className={`cursor-pointer transition-colors ${
                    isDarkMode
                      ? 'hover:bg-gray-700/50 border-b border-gray-700'
                      : 'hover:bg-gray-50 border-b border-gray-200'
                  } ${index === filteredJobs.length - 1 ? 'border-b-0' : ''}`}
                >
                  <td className={`py-3 px-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{job.job_id}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                    </div>
                  </td>
                  <td className={`py-3 px-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {formatTimestamp(job.created_at)}
                  </td>
                  <td className={`py-3 px-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {getJobTypeLabel(job.job_type)}
                  </td>
                  <td className={`py-3 px-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {getTriggerLabel(job.trigger)}
                  </td>
                  <td className={`py-3 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {job.run_id ? (
                      <span className="font-mono text-sm">{job.run_id}</span>
                    ) : (
                      <span className={`text-sm ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      {job.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {job.validation_pass === null ? (
                      <span className={`text-sm ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>—</span>
                    ) : job.validation_pass ? (
                      <CheckCircle2 className={`w-5 h-5 mx-auto ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                    ) : (
                      <XCircle className={`w-5 h-5 mx-auto ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {job.fallback_used ? (
                      <Zap className={`w-5 h-5 mx-auto ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                    ) : (
                      <span className={`text-sm ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>—</span>
                    )}
                  </td>
                  <td className={`py-3 px-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {formatDuration(job.duration_ms)}
                  </td>
                  <td className={`py-3 px-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {job.started_by}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            No jobs found matching your filters
          </p>
        </div>
      )}
    </div>
  );
}