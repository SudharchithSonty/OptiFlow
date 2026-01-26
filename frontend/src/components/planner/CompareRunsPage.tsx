import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { 
  ArrowLeft, 
  GitBranch,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Cpu,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Settings
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface RunOption {
  id: string;
  date: string;
  shift: string;
  version: number;
  status: string;
}

interface KPIDelta {
  label: string;
  parentValue: string;
  childValue: string;
  delta: number; // percentage
  unit: string;
  icon: any;
  isImprovement: boolean;
}

interface ChangeItem {
  id: string;
  orderId: string;
  orderName: string;
  changeType: 'machine' | 'timing' | 'lateness';
  parentValue: string;
  childValue: string;
  impact: 'positive' | 'negative' | 'neutral';
  details: string;
}

const mockRuns: RunOption[] = [
  { id: 'RUN-2401', date: '2026-01-01', shift: 'A', version: 1, status: 'completed' },
  { id: 'RUN-2412', date: '2026-01-01', shift: 'A', version: 2, status: 'completed' },
  { id: 'RUN-2423', date: '2026-01-01', shift: 'A', version: 3, status: 'scheduled' },
  { id: 'RUN-2434', date: '2026-01-02', shift: 'B', version: 1, status: 'completed' },
  { id: 'RUN-2445', date: '2026-01-03', shift: 'C', version: 1, status: 'running' },
];

const mockKPIDeltas: KPIDelta[] = [
  {
    label: 'On-Time Delivery',
    parentValue: '91.9%',
    childValue: '94.2%',
    delta: 2.3,
    unit: '%',
    icon: CheckCircle2,
    isImprovement: true,
  },
  {
    label: 'Setup Time',
    parentValue: '139 min',
    childValue: '127 min',
    delta: -8.6,
    unit: 'min',
    icon: Clock,
    isImprovement: true,
  },
  {
    label: 'First-Piece Rejects',
    parentValue: '1.6%',
    childValue: '2.4%',
    delta: 50.0,
    unit: '%',
    icon: XCircle,
    isImprovement: false,
  },
  {
    label: 'OEE-Lite',
    parentValue: '75.2%',
    childValue: '78.3%',
    delta: 4.1,
    unit: '%',
    icon: TrendingUp,
    isImprovement: true,
  },
];

const mockChanges: ChangeItem[] = [
  {
    id: 'CH001',
    orderId: 'ORD-1234',
    orderName: 'Widget A Production',
    changeType: 'machine',
    parentValue: 'M02 (Lathe 2)',
    childValue: 'M03 (Press 3)',
    impact: 'negative',
    details: 'Moved to bottleneck machine due to M02 unavailability',
  },
  {
    id: 'CH002',
    orderId: 'ORD-1235',
    orderName: 'Bracket Assembly',
    changeType: 'timing',
    parentValue: '08:00 - 09:30',
    childValue: '10:45 - 12:00',
    impact: 'neutral',
    details: 'Start time shifted by 2h 45m to accommodate upstream delays',
  },
  {
    id: 'CH003',
    orderId: 'ORD-1236',
    orderName: 'Shaft Machining',
    changeType: 'lateness',
    parentValue: 'On Time',
    childValue: 'At Risk',
    impact: 'negative',
    details: 'Lateness status degraded due to material shortage',
  },
  {
    id: 'CH004',
    orderId: 'ORD-1237',
    orderName: 'Housing Drill',
    changeType: 'machine',
    parentValue: 'M03 (Press 3)',
    childValue: 'M05 (Drill 5)',
    impact: 'positive',
    details: 'Moved away from bottleneck to improve throughput',
  },
  {
    id: 'CH005',
    orderId: 'ORD-1238',
    orderName: 'Gear Pressing',
    changeType: 'timing',
    parentValue: '11:30 - 13:00',
    childValue: '13:30 - 15:45',
    impact: 'positive',
    details: 'Adjusted to reduce setup time by batching similar operations',
  },
  {
    id: 'CH006',
    orderId: 'ORD-1239',
    orderName: 'Cover Grinding',
    changeType: 'lateness',
    parentValue: 'At Risk',
    childValue: 'On Time',
    impact: 'positive',
    details: 'Improved status through optimized scheduling',
  },
  {
    id: 'CH007',
    orderId: 'ORD-1240',
    orderName: 'Flange Milling',
    changeType: 'machine',
    parentValue: 'M04 (Grinder 4)',
    childValue: 'M01 (CNC Mill 1)',
    impact: 'positive',
    details: 'Moved to faster machine with available capacity',
  },
  {
    id: 'CH008',
    orderId: 'ORD-1241',
    orderName: 'Pin Threading',
    changeType: 'timing',
    parentValue: '14:00 - 15:15',
    childValue: '14:15 - 15:30',
    impact: 'neutral',
    details: 'Minor adjustment (+15m) to accommodate machine maintenance',
  },
];

const changeTypeConfig = {
  machine: { label: 'Machine Change', icon: Settings, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  timing: { label: 'Timing Shift', icon: Clock, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  lateness: { label: 'Lateness Change', icon: TrendingUp, color: 'text-orange-600', bgColor: 'bg-orange-100' },
};

const impactConfig = {
  positive: { icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  negative: { icon: TrendingDown, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  neutral: { icon: ArrowRight, color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
};

export function CompareRunsPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [parentRunId, setParentRunId] = useState(searchParams.get('a') || 'RUN-2401');
  const [childRunId, setChildRunId] = useState(searchParams.get('b') || 'RUN-2412');

  const parentRun = mockRuns.find(r => r.id === parentRunId);
  const childRun = mockRuns.find(r => r.id === childRunId);

  const totalChanges = mockChanges.length;
  const positiveChanges = mockChanges.filter(c => c.impact === 'positive').length;
  const negativeChanges = mockChanges.filter(c => c.impact === 'negative').length;

  const handleAskAgent = () => {
    navigate(`/app/runs/${childRunId}/agent`, { 
      state: { 
        question: `Why did the schedule change from ${parentRunId} to ${childRunId}?`,
        context: 'comparison'
      } 
    });
  };

  const handleViewImpactReport = () => {
    navigate(`/app/runs/${childRunId}/impact-report`);
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

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <GitBranch className="w-6 h-6 text-blue-600" />
              <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Compare Runs</h1>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Analyze differences between production runs and their impact on KPIs
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAskAgent}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              <span>Ask Agent Why</span>
            </button>
            <button
              onClick={handleViewImpactReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">View Impact Report</span>
              <span className="sm:hidden">Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Run Selectors */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Parent Run Selector */}
          <div>
            <label htmlFor="parent" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Parent Run (Baseline)
            </label>
            <select
              id="parent"
              value={parentRunId}
              onChange={(e) => setParentRunId(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            >
              {mockRuns.map((run) => (
                <option key={run.id} value={run.id}>
                  {run.id} - {run.date} Shift {run.shift} (v{run.version}) - {run.status}
                </option>
              ))}
            </select>
            {parentRun && (
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {parentRun.date} • Shift {parentRun.shift} • Version {parentRun.version}
              </p>
            )}
          </div>

          {/* Child Run Selector */}
          <div>
            <label htmlFor="child" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Child Run (Comparison)
            </label>
            <select
              id="child"
              value={childRunId}
              onChange={(e) => setChildRunId(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            >
              {mockRuns.map((run) => (
                <option key={run.id} value={run.id}>
                  {run.id} - {run.date} Shift {run.shift} (v{run.version}) - {run.status}
                </option>
              ))}
            </select>
            {childRun && (
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {childRun.date} • Shift {childRun.shift} • Version {childRun.version}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Summary Stats */}
          <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Comparison Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`text-center p-4 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <p className={`text-3xl mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totalChanges}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Changes</p>
              </div>
              <div className={`text-center p-4 rounded-lg ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
                <p className="text-3xl text-green-600 mb-1">{positiveChanges}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Improvements</p>
              </div>
              <div className={`text-center p-4 rounded-lg ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                <p className="text-3xl text-red-600 mb-1">{negativeChanges}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Degradations</p>
              </div>
            </div>
          </div>

          {/* KPI Delta Cards */}
          <div>
            <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>KPI Changes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockKPIDeltas.map((kpi, idx) => {
                const Icon = kpi.icon;
                const isImprovement = kpi.isImprovement;

                return (
                  <div key={idx} className={`border rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${isImprovement ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Icon className={`w-5 h-5 ${isImprovement ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${isImprovement ? 'text-green-600' : 'text-red-600'}`}>
                        {isImprovement ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>{Math.abs(kpi.delta).toFixed(1)}%</span>
                      </div>
                    </div>
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{kpi.label}</p>
                    
                    {/* Parent → Child Flow */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Parent:</span>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{kpi.parentValue}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <ArrowRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Child:</span>
                        <span className={`text-sm ${isImprovement ? 'text-green-700' : 'text-red-700'}`}>
                          {kpi.childValue}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Changed Orders/Operations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Changed Orders & Operations</h2>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                {mockChanges.length} changes
              </span>
            </div>

            <div className="space-y-3">
              {mockChanges.map((change) => {
                const typeConfig = changeTypeConfig[change.changeType];
                const impactCfg = impactConfig[change.impact];
                const TypeIcon = typeConfig.icon;
                const ImpactIcon = impactCfg.icon;

                return (
                  <div 
                    key={change.id} 
                    className={`border rounded-lg p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : `bg-white ${impactCfg.borderColor}`}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Impact Indicator */}
                      <div className={`p-2 rounded-lg ${impactCfg.bgColor} flex-shrink-0`}>
                        <ImpactIcon className={`w-5 h-5 ${impactCfg.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{change.orderId}</span>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${typeConfig.bgColor} ${typeConfig.color}`}>
                                <TypeIcon className="w-3 h-3" />
                                {typeConfig.label}
                              </span>
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{change.orderName}</p>
                          </div>
                        </div>

                        {/* Parent → Child Change */}
                        <div className={`rounded-lg p-3 mb-2 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                            <div>
                              <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Parent:</p>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{change.parentValue}</p>
                            </div>
                            <div className="flex justify-center">
                              <ArrowRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                            </div>
                            <div>
                              <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Child:</p>
                              <p className={`text-sm ${
                                change.impact === 'positive' ? 'text-green-700' :
                                change.impact === 'negative' ? 'text-red-700' :
                                isDarkMode ? 'text-gray-300' : 'text-gray-900'
                              }`}>
                                {change.childValue}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{change.details}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Insights Section */}
          <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-800' : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'}`}>
            <div className="flex items-start gap-4">
              <Cpu className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className={isDarkMode ? 'text-purple-300 mb-2' : 'text-purple-900 mb-2'}>Need AI Insights?</h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-purple-200' : 'text-purple-800'}`}>
                  Ask the AI agent to explain the reasoning behind schedule changes, or review the 
                  detailed impact report with predictions and recommendations.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleAskAgent}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Cpu className="w-4 h-4" />
                    <span>Ask Agent Why Changes Were Made</span>
                  </button>
                  <button
                    onClick={handleViewImpactReport}
                    className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${isDarkMode ? 'bg-gray-800 border-purple-700 text-purple-300 hover:bg-gray-700' : 'bg-white border-purple-300 text-purple-700 hover:bg-purple-50'}`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Draft Impact Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}