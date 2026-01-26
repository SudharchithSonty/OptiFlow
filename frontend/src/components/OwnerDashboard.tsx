import { BarChart3, TrendingUp, TrendingDown, Minus, ArrowRight, Map, GitBranch } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockKPIs, weeklyTrendData } from '../types';
import { useDarkMode } from './DarkModeContext';
import { useNavigate } from 'react-router';

export function OwnerDashboard() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-900 dark:text-gray-100 mb-2">Operations Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Manufacturing KPIs and governance dashboard</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {mockKPIs.map((kpi) => (
          <div key={kpi.name} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{kpi.name}</p>
                <p className="text-2xl lg:text-3xl text-gray-900 dark:text-gray-100 font-bold">
                  {kpi.value}
                  <span className="text-base lg:text-lg text-gray-500 dark:text-gray-400 ml-1">{kpi.unit}</span>
                </p>
              </div>
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                kpi.trend === 'up' ? 'bg-green-50 dark:bg-green-900/20' : kpi.trend === 'down' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700'
              }`}>
                {kpi.trend === 'up' ? (
                  <TrendingUp className={`w-5 h-5 ${kpi.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                ) : kpi.trend === 'down' ? (
                  <TrendingDown className={`w-5 h-5 ${kpi.change < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                ) : (
                  <Minus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${
                Math.abs(kpi.change) < 1 ? 'text-gray-600 dark:text-gray-400' : kpi.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}% vs last week
              </span>
            </div>
            {kpi.target && (
              <div className="mt-3 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    kpi.value >= kpi.target ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}
                  style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Weekly Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 mb-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 dark:text-gray-100 mb-1">Weekly Performance Trends</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Last 4 weeks comparison</p>
          </div>
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <option>Last 4 Weeks</option>
            <option>Last 8 Weeks</option>
            <option>Last Quarter</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyTrendData}>
            <defs>
              <linearGradient id="colorOEE" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="week" 
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'} 
              tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
            />
            <YAxis 
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
                color: isDarkMode ? '#f3f4f6' : '#111827'
              }}
            />
            <Legend wrapperStyle={{ color: isDarkMode ? '#f3f4f6' : '#111827' }} />
            <Line type="monotone" dataKey="oee" stroke="#3b82f6" name="OEE %" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="otd" stroke="#10b981" name="OTD %" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="utilization" stroke="#f59e0b" name="Utilization %" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-gray-900 dark:text-gray-100 mb-4 font-semibold">Recent Activities</h3>
        <div className="space-y-3">
          {[
            { user: 'Ravi Rampaul', action: 'Created Run v2 for Shift A (Jan 2)', time: '2 hours ago', type: 'run' },
            { user: 'Priya Patel', action: 'Acknowledged machine breakdown alert', time: '3 hours ago', type: 'alert' },
            { user: 'Ravi Rampaul', action: 'Generated AI brief for Shift B', time: '5 hours ago', type: 'ai' },
            { user: 'Amit Mishra', action: 'Added new user: John Smith (Supervisor)', time: '1 day ago', type: 'user' },
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === 'run' ? 'bg-blue-500' :
                activity.type === 'alert' ? 'bg-red-500' :
                activity.type === 'ai' ? 'bg-purple-500' : 'bg-green-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}