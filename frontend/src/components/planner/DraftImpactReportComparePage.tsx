import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronRight,
  CheckCircle2,
  Clock,
  Zap,
  FileText,
  Settings,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Package,
  Cpu,
  X,
  Download,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  Database,
  FileCheck,
  Calendar,
  Lock,
  ArrowRight,
  ExternalLink,
  Bell,
  Info
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface DraftImpactReportComparePageProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

interface KPIDelta {
  label: string;
  parentValue: number;
  childValue: number;
  unit: string;
  sparkline: number[];
  isPercentage?: boolean;
}

interface LateOrder {
  orderId: string;
  productName: string;
  dueTime: string;
  parentLateness: number;
  childLateness: number;
  deltaLateness: number;
}

interface MachineTimelineItem {
  orderId: string;
  startTime: string;
  duration: number;
  isMoved?: boolean;
}

interface MachineTimeline {
  machineId: string;
  parentItems: MachineTimelineItem[];
  childItems: MachineTimelineItem[];
}

interface EvidenceItem {
  id: string;
  type: 'event' | 'constraint' | 'validation';
  title: string;
  timestamp: string;
  details: string;
}

export function DraftImpactReportComparePage({ userRole = 'planner' }: DraftImpactReportComparePageProps) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  
  const kpiDeltas: KPIDelta[] = [
    { 
      label: 'On-time delivery', 
      parentValue: 82, 
      childValue: 88, 
      unit: '%', 
      sparkline: [82, 83, 85, 86, 88],
      isPercentage: true
    },
    { 
      label: 'Total lateness', 
      parentValue: 450, 
      childValue: 285, 
      unit: 'min', 
      sparkline: [450, 420, 380, 320, 285]
    },
    { 
      label: 'Setup minutes', 
      parentValue: 240, 
      childValue: 265, 
      unit: 'min', 
      sparkline: [240, 245, 250, 258, 265]
    },
    { 
      label: 'Utilization', 
      parentValue: 76, 
      childValue: 81, 
      unit: '%', 
      sparkline: [76, 77, 78, 80, 81],
      isPercentage: true
    },
    { 
      label: 'OEE-lite', 
      parentValue: 68, 
      childValue: 72, 
      unit: '%', 
      sparkline: [68, 69, 70, 71, 72],
      isPercentage: true
    },
  ];

  const lateOrders: LateOrder[] = [
    { orderId: 'ORD-1024', productName: 'Gear B', dueTime: 'Jan 26, 2:00 PM', parentLateness: 120, childLateness: 45, deltaLateness: -75 },
    { orderId: 'ORD-1031', productName: 'Widget A', dueTime: 'Jan 26, 4:30 PM', parentLateness: 90, childLateness: 30, deltaLateness: -60 },
    { orderId: 'ORD-1038', productName: 'Shaft C', dueTime: 'Jan 27, 10:00 AM', parentLateness: 150, childLateness: 85, deltaLateness: -65 },
    { orderId: 'ORD-1042', productName: 'Bearing D', dueTime: 'Jan 27, 1:00 PM', parentLateness: 0, childLateness: 25, deltaLateness: 25 },
  ];

  const machineTimelines: MachineTimeline[] = [
    {
      machineId: 'M01',
      parentItems: [
        { orderId: 'ORD-1024', startTime: '08:00', duration: 3 },
        { orderId: 'ORD-1031', startTime: '11:00', duration: 2.5 },
        { orderId: 'ORD-1038', startTime: '13:30', duration: 2 },
      ],
      childItems: [
        { orderId: 'ORD-1024', startTime: '08:00', duration: 3 },
        { orderId: 'ORD-1031', startTime: '11:00', duration: 2.5, isMoved: true },
        { orderId: 'ORD-1038', startTime: '13:30', duration: 2 },
      ]
    },
    {
      machineId: 'M02',
      parentItems: [
        { orderId: 'ORD-1027', startTime: '09:00', duration: 2 },
        { orderId: 'ORD-1033', startTime: '11:00', duration: 3 },
        { orderId: 'ORD-1040', startTime: '14:00', duration: 1.5 },
      ],
      childItems: [
        { orderId: 'ORD-1027', startTime: '08:30', duration: 2, isMoved: true },
        { orderId: 'ORD-1033', startTime: '10:30', duration: 3, isMoved: true },
        { orderId: 'ORD-1040', startTime: '13:30', duration: 1.5 },
      ]
    },
    {
      machineId: 'M03',
      parentItems: [
        { orderId: 'ORD-1025', startTime: '08:30', duration: 2.5 },
        { orderId: 'ORD-1035', startTime: '11:00', duration: 2 },
        { orderId: 'ORD-1042', startTime: '13:00', duration: 3 },
      ],
      childItems: [
        { orderId: 'ORD-1025', startTime: '08:30', duration: 2.5 },
        { orderId: 'ORD-1035', startTime: '11:00', duration: 2.5, isMoved: true },
        { orderId: 'ORD-1042', startTime: '13:30', duration: 3.5, isMoved: true },
      ]
    },
    {
      machineId: 'M04',
      parentItems: [
        { orderId: 'ORD-1029', startTime: '10:00', duration: 2 },
        { orderId: 'ORD-1037', startTime: '12:00', duration: 2.5 },
      ],
      childItems: [
        { orderId: 'ORD-1029', startTime: '10:00', duration: 2 },
        { orderId: 'ORD-1037', startTime: '12:00', duration: 2.5 },
      ]
    },
    {
      machineId: 'M05',
      parentItems: [
        { orderId: 'ORD-1030', startTime: '09:00', duration: 3 },
        { orderId: 'ORD-1036', startTime: '12:00', duration: 2 },
        { orderId: 'ORD-1043', startTime: '14:00', duration: 1.5 },
      ],
      childItems: [
        { orderId: 'ORD-1030', startTime: '09:00', duration: 3 },
        { orderId: 'ORD-1036', startTime: '12:30', duration: 2, isMoved: true },
        { orderId: 'ORD-1043', startTime: '14:30', duration: 1.5 },
      ]
    },
  ];

  const evidenceItems: EvidenceItem[] = [
    { id: 'e1', type: 'event', title: 'Machine M03 downtime window', timestamp: 'Jan 25, 1:30 PM', details: 'Preventive maintenance scheduled' },
    { id: 'e2', type: 'constraint', title: 'Order ORD-1038 locked', timestamp: 'Jan 25, 2:00 PM', details: 'Customer priority request' },
    { id: 'e3', type: 'validation', title: 'Capacity validation passed', timestamp: 'Jan 25, 2:15 PM', details: 'All machines within 95% utilization' },
    { id: 'e4', type: 'event', title: 'Operator shift change at 14:00', timestamp: 'Jan 25, 2:00 PM', details: 'Setup time extended for M03' },
  ];

  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [notifySupervisors, setNotifySupervisors] = useState(true);

  const getDelta = (parentValue: number, childValue: number, isPercentage?: boolean) => {
    const delta = childValue - parentValue;
    const percentChange = parentValue !== 0 ? ((delta / parentValue) * 100).toFixed(1) : '0.0';
    return {
      delta,
      percentChange,
      isPositive: delta > 0,
      isNeutral: delta === 0
    };
  };

  const renderSparkline = (data: number[], isPositive: boolean) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-16 h-6" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? (isDarkMode ? '#34d399' : '#10b981') : (isDarkMode ? '#f87171' : '#ef4444')}
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  };

  const handleApprove = () => {
    // Only planner can approve & publish
    // Owner has view-only, Supervisor has no access
    if (userRole !== 'planner') {
      navigate('/app/runs/compare/permission-denied');
      return;
    }
    setShowPublishModal(true);
  };

  const handlePublish = () => {
    console.log('Publishing schedule...', { notifySupervisors });
    setShowPublishModal(false);
    navigate('/app/runs/RUN-2412');
  };

  const handleReject = () => {
    console.log('Rejecting draft...');
    navigate('/app/runs/RUN-2401');
  };

  const handleExport = () => {
    console.log('Exporting report...');
  };

  return (
    <div className={`h-full flex ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Main Content */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate('/app')}
              className={`hover:underline ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Runs
            </button>
            <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <button
              onClick={() => navigate('/app/runs/compare')}
              className={`hover:underline ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Compare
            </button>
            <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>Draft Impact Report</span>
          </div>

          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                  Draft Impact Report
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Parent:</span>
                    <button
                      onClick={() => navigate('/app/runs/RUN-2401')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      RUN-2401 v1
                    </button>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Child:</span>
                    <button
                      onClick={() => navigate('/app/runs/RUN-2412')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isDarkMode 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      RUN-2412 v2
                      <span className={`px-1.5 py-0.5 rounded text-xs ${
                        isDarkMode ? 'bg-blue-500' : 'bg-blue-500'
                      }`}>
                        Reschedule
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  <FileText className="w-4 h-4" />
                  Draft
                </span>
                <button
                  onClick={() => setEvidenceDrawerOpen(!evidenceDrawerOpen)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  Evidence
                  {evidenceDrawerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* KPI Delta Cards */}
          <div className="grid grid-cols-5 gap-4">
            {kpiDeltas.map((kpi) => {
              const delta = getDelta(kpi.parentValue, kpi.childValue, kpi.isPercentage);
              const isGoodChange = kpi.label === 'Total lateness' || kpi.label === 'Setup minutes' 
                ? delta.delta < 0 
                : delta.delta > 0;
              
              return (
                <div
                  key={kpi.label}
                  className={`rounded-xl border p-4 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {kpi.label}
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {kpi.childValue}{kpi.unit}
                    </span>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      delta.isNeutral
                        ? isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        : isGoodChange
                          ? isDarkMode ? 'text-green-400' : 'text-green-600'
                          : isDarkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {delta.isNeutral ? (
                        <Minus className="w-4 h-4" />
                      ) : delta.isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {Math.abs(delta.delta)}{kpi.unit}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      was {kpi.parentValue}{kpi.unit}
                    </span>
                    {renderSparkline(kpi.sparkline, isGoodChange)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Machine Timelines */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Machine timelines (Shift B)
              </h3>
              
              {machineTimelines.map((timeline) => (
                <div
                  key={timeline.machineId}
                  className={`rounded-xl border p-4 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Cpu className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {timeline.machineId}
                    </h4>
                  </div>
                  
                  {/* Parent Timeline */}
                  <div className="mb-2">
                    <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Parent</div>
                    <div className="flex gap-1 h-6">
                      {timeline.parentItems.map((item, idx) => (
                        <div
                          key={idx}
                          className={`rounded px-2 py-1 text-xs font-medium flex items-center justify-center ${
                            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}
                          style={{ width: `${(item.duration / 8) * 100}%` }}
                          title={`${item.orderId} (${item.startTime})`}
                        >
                          {item.orderId.split('-')[1]}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Child Timeline */}
                  <div>
                    <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Child</div>
                    <div className="flex gap-1 h-6">
                      {timeline.childItems.map((item, idx) => (
                        <div
                          key={idx}
                          className={`rounded px-2 py-1 text-xs font-medium flex items-center justify-center ${
                            item.isMoved
                              ? isDarkMode 
                                ? 'bg-amber-600 text-white border-2 border-amber-400' 
                                : 'bg-amber-500 text-white border-2 border-amber-300'
                              : isDarkMode 
                                ? 'bg-gray-700 text-gray-300' 
                                : 'bg-gray-200 text-gray-700'
                          }`}
                          style={{ width: `${(item.duration / 8) * 100}%` }}
                          title={`${item.orderId} (${item.startTime})${item.isMoved ? ' - MOVED' : ''}`}
                        >
                          {item.orderId.split('-')[1]}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Unchanged</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border-2 ${
                    isDarkMode ? 'bg-amber-600 border-amber-400' : 'bg-amber-500 border-amber-300'
                  }`} />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Moved/Changed</span>
                </div>
              </div>
            </div>

            {/* Right: Impact Cards */}
            <div className="space-y-4">
              {/* Top Late Orders */}
              <div className={`rounded-xl border p-4 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Package className="w-5 h-5 text-red-600" />
                  Top late orders (delta)
                </h3>
                <div className="space-y-3">
                  {lateOrders.map((order) => {
                    const isImproved = order.deltaLateness < 0;
                    return (
                      <div
                        key={order.orderId}
                        className={`p-3 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-700/50 border-gray-600' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <button
                              onClick={() => navigate(`/app/orders/${order.orderId}`)}
                              className="text-sm font-medium text-blue-600 hover:underline"
                            >
                              {order.orderId}
                            </button>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {order.productName}
                            </div>
                          </div>
                          <div className={`flex items-center gap-1 text-sm font-semibold ${
                            isImproved
                              ? isDarkMode ? 'text-green-400' : 'text-green-600'
                              : isDarkMode ? 'text-red-400' : 'text-red-600'
                          }`}>
                            {isImproved ? (
                              <TrendingDown className="w-4 h-4" />
                            ) : (
                              <TrendingUp className="w-4 h-4" />
                            )}
                            {Math.abs(order.deltaLateness)} min
                          </div>
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          Due: {order.dueTime}
                        </div>
                        <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {order.parentLateness} min → {order.childLateness} min late
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottleneck Risk */}
              <div className={`rounded-xl border p-4 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Bottleneck risk
                </h3>
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-amber-900/20 border-amber-700' 
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${isDarkMode ? 'text-amber-300' : 'text-amber-900'}`}>
                        M03 overload
                      </span>
                      <span className={`text-lg font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                        92%
                      </span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden mb-2 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div className="h-full bg-amber-500" style={{ width: '92%' }} />
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                      Impacted orders: ORD-1035, ORD-1042
                    </div>
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Consider extending shift or moving operations to M04
                  </div>
                </div>
              </div>

              {/* Key Changes */}
              <div className={`rounded-xl border p-4 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  Key changes
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className={`flex items-start gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>6 operations moved across machines M02, M03, M05</span>
                  </li>
                  <li className={`flex items-start gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="text-blue-600 mt-0.5">•</span>
                    <div className="flex items-center gap-1">
                      <span>Order ORD-1038 locked</span>
                      <Lock className="w-3 h-3" />
                    </div>
                  </li>
                  <li className={`flex items-start gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>M03 downtime window applied (14:00-15:00)</span>
                  </li>
                  <li className={`flex items-start gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Setup time increased for M03 operations (+15 min avg)</span>
                  </li>
                  <li className={`flex items-start gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Total lateness reduced by 165 minutes (-37%)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className={`flex items-center justify-between pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={handleExport}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Download className="w-4 h-4" />
              Export report
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleReject}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                Approve & Publish
              </button>
            </div>
          </div>
        </div>

        {/* Evidence Drawer (Right Sidebar) */}
        {evidenceDrawerOpen && (
          <div className={`w-80 border-l ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} overflow-auto`}>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Evidence drawer
                </h3>
                <button
                  onClick={() => setEvidenceDrawerOpen(false)}
                  className={`p-1 rounded hover:bg-gray-700 transition-colors`}
                >
                  <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>
              
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Events, constraints, and validations ({evidenceItems.length})
              </p>

              <div className="space-y-3">
                {evidenceItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {item.type === 'event' && <Calendar className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />}
                      {item.type === 'constraint' && <Lock className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />}
                      {item.type === 'validation' && <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />}
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.title}
                        </h4>
                        <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {item.timestamp}
                        </p>
                      </div>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.details}
                    </p>
                    <button className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline mt-2">
                      View details
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`max-w-lg w-full rounded-xl shadow-2xl border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Publish RUN-2412 v2 as the active schedule?
                </h3>
                <button
                  onClick={() => setShowPublishModal(false)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Summary */}
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                This will replace the current active run for <span className="font-semibold">Shift B</span>.
              </p>

              {/* Mini KPI Snapshot */}
              <div className={`rounded-lg border p-4 ${
                isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Impact summary
                </h4>
                <div className="space-y-2">
                  {/* OTD */}
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      On-time delivery
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        82% → 88%
                      </span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                        isDarkMode 
                          ? 'bg-green-900/30 text-green-400' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        +6%
                      </span>
                    </div>
                  </div>
                  
                  {/* Lateness */}
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total lateness
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        450 → 285 min
                      </span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                        isDarkMode 
                          ? 'bg-green-900/30 text-green-400' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        -165 min
                      </span>
                    </div>
                  </div>
                  
                  {/* Setup time */}
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Setup time
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        240 → 265 min
                      </span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                        isDarkMode 
                          ? 'bg-red-900/30 text-red-400' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        +25 min
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notify Supervisors */}
              <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                notifySupervisors
                  ? isDarkMode 
                    ? 'bg-blue-900/20 border-blue-700' 
                    : 'bg-blue-50 border-blue-200'
                  : isDarkMode
                    ? 'bg-gray-700/30 border-gray-600 hover:border-gray-500'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="checkbox"
                  checked={notifySupervisors}
                  onChange={(e) => setNotifySupervisors(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
                <div className="flex-1">
                  <div className={`flex items-center gap-2 text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Bell className="w-4 h-4" />
                    Notify supervisors
                  </div>
                  <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Shift Brief will be regenerated
                  </p>
                </div>
              </label>

              {/* Policy Note */}
              <div className={`flex items-start gap-2 p-3 rounded-lg border ${
                isDarkMode 
                  ? 'bg-blue-900/10 border-blue-800' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <Info className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <p className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                  No auto-publish — publishing requires Planner approval.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <button
                onClick={() => navigate('/app/audit')}
                className={`text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                View audit trail entry →
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPublishModal(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Publish schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}