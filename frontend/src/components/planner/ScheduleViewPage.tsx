import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Settings,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wrench,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type OrderStatus = 'on-time' | 'at-risk' | 'late';

interface ScheduleOperation {
  id: string;
  orderId: string;
  orderName: string;
  productId: string;
  machineId: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  setupTime?: number; // minutes
  isSetup?: boolean;
  status: OrderStatus;
  isBottleneck?: boolean;
  hasDowntime?: boolean;
  downtimeStart?: string;
  downtimeEnd?: string;
  downtimeDuration?: number;
  downtimeReason?: string;
}

interface Machine {
  id: string;
  name: string;
  isBottleneck?: boolean;
}

const machines: Machine[] = [
  { id: 'M01', name: 'CNC Mill 1' },
  { id: 'M02', name: 'Lathe 2' },
  { id: 'M03', name: 'Press 3', isBottleneck: true },
  { id: 'M04', name: 'Grinder 4' },
  { id: 'M05', name: 'Drill 5' },
];

const mockSchedule: ScheduleOperation[] = [
  {
    id: 'OP001',
    orderId: 'ORD-1234',
    orderName: 'Widget A Production',
    productId: 'PROD-001',
    machineId: 'M01',
    startTime: '08:00',
    endTime: '10:30',
    duration: 150,
    setupTime: 15,
    status: 'on-time',
  },
  {
    id: 'OP002',
    orderId: 'ORD-1234',
    orderName: 'Widget A Production',
    productId: 'PROD-001',
    machineId: 'M03',
    startTime: '10:45',
    endTime: '13:15',
    duration: 150,
    setupTime: 20,
    status: 'late',
    isBottleneck: true,
    hasDowntime: true,
    downtimeStart: '11:30',
    downtimeEnd: '12:00',
    downtimeDuration: 30,
    downtimeReason: 'Hydraulic pressure drop - maintenance required',
  },
  {
    id: 'OP003',
    orderId: 'ORD-1235',
    orderName: 'Bracket Assembly',
    productId: 'PROD-002',
    machineId: 'M01',
    startTime: '10:45',
    endTime: '12:00',
    duration: 75,
    setupTime: 10,
    status: 'on-time',
  },
  {
    id: 'OP004',
    orderId: 'ORD-1236',
    orderName: 'Shaft Machining',
    productId: 'PROD-003',
    machineId: 'M02',
    startTime: '08:00',
    endTime: '11:30',
    duration: 210,
    setupTime: 25,
    status: 'at-risk',
  },
  {
    id: 'OP005',
    orderId: 'ORD-1237',
    orderName: 'Housing Drill',
    productId: 'PROD-004',
    machineId: 'M05',
    startTime: '09:00',
    endTime: '10:45',
    duration: 105,
    setupTime: 12,
    status: 'on-time',
  },
  {
    id: 'OP006',
    orderId: 'ORD-1238',
    orderName: 'Gear Pressing',
    productId: 'PROD-005',
    machineId: 'M03',
    startTime: '13:30',
    endTime: '15:45',
    duration: 135,
    setupTime: 18,
    status: 'late',
    isBottleneck: true,
  },
  {
    id: 'OP007',
    orderId: 'ORD-1239',
    orderName: 'Cover Grinding',
    productId: 'PROD-006',
    machineId: 'M04',
    startTime: '08:30',
    endTime: '11:00',
    duration: 150,
    setupTime: 15,
    status: 'on-time',
  },
  {
    id: 'OP008',
    orderId: 'ORD-1236',
    orderName: 'Shaft Machining',
    productId: 'PROD-003',
    machineId: 'M03',
    startTime: '16:00',
    endTime: '17:30',
    duration: 90,
    setupTime: 15,
    status: 'at-risk',
    isBottleneck: true,
  },
];

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: any }> = {
  'on-time': { label: 'On Time', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle2 },
  'at-risk': { label: 'At Risk', color: 'text-orange-700', bgColor: 'bg-orange-100', icon: AlertTriangle },
  'late': { label: 'Late', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
};

export function ScheduleViewPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { runId } = useParams<{ runId: string }>();

  console.log('ScheduleViewPage rendered with runId:', runId);

  const [filterMachine, setFilterMachine] = useState<string>('all');
  const [filterOrder, setFilterOrder] = useState<string>('');
  const [showSetup, setShowSetup] = useState<boolean>(true);
  const [showDowntime, setShowDowntime] = useState<boolean>(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(['OP002']));

  const toggleRowExpansion = (opId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(opId)) {
      newExpanded.delete(opId);
    } else {
      newExpanded.add(opId);
    }
    setExpandedRows(newExpanded);
  };

  // Filter operations
  const filteredOperations = mockSchedule.filter((op) => {
    if (filterMachine !== 'all' && op.machineId !== filterMachine) return false;
    if (filterOrder && !op.orderId.toLowerCase().includes(filterOrder.toLowerCase()) && 
        !op.orderName.toLowerCase().includes(filterOrder.toLowerCase())) return false;
    return true;
  });

  // Group by machine for desktop view
  const operationsByMachine = machines.reduce((acc, machine) => {
    acc[machine.id] = filteredOperations.filter(op => op.machineId === machine.id);
    return acc;
  }, {} as Record<string, ScheduleOperation[]>);

  const totalOperations = filteredOperations.length;
  const lateOperations = filteredOperations.filter(op => op.status === 'late').length;
  const atRiskOperations = filteredOperations.filter(op => op.status === 'at-risk').length;
  const downtimeOccurrences = filteredOperations.filter(op => op.hasDowntime).length;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <button
          onClick={() => navigate(`/app/runs/${runId}`)}
          className={`flex items-center gap-2 mb-4 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Run</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Production Schedule</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Run ID: <span className="font-mono text-blue-600">{runId || 'RUN-2401'}</span>
            </p>
          </div>

          {/* Summary Stats */}
          <div className={`flex items-center gap-4 px-4 py-3 rounded-lg border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="text-center">
              <p className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totalOperations}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Operations</p>
            </div>
            <div className={`w-px h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <div className="text-center">
              <p className="text-xl text-red-600">{lateOperations}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Late</p>
            </div>
            <div className={`w-px h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <div className="text-center">
              <p className="text-xl text-orange-600">{atRiskOperations}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>At Risk</p>
            </div>
            <div className={`w-px h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <div className="text-center">
              <p className="text-xl text-purple-600">{downtimeOccurrences}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Downtime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Filters:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Machine Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="machine" className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Machine:
              </label>
              <select
                id="machine"
                value={filterMachine}
                onChange={(e) => setFilterMachine(e.target.value)}
                className={`px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value="all">All Machines</option>
                {machines.map((machine) => (
                  <option key={machine.id} value={machine.id}>
                    {machine.name} {machine.isBottleneck ? '⚠️' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Order Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="order" className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Order:
              </label>
              <input
                id="order"
                type="text"
                value={filterOrder}
                onChange={(e) => setFilterOrder(e.target.value)}
                placeholder="Search..."
                className={`px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>

            <div className={`w-px h-6 hidden lg:block ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />

            {/* Toggle Filters */}
            <button
              onClick={() => setShowSetup(!showSetup)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                showSetup
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-400 border border-gray-600'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
            >
              {showSetup ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>Setup Time</span>
            </button>

            <button
              onClick={() => setShowDowntime(!showDowntime)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                showDowntime
                  ? 'bg-purple-100 text-purple-700 border border-purple-300'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-400 border border-gray-600'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
            >
              {showDowntime ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>Downtime</span>
            </button>
          </div>

          <button className={`ml-auto px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Table View */}
          <div className={`hidden lg:block border rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <table className="w-full">
              <thead className={`border-b ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <tr>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Machine
                  </th>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Order
                  </th>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Product
                  </th>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Time Window
                  </th>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Duration
                  </th>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Status
                  </th>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredOperations.map((op) => {
                  const statusInfo = statusConfig[op.status];
                  const Icon = statusInfo.icon;
                  const machine = machines.find(m => m.id === op.machineId);

                  return (
                    <tr 
                      key={op.id} 
                      className={`transition-colors ${
                        op.status === 'late' ? (isDarkMode ? 'bg-red-900/20' : 'bg-red-50') : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
                      } ${
                        op.isBottleneck ? 'border-l-4 border-l-orange-500' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {op.machineId}
                          </span>
                          {machine?.isBottleneck && (
                            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
                              Bottleneck
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{op.orderId}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>{op.orderName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-mono text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>{op.productId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          {op.startTime} - {op.endTime}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          {formatDuration(op.duration)}
                          {showSetup && op.setupTime && (
                            <span className="text-xs text-blue-600 ml-1">
                              (+{op.setupTime}m setup)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${statusInfo.bgColor} ${statusInfo.color}`}>
                          <Icon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {op.hasDowntime && showDowntime && (
                          <div className="flex items-center gap-1 text-purple-700">
                            <Wrench className="w-4 h-4" />
                            <span className="text-xs">Downtime</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Tablet/Mobile Card View with Expandable Rows */}
          <div className="lg:hidden space-y-3">
            {filteredOperations.map((op) => {
              const statusInfo = statusConfig[op.status];
              const Icon = statusInfo.icon;
              const machine = machines.find(m => m.id === op.machineId);
              const isExpanded = expandedRows.has(op.id);

              return (
                <div 
                  key={op.id} 
                  className={`border rounded-lg overflow-hidden ${
                    op.status === 'late' ? (isDarkMode ? 'border-red-700' : 'border-red-300') : (isDarkMode ? 'border-gray-700' : 'border-gray-200')
                  } ${
                    op.isBottleneck ? 'border-l-4 border-l-orange-500' : ''
                  } ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  {/* Card Header */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{op.orderId}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${statusInfo.bgColor} ${statusInfo.color}`}>
                            <Icon className="w-3 h-3" />
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{op.orderName}</p>
                      </div>
                      <button
                        onClick={() => toggleRowExpansion(op.id)}
                        className={`p-1 rounded transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Machine</p>
                        <div className="flex items-center gap-2">
                          <span className={`font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{op.machineId}</span>
                          {machine?.isBottleneck && (
                            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
                              Bottleneck
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Time Window</p>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{op.startTime} - {op.endTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className={`border-t p-4 ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Product ID</p>
                          <p className={`font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{op.productId}</p>
                        </div>
                        <div>
                          <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Duration</p>
                          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{formatDuration(op.duration)}</p>
                        </div>
                        {showSetup && op.setupTime && (
                          <div>
                            <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Setup Time</p>
                            <p className="text-blue-700">{op.setupTime} minutes</p>
                          </div>
                        )}
                      </div>

                      {/* Downtime Block */}
                      {op.hasDowntime && showDowntime && (
                        <div className={`p-3 border rounded-lg ${isDarkMode ? 'bg-purple-900/30 border-purple-800' : 'bg-purple-50 border-purple-200'}`}>
                          <div className="flex items-start gap-2 mb-2">
                            <Wrench className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className={`text-sm mb-1 ${isDarkMode ? 'text-purple-200' : 'text-purple-900'}`}>Downtime Event</p>
                              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                <div>
                                  <span className={isDarkMode ? 'text-purple-300' : 'text-purple-700'}>Start: </span>
                                  <span className={isDarkMode ? 'text-purple-200' : 'text-purple-900'}>{op.downtimeStart}</span>
                                </div>
                                <div>
                                  <span className={isDarkMode ? 'text-purple-300' : 'text-purple-700'}>End: </span>
                                  <span className={isDarkMode ? 'text-purple-200' : 'text-purple-900'}>{op.downtimeEnd}</span>
                                </div>
                              </div>
                              <p className={`text-xs mb-1 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                                Duration: {op.downtimeDuration} minutes
                              </p>
                              <p className={`text-xs ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                                {op.downtimeReason}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredOperations.length === 0 && (
            <div className={`border rounded-lg p-12 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <Settings className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No operations found</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className={`border-t px-4 sm:px-6 lg:px-8 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4 text-sm">
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Legend:</span>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 border rounded ${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`} />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Late Order</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 border-l-4 border-l-orange-500 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Bottleneck Machine (M03)</span>
          </div>
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-purple-600" />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Downtime Event</span>
          </div>
        </div>
      </div>
    </div>
  );
}