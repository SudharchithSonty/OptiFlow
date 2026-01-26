import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  FileText,
  MessageSquare,
  BarChart3,
  Zap,
  Loader2,
  ShieldAlert,
  RefreshCw,
  Wrench
} from 'lucide-react';
import { mockAgentStatus, mockAgentJobs, mockAgentAlerts, AgentJob, AgentStatus, AgentAlert } from '../../types';

interface AgentHomePageProps {
  userRole: 'owner' | 'planner' | 'supervisor';
}

export function AgentHomePage({ userRole }: AgentHomePageProps) {
  const navigate = useNavigate();
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [recentJobs, setRecentJobs] = useState<AgentJob[]>([]);
  const [alerts, setAlerts] = useState<AgentAlert[]>([]);

  // Check permissions
  const hasAccess = userRole === 'owner' || userRole === 'planner';
  const hasFullAccess = userRole === 'planner';

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setAgentStatus(mockAgentStatus);
      setRecentJobs(mockAgentJobs);
      setAlerts(mockAgentAlerts);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Permission Denied State
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have permission to view the Agent section. This area is restricted to Owner and Planner roles.
          </p>
          <button
            onClick={() => navigate('/app')}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading agent data...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (hasError || !agentStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Failed to Load Agent Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Unable to connect to the agent service. Please check your connection and try again.
          </p>
          <button
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
              setTimeout(() => {
                setAgentStatus(mockAgentStatus);
                setRecentJobs(mockAgentJobs);
                setAlerts(mockAgentAlerts);
                setIsLoading(false);
              }, 800);
            }}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty State (no jobs yet)
  const isEmpty = recentJobs.length === 0;
  if (isEmpty) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Digital Operations Assistant</h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            AI agent monitoring and management
          </p>
        </div>

        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Agent Activity Yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The Digital Operations Assistant hasn't processed any jobs yet. Create a run or request a brief to get started.
            </p>
            {hasFullAccess && (
              <button
                onClick={() => navigate('/app/runs/create')}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Run
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Calculate job type counts for today
  const jobTypeCounts = {
    shift_brief: recentJobs.filter(j => j.jobType === 'shift_brief').length,
    impact_report: recentJobs.filter(j => j.jobType === 'impact_report').length,
    explain_chat: recentJobs.filter(j => j.jobType === 'explain_chat').length,
    validation: recentJobs.filter(j => j.jobType === 'validation').length,
    schedule_generation: recentJobs.filter(j => j.jobType === 'schedule_generation').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30';
      case 'degraded':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30';
      case 'down':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getJobTypeIcon = (jobType: string) => {
    switch (jobType) {
      case 'shift_brief':
        return <FileText className="w-4 h-4" />;
      case 'impact_report':
        return <BarChart3 className="w-4 h-4" />;
      case 'explain_chat':
        return <MessageSquare className="w-4 h-4" />;
      case 'validation':
        return <CheckCircle className="w-4 h-4" />;
      case 'schedule_generation':
        return <Clock className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getJobTypeLabel = (jobType: string) => {
    switch (jobType) {
      case 'shift_brief':
        return 'Shift Brief';
      case 'impact_report':
        return 'Impact Report';
      case 'explain_chat':
        return 'Explain Chat';
      case 'validation':
        return 'Validation';
      case 'schedule_generation':
        return 'Schedule Generation';
      default:
        return jobType;
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds.toFixed(1)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Digital Operations Assistant</h1>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Acme Precision Works • AI agent monitoring and management
        </p>
      </div>

      {/* Agent Status Card */}
      <div className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-xl border p-6 mb-6 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Agent Status
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Last heartbeat: {formatTimestamp(agentStatus.lastHeartbeat)}
            </p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-2 ${getStatusColor(agentStatus.status)}`}>
            <Activity className="w-4 h-4" />
            {agentStatus.status.charAt(0).toUpperCase() + agentStatus.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Uptime</p>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {agentStatus.uptime.toFixed(1)}h
            </p>
          </div>
          <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Today's Jobs</p>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {agentStatus.todayJobsCount}
            </p>
          </div>
          <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Failure Rate</p>
            <p className={`text-2xl font-bold ${
              agentStatus.failureRate > 5 ? 'text-red-600 dark:text-red-400' : 
              agentStatus.failureRate > 3 ? 'text-yellow-600 dark:text-yellow-400' : 
              'text-green-600 dark:text-green-400'
            }`}>
              {agentStatus.failureRate.toFixed(1)}%
            </p>
          </div>
          <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Duration</p>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {agentStatus.avgDuration.toFixed(1)}s
            </p>
          </div>
        </div>
      </div>

      {/* Job Type Activity */}
      <div className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-xl border p-6 mb-6 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Today's Activity by Job Type
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className={`${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Shift Brief</p>
            </div>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {jobTypeCounts.shift_brief}
            </p>
          </div>
          <div className={`${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-purple-50 border-purple-200'} border rounded-lg p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Impact Report</p>
            </div>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {jobTypeCounts.impact_report}
            </p>
          </div>
          <div className={`${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-green-50 border-green-200'} border rounded-lg p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Explain Chat</p>
            </div>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {jobTypeCounts.explain_chat}
            </p>
          </div>
          <div className={`${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Validation</p>
            </div>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {jobTypeCounts.validation}
            </p>
          </div>
          <div className={`${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-orange-50 border-orange-200'} border rounded-lg p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Schedule Gen</p>
            </div>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {jobTypeCounts.schedule_generation}
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } rounded-xl border p-6 mb-6`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Agent Alerts
          </h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-4 rounded-lg border ${
                  alert.severity === 'critical'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : alert.severity === 'high'
                    ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                }`}
              >
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                  alert.severity === 'critical'
                    ? 'text-red-600 dark:text-red-400'
                    : alert.severity === 'high'
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-yellow-600 dark:text-yellow-400'
                }`} />
                <div className="flex-1">
                  <p className={`font-medium mb-1 ${
                    alert.severity === 'critical'
                      ? 'text-red-900 dark:text-red-200'
                      : alert.severity === 'high'
                      ? 'text-orange-900 dark:text-orange-200'
                      : 'text-yellow-900 dark:text-yellow-200'
                  }`}>
                    {alert.message}
                  </p>
                  <p className={`text-sm ${
                    alert.severity === 'critical'
                      ? 'text-red-700 dark:text-red-300'
                      : alert.severity === 'high'
                      ? 'text-orange-700 dark:text-orange-300'
                      : 'text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {formatTimestamp(alert.timestamp)}
                    {alert.count && ` • ${alert.count} occurrences`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Jobs Table */}
        <div className={`lg:col-span-2 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } rounded-xl border p-6 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Jobs
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-2 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Job ID</th>
                  <th className={`text-left py-3 px-2 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Type</th>
                  <th className={`text-left py-3 px-2 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Run ID</th>
                  <th className={`text-left py-3 px-2 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                  <th className={`text-left py-3 px-2 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Duration</th>
                  <th className={`text-center py-3 px-2 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Validation</th>
                  <th className={`text-center py-3 px-2 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fallback</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr
                    key={job.id}
                    className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
                  >
                    <td className={`py-3 px-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {job.id}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        {getJobTypeIcon(job.jobType)}
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {getJobTypeLabel(job.jobType)}
                        </span>
                      </div>
                    </td>
                    <td className={`py-3 px-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {job.runId || '—'}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        job.status === 'completed'
                          ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : job.status === 'failed'
                          ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : job.status === 'running'
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {job.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                        {job.status === 'failed' && <XCircle className="w-3 h-3" />}
                        {job.status === 'running' && <Loader2 className="w-3 h-3 animate-spin" />}
                        {job.status}
                      </span>
                    </td>
                    <td className={`py-3 px-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {job.duration ? formatDuration(job.duration) : '—'}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {job.validationPass ? (
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {job.fallbackUsed ? (
                        <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400 mx-auto" />
                      ) : (
                        <span className={`text-sm ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } rounded-xl border p-6 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Links
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/app/runs/RUN-2402/brief')}
              disabled={!hasFullAccess}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                hasFullAccess
                  ? `${isDarkMode ? 'border-gray-700 hover:border-blue-500 hover:bg-gray-700/50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`
                  : 'opacity-50 cursor-not-allowed border-gray-700'
              }`}
            >
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 text-left">
                <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Shift Brief</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>View latest brief</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/app/runs/RUN-2402/draft-assistant')}
              disabled={!hasFullAccess}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                hasFullAccess
                  ? `${isDarkMode ? 'border-gray-700 hover:border-purple-500 hover:bg-gray-700/50' : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'}`
                  : 'opacity-50 cursor-not-allowed border-gray-700'
              }`}
            >
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 text-left">
                <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Impact Report</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Draft impact analysis</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/app/agent/chat')}
              disabled={!hasFullAccess}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                hasFullAccess
                  ? `${isDarkMode ? 'border-gray-700 hover:border-green-500 hover:bg-gray-700/50' : 'border-gray-200 hover:border-green-300 hover:bg-green-50'}`
                  : 'opacity-50 cursor-not-allowed border-gray-700'
              }`}
            >
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 text-left">
                <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Explain Chat</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ask about this run</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/app/agent/metrics')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                isDarkMode 
                  ? 'border-gray-700 hover:border-orange-500 hover:bg-gray-700/50' 
                  : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-orange-900/30' : 'bg-orange-100'}`}>
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 text-left">
                <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AI Metrics</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>View performance</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/app/agent/setup-guidance')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                isDarkMode 
                  ? 'border-gray-700 hover:border-yellow-500 hover:bg-gray-700/50' 
                  : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
                <Wrench className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1 text-left">
                <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Setup Guidance</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Generate checklists</p>
              </div>
            </button>

            {/* Setup Checklist - Sourced */}
            <button
              onClick={() => navigate('/app/agent/setup-checklist/output')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                isDarkMode 
                  ? 'border-gray-700 hover:border-green-500 hover:bg-gray-700/50' 
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                <Wrench className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 text-left">
                <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Setup Checklist - Sourced</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>All parameters verified</p>
              </div>
            </button>

            {/* Setup Checklist - Unsourced */}
            <button
              onClick={() => navigate('/app/agent/setup-checklist/unsourced')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                isDarkMode 
                  ? 'border-gray-700 hover:border-amber-500 hover:bg-gray-700/50' 
                  : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
                <Wrench className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 text-left">
                <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Setup Checklist - Unsourced</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Parameters need sources</p>
              </div>
            </button>

            {/* Draft Impact Report Compare - Publish Child Run */}
            <button
              onClick={() => navigate('/app/runs/compare/draft-impact-report')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                isDarkMode 
                  ? 'border-gray-700 hover:border-indigo-500 hover:bg-gray-700/50' 
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}>
                <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1 text-left">
                <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Publish Child Run</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Draft impact compare</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/app/agent/jobs')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                isDarkMode 
                  ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-700/50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1 text-left">
                <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Agent Jobs</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Audit log</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}