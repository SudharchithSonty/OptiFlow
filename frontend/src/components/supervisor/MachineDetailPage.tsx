import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft,
  Settings,
  CheckCircle2,
  XCircle,
  Wrench,
  AlertTriangle,
  Clock,
  Package
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type MachineStatus = 'running' | 'idle' | 'setup' | 'down';
type BlockType = 'operation' | 'setup' | 'downtime' | 'idle';

interface TimelineBlock {
  id: string;
  type: BlockType;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  orderId?: string;
  orderName?: string;
  description: string;
}

interface QueuedOperation {
  id: string;
  orderId: string;
  orderName: string;
  opNumber: number;
  scheduledStart: string;
  estimatedDuration: number;
  priority: 'normal' | 'high' | 'critical';
}

interface SetupTransition {
  fromProduct: string;
  toProduct: string;
  estimatedTime: number;
  scheduledTime: string;
}

interface MachineDetail {
  id: string;
  name: string;
  status: MachineStatus;
  currentOp?: string;
  currentOrder?: string;
  timeline: TimelineBlock[];
  queue: QueuedOperation[];
  nextSetup?: SetupTransition;
  isBottleneck: boolean;
}

const mockMachine: MachineDetail = {
  id: 'M03',
  name: 'Press 3',
  status: 'down',
  isBottleneck: true,
  timeline: [
    {
      id: 'BLOCK-001',
      type: 'operation',
      startTime: '08:00',
      endTime: '10:30',
      duration: 150,
      orderId: 'ORD-1235',
      orderName: 'Bracket Assembly',
      description: 'Pressing operation completed',
    },
    {
      id: 'BLOCK-002',
      type: 'setup',
      startTime: '10:30',
      endTime: '10:50',
      duration: 20,
      description: 'Changeover from Bracket to Widget tooling',
    },
    {
      id: 'BLOCK-003',
      type: 'operation',
      startTime: '10:50',
      endTime: '11:30',
      duration: 40,
      orderId: 'ORD-1234',
      orderName: 'Widget A Production',
      description: 'Pressing in progress',
    },
    {
      id: 'BLOCK-004',
      type: 'downtime',
      startTime: '11:30',
      endTime: '12:00',
      duration: 30,
      description: 'Hydraulic system failure - maintenance required',
    },
    {
      id: 'BLOCK-005',
      type: 'idle',
      startTime: '12:00',
      endTime: '13:00',
      duration: 60,
      description: 'Waiting for maintenance completion',
    },
  ],
  queue: [
    {
      id: 'QUEUE-001',
      orderId: 'ORD-1238',
      orderName: 'Gear Pressing',
      opNumber: 2,
      scheduledStart: '13:00',
      estimatedDuration: 135,
      priority: 'high',
    },
    {
      id: 'QUEUE-002',
      orderId: 'ORD-1236',
      orderName: 'Shaft Machining',
      opNumber: 3,
      scheduledStart: '15:30',
      estimatedDuration: 90,
      priority: 'normal',
    },
  ],
  nextSetup: {
    fromProduct: 'Widget A',
    toProduct: 'Gear B',
    estimatedTime: 18,
    scheduledTime: '13:00',
  },
};

const statusConfig = {
  running: { label: 'Running', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle2 },
  idle: { label: 'Idle', color: 'text-gray-700', bgColor: 'bg-gray-100', icon: Clock },
  setup: { label: 'Setup', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: Wrench },
  down: { label: 'Down', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
};

const blockTypeConfig = {
  operation: { label: 'Operation', color: 'bg-green-500', borderColor: 'border-green-600' },
  setup: { label: 'Setup', color: 'bg-blue-500', borderColor: 'border-blue-600' },
  downtime: { label: 'Downtime', color: 'bg-red-500', borderColor: 'border-red-600' },
  idle: { label: 'Idle', color: 'bg-gray-300', borderColor: 'border-gray-400' },
};

const priorityConfig = {
  normal: { label: 'Normal', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  high: { label: 'High', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  critical: { label: 'Critical', color: 'text-red-700', bgColor: 'bg-red-100' },
};

export function MachineDetailPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { machineId } = useParams<{ machineId: string }>();
  
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [breakdownReason, setBreakdownReason] = useState('');

  const machine = mockMachine;
  const statusInfo = statusConfig[machine.status];
  const StatusIcon = statusInfo.icon;

  const handleLogBreakdown = () => {
    console.log('Logging breakdown:', breakdownReason);
    // In real app, would submit to API
    setShowBreakdownModal(false);
    setBreakdownReason('');
  };

  const handleOrderClick = (orderId: string) => {
    navigate(`/app/orders/${orderId}`);
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
                <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>{machine.name}</h1>
                {machine.isBottleneck && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-sm rounded">
                    Bottleneck
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Machine ID: <span className="font-mono text-blue-600">{machine.id}</span>
                </span>
                {machine.currentOrder && (
                  <>
                    <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>•</span>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Current Order: <span className={`font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{machine.currentOrder}</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Status Panel */}
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-lg ${statusInfo.bgColor} ${statusInfo.color}`}>
                <StatusIcon className="w-5 h-5" />
                {statusInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Action Button */}
            <div>
              <button
                onClick={() => setShowBreakdownModal(true)}
                className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Log Breakdown / Unavailability</span>
              </button>
            </div>

            {/* Timeline Section */}
            <div>
              <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Timeline (Today)</h2>
              
              {/* Timeline Visualization */}
              <div className={`border rounded-lg p-6 mb-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="space-y-3">
                  {machine.timeline.map((block) => {
                    const blockConfig = blockTypeConfig[block.type];
                    
                    return (
                      <div key={block.id} className="relative">
                        {/* Time Labels */}
                        <div className={`flex items-center justify-between text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span>{block.startTime}</span>
                          <span>{block.endTime}</span>
                        </div>
                        
                        {/* Block Bar */}
                        <div 
                          className={`h-16 rounded-lg border-2 ${blockConfig.color} ${blockConfig.borderColor} p-3 flex flex-col justify-center cursor-pointer hover:opacity-90 transition-opacity`}
                          onClick={() => block.orderId && handleOrderClick(block.orderId)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm mb-1">
                                {blockConfig.label}
                                {block.orderId && ` - ${block.orderId}`}
                              </p>
                              <p className="text-white text-xs opacity-90 truncate">
                                {block.description}
                              </p>
                            </div>
                            <span className="text-white text-xs opacity-90 flex-shrink-0">
                              {block.duration} min
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Legend:</p>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(blockTypeConfig).map(([type, config]) => (
                      <div key={type} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${config.color}`} />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{config.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Queue */}
              <div>
                <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Operation Queue</h2>
                <div className="space-y-3">
                  {machine.queue.map((op) => {
                    const priorityInfo = priorityConfig[op.priority];
                    
                    return (
                      <button
                        key={op.id}
                        onClick={() => handleOrderClick(op.orderId)}
                        className={`w-full border rounded-lg p-4 hover:shadow-sm transition-all text-left ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-600' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{op.orderId}</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${priorityInfo.bgColor} ${priorityInfo.color}`}>
                                {priorityInfo.label}
                              </span>
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{op.orderName}</p>
                          </div>
                          <Package className={`w-5 h-5 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Scheduled Start:</p>
                            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{op.scheduledStart}</p>
                          </div>
                          <div>
                            <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Duration:</p>
                            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{op.estimatedDuration} min</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {machine.queue.length === 0 && (
                    <div className={`border rounded-lg p-8 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <Package className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No operations queued</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Setup Transition */}
              <div>
                <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Next Setup Transition</h2>
                {machine.nextSetup ? (
                  <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Wrench className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className={`mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Changeover Required</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Scheduled: {machine.nextSetup.scheduledTime}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                        {machine.nextSetup.estimatedTime} min
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>From:</p>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{machine.nextSetup.fromProduct}</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className={`w-full h-px relative ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>→</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>To:</p>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{machine.nextSetup.toProduct}</p>
                      </div>
                    </div>

                    <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className={`rounded-lg p-3 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                        <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                          Ensure {machine.nextSetup.toProduct} tooling is ready before {machine.nextSetup.scheduledTime}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`border rounded-lg p-8 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <Wrench className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No setup transitions scheduled</p>
                  </div>
                )}
              </div>
            </div>

            {/* Machine Status Alert */}
            {machine.status === 'down' && (
              <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-red-200' : 'text-red-900'}`}>
                      Machine is currently down and unavailable
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                      {machine.timeline.find(b => b.type === 'downtime')?.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {machine.isBottleneck && (
              <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-orange-900/30 border-orange-800' : 'bg-orange-50 border-orange-200'}`}>
                <div className="flex items-start gap-3">
                  <Settings className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-orange-200' : 'text-orange-900'}`}>
                      This is a bottleneck machine
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-orange-300' : 'text-orange-800'}`}>
                      Any downtime on this machine will significantly impact the production schedule. 
                      Prioritize maintenance and setup efficiency.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log Breakdown Modal */}
      {showBreakdownModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Log Machine Breakdown</h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Report machine unavailability for {machine.name}
                </p>
                <div>
                  <label htmlFor="reason" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Reason <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="reason"
                    value={breakdownReason}
                    onChange={(e) => setBreakdownReason(e.target.value)}
                    rows={4}
                    placeholder="Describe the issue..."
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowBreakdownModal(false);
                  setBreakdownReason('');
                }}
                className={`flex-1 px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleLogBreakdown}
                disabled={!breakdownReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Log Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}