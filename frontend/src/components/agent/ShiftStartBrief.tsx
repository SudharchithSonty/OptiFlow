import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  X,
  FileText,
  Activity,
  Settings,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Shield,
  Zap,
  Package,
  Wrench,
  AlertCircle,
  Info,
  ChevronRight
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface ShiftStartBriefProps {
  userRole: 'owner' | 'planner' | 'supervisor';
}

type EvidenceTab = 'schedule' | 'events' | 'constraints' | 'kpis';

interface EvidenceItem {
  type: string;
  reference: string;
  description: string;
  timestamp?: string;
}

interface Evidence {
  schedule: EvidenceItem[];
  events: EvidenceItem[];
  constraints: EvidenceItem[];
  kpis: EvidenceItem[];
}

export function ShiftStartBrief({ userRole }: ShiftStartBriefProps) {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { runId } = useParams<{ runId: string }>();
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // Evidence drawer state
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false);
  const [activeEvidenceTab, setActiveEvidenceTab] = useState<EvidenceTab>('schedule');
  const [currentEvidence, setCurrentEvidence] = useState<Evidence | null>(null);
  const [evidenceTitle, setEvidenceTitle] = useState('');

  // Check permissions
  const hasPermission = userRole === 'planner' || userRole === 'supervisor';

  // Mock run data
  const runData = {
    runDate: '2026-01-24',
    shift: 'Shift B',
    runId: 'RUN-2402',
    status: 'Completed' as const,
    generatedAt: '07:58',
  };

  // Mock brief data
  const lateOrders = [
    { orderId: 'O-112', dueTime: '14:30', predictedLateness: '2h 15m', severity: 'high' as const },
    { orderId: 'O-121', dueTime: '16:00', predictedLateness: '45m', severity: 'medium' as const },
    { orderId: 'O-133', dueTime: '18:30', predictedLateness: '1h 30m', severity: 'high' as const },
  ];

  const bottleneckRisk = {
    machine: 'M03',
    issue: 'Overloaded - 8 operations scheduled',
    impact: 'May delay O-112, O-121, O-133',
    utilization: '142%',
  };

  const recommendedActions = [
    {
      id: 'ACT-001',
      action: 'Reschedule OP-456 from M03 to M04',
      owner: 'Planner' as const,
      urgency: 'high' as const,
      reason: 'Reduce M03 load by 18%',
    },
    {
      id: 'ACT-002',
      action: 'Start shift 15 minutes early',
      owner: 'Supervisor' as const,
      urgency: 'medium' as const,
      reason: 'Recover predicted lateness on O-112',
    },
    {
      id: 'ACT-003',
      action: 'Pre-stage tooling for M03 operations',
      owner: 'Supervisor' as const,
      urgency: 'medium' as const,
      reason: 'Reduce setup time by ~20 minutes',
    },
  ];

  const knownRisks = [
    {
      id: 'RISK-001',
      type: 'Downtime Window',
      description: 'M07 scheduled maintenance 14:00-15:00',
      impact: 'Low - only OP-789 affected',
      severity: 'low' as const,
    },
    {
      id: 'RISK-002',
      type: 'Tooling Constraint',
      description: 'Only 2 T-450 tools available for M03',
      impact: 'Medium - may increase setup time',
      severity: 'medium' as const,
    },
  ];

  const handleOpenEvidence = (title: string, evidence: Evidence) => {
    setEvidenceTitle(title);
    setCurrentEvidence(evidence);
    setEvidenceDrawerOpen(true);
    setActiveEvidenceTab('schedule');
  };

  const handleRegenerateBrief = async () => {
    setIsRegenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRegenerating(false);
    // Could toggle fallback mode here for demo
  };

  const handleJumpToSchedule = (reference: string) => {
    console.log('Jump to schedule with reference:', reference);
    navigate('/app/schedule', { state: { highlightId: reference } });
  };

  // Permission denied state
  if (!hasPermission) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isDarkMode ? 'bg-red-500/20' : 'bg-red-100'
          }`}>
            <Shield className={`w-8 h-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Access Denied
          </h3>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Shift-start briefs are only available to Planners and Supervisors.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className={`w-12 h-12 animate-spin mx-auto mb-4 ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`} />
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Loading shift-start brief...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isDarkMode ? 'bg-red-500/20' : 'bg-red-100'
          }`}>
            <AlertCircle className={`w-8 h-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Failed to Load Brief
          </h3>
          <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Unable to generate shift-start brief. Please try again.
          </p>
          <button
            onClick={() => setHasError(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    const colors = {
      high: isDarkMode ? 'text-red-400 bg-red-500/20' : 'text-red-700 bg-red-100',
      medium: isDarkMode ? 'text-yellow-400 bg-yellow-500/20' : 'text-yellow-700 bg-yellow-100',
      low: isDarkMode ? 'text-green-400 bg-green-500/20' : 'text-green-700 bg-green-100',
    };
    return colors[severity];
  };

  const getUrgencyColor = (urgency: 'high' | 'medium' | 'low') => {
    const colors = {
      high: isDarkMode ? 'text-red-400 bg-red-500/20 border-red-500/30' : 'text-red-700 bg-red-50 border-red-200',
      medium: isDarkMode ? 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' : 'text-yellow-700 bg-yellow-50 border-yellow-200',
      low: isDarkMode ? 'text-blue-400 bg-blue-500/20 border-blue-500/30' : 'text-blue-700 bg-blue-50 border-blue-200',
    };
    return colors[urgency];
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/app/agent/home')}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
        }`}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Agent Home</span>
      </button>

      {/* Fallback Mode Banner */}
      {isFallbackMode && (
        <div className={`p-4 rounded-lg border-2 border-dashed ${
          isDarkMode 
            ? 'bg-yellow-500/10 border-yellow-500/30' 
            : 'bg-yellow-50 border-yellow-300'
        }`}>
          <div className="flex items-start gap-3">
            <Info className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <div className="flex-1">
              <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-900'}`}>
                Fallback Brief (Template)
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                AI model unavailable or evidence validation failed. Showing template-based brief with limited insights.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`rounded-xl border p-6 ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Run Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Run: {runData.runDate} {runData.shift}
              </h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium ${
                isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
              }`}>
                <CheckCircle2 className="w-4 h-4" />
                {runData.status}
              </span>
              {isFallbackMode && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium ${
                  isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  Template
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 flex-wrap text-sm">
              <span className={`flex items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <FileText className="w-4 h-4" />
                Run ID: {runData.runId}
              </span>
              <span className={`flex items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <Clock className="w-4 h-4" />
                Generated at {runData.generatedAt}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {userRole === 'planner' && (
              <button
                onClick={handleRegenerateBrief}
                disabled={isRegenerating}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isRegenerating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isDarkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                {isRegenerating ? 'Regenerating...' : 'Regenerate Brief'}
              </button>
            )}
            <button
              onClick={() => navigate(`/app/runs/${runId || runData.runId}/schedule`)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              View Schedule
            </button>
            <button
              onClick={() => navigate(`/app/runs/${runId || runData.runId}/events`)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              View Events
            </button>
          </div>
        </div>
      </div>

      {/* Brief Cards Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Late Orders */}
        <div className={`rounded-xl border p-6 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
                <AlertTriangle className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Top Late Orders
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {lateOrders.length} orders at risk
                </p>
              </div>
            </div>
            {isFallbackMode && (
              <span className={`px-2 py-1 text-xs rounded ${
                isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
              }`}>
                Template
              </span>
            )}
          </div>

          <div className="space-y-3">
            {lateOrders.map((order) => (
              <div
                key={order.orderId}
                className={`p-3 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {order.orderId}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(order.severity)}`}>
                    {order.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Due: {order.dueTime}
                  </span>
                  <span className={isDarkMode ? 'text-red-400' : 'text-red-600'}>
                    +{order.predictedLateness} late
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleOpenEvidence('Top Late Orders', {
              schedule: [
                { type: 'Order', reference: 'O-112', description: 'Scheduled on M03, OP-234' },
                { type: 'Order', reference: 'O-121', description: 'Scheduled on M03, OP-456' },
                { type: 'Order', reference: 'O-133', description: 'Scheduled on M05, OP-789' },
              ],
              events: [
                { type: 'Setup Delay', reference: 'EVT-123', description: 'M03 setup exceeded estimate by 15m', timestamp: '2026-01-23 14:30' },
              ],
              constraints: [
                { type: 'Precedence', reference: 'CONS-045', description: 'O-112 depends on O-098 completion' },
              ],
              kpis: [
                { type: 'OTD', reference: 'KPI-001', description: 'Current: 78%, Target: 85%' },
              ],
            })}
            className={`w-full mt-4 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? 'text-blue-400 hover:bg-gray-700/50'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            View Evidence
          </button>
        </div>

        {/* Bottleneck Risk */}
        <div className={`rounded-xl border p-6 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                <Zap className={`w-5 h-5 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Bottleneck Risk
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Critical machine overload
                </p>
              </div>
            </div>
            {isFallbackMode && (
              <span className={`px-2 py-1 text-xs rounded ${
                isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
              }`}>
                Template
              </span>
            )}
          </div>

          <div className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-lg font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}>
                {bottleneckRisk.machine}
              </span>
              <span className={`px-2.5 py-1 rounded font-semibold text-sm ${
                isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
              }`}>
                {bottleneckRisk.utilization}
              </span>
            </div>
            <p className={`font-medium mb-2 ${isDarkMode ? 'text-orange-300' : 'text-orange-800'}`}>
              {bottleneckRisk.issue}
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-orange-200/80' : 'text-orange-700'}`}>
              Impact: {bottleneckRisk.impact}
            </p>
          </div>

          <button
            onClick={() => handleOpenEvidence('Bottleneck Risk: M03', {
              schedule: [
                { type: 'Operation', reference: 'OP-234', description: 'O-112 on M03, 2h duration' },
                { type: 'Operation', reference: 'OP-456', description: 'O-121 on M03, 1.5h duration' },
                { type: 'Operation', reference: 'OP-567', description: 'O-089 on M03, 1h duration' },
              ],
              events: [],
              constraints: [
                { type: 'Capacity', reference: 'CONS-067', description: 'M03 max 8h per shift' },
              ],
              kpis: [
                { type: 'Utilization', reference: 'KPI-002', description: 'M03: 142% (11.4h scheduled)' },
              ],
            })}
            className={`w-full mt-4 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? 'text-blue-400 hover:bg-gray-700/50'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            View Evidence
          </button>
        </div>

        {/* Recommended Actions */}
        <div className={`rounded-xl border p-6 lg:col-span-2 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <CheckCircle2 className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recommended Actions
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {recommendedActions.length} actions to improve outcomes
                </p>
              </div>
            </div>
            {isFallbackMode && (
              <span className={`px-2 py-1 text-xs rounded ${
                isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
              }`}>
                Template
              </span>
            )}
          </div>

          <div className="space-y-3">
            {recommendedActions.map((action) => (
              <div
                key={action.id}
                className={`p-4 rounded-lg border-2 ${getUrgencyColor(action.urgency)}`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className={`font-semibold flex-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {action.action}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      action.urgency === 'high' 
                        ? isDarkMode ? 'bg-red-500/30 text-red-300' : 'bg-red-200 text-red-800'
                        : action.urgency === 'medium'
                        ? isDarkMode ? 'bg-yellow-500/30 text-yellow-300' : 'bg-yellow-200 text-yellow-800'
                        : isDarkMode ? 'bg-blue-500/30 text-blue-300' : 'bg-blue-200 text-blue-800'
                    }`}>
                      {action.urgency}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Owner: <span className="font-medium">{action.owner}</span>
                  </span>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {action.reason}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleOpenEvidence('Recommended Actions', {
              schedule: [
                { type: 'Operation', reference: 'OP-456', description: 'Currently on M03, can move to M04' },
              ],
              events: [
                { type: 'Analysis', reference: 'ANA-001', description: 'M04 has 2h available capacity' },
              ],
              constraints: [
                { type: 'Machine Compatibility', reference: 'CONS-089', description: 'OP-456 compatible with M03, M04' },
              ],
              kpis: [
                { type: 'Utilization Delta', reference: 'KPI-003', description: 'M03: 142% → 124%, M04: 65% → 83%' },
              ],
            })}
            className={`w-full mt-4 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? 'text-blue-400 hover:bg-gray-700/50'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            View Evidence
          </button>
        </div>

        {/* Known Risks */}
        <div className={`rounded-xl border p-6 lg:col-span-2 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                <AlertCircle className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Known Risks
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {knownRisks.length} risks to monitor
                </p>
              </div>
            </div>
            {isFallbackMode && (
              <span className={`px-2 py-1 text-xs rounded ${
                isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
              }`}>
                Template
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {knownRisks.map((risk) => (
              <div
                key={risk.id}
                className={`p-4 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {risk.type === 'Downtime Window' ? (
                      <Wrench className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    ) : (
                      <Settings className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    )}
                    <span className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {risk.type}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(risk.severity)}`}>
                    {risk.severity}
                  </span>
                </div>
                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {risk.description}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {risk.impact}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleOpenEvidence('Known Risks', {
              schedule: [
                { type: 'Maintenance', reference: 'M07', description: 'Downtime window 14:00-15:00' },
              ],
              events: [
                { type: 'Planned Downtime', reference: 'EVT-456', description: 'M07 PM scheduled', timestamp: '2026-01-24 14:00' },
              ],
              constraints: [
                { type: 'Tooling', reference: 'CONS-123', description: 'T-450: 2 available, 3 required for optimal flow' },
              ],
              kpis: [],
            })}
            className={`w-full mt-4 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? 'text-blue-400 hover:bg-gray-700/50'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            View Evidence
          </button>
        </div>
      </div>

      {/* Evidence Drawer */}
      {evidenceDrawerOpen && currentEvidence && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center lg:justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEvidenceDrawerOpen(false)}
          />

          {/* Drawer */}
          <div className={`relative w-full lg:w-[600px] lg:h-full max-h-[85vh] lg:max-h-full overflow-hidden ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          } rounded-t-2xl lg:rounded-none shadow-2xl flex flex-col animate-slide-up lg:animate-slide-left`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Evidence: {evidenceTitle}
              </h3>
              <button
                onClick={() => setEvidenceDrawerOpen(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Tabs */}
            <div className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {[
                { id: 'schedule', label: 'Schedule Rows', icon: Calendar },
                { id: 'events', label: 'Events', icon: Activity },
                { id: 'constraints', label: 'Constraints', icon: Settings },
                { id: 'kpis', label: 'KPI Deltas', icon: TrendingUp },
              ].map((tab) => {
                const Icon = tab.icon;
                const count = currentEvidence[tab.id as EvidenceTab].length;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveEvidenceTab(tab.id as EvidenceTab)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                      activeEvidenceTab === tab.id
                        ? isDarkMode
                          ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                          : 'border-blue-600 text-blue-600 bg-blue-50'
                        : isDarkMode
                        ? 'border-transparent text-gray-400 hover:text-gray-300'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {count > 0 && (
                      <span className={`px-1.5 py-0.5 rounded text-xs ${
                        activeEvidenceTab === tab.id
                          ? isDarkMode ? 'bg-blue-500/30 text-blue-300' : 'bg-blue-200 text-blue-700'
                          : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {currentEvidence[activeEvidenceTab].length === 0 ? (
                <div className="text-center py-12">
                  <Info className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    No {activeEvidenceTab} evidence available
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentEvidence[activeEvidenceTab].map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      } transition-colors`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                              isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {item.type}
                            </span>
                            <span className={`font-mono text-sm font-semibold ${
                              isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            }`}>
                              {item.reference}
                            </span>
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {item.description}
                          </p>
                          {item.timestamp && (
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              {item.timestamp}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleJumpToSchedule(item.reference)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                            isDarkMode
                              ? 'text-blue-400 hover:bg-blue-500/20'
                              : 'text-blue-600 hover:bg-blue-100'
                          }`}
                        >
                          Jump
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}