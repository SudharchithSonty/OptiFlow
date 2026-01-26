import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Filter,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type Shift = 'A' | 'B' | 'C' | 'all';
type EventType = 'all' | 'breakdown' | 'rush_order' | 'maintenance' | 'material_delay';

interface WeeklyMetric {
  label: string;
  thisWeek: string;
  lastWeek: string;
  change: number; // percentage
  unit: string;
  icon: any;
  isImprovement: boolean;
}

interface FilterState {
  weekStart: string;
  weekEnd: string;
  shift: Shift;
  machine: string;
  productFamily: string;
  eventType: EventType;
}

const mockMetrics: WeeklyMetric[] = [
  {
    label: 'Setup Minutes',
    thisWeek: '487 min',
    lastWeek: '532 min',
    change: -8.5,
    unit: 'min',
    icon: Clock,
    isImprovement: true,
  },
  {
    label: 'On-Time Delivery',
    thisWeek: '93.2%',
    lastWeek: '88.7%',
    change: 5.1,
    unit: '%',
    icon: CheckCircle2,
    isImprovement: true,
  },
  {
    label: 'First-Piece Rejects',
    thisWeek: '2.8%',
    lastWeek: '3.4%',
    change: -17.6,
    unit: '%',
    icon: XCircle,
    isImprovement: true,
  },
  {
    label: 'OEE-Lite',
    thisWeek: '76.4%',
    lastWeek: '73.1%',
    change: 4.5,
    unit: '%',
    icon: TrendingUp,
    isImprovement: true,
  },
];

const machines = ['M01', 'M02', 'M03', 'M04', 'M05'];
const productFamilies = ['Widget', 'Bracket', 'Shaft', 'Gear', 'Cover', 'Housing'];
const eventTypes = [
  { value: 'breakdown', label: 'Machine Breakdown' },
  { value: 'rush_order', label: 'Rush Order' },
  { value: 'maintenance', label: 'Scheduled Maintenance' },
  { value: 'material_delay', label: 'Material Delay' },
];

const getWeekRange = (weeksAgo: number = 0) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() - (weeksAgo * 7));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  return {
    start: startOfWeek.toISOString().split('T')[0],
    end: endOfWeek.toISOString().split('T')[0],
  };
};

export function WeeklyMetricsPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  
  const thisWeek = getWeekRange(0);
  const [filters, setFilters] = useState<FilterState>({
    weekStart: thisWeek.start,
    weekEnd: thisWeek.end,
    shift: 'all',
    machine: 'all',
    productFamily: 'all',
    eventType: 'all',
  });

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Weekly Production Metrics</h1>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Week of {formatDate(filters.weekStart)} - {formatDate(filters.weekEnd)}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Filters:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {/* Week Range */}
            <div className="sm:col-span-2">
              <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Week Range:</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.weekStart}
                  onChange={(e) => handleFilterChange('weekStart', e.target.value)}
                  className={`flex-1 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
                <input
                  type="date"
                  value={filters.weekEnd}
                  onChange={(e) => handleFilterChange('weekEnd', e.target.value)}
                  className={`flex-1 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>
            </div>

            {/* Shift */}
            <div>
              <label htmlFor="shift" className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Shift:
              </label>
              <select
                id="shift"
                value={filters.shift}
                onChange={(e) => handleFilterChange('shift', e.target.value as Shift)}
                className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value="all">All Shifts</option>
                <option value="A">Shift A</option>
                <option value="B">Shift B</option>
                <option value="C">Shift C</option>
              </select>
            </div>

            {/* Machine */}
            <div>
              <label htmlFor="machine" className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Machine:
              </label>
              <select
                id="machine"
                value={filters.machine}
                onChange={(e) => handleFilterChange('machine', e.target.value)}
                className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value="all">All Machines</option>
                {machines.map(machine => (
                  <option key={machine} value={machine}>{machine}</option>
                ))}
              </select>
            </div>

            {/* Product Family */}
            <div>
              <label htmlFor="productFamily" className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Product Family:
              </label>
              <select
                id="productFamily"
                value={filters.productFamily}
                onChange={(e) => handleFilterChange('productFamily', e.target.value)}
                className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value="all">All Families</option>
                {productFamilies.map(family => (
                  <option key={family} value={family}>{family}</option>
                ))}
              </select>
            </div>

            {/* Event Type */}
            <div>
              <label htmlFor="eventType" className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Event Type:
              </label>
              <select
                id="eventType"
                value={filters.eventType}
                onChange={(e) => handleFilterChange('eventType', e.target.value as EventType)}
                className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value="all">All Events</option>
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Week-over-Week Comparison Cards */}
          <div>
            <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>This Week vs Last Week</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockMetrics.map((metric, idx) => {
                const Icon = metric.icon;
                const isImprovement = metric.isImprovement;
                const changeIsPositive = metric.change > 0;

                return (
                  <div key={idx} className={`border rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2 rounded-lg ${isImprovement ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Icon className={`w-5 h-5 ${isImprovement ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                      <div className={`flex items-center gap-1 ${isImprovement ? 'text-green-600' : 'text-red-600'}`}>
                        {changeIsPositive === isImprovement ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                          {Math.abs(metric.change).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metric.label}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>This Week:</span>
                        <span className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{metric.thisWeek}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last Week:</span>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metric.lastWeek}</span>
                      </div>
                    </div>

                    <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center gap-1">
                        <ArrowRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {isImprovement ? 'Improved' : 'Needs attention'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Trend Charts Placeholder */}
          <div>
            <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Weekly Trends</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Setup Time Trend */}
              <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Setup Time Trend</h3>
                  <Clock className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <div className={`h-64 rounded-lg flex items-center justify-center border-2 border-dashed ${isDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                  <div className="text-center">
                    <BarChart3 className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chart Placeholder</p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Weekly setup minutes by machine</p>
                  </div>
                </div>
              </div>

              {/* OTD Trend */}
              <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>On-Time Delivery Trend</h3>
                  <CheckCircle2 className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <div className={`h-64 rounded-lg flex items-center justify-center border-2 border-dashed ${isDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                  <div className="text-center">
                    <BarChart3 className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chart Placeholder</p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Weekly OTD percentage</p>
                  </div>
                </div>
              </div>

              {/* First-Piece Rejects Trend */}
              <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>First-Piece Rejects Trend</h3>
                  <XCircle className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <div className={`h-64 rounded-lg flex items-center justify-center border-2 border-dashed ${isDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                  <div className="text-center">
                    <BarChart3 className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chart Placeholder</p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Weekly reject rate by product family</p>
                  </div>
                </div>
              </div>

              {/* OEE Trend */}
              <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>OEE-Lite Trend</h3>
                  <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <div className={`h-64 rounded-lg flex items-center justify-center border-2 border-dashed ${isDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                  <div className="text-center">
                    <BarChart3 className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chart Placeholder</p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Weekly OEE by shift</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insights Section */}
          <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-800' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'}`}>
            <h3 className={`mb-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>Key Insights</h3>
            <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Setup time reduced by 8.5% - Shift A leading with 15% improvement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>On-Time Delivery improved to 93.2% - Best performance in 4 weeks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">!</span>
                <span>First-piece rejects still at 2.8% - Focus on M03 Press setup quality</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>OEE-Lite trending up - Maintenance optimization paying off</span>
              </li>
            </ul>
          </div>

          {/* Filter Summary */}
          <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className="font-medium">Current Filters:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {filters.shift !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  Shift {filters.shift}
                </span>
              )}
              {filters.machine !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  Machine {filters.machine}
                </span>
              )}
              {filters.productFamily !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  {filters.productFamily}
                </span>
              )}
              {filters.eventType !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  {eventTypes.find(e => e.value === filters.eventType)?.label}
                </span>
              )}
              {filters.shift === 'all' && 
               filters.machine === 'all' && 
               filters.productFamily === 'all' && 
               filters.eventType === 'all' && (
                <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>No filters applied - showing all data</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}