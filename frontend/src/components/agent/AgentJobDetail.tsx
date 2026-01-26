import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Zap,
  Download,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Copy,
  GitCompare,
  FileJson,
  AlertTriangle
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface AgentJobDetailProps {
  userRole: 'owner' | 'planner' | 'supervisor';
}

interface ValidationCheck {
  check: string;
  passed: boolean;
  message: string;
  severity: 'critical' | 'warning' | 'info';
}

interface AuditEvent {
  timestamp: string;
  event: string;
  details: string;
}

export function AgentJobDetail({ userRole }: AgentJobDetailProps) {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();

  const [outputExpanded, setOutputExpanded] = useState(false);
  const [technicalExpanded, setTechnicalExpanded] = useState(false);

  // Check permissions
  const canRetry = userRole === 'planner';
  const canCompare = userRole === 'planner';
  const canDownload = userRole === 'owner' || userRole === 'planner';

  // Mock job data
  const job = {
    job_id: jobId || 'AJ-98321',
    job_type: 'disruption_replan',
    status: 'failed' as const,
    duration_ms: 32000,
    validation_pass: false,
    fallback_used: true,
    created_at: '2026-01-25T11:30:45Z',
    started_at: '2026-01-25T11:30:46Z',
    completed_at: '2026-01-25T11:31:18Z',
    trigger: 'event_logged',
    run_id: 'RUN-2402',
    parent_run_id: 'RUN-2401',
    started_by: 'system',
    machine_id: 'M03',
    request_id: 'req_7f3a8b2c9d1e',
  };

  const inputs = {
    event_id: 'EVT-145',
    event_type: 'machine_breakdown',
    machine_id: 'M03',
    duration_minutes: 45,
    severity: 'high',
    run_id: 'RUN-2402',
    parent_run_id: 'RUN-2401',
    constraints: {
      max_tardiness_minutes: 60,
      preserve_order_priority: true,
      allow_machine_substitution: false,
    },
  };

  const outputs = {
    new_run_id: 'RUN-2402-v2',
    operations_rescheduled: 8,
    orders_affected: 4,
    predicted_otd_impact: '+6%',
    fallback_reason: 'Validation failed: Cross-reference integrity check',
    recommendations: [
      'Manual review required for M03 operations',
      'Consider machine substitution for critical orders',
    ],
  };

  const validationChecks: ValidationCheck[] = [
    {
      check: 'Event timestamp consistency',
      passed: false,
      message: 'Breakdown timestamp (11:10) conflicts with scheduled operation start (10:00). Gap indicates missing event data.',
      severity: 'critical',
    },
    {
      check: 'Cross-reference integrity',
      passed: false,
      message: 'Operation OP-234 not found in parent run schedule. Cannot validate downstream dependencies.',
      severity: 'critical',
    },
    {
      check: 'Machine capacity constraints',
      passed: true,
      message: 'All rescheduled operations fit within machine capacity limits.',
      severity: 'info',
    },
    {
      check: 'Order precedence',
      passed: true,
      message: 'All precedence constraints maintained in new schedule.',
      severity: 'info',
    },
    {
      check: 'Resource availability',
      passed: false,
      message: 'Tooling T-450 unavailable during proposed reschedule window.',
      severity: 'warning',
    },
  ];

  const failureReason = {
    title: 'Validation Failed: Missing Event Context',
    summary: 'The disruption replan could not be validated because critical event data is missing from the parent run. The breakdown event at 11:10 conflicts with the scheduled operation timeline, and operation OP-234 referenced in the event does not exist in the parent run schedule.',
    impact: 'High - Manual intervention required',
    recommendation: 'Review event log EVT-145 for accuracy, verify operation references, and consider running impact analysis on parent run RUN-2401 before retrying.',
  };

  const technicalDetails = {
    model_version: 'disruption-replan-v2.4.1',
    execution_time_breakdown: {
      event_parsing: '120ms',
      constraint_loading: '450ms',
      schedule_optimization: '28500ms',
      validation: '2100ms',
      output_generation: '830ms',
    },
    memory_usage: '2.3GB peak',
    error_trace: `ValidationError: Cross-reference check failed
  at validateEventContext (validator.ts:234)
  at validateDisruptionPlan (planner.ts:156)
  at executeDisruptionReplan (executor.ts:89)`,
  };

  const auditTrail: AuditEvent[] = [
    { timestamp: '2026-01-25T11:30:45Z', event: 'Job created', details: 'Triggered by event_logged (EVT-145)' },
    { timestamp: '2026-01-25T11:30:46Z', event: 'Job started', details: 'Allocated to worker node-3' },
    { timestamp: '2026-01-25T11:30:47Z', event: 'Inputs validated', details: 'Input schema check passed' },
    { timestamp: '2026-01-25T11:31:15Z', event: 'Validation failed', details: 'Cross-reference integrity check failed' },
    { timestamp: '2026-01-25T11:31:16Z', event: 'Fallback activated', details: 'Using rule-based SOP template' },
    { timestamp: '2026-01-25T11:31:18Z', event: 'Job completed', details: 'Status: failed, Fallback: true' },
  ];

  const formatDuration = (ms: number) => {
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
      fractionalSecondDigits: 3,
    });
  };

  const getStatusColor = (status: 'failed' | 'succeeded' | 'running' | 'queued') => {
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

  const getSeverityColor = (severity: 'critical' | 'warning' | 'info') => {
    switch (severity) {
      case 'critical':
        return isDarkMode ? 'text-red-400 bg-red-500/20 border-red-500/30' : 'text-red-700 bg-red-50 border-red-200';
      case 'warning':
        return isDarkMode ? 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' : 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'info':
        return isDarkMode ? 'text-blue-400 bg-blue-500/20 border-blue-500/30' : 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  const handleCopyJSON = (obj: any) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
  };

  const handleDownloadArtifacts = () => {
    const artifacts = {
      job: job,
      inputs: inputs,
      outputs: outputs,
      validation_checks: validationChecks,
      audit_trail: auditTrail,
    };
    
    const json = JSON.stringify(artifacts, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-job-${job.job_id}-artifacts.json`;
    a.click();
  };

  const handleRetryJob = () => {
    console.log('Retrying job:', job.job_id);
    // Navigate to retry confirmation or directly retry
    navigate(`/app/agent/jobs/${job.job_id}/retry`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate('/app/agent/jobs')}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className={`text-2xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {job.job_id}
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(job.status)}`}>
                {job.status === 'failed' && <XCircle className="w-4 h-4" />}
                {job.status === 'succeeded' && <CheckCircle2 className="w-4 h-4" />}
                {job.status}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Type: <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {job.job_type.replace('_', ' ')}
                </span>
              </span>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Duration: <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {formatDuration(job.duration_ms)}
                </span>
              </span>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Validation: {job.validation_pass ? (
                  <CheckCircle2 className="w-4 h-4 inline text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 inline text-red-600 dark:text-red-400" />
                )}
              </span>
              {job.fallback_used && (
                <span className={`inline-flex items-center gap-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  <Zap className="w-4 h-4" />
                  Fallback used
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {canDownload && (
            <button
              onClick={handleDownloadArtifacts}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          )}

          {canRetry && job.status === 'failed' && (
            <button
              onClick={handleRetryJob}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Job
            </button>
          )}
        </div>
      </div>

      {/* Loud Failure Reason (if failed) */}
      {job.status === 'failed' && (
        <div className={`rounded-xl border-2 p-6 ${
          isDarkMode 
            ? 'bg-red-500/10 border-red-500/30' 
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-start gap-4">
            <AlertTriangle className={`w-8 h-8 flex-shrink-0 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>
                {failureReason.title}
              </h3>
              <p className={`mb-3 ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                {failureReason.summary}
              </p>
              
              <div className="grid gap-3">
                <div className={`p-3 rounded-lg border ${
                  isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-100 border-red-200'
                }`}>
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>
                    Impact:
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                    {failureReason.impact}
                  </p>
                </div>
                
                <div className={`p-3 rounded-lg border ${
                  isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-100 border-red-200'
                }`}>
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>
                    Recommended Action:
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                    {failureReason.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className={`rounded-xl border p-6 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Inputs
            </h3>
            <button
              onClick={() => handleCopyJSON(inputs)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <Copy className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
          
          <div className={`rounded-lg border p-4 font-mono text-sm ${
            isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <pre className={`overflow-x-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {JSON.stringify(inputs, null, 2)}
            </pre>
          </div>
        </div>

        {/* Outputs */}
        <div className={`rounded-xl border p-6 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Outputs
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyJSON(outputs)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <Copy className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              <button
                onClick={() => setOutputExpanded(!outputExpanded)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                {outputExpanded ? (
                  <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                ) : (
                  <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                )}
              </button>
            </div>
          </div>
          
          {outputExpanded ? (
            <div className={`rounded-lg border p-4 font-mono text-sm ${
              isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <pre className={`overflow-x-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {JSON.stringify(outputs, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(outputs).slice(0, 3).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                >
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {key}:
                  </span>
                  <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
              <button
                onClick={() => setOutputExpanded(true)}
                className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
              >
                Show all fields →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Validation Checks */}
      <div className={`rounded-xl border p-6 ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Validation Checks
        </h3>
        
        <div className="space-y-3">
          {validationChecks.map((check, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getSeverityColor(check.severity)}`}
            >
              <div className="flex items-start gap-3">
                {check.passed ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">{check.check}</h4>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      check.severity === 'critical' 
                        ? isDarkMode ? 'bg-red-500/30' : 'bg-red-200'
                        : check.severity === 'warning'
                        ? isDarkMode ? 'bg-yellow-500/30' : 'bg-yellow-200'
                        : isDarkMode ? 'bg-blue-500/30' : 'bg-blue-200'
                    }`}>
                      {check.severity}
                    </span>
                  </div>
                  <p className="text-sm">{check.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Details */}
      <div className={`rounded-xl border p-6 ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white border-gray-200'
      }`}>
        <button
          onClick={() => setTechnicalExpanded(!technicalExpanded)}
          className="w-full flex items-center justify-between mb-4"
        >
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Technical Details
          </h3>
          {technicalExpanded ? (
            <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </button>
        
        {technicalExpanded && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Model Version
              </p>
              <p className={`font-mono text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {technicalDetails.model_version}
              </p>
            </div>

            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Execution Time Breakdown
              </p>
              <div className="space-y-1">
                {Object.entries(technicalDetails.execution_time_breakdown).map(([phase, time]) => (
                  <div key={phase} className="flex items-center justify-between text-sm">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {phase.replace('_', ' ')}:
                    </span>
                    <span className={`font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Memory Usage
              </p>
              <p className={`font-mono text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {technicalDetails.memory_usage}
              </p>
            </div>

            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Error Trace
              </p>
              <pre className={`font-mono text-xs overflow-x-auto ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                {technicalDetails.error_trace}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Audit Trail */}
      <div className={`rounded-xl border p-6 ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Audit Trail
          </h3>
          <div className={`px-3 py-1 rounded-lg text-xs font-mono ${
            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            Request ID: {job.request_id}
          </div>
        </div>
        
        <div className="space-y-3">
          {auditTrail.map((event, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 p-3 rounded-lg ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                event.event.includes('failed') || event.event.includes('Fallback')
                  ? 'bg-red-500'
                  : event.event.includes('completed')
                  ? 'bg-green-500'
                  : 'bg-blue-500'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className={`font-medium text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {event.event}
                  </span>
                  <span className={`text-xs font-mono flex-shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {formatTimestamp(event.timestamp)}
                  </span>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {event.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions (if planner) */}
      {canCompare && job.parent_run_id && (
        <div className={`rounded-xl border p-6 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Actions
          </h3>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(`/app/runs/${job.parent_run_id}`)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              Open Parent Run
            </button>

            <button
              onClick={() => navigate(`/app/runs/compare?base=${job.parent_run_id}&compare=${job.run_id}`)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              Compare Runs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
