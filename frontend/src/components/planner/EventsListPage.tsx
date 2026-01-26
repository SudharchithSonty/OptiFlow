import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, 
  Plus,
  Filter,
  AlertTriangle,
  Wrench,
  Package,
  Clock,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type EventType = 'machine_breakdown' | 'rush_order' | 'maintenance' | 'material_delay';
type Severity = 'low' | 'medium' | 'high' | 'critical';

interface ProductionEvent {
  id: string;
  type: EventType;
  startTime: string;
  duration: number; // minutes
  severity: Severity;
  machineId?: string;
  orderId?: string;
  notes: string;
  createdBy: string;
  createdAt: string;
}

const eventTypeConfig: Record<EventType, { label: string; icon: any; color: string; bgColor: string }> = {
  machine_breakdown: { label: 'Machine Breakdown', icon: AlertTriangle, color: 'text-red-700', bgColor: 'bg-red-100' },
  rush_order: { label: 'Rush Order', icon: Zap, color: 'text-orange-700', bgColor: 'bg-orange-100' },
  maintenance: { label: 'Scheduled Maintenance', icon: Wrench, color: 'text-blue-700', bgColor: 'bg-blue-100' },
  material_delay: { label: 'Material Delay', icon: Package, color: 'text-purple-700', bgColor: 'bg-purple-100' },
};

const severityConfig: Record<Severity, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Low', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  medium: { label: 'Medium', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  high: { label: 'High', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  critical: { label: 'Critical', color: 'text-red-700', bgColor: 'bg-red-100' },
};

const mockEvents: ProductionEvent[] = [
  {
    id: 'EVT-001',
    type: 'machine_breakdown',
    startTime: '2026-01-01 11:30',
    duration: 30,
    severity: 'high',
    machineId: 'M03',
    notes: 'Hydraulic pressure drop - maintenance required',
    createdBy: 'Priya Patel',
    createdAt: '2026-01-01 11:35',
  },
  {
    id: 'EVT-002',
    type: 'rush_order',
    startTime: '2026-01-01 09:15',
    duration: 180,
    severity: 'critical',
    orderId: 'ORD-RUSH-456',
    notes: 'Emergency order from key customer - needs completion by EOD',
    createdBy: 'Ravi Rampaul',
    createdAt: '2026-01-01 09:00',
  },
  {
    id: 'EVT-003',
    type: 'maintenance',
    startTime: '2026-01-03',
    duration: 240,
    severity: 'medium',
    machineId: 'M03',
    notes: 'Scheduled monthly calibration',
    createdBy: 'Amit Mishra',
    createdAt: '2025-12-28 10:00',
  },
  {
    id: 'EVT-004',
    type: 'material_delay',
    startTime: '2026-01-01 08:00',
    duration: 1440,
    severity: 'high',
    orderId: 'ORD-1240',
    notes: 'Supplier delivery delayed - raw material shortage for steel components',
    createdBy: 'Ravi Rampaul',
    createdAt: '2026-01-01 07:45',
  },
];

export function EventsListPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { runId } = useParams<{ runId: string }>();
  
  const [filterType, setFilterType] = useState<EventType | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'all'>('all');
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set(['EVT-001']));
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleEventExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  // Filter events
  const filteredEvents = mockEvents.filter((event) => {
    if (filterType !== 'all' && event.type !== filterType) return false;
    if (filterSeverity !== 'all' && event.severity !== filterSeverity) return false;
    return true;
  });

  const totalEvents = filteredEvents.length;
  const criticalEvents = filteredEvents.filter(e => e.severity === 'critical').length;
  const highEvents = filteredEvents.filter(e => e.severity === 'high').length;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <>
      <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <button
            onClick={() => navigate(`/app/runs/${runId}/brief`)}
            className={`flex items-center gap-2 mb-4 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Shift Brief</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Production Events</h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Track disruptions and trigger reschedules
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Add Breakdown Event - For Flow */}
              <button
                onClick={() => {
                  // Navigate to add event form with breakdown pre-selected
                  navigate(`/app/runs/${runId}/events/add?type=machine_breakdown`);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Add Breakdown Event</span>
              </button>

              {/* Add Other Event */}
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Event</span>
              </button>
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
              {/* Event Type Filter */}
              <div className="flex items-center gap-2">
                <label htmlFor="type" className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Type:
                </label>
                <select
                  id="type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as EventType | 'all')}
                  className={`px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="all">All Types</option>
                  {Object.entries(eventTypeConfig).map(([type, config]) => (
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
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
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
                      Type
                    </th>
                    <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Start Time
                    </th>
                    <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Duration
                    </th>
                    <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Severity
                    </th>
                    <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Affected
                    </th>
                    <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {filteredEvents.map((event) => {
                    const typeConfig = eventTypeConfig[event.type];
                    const sevConfig = severityConfig[event.severity];
                    const TypeIcon = typeConfig.icon;

                    return (
                      <tr key={event.id} className={`transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className="px-4 py-3">
                          <div className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs ${typeConfig.bgColor} ${typeConfig.color}`}>
                            <TypeIcon className="w-3 h-3" />
                            {typeConfig.label}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{event.startTime}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`flex items-center gap-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            {formatDuration(event.duration)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 rounded text-xs ${sevConfig.bgColor} ${sevConfig.color}`}>
                            {sevConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {event.machineId && (
                            <span className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{event.machineId}</span>
                          )}
                          {event.orderId && (
                            <span className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{event.orderId}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className={`text-sm truncate max-w-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{event.notes}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Tablet/Mobile Card View */}
            <div className="lg:hidden space-y-3">
              {filteredEvents.map((event) => {
                const typeConfig = eventTypeConfig[event.type];
                const sevConfig = severityConfig[event.severity];
                const TypeIcon = typeConfig.icon;
                const isExpanded = expandedEvents.has(event.id);

                return (
                  <div key={event.id} className={`border rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    {/* Card Header */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs ${typeConfig.bgColor} ${typeConfig.color}`}>
                              <TypeIcon className="w-3 h-3" />
                              {typeConfig.label}
                            </span>
                            <span className={`inline-flex px-2 py-1 rounded text-xs ${sevConfig.bgColor} ${sevConfig.color}`}>
                              {sevConfig.label}
                            </span>
                          </div>
                          <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{event.startTime}</p>
                        </div>
                        <button
                          onClick={() => toggleEventExpansion(event.id)}
                          className={`p-1 rounded transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(event.duration)}</span>
                        </div>
                        {event.machineId && (
                          <span className={`font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{event.machineId}</span>
                        )}
                        {event.orderId && (
                          <span className={`font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{event.orderId}</span>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className={`border-t p-4 ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="mb-3">
                          <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Notes:</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{event.notes}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Created By:</p>
                            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{event.createdBy}</p>
                          </div>
                          <div>
                            <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Created At:</p>
                            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{event.createdAt}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredEvents.length === 0 && (
              <div className={`border rounded-lg p-12 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <AlertTriangle className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No events found</h3>
                <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Try adjusting your filters or add a new event.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal - Will navigate to separate modal component */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add Event</h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Navigate to the Add Event modal for full form.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  navigate(`/app/runs/${runId}/events/add`);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Open Add Event
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className={`flex-1 px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}