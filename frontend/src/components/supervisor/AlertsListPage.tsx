import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft,
  Filter,
  AlertTriangle,
  TrendingDown,
  RotateCcw,
  Clock,
  Bell,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type AlertType = 'downtime' | 'at-risk' | 'changeover' | 'late';
type Severity = 'high' | 'medium' | 'low';

interface Alert {
  id: string;
  type: AlertType;
  severity: Severity;
  title: string;
  description: string;
  time: string;
  machineId?: string;
  orderId?: string;
  acknowledged: boolean;
}

const alertTypeConfig: Record<AlertType, { label: string; icon: any; color: string; bgColor: string }> = {
  downtime: { label: 'Machine Downtime', icon: AlertTriangle, color: 'text-red-700', bgColor: 'bg-red-100' },
  'at-risk': { label: 'At-Risk Order', icon: TrendingDown, color: 'text-orange-700', bgColor: 'bg-orange-100' },
  changeover: { label: 'Changeover Alert', icon: RotateCcw, color: 'text-purple-700', bgColor: 'bg-purple-100' },
  late: { label: 'Predicted Late', icon: Clock, color: 'text-red-700', bgColor: 'bg-red-100' },
};

const severityConfig: Record<Severity, { label: string; color: string; bgColor: string }> = {
  high: { label: 'High', color: 'text-red-700', bgColor: 'bg-red-100' },
  medium: { label: 'Medium', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  low: { label: 'Low', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
};

const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    type: 'downtime',
    severity: 'high',
    title: 'M03 Hydraulic System Failure',
    description: 'Press 3 hydraulic pressure dropped below threshold. Immediate maintenance required.',
    time: '11:30',
    machineId: 'M03',
    acknowledged: false,
  },
  {
    id: 'ALT-002',
    type: 'late',
    severity: 'high',
    title: 'ORD-1234 At Risk of Missing Deadline',
    description: 'Widget A Production scheduled to complete after 16:00 due time. Current delay: 45 minutes.',
    time: '13:00',
    orderId: 'ORD-1234',
    acknowledged: false,
  },
  {
    id: 'ALT-003',
    type: 'changeover',
    severity: 'medium',
    title: 'M01 Repeated Changeover Switching',
    description: 'CNC Mill 1 requires 3rd setup today. Check tooling availability and consider batching.',
    time: '13:45',
    machineId: 'M01',
    acknowledged: false,
  },
  {
    id: 'ALT-004',
    type: 'at-risk',
    severity: 'medium',
    title: 'ORD-1236 Approaching Risk Threshold',
    description: 'Shaft Machining is 30 minutes behind schedule. May become late if not addressed.',
    time: '14:00',
    orderId: 'ORD-1236',
    acknowledged: true,
  },
  {
    id: 'ALT-005',
    type: 'downtime',
    severity: 'low',
    title: 'M05 Minor Tool Wear Detected',
    description: 'Drill 5 showing increased cycle times. Schedule bit replacement at next changeover.',
    time: '14:15',
    machineId: 'M05',
    acknowledged: true,
  },
  {
    id: 'ALT-006',
    type: 'late',
    severity: 'high',
    title: 'ORD-1238 Confirmed Late',
    description: 'Gear Pressing will not complete by 17:00 deadline. Expected completion: 18:00.',
    time: '14:30',
    orderId: 'ORD-1238',
    acknowledged: false,
  },
  {
    id: 'ALT-007',
    type: 'changeover',
    severity: 'low',
    title: 'M04 Setup Optimization Available',
    description: 'Grinder 4 could reduce setup time by batching similar products.',
    time: '15:00',
    machineId: 'M04',
    acknowledged: true,
  },
];

export function AlertsListPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  
  const [filterType, setFilterType] = useState<AlertType | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'all'>('all');
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  // Filter alerts
  const filteredAlerts = mockAlerts.filter((alert) => {
    if (filterType !== 'all' && alert.type !== filterType) return false;
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (!showAcknowledged && alert.acknowledged) return false;
    return true;
  });

  const totalAlerts = filteredAlerts.length;
  const unacknowledgedAlerts = filteredAlerts.filter(a => !a.acknowledged).length;
  const highSeverityAlerts = filteredAlerts.filter(a => a.severity === 'high').length;

  const handleAlertClick = (alert: Alert) => {
    if (alert.machineId) {
      navigate(`/app/machines/${alert.machineId}`);
    } else if (alert.orderId) {
      navigate(`/app/orders/${alert.orderId}`);
    }
  };

  return (
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
            <h1 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Production Alerts</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Real-time notifications for your shift
            </p>
          </div>

          {/* Summary Stats */}
          <div className={`flex items-center gap-4 px-4 py-3 rounded-lg border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="text-center">
              <p className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totalAlerts}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</p>
            </div>
            <div className={`w-px h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <div className="text-center">
              <p className="text-xl text-orange-600">{unacknowledgedAlerts}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>New</p>
            </div>
            <div className={`w-px h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <div className="text-center">
              <p className="text-xl text-red-600">{highSeverityAlerts}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>High</p>
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
            {/* Alert Type Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="type" className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Type:
              </label>
              <select
                id="type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as AlertType | 'all')}
                className={`px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value="all">All Types</option>
                {Object.entries(alertTypeConfig).map(([type, config]) => (
                  <option key={type} value={type}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="severity" className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Severity:
              </label>
              <select
                id="severity"
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value as Severity | 'all')}
                className={`px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value="all">All Severities</option>
                {Object.entries(severityConfig).map(([sev, config]) => (
                  <option key={sev} value={sev}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={`w-px h-6 hidden lg:block ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />

            {/* Show Acknowledged Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAcknowledged}
                onChange={(e) => setShowAcknowledged(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Show Acknowledged</span>
            </label>
          </div>
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
                    Status
                  </th>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Type
                  </th>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Severity
                  </th>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Alert
                  </th>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Related
                  </th>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Time
                  </th>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredAlerts.map((alert) => {
                  const typeConfig = alertTypeConfig[alert.type];
                  const sevConfig = severityConfig[alert.severity];
                  const TypeIcon = typeConfig.icon;

                  return (
                    <tr 
                      key={alert.id} 
                      className={`transition-colors ${
                        !alert.acknowledged ? (isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50') : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
                      }`}
                    >
                      <td className="px-4 py-3">
                        {alert.acknowledged ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                            <CheckCircle2 className="w-3 h-3" />
                            Ack'd
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-orange-100 text-orange-700">
                            <Bell className="w-3 h-3" />
                            New
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs ${typeConfig.bgColor} ${typeConfig.color}`}>
                          <TypeIcon className="w-3 h-3" />
                          {typeConfig.label}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded text-xs ${sevConfig.bgColor} ${sevConfig.color}`}>
                          {sevConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{alert.title}</p>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>{alert.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        {alert.machineId && (
                          <span className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{alert.machineId}</span>
                        )}
                        {alert.orderId && (
                          <span className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{alert.orderId}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{alert.time}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleAlertClick(alert)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Tablet/Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {filteredAlerts.map((alert) => {
              const typeConfig = alertTypeConfig[alert.type];
              const sevConfig = severityConfig[alert.severity];
              const TypeIcon = typeConfig.icon;

              const cardBg = 
                alert.severity === 'high' && !alert.acknowledged ? (isDarkMode ? 'bg-red-900/30' : 'bg-red-50') :
                !alert.acknowledged ? (isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50') :
                (isDarkMode ? 'bg-gray-800' : 'bg-white');
              const borderColor =
                alert.severity === 'high' && !alert.acknowledged ? (isDarkMode ? 'border-red-800' : 'border-red-200') :
                !alert.acknowledged ? (isDarkMode ? 'border-blue-800' : 'border-blue-200') :
                (isDarkMode ? 'border-gray-700' : 'border-gray-200');

              return (
                <button
                  key={alert.id}
                  onClick={() => handleAlertClick(alert)}
                  className={`w-full border rounded-lg p-4 hover:shadow-sm transition-all text-left ${cardBg} ${borderColor}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs ${typeConfig.bgColor} ${typeConfig.color}`}>
                        <TypeIcon className="w-3 h-3" />
                        {typeConfig.label}
                      </span>
                      <span className={`inline-flex px-2 py-1 rounded text-xs ${sevConfig.bgColor} ${sevConfig.color}`}>
                        {sevConfig.label}
                      </span>
                    </div>
                    {!alert.acknowledged && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-orange-100 text-orange-700 flex-shrink-0">
                        <Bell className="w-3 h-3" />
                        New
                      </span>
                    )}
                  </div>

                  <p className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{alert.title}</p>
                  <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{alert.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      {alert.machineId && (
                        <span className={`font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{alert.machineId}</span>
                      )}
                      {alert.orderId && (
                        <span className={`font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{alert.orderId}</span>
                      )}
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-600'}>{alert.time}</span>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredAlerts.length === 0 && (
            <div className={`border rounded-lg p-12 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <Bell className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No alerts found</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {showAcknowledged 
                  ? 'Try adjusting your filters.'
                  : 'Great! All alerts have been acknowledged.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}