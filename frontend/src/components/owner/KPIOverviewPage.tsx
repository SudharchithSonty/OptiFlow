import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  Settings,
  Activity,
  ChevronDown
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type Shift = 'all' | 'A' | 'B' | 'C';
type Machine = 'all' | 'M01' | 'M02' | 'M03' | 'M04' | 'M05';

interface KPIData {
  label: string;
  value: string;
  trend: number;
  icon: any;
  color: string;
  bgColor: string;
}

const mockOrgKPIs: KPIData[] = [
  {
    label: 'On-Time Delivery',
    value: '91.5%',
    trend: 3.2,
    icon: TrendingUp,
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  {
    label: 'Downtime Hours',
    value: '12.4 hrs',
    trend: -15.3,
    icon: AlertTriangle,
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
  },
  {
    label: 'Avg Utilization',
    value: '78.3%',
    trend: 2.1,
    icon: Activity,
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  {
    label: 'Setup Minutes',
    value: '487 min',
    trend: -8.5,
    icon: Clock,
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
  },
  {
    label: 'OEE-Lite',
    value: '72.8%',
    trend: 4.7,
    icon: BarChart3,
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
  },
];

const mockShiftData = {
  A: { otd: '94.2%', downtime: '3.2 hrs', utilization: '82.1%', setup: '142 min', oee: '76.5%' },
  B: { otd: '91.3%', downtime: '4.8 hrs', utilization: '77.8%', setup: '168 min', oee: '71.2%' },
  C: { otd: '89.1%', downtime: '4.4 hrs', utilization: '75.0%', setup: '177 min', oee: '70.7%' },
};

const mockMachineData = {
  M01: { otd: '95.2%', downtime: '2.1 hrs', utilization: '72.3%', setup: '85 min', oee: '78.4%' },
  M02: { otd: '93.8%', downtime: '2.8 hrs', utilization: '75.6%', setup: '92 min', oee: '75.1%' },
  M03: { otd: '85.4%', downtime: '5.2 hrs', utilization: '94.2%', setup: '124 min', oee: '65.3%' },
  M04: { otd: '92.1%', downtime: '2.3 hrs', utilization: '76.8%', setup: '98 min', oee: '74.8%' },
  M05: { otd: '94.5%', downtime: '2.0 hrs', utilization: '73.4%', setup: '88 min', oee: '77.2%' },
};

export function KPIOverviewPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [selectedShift, setSelectedShift] = useState<Shift>('all');
  const [selectedMachine, setSelectedMachine] = useState<Machine>('all');

  const getShiftData = (shift: Shift) => {
    if (shift === 'all') return null;
    return mockShiftData[shift];
  };

  const getMachineData = (machine: Machine) => {
    if (machine === 'all') return null;
    return mockMachineData[machine];
  };

  const drilldownData = selectedMachine !== 'all' 
    ? getMachineData(selectedMachine)
    : selectedShift !== 'all'
    ? getShiftData(selectedShift)
    : null;

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Organization KPI Overview</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Real-time performance metrics across all operations
            </p>
          </div>
        </div>

        {/* Drilldown Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Shift Selector */}
          <div className="relative">
            <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Filter by Shift:</label>
            <div className="relative">
              <select
                value={selectedShift}
                onChange={(e) => {
                  setSelectedShift(e.target.value as Shift);
                  setSelectedMachine('all');
                }}
                className={`appearance-none px-4 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
              >
                <option value="all">All Shifts</option>
                <option value="A">Shift A (Morning)</option>
                <option value="B">Shift B (Afternoon)</option>
                <option value="C">Shift C (Night)</option>
              </select>
              <ChevronDown className={`w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
          </div>

          {/* Machine Selector */}
          <div className="relative">
            <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Filter by Machine:</label>
            <div className="relative">
              <select
                value={selectedMachine}
                onChange={(e) => {
                  setSelectedMachine(e.target.value as Machine);
                  setSelectedShift('all');
                }}
                className={`appearance-none px-4 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
              >
                <option value="all">All Machines</option>
                <option value="M01">M01</option>
                <option value="M02">M02</option>
                <option value="M03">M03 (Bottleneck)</option>
                <option value="M04">M04</option>
                <option value="M05">M05</option>
              </select>
              <ChevronDown className={`w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedShift !== 'all' || selectedMachine !== 'all') && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedShift('all');
                  setSelectedMachine('all');
                }}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${isDarkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-700 hover:bg-blue-50'}`}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Active Filter Banner */}
          {drilldownData && (
            <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                  <span className="font-medium">Viewing:</span>{' '}
                  {selectedMachine !== 'all' 
                    ? `Machine ${selectedMachine}${selectedMachine === 'M03' ? ' (Bottleneck)' : ''}`
                    : `Shift ${selectedShift}`
                  }
                </span>
              </div>
            </div>
          )}

          {/* Organization-Level KPIs */}
          <div>
            <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {drilldownData 
                ? selectedMachine !== 'all'
                  ? `Machine ${selectedMachine} Performance`
                  : `Shift ${selectedShift} Performance`
                : 'Organization-Wide Performance'
              }
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {mockOrgKPIs.map((kpi, idx) => {
                const Icon = kpi.icon;
                const trendIsPositive = kpi.trend > 0;
                const trendColor = trendIsPositive ? 'text-green-600' : 'text-red-600';
                
                // Get drilldown value if applicable
                let displayValue = kpi.value;
                if (drilldownData) {
                  const keys = ['otd', 'downtime', 'utilization', 'setup', 'oee'];
                  displayValue = drilldownData[keys[idx] as keyof typeof drilldownData];
                }

                return (
                  <div key={idx} className={`border rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                        <Icon className={`w-5 h-5 ${kpi.color}`} />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
                        {trendIsPositive ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>{Math.abs(kpi.trend).toFixed(1)}%</span>
                      </div>
                    </div>

                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{kpi.label}</p>
                    <p className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{displayValue}</p>

                    <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>vs. last period</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shift Breakdown (when no filters) */}
          {!drilldownData && (
            <div>
              <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Breakdown by Shift</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {(['A', 'B', 'C'] as const).map(shift => {
                  const data = mockShiftData[shift];
                  return (
                    <button
                      key={shift}
                      onClick={() => setSelectedShift(shift)}
                      className={`border rounded-lg p-6 transition-all text-left ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:shadow-lg' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Shift {shift}</h3>
                        <span className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>View Details →</span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>OTD:</span>
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{data.otd}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Downtime:</span>
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{data.downtime}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Utilization:</span>
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{data.utilization}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Setup Time:</span>
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{data.setup}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>OEE-Lite:</span>
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{data.oee}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Machine Breakdown (when no filters) */}
          {!drilldownData && (
            <div>
              <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Breakdown by Machine</h2>
              <div className={`border rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <table className="w-full">
                  <thead className={`border-b ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Machine</th>
                      <th className={`px-6 py-3 text-left text-xs uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>OTD</th>
                      <th className={`px-6 py-3 text-left text-xs uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Downtime</th>
                      <th className={`px-6 py-3 text-left text-xs uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Utilization</th>
                      <th className={`px-6 py-3 text-left text-xs uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Setup</th>
                      <th className={`px-6 py-3 text-left text-xs uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>OEE</th>
                      <th className={`px-6 py-3 text-left text-xs uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {(['M01', 'M02', 'M03', 'M04', 'M05'] as const).map(machine => {
                      const data = mockMachineData[machine];
                      const isBottleneck = machine === 'M03';
                      
                      return (
                        <tr key={machine} className={isBottleneck ? 'bg-orange-50' : ''}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${isDarkMode && !isBottleneck ? 'text-white' : 'text-gray-900'}`}>{machine}</span>
                              {isBottleneck && (
                                <span className="px-2 py-0.5 bg-orange-200 text-orange-700 text-xs rounded">
                                  Bottleneck
                                </span>
                              )}
                            </div>
                          </td>
                          <td className={`px-6 py-4 text-sm ${isDarkMode && !isBottleneck ? 'text-gray-300' : 'text-gray-900'}`}>{data.otd}</td>
                          <td className={`px-6 py-4 text-sm ${isDarkMode && !isBottleneck ? 'text-gray-300' : 'text-gray-900'}`}>{data.downtime}</td>
                          <td className={`px-6 py-4 text-sm ${isDarkMode && !isBottleneck ? 'text-gray-300' : 'text-gray-900'}`}>{data.utilization}</td>
                          <td className={`px-6 py-4 text-sm ${isDarkMode && !isBottleneck ? 'text-gray-300' : 'text-gray-900'}`}>{data.setup}</td>
                          <td className={`px-6 py-4 text-sm ${isDarkMode && !isBottleneck ? 'text-gray-300' : 'text-gray-900'}`}>{data.oee}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedMachine(machine)}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Info Panel */}
          <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="font-medium">About KPIs:</span>
            </p>
            <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• <span className="font-medium">OTD:</span> On-Time Delivery percentage</li>
              <li>• <span className="font-medium">Downtime:</span> Total unplanned machine downtime</li>
              <li>• <span className="font-medium">Utilization:</span> Average machine utilization across fleet</li>
              <li>• <span className="font-medium">Setup Minutes:</span> Total changeover time</li>
              <li>• <span className="font-medium">OEE-Lite:</span> Overall Equipment Effectiveness (simplified calculation)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}