import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Download } from 'lucide-react';
import { mockKPIs, weeklyTrendData } from '../types';
import { useDarkModeChartStyles } from './ui/DarkModeChartTooltip';

interface MetricsPageProps {
  role: 'owner' | 'planner' | 'supervisor';
}

export function MetricsPage({ role }: MetricsPageProps) {
  const chartStyles = useDarkModeChartStyles();

  const setupTimeData = [
    { machine: 'M1', avgSetup: 45, target: 40 },
    { machine: 'M2', avgSetup: 52, target: 40 },
    { machine: 'M3', avgSetup: 38, target: 40 },
    { machine: 'M4', avgSetup: 48, target: 40 },
    { machine: 'M5', avgSetup: 42, target: 40 },
  ];

  const downtimeData = [
    { day: 'Mon', planned: 0.5, unplanned: 0.8 },
    { day: 'Tue', planned: 0.3, unplanned: 1.2 },
    { day: 'Wed', planned: 0.6, unplanned: 0.5 },
    { day: 'Thu', planned: 0.4, unplanned: 0.3 },
    { day: 'Fri', planned: 0.7, unplanned: 0.6 },
  ];

  const rejectData = [
    { category: 'Dimensional', count: 12, percentage: 42.9 },
    { category: 'Surface Defects', count: 8, percentage: 28.6 },
    { category: 'Material Issues', count: 5, percentage: 17.9 },
    { category: 'Assembly Errors', count: 3, percentage: 10.7 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900 dark:text-gray-100 mb-2">Performance Metrics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {role === 'owner' 
              ? 'Comprehensive KPI overview and trends'
              : 'Track production efficiency and quality metrics'}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors">
          <Download className="w-5 h-5" />
          <span className="hidden sm:inline">Export Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {mockKPIs.map((kpi) => (
          <div key={kpi.name} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{kpi.name}</p>
                <p className="text-2xl lg:text-3xl text-gray-900 dark:text-gray-100 font-bold">
                  {kpi.value}
                  <span className="text-base lg:text-lg text-gray-500 dark:text-gray-400 ml-1">{kpi.unit}</span>
                </p>
              </div>
              <div className={`p-2 rounded-lg transition-all ${
                kpi.trend === 'up' && kpi.change > 0 ? 'bg-green-50 dark:bg-green-900/20' :
                kpi.trend === 'down' && kpi.change < 0 ? 'bg-green-50 dark:bg-green-900/20' :
                kpi.trend === 'up' && kpi.change < 0 ? 'bg-red-50 dark:bg-red-900/20' :
                'bg-gray-50 dark:bg-gray-700'
              }`}>
                {kpi.trend === 'up' ? (
                  <TrendingUp className={`w-5 h-5 ${
                    kpi.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`} />
                ) : kpi.trend === 'down' ? (
                  <TrendingDown className={`w-5 h-5 ${
                    ['Avg Setup Time', 'Downtime', 'Reject Rate'].includes(kpi.name) 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`} />
                ) : null}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm mb-3">
              <span className={`font-medium ${
                Math.abs(kpi.change) < 1 ? 'text-gray-600 dark:text-gray-400' :
                (['Avg Setup Time', 'Downtime', 'Reject Rate'].includes(kpi.name) && kpi.change < 0) ||
                (!['Avg Setup Time', 'Downtime', 'Reject Rate'].includes(kpi.name) && kpi.change > 0)
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}% vs last week
              </span>
              {kpi.target && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Target: {kpi.target}{kpi.unit}
                </span>
              )}
            </div>

            {kpi.target && (
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    kpi.value >= kpi.target ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}
                  style={{ 
                    width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` 
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Weekly Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 mb-6 hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 dark:text-gray-100 mb-1 font-semibold">Weekly Performance Trends</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Last 4 weeks comparison</p>
          </div>
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <option>Last 4 Weeks</option>
            <option>Last 8 Weeks</option>
            <option>Last Quarter</option>
            <option>Last 6 Months</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={weeklyTrendData}>
            <defs>
              <linearGradient id="colorOEE" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" {...chartStyles.cartesianGrid} />
            <XAxis dataKey="week" {...chartStyles.axis} />
            <YAxis {...chartStyles.axis} />
            <Tooltip {...chartStyles.tooltip} />
            <Legend {...chartStyles.legend} />
            <Line 
              type="monotone" 
              dataKey="oee" 
              stroke="#3b82f6" 
              name="OEE %" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#3b82f6' }}
              activeDot={{ r: 7, strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="otd" 
              stroke="#10b981" 
              name="OTD %" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#10b981' }}
              activeDot={{ r: 7, strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="utilization" 
              stroke="#f59e0b" 
              name="Utilization %" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#f59e0b' }}
              activeDot={{ r: 7, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Setup Time by Machine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-gray-900 dark:text-gray-100 mb-4 font-semibold">Setup Time by Machine</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={setupTimeData}>
              <defs>
                <linearGradient id="setupGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" {...chartStyles.cartesianGrid} />
              <XAxis dataKey="machine" {...chartStyles.axis} />
              <YAxis {...chartStyles.axis} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', ...chartStyles.axis.tick }} />
              <Tooltip {...chartStyles.tooltip} />
              <Legend {...chartStyles.legend} />
              <Bar dataKey="avgSetup" fill="url(#setupGradient)" name="Avg Setup Time" radius={[8, 8, 0, 0]} />
              <Bar dataKey="target" fill="#9ca3af" name="Target" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Downtime Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-gray-900 dark:text-gray-100 mb-4 font-semibold">Downtime Analysis - This Week</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={downtimeData}>
              <defs>
                <linearGradient id="plannedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                </linearGradient>
                <linearGradient id="unplannedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" {...chartStyles.cartesianGrid} />
              <XAxis dataKey="day" {...chartStyles.axis} />
              <YAxis {...chartStyles.axis} label={{ value: 'Hours', angle: -90, position: 'insideLeft', ...chartStyles.axis.tick }} />
              <Tooltip {...chartStyles.tooltip} />
              <Legend {...chartStyles.legend} />
              <Bar dataKey="planned" fill="url(#plannedGradient)" name="Planned" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="unplanned" fill="url(#unplannedGradient)" name="Unplanned" stackId="a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reject Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 mb-6 hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-gray-900 dark:text-gray-100 mb-4 font-semibold">Reject Analysis - Current Week</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={rejectData} layout="vertical">
                <defs>
                  <linearGradient id="rejectGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" {...chartStyles.cartesianGrid} />
                <XAxis type="number" {...chartStyles.axis} />
                <YAxis type="category" dataKey="category" {...chartStyles.axis} width={120} />
                <Tooltip {...chartStyles.tooltip} />
                <Bar dataKey="count" fill="url(#rejectGradient)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Rejects: 28 units (1.8% of production)</p>
            {rejectData.map((item, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">{item.category}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.count} units</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{item.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Machine Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-gray-900 dark:text-gray-100 mb-4 font-semibold">Machine Performance Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left text-sm text-gray-600 dark:text-gray-400 pb-3 font-semibold">Machine</th>
                <th className="text-right text-sm text-gray-600 dark:text-gray-400 pb-3 font-semibold">OEE</th>
                <th className="text-right text-sm text-gray-600 dark:text-gray-400 pb-3 font-semibold">Utilization</th>
                <th className="text-right text-sm text-gray-600 dark:text-gray-400 pb-3 font-semibold">Downtime</th>
                <th className="text-right text-sm text-gray-600 dark:text-gray-400 pb-3 font-semibold">Setup Time</th>
                <th className="text-right text-sm text-gray-600 dark:text-gray-400 pb-3 font-semibold">Rejects</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'M1', name: 'CNC Mill #1', oee: 87, util: 91, down: 0.5, setup: 45, rejects: 2 },
                { id: 'M2', name: 'CNC Mill #2', oee: 89, util: 93, down: 0.3, setup: 52, rejects: 1 },
                { id: 'M3', name: 'Lathe #1', oee: 82, util: 85, down: 1.2, setup: 38, rejects: 3 },
                { id: 'M4', name: 'Lathe #2', oee: 0, util: 0, down: 8.0, setup: 0, rejects: 0 },
                { id: 'M5', name: 'Press #1', oee: 84, util: 88, down: 0.6, setup: 42, rejects: 2 },
              ].map((machine) => (
                <tr key={machine.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 text-sm text-gray-900 dark:text-gray-100">{machine.name}</td>
                  <td className="py-3 text-sm text-gray-900 dark:text-gray-100 text-right font-medium">
                    {machine.oee > 0 ? `${machine.oee}%` : '-'}
                  </td>
                  <td className="py-3 text-sm text-gray-900 dark:text-gray-100 text-right font-medium">
                    {machine.util > 0 ? `${machine.util}%` : '-'}
                  </td>
                  <td className="py-3 text-sm text-gray-900 dark:text-gray-100 text-right font-medium">{machine.down}h</td>
                  <td className="py-3 text-sm text-gray-900 dark:text-gray-100 text-right font-medium">
                    {machine.setup > 0 ? `${machine.setup}m` : '-'}
                  </td>
                  <td className="py-3 text-sm text-gray-900 dark:text-gray-100 text-right font-medium">{machine.rejects}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}