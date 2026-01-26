import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft,
  Clock,
  Settings,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  ClipboardCheck,
  Cpu,
  Package
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type OperationStatus = 'completed' | 'in-progress' | 'pending';

interface Operation {
  id: string;
  opNumber: number;
  description: string;
  machineId: string;
  machineName: string;
  status: OperationStatus;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
}

interface OrderDetail {
  id: string;
  orderId: string;
  orderName: string;
  productId: string;
  quantity: number;
  dueTime: string;
  currentStatus: 'on-time' | 'at-risk' | 'late';
  priority: 'normal' | 'high' | 'critical';
  completionPercent: number;
  operations: Operation[];
}

const mockOrder: OrderDetail = {
  id: 'ORD-001',
  orderId: 'ORD-1234',
  orderName: 'Widget A Production',
  productId: 'PROD-001',
  quantity: 100,
  dueTime: '16:00',
  currentStatus: 'late',
  priority: 'high',
  completionPercent: 65,
  operations: [
    {
      id: 'OP-001',
      opNumber: 1,
      description: 'Initial Milling',
      machineId: 'M01',
      machineName: 'CNC Mill 1',
      status: 'completed',
      scheduledStart: '08:00',
      scheduledEnd: '10:30',
      actualStart: '08:05',
      actualEnd: '10:35',
    },
    {
      id: 'OP-002',
      opNumber: 2,
      description: 'Pressing',
      machineId: 'M03',
      machineName: 'Press 3',
      status: 'in-progress',
      scheduledStart: '10:45',
      scheduledEnd: '13:15',
      actualStart: '11:15',
    },
    {
      id: 'OP-003',
      opNumber: 3,
      description: 'Grinding',
      machineId: 'M04',
      machineName: 'Grinder 4',
      status: 'pending',
      scheduledStart: '13:30',
      scheduledEnd: '15:00',
    },
    {
      id: 'OP-004',
      opNumber: 4,
      description: 'Final Inspection',
      machineId: 'M05',
      machineName: 'Drill 5',
      status: 'pending',
      scheduledStart: '15:15',
      scheduledEnd: '16:00',
    },
  ],
};

const statusConfig = {
  'on-time': { label: 'On Time', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle2 },
  'at-risk': { label: 'At Risk', color: 'text-orange-700', bgColor: 'bg-orange-100', icon: AlertTriangle },
  'late': { label: 'Late', color: 'text-red-700', bgColor: 'bg-red-100', icon: AlertTriangle },
};

const opStatusConfig = {
  completed: { label: 'Completed', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle2 },
  'in-progress': { label: 'In Progress', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: PlayCircle },
  pending: { label: 'Pending', color: 'text-gray-700', bgColor: 'bg-gray-100', icon: Clock },
};

const priorityConfig = {
  normal: { label: 'Normal', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  high: { label: 'High', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  critical: { label: 'Critical', color: 'text-red-700', bgColor: 'bg-red-100' },
};

export function OrderDetailPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  
  const [showAcknowledgeModal, setShowAcknowledgeModal] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const order = mockOrder;
  const statusInfo = statusConfig[order.currentStatus];
  const priorityInfo = priorityConfig[order.priority];
  const StatusIcon = statusInfo.icon;

  const handleAcknowledge = () => {
    setAcknowledged(true);
    setShowAcknowledgeModal(false);
  };

  const handleStartSetup = () => {
    console.log('Start setup for order', orderId);
    // In real app, would open setup form
  };

  const handleLogFirstPiece = () => {
    console.log('Log first-piece check for order', orderId);
    // In real app, would open first-piece form
  };

  const handleAskWhyLate = () => {
    navigate(`/app/orders/${orderId}/ask-agent`, {
      state: { question: `Why is order ${order.orderId} running late?` }
    });
  };

  return (
    <>
      <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <button
            onClick={() => navigate('/app')}
            className={`flex items-center gap-2 mb-4 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>{order.orderName}</h1>
                {acknowledged && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Acknowledged
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Order ID: <span className="font-mono text-blue-600">{order.orderId}</span>
                </span>
                <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>•</span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Product: <span className={`font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{order.productId}</span>
                </span>
                <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>•</span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Quantity: <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{order.quantity} units</span>
                </span>
              </div>
            </div>

            {/* Status Panel */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <div className="text-center">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${statusInfo.bgColor} ${statusInfo.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusInfo.label}
                </span>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Status</p>
              </div>
              <div className={`w-px h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
              <div className="text-center">
                <span className={`inline-flex px-2 py-1 rounded text-sm ${priorityInfo.bgColor} ${priorityInfo.color}`}>
                  {priorityInfo.label}
                </span>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Priority</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Progress</span>
              <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{order.completionPercent}%</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${order.completionPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Key Info Card */}
            <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Due Time</p>
                  <div className="flex items-center gap-2">
                    <Clock className={`w-5 h-5 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{order.dueTime}</p>
                  </div>
                </div>
                <div>
                  <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Operation</p>
                  <div className="flex items-center gap-2">
                    <Settings className={`w-5 h-5 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Op {order.operations.find(op => op.status === 'in-progress')?.opNumber || '-'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Machine Assignment</p>
                  <div className="flex items-center gap-2">
                    <Settings className={`w-5 h-5 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`text-xl font-mono ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {order.operations.find(op => op.status === 'in-progress')?.machineId || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => setShowAcknowledgeModal(true)}
                  disabled={acknowledged}
                  className={`p-4 rounded-lg transition-colors flex flex-col items-center gap-2 ${
                    acknowledged
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-sm">
                    {acknowledged ? 'Acknowledged' : 'Acknowledge'}
                  </span>
                </button>

                <button
                  onClick={handleStartSetup}
                  className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex flex-col items-center gap-2"
                >
                  <PlayCircle className="w-6 h-6" />
                  <span className="text-sm">Start Setup</span>
                </button>

                <button
                  onClick={handleLogFirstPiece}
                  className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex flex-col items-center gap-2"
                >
                  <ClipboardCheck className="w-6 h-6" />
                  <span className="text-sm">Log First-Piece</span>
                </button>

                <button
                  onClick={handleAskWhyLate}
                  className="p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex flex-col items-center gap-2"
                >
                  <Cpu className="w-6 h-6" />
                  <span className="text-sm">Why Late?</span>
                </button>
              </div>
            </div>

            {/* Operations List */}
            <div>
              <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Operations</h2>
              <div className={`border rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <table className="w-full">
                    <thead className={`border-b ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                      <tr>
                        <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Op #
                        </th>
                        <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Description
                        </th>
                        <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Machine
                        </th>
                        <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Scheduled
                        </th>
                        <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Actual
                        </th>
                        <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {order.operations.map((op) => {
                        const opStatusInfo = opStatusConfig[op.status];
                        const OpIcon = opStatusInfo.icon;

                        return (
                          <tr 
                            key={op.id}
                            className={`${op.status === 'in-progress' ? (isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50') : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')} transition-colors`}
                          >
                            <td className="px-4 py-3">
                              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{op.opNumber}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{op.description}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <p className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{op.machineId}</p>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>{op.machineName}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm">
                                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{op.scheduledStart} - {op.scheduledEnd}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {op.actualStart && (
                                <div className="text-sm">
                                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                                    {op.actualStart} {op.actualEnd ? `- ${op.actualEnd}` : '(ongoing)'}
                                  </p>
                                </div>
                              )}
                              {!op.actualStart && (
                                <span className={`text-sm ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>-</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${opStatusInfo.bgColor} ${opStatusInfo.color}`}>
                                <OpIcon className="w-3 h-3" />
                                {opStatusInfo.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile/Tablet Cards */}
                <div className={`lg:hidden divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {order.operations.map((op) => {
                    const opStatusInfo = opStatusConfig[op.status];
                    const OpIcon = opStatusInfo.icon;

                    return (
                      <div 
                        key={op.id}
                        className={`p-4 ${op.status === 'in-progress' ? (isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50') : ''}`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                              <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{op.opNumber}</span>
                            </div>
                            <div>
                              <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{op.description}</p>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{op.machineName}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${opStatusInfo.bgColor} ${opStatusInfo.color} flex-shrink-0`}>
                            <OpIcon className="w-3 h-3" />
                            {opStatusInfo.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Scheduled:</p>
                            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{op.scheduledStart} - {op.scheduledEnd}</p>
                          </div>
                          <div>
                            <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Actual:</p>
                            {op.actualStart ? (
                              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                                {op.actualStart} {op.actualEnd ? `- ${op.actualEnd}` : '(ongoing)'}
                              </p>
                            ) : (
                              <p className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>-</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {order.currentStatus === 'late' && (
              <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-red-200' : 'text-red-900'}`}>
                      This order is running late and may miss the {order.dueTime} deadline.
                    </p>
                    <button
                      onClick={handleAskWhyLate}
                      className={`text-sm underline ${isDarkMode ? 'text-red-300 hover:text-red-200' : 'text-red-700 hover:text-red-800'}`}
                    >
                      Ask AI agent why this order is late
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Acknowledge Modal */}
      {showAcknowledgeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Acknowledge Order</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Confirm that you've reviewed order {order.orderId} and are aware of its current status.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAcknowledgeModal(false)}
                className={`flex-1 px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleAcknowledge}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}