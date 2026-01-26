import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Wrench,
  Calendar,
  Activity,
  Settings,
  ExternalLink,
  X,
  ChevronRight,
  Info,
  AlertTriangle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Trash2,
  FileText,
  RefreshCw,
  Zap
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface DraftImpactReportProps {
  userRole: 'owner' | 'planner' | 'supervisor';
  runId?: string;
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

type DraftState = 'loaded' | 'missing' | 'invalid' | 'model-unavailable';

export function DraftImpactReport({ userRole, runId = 'RUN-2401' }: DraftImpactReportProps) {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const [draftState, setDraftState] = useState<DraftState>('loaded');
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false);
  const [activeEvidenceTab, setActiveEvidenceTab] = useState<EvidenceTab>('schedule');

  // Mock data
  const parentRun = {
    runId: 'RUN-2401',
    version: 'v1',
    status: 'Completed' as const,
  };

  const selectedEvent = {
    type: 'machine_breakdown',
    machine: 'M03',
    startTime: '11:10',
    duration: '45 min',
    severity: 'High' as const,
  };

  const draftSavedTime = '11:42';

  const impactedMachines = [
    { id: 'M03', name: 'Press M03', impact: 'Direct breakdown', severity: 'high' as const },
    { id: 'M04', name: 'Press M04', impact: 'Rerouted operations (+2h)', severity: 'medium' as const },
    { id: 'M05', name: 'Lathe M05', impact: 'Queued operations delayed', severity: 'low' as const },
  ];

  const impactedOrders = [
    { id: 'O-112', product: 'Widget A', predictedDelay: '45 min', severity: 'high' as const },
    { id: 'O-121', product: 'Gear Pressing', predictedDelay: '30 min', severity: 'medium' as const },
    { id: 'O-133', product: 'Bracket Set', predictedDelay: '1h 15min', severity: 'high' as const },
    { id: 'O-089', product: 'Shaft Assembly', predictedDelay: '15 min', severity: 'low' as const },
  ];

  const otdRiskDelta = {
    parentRisk: 15,
    currentRisk: 21,
    delta: 6,
    trend: 'up' as const,
  };

  const setupRisk = {
    machine: 'M03',
    description: 'Switching from breakdown to normal operations requires recalibration',
    estimatedSetupTime: '20-30 min',
    impact: 'May delay 2 operations further',
  };

  const recommendedAction = {
    action: 'Schedule child run with updated constraints',
    priority: 'high' as const,
    reasoning: 'M03 breakdown creates cascade delays. Recommend immediate reschedule to optimize remaining shift time and minimize late orders.',
    alternatives: [
      'Notify supervisor to reassign operations manually',
      'Adjust order priorities to save critical orders',
    ],
  };

  const validationError = {
    reason: 'CROSS_REFERENCE_FAILURE',
    message: 'Event timestamp conflicts with parent run schedule. M03 breakdown at 11:10 occurs before scheduled operation start.',
    jobId: `JOB-${Date.now()}`,
  };

  // Evidence data
  const evidenceData: Evidence = {
    schedule: [
      { type: 'Operation', reference: 'OP-234', description: 'O-112 on M03, originally 10:00-12:00' },
      { type: 'Operation', reference: 'OP-456', description: 'O-121 on M03, originally 12:15-13:45' },
      { type: 'Operation', reference: 'OP-789', description: 'O-133 on M05, dependent on M03 completion' },
    ],
    events: [
      { type: 'Breakdown', reference: 'EVT-145', description: 'M03 hydraulic failure', timestamp: '2026-01-24 11:10' },
      { type: 'Repair Complete', reference: 'EVT-146', description: 'M03 back online', timestamp: '2026-01-24 11:55' },
    ],
    constraints: [
      { type: 'Capacity', reference: 'CONS-067', description: 'M03 max 8h per shift' },
      { type: 'Precedence', reference: 'CONS-045', description: 'O-133 depends on O-112 completion' },
    ],
    kpis: [
      { type: 'OTD Risk', reference: 'KPI-OTD', description: 'Parent: 15% → Current: 21% (+6%)' },
      { type: 'Utilization', reference: 'KPI-M03', description: 'M03: 94% → 87% (-7% due to downtime)' },
      { type: 'Late Orders', reference: 'KPI-LATE', description: 'Predicted late: 2 → 4 orders (+2)' },
    ],
  };

  const handleContinueReschedule = () => {
    console.log('Continue to reschedule wizard');
    navigate(`/app/runs/${runId}/reschedule`);
  };

  const handleDiscardDraft = () => {
    console.log('Draft discarded');
    setShowDiscardModal(false);
    // Navigate back or clear draft
    navigate(`/app/runs/${runId}`);
  };

  const handleJumpToSchedule = (reference: string) => {
    console.log('Jump to schedule with reference:', reference);
    navigate('/app/schedule', { state: { highlightId: reference } });
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    const colors = {
      high: isDarkMode ? 'text-red-400 bg-red-500/20 border-red-500/30' : 'text-red-700 bg-red-50 border-red-200',
      medium: isDarkMode ? 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' : 'text-yellow-700 bg-yellow-50 border-yellow-200',
      low: isDarkMode ? 'text-blue-400 bg-blue-500/20 border-blue-500/30' : 'text-blue-700 bg-blue-50 border-blue-200',
    };
    return colors[severity];
  };

  const totalEvidenceCount = 
    evidenceData.schedule.length +
    evidenceData.events.length +
    evidenceData.constraints.length +
    evidenceData.kpis.length;

  // Draft Missing State
  if (draftState === 'missing') {
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

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <FileText className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Draft Available
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No impact report draft found for this run. Select an event from the schedule to generate a new draft.
            </p>
            <button
              onClick={() => navigate('/app/schedule')}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Go to Schedule
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Draft Invalid State
  if (draftState === 'invalid') {
    return (
      <div className="space-y-6">
        <div className={`rounded-xl border-2 p-6 ${
          isDarkMode 
            ? 'bg-red-500/10 border-red-500/30' 
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-start gap-4 mb-4">
            <AlertCircle className={`w-8 h-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>
                Draft Validation Failed
              </h3>
              <p className={`mb-3 ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                {validationError.message}
              </p>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono ${
                isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
              }`}>
                Error: {validationError.reason}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/app/agent/jobs/${validationError.jobId}`)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              View Job Details
            </button>
            <button
              onClick={() => setDraftState('loaded')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate Draft
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loaded State (with optional model unavailable banner)
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

      {/* Auto-Save Banner */}
      <div className={`rounded-lg border p-4 ${
        isDarkMode 
          ? 'bg-green-500/10 border-green-500/30' 
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-center gap-3">
          <CheckCircle2 className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
          <div className="flex-1">
            <p className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-900'}`}>
              Draft saved ✓ at {draftSavedTime}
            </p>
          </div>
        </div>
      </div>

      {/* Model Unavailable Banner (conditional) */}
      {draftState === 'model-unavailable' && (
        <div className={`rounded-lg border-2 border-dashed p-4 ${
          isDarkMode 
            ? 'bg-yellow-500/10 border-yellow-500/30' 
            : 'bg-yellow-50 border-yellow-300'
        }`}>
          <div className="flex items-start gap-3">
            <Info className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <div className="flex-1">
              <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-900'}`}>
                AI Model Unavailable
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                Draft is still viewable and you can continue to the reschedule wizard. However, new impact predictions cannot be generated at this time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Parent Run & Event Context */}
      <div className={`rounded-xl border p-6 ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Context
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Parent Run:
            </span>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {parentRun.runId} {parentRun.version}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
              }`}>
                {parentRun.status}
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>
                    {selectedEvent.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    isDarkMode ? 'bg-red-500/30 text-red-300' : 'bg-red-200 text-red-800'
                  }`}>
                    {selectedEvent.severity}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Machine:</span>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedEvent.machine}
                    </p>
                  </div>
                  <div>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Start Time:</span>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedEvent.startTime}
                    </p>
                  </div>
                  <div>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Duration:</span>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedEvent.duration}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Predicted Impact Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Impacted Machines */}
        <div className={`rounded-xl border p-6 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
              <Wrench className={`w-5 h-5 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Impacted Machines
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {impactedMachines.length} machines affected
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {impactedMachines.map((machine) => (
              <div
                key={machine.id}
                className={`p-3 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {machine.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(machine.severity)}`}>
                    {machine.severity}
                  </span>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {machine.impact}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Impacted Orders */}
        <div className={`rounded-xl border p-6 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
              <AlertTriangle className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Impacted Orders
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {impactedOrders.length} orders at risk
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {impactedOrders.map((order) => (
              <div
                key={order.id}
                className={`p-3 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {order.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(order.severity)}`}>
                    {order.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {order.product}
                  </span>
                  <span className={isDarkMode ? 'text-red-400' : 'text-red-600'}>
                    +{order.predictedDelay}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OTD Risk Delta */}
      <div className={`rounded-xl border p-6 ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
            <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              OTD Risk Delta vs Parent
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Predicted late risk comparison
            </p>
          </div>
        </div>

        <div className={`p-6 rounded-lg border-2 ${
          otdRiskDelta.trend === 'up'
            ? isDarkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
            : isDarkMode ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Parent Run Risk
              </p>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {otdRiskDelta.parentRisk}%
              </p>
            </div>

            <div className="flex items-center gap-2">
              {otdRiskDelta.trend === 'up' ? (
                <TrendingUp className={`w-8 h-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
              ) : (
                <TrendingDown className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              )}
              <div className={`px-4 py-2 rounded-lg font-bold text-2xl ${
                otdRiskDelta.trend === 'up'
                  ? isDarkMode ? 'bg-red-500/30 text-red-300' : 'bg-red-200 text-red-800'
                  : isDarkMode ? 'bg-green-500/30 text-green-300' : 'bg-green-200 text-green-800'
              }`}>
                +{otdRiskDelta.delta}%
              </div>
            </div>

            <div>
              <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Current Risk
              </p>
              <p className={`text-3xl font-bold ${
                isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                {otdRiskDelta.currentRisk}%
              </p>
            </div>
          </div>

          <p className={`text-sm text-center ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Late risk increased by {otdRiskDelta.delta} percentage points due to downstream impacts
          </p>
        </div>
      </div>

      {/* Setup Switching Risk */}
      <div className={`rounded-xl border p-6 ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white border-gray-200'
      }`}>
        <div className={`flex items-center gap-3 mb-4`}>
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
            <Zap className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Setup Switching Risk on {setupRisk.machine}
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Additional time required for recovery
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'
        }`}>
          <p className={`mb-3 ${isDarkMode ? 'text-yellow-200' : 'text-yellow-900'}`}>
            {setupRisk.description}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className={isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}>
                Estimated Setup Time:
              </span>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {setupRisk.estimatedSetupTime}
              </p>
            </div>
            <div>
              <span className={isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}>
                Impact:
              </span>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {setupRisk.impact}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Next Action */}
      <div className={`rounded-xl border p-6 ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
            <CheckCircle2 className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recommended Next Action
            </h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
              recommendedAction.priority === 'high'
                ? isDarkMode ? 'bg-red-500/30 text-red-300' : 'bg-red-100 text-red-700'
                : isDarkMode ? 'bg-yellow-500/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {recommendedAction.priority} priority
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-lg border-2 mb-4 ${
          isDarkMode ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
        }`}>
          <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-900'}`}>
            {recommendedAction.action}
          </h4>
          <p className={`text-sm ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
            {recommendedAction.reasoning}
          </p>
        </div>

        <div>
          <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Alternative Actions:
          </p>
          <ul className="space-y-2">
            {recommendedAction.alternatives.map((alt, index) => (
              <li
                key={index}
                className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                <ChevronRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                {alt}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleContinueReschedule}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors bg-blue-600 text-white hover:bg-blue-700"
        >
          Continue Reschedule Wizard
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => setEvidenceDrawerOpen(true)}
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            isDarkMode
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          <FileText className="w-5 h-5" />
          View Evidence
        </button>

        <button
          onClick={() => setShowDiscardModal(true)}
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            isDarkMode
              ? 'text-red-400 hover:bg-red-500/10 border border-red-500/30'
              : 'text-red-600 hover:bg-red-50 border border-red-200'
          }`}
        >
          <Trash2 className="w-5 h-5" />
          Discard Draft
        </button>
      </div>

      {/* Discard Confirmation Modal */}
      {showDiscardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDiscardModal(false)}
          />

          {/* Modal */}
          <div className={`relative w-full max-w-md rounded-xl shadow-2xl ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-full ${
                  isDarkMode ? 'bg-red-500/20' : 'bg-red-100'
                }`}>
                  <AlertTriangle className={`w-6 h-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Discard Draft?
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    This will permanently delete the draft impact report. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDiscardDraft}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Yes, Discard
                </button>
                <button
                  onClick={() => setShowDiscardModal(false)}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Drawer */}
      {evidenceDrawerOpen && (
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
                Evidence ({totalEvidenceCount})
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
                { id: 'schedule', label: 'Schedule', icon: Calendar },
                { id: 'events', label: 'Events', icon: Activity },
                { id: 'constraints', label: 'Constraints', icon: Settings },
                { id: 'kpis', label: 'KPIs', icon: TrendingUp },
              ].map((tab) => {
                const Icon = tab.icon;
                const count = evidenceData[tab.id as EvidenceTab].length;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveEvidenceTab(tab.id as EvidenceTab)}
                    className={`flex-1 flex flex-col items-center gap-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
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
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {evidenceData[activeEvidenceTab].length === 0 ? (
                <div className="text-center py-12">
                  <Info className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    No {activeEvidenceTab} evidence available
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {evidenceData[activeEvidenceTab].map((item, index) => (
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