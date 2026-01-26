import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  AlertTriangle,
  ChevronDown,
  BarChart3,
  Activity
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';
import { TabletLayout } from './TabletLayout';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AgentMetricsDashboardTabletProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

export function AgentMetricsDashboardTablet({ userRole = 'supervisor' }: AgentMetricsDashboardTabletProps) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const kpiData = [
    { 
      label: 'Total jobs', 
      value: '342', 
      change: '+12%', 
      isPositive: true,
      subtitle: 'Last 30 days'
    },
    { 
      label: 'Success rate', 
      value: '94.7%', 
      change: '+2.1%', 
      isPositive: true,
      subtitle: '324 / 342 jobs'
    },
    { 
      label: 'Avg response time', 
      value: '1.8s', 
      change: '-0.3s', 
      isPositive: true,
      subtitle: 'p50 latency'
    },
    { 
      label: 'Cost per job', 
      value: '$0.12', 
      change: '-$0.02', 
      isPositive: true,
      subtitle: 'LLM tokens'
    },
  ];

  const jobVolumeData = [
    { date: 'Jan 19', jobs: 45 },
    { date: 'Jan 20', jobs: 52 },
    { date: 'Jan 21', jobs: 38 },
    { date: 'Jan 22', jobs: 61 },
    { date: 'Jan 23', jobs: 48 },
    { date: 'Jan 24', jobs: 55 },
    { date: 'Jan 25', jobs: 43 },
  ];

  const successRateData = [
    { date: 'Jan 19', rate: 93.2 },
    { date: 'Jan 20', rate: 95.1 },
    { date: 'Jan 21', rate: 92.8 },
    { date: 'Jan 22', rate: 94.5 },
    { date: 'Jan 23', rate: 96.2 },
    { date: 'Jan 24', rate: 93.7 },
    { date: 'Jan 25', rate: 94.7 },
  ];

  const jobsByTypeData = [
    { name: 'Setup guidance', value: 128, color: '#3b82f6' },
    { name: 'Brief generation', value: 95, color: '#10b981' },
    { name: 'Q&A', value: 73, color: '#f59e0b' },
    { name: 'Run comparison', value: 46, color: '#8b5cf6' },
  ];

  const recentJobs = [
    { id: 'AJ-98347', type: 'Setup guidance', status: 'success', time: '2 min ago', duration: '1.4s' },
    { id: 'AJ-98346', type: 'Brief generation', status: 'success', time: '5 min ago', duration: '2.1s' },
    { id: 'AJ-98345', type: 'Q&A', status: 'failed', time: '12 min ago', duration: '0.8s' },
    { id: 'AJ-98344', type: 'Setup guidance', status: 'success', time: '18 min ago', duration: '1.7s' },
    { id: 'AJ-98343', type: 'Run comparison', status: 'success', time: '25 min ago', duration: '3.2s' },
  ];

  return (
    <TabletLayout userRole={userRole}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              AI Metrics
            </h1>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Digital Operations Assistant performance
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium outline-none ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          {kpiData.map((kpi) => (
            <div
              key={kpi.label}
              className={`rounded-lg border p-3 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {kpi.label}
              </div>
              <div className="flex items-baseline justify-between mb-1">
                <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {kpi.value}
                </span>
                <span className={`text-xs font-medium ${
                  kpi.isPositive
                    ? isDarkMode ? 'text-green-400' : 'text-green-600'
                    : isDarkMode ? 'text-red-400' : 'text-red-600'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {kpi.subtitle}
              </div>
            </div>
          ))}
        </div>

        {/* Job Volume Chart */}
        <div className={`rounded-lg border p-4 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-base font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Job volume
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={jobVolumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                stroke={isDarkMode ? '#4b5563' : '#d1d5db'}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                stroke={isDarkMode ? '#4b5563' : '#d1d5db'}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="jobs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Success Rate Chart */}
        <div className={`rounded-lg border p-4 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-base font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Success rate trend
          </h3>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={successRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                stroke={isDarkMode ? '#4b5563' : '#d1d5db'}
              />
              <YAxis 
                domain={[90, 100]}
                tick={{ fontSize: 11, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                stroke={isDarkMode ? '#4b5563' : '#d1d5db'}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Jobs by Type */}
        <div className={`rounded-lg border p-4 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-base font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Jobs by type
          </h3>
          <div className="space-y-2">
            {jobsByTypeData.map((item) => {
              const total = jobsByTypeData.reduce((sum, i) => sum + i.value, 0);
              const percentage = ((item.value / total) * 100).toFixed(1);
              
              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item.name}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.value} ({percentage}%)
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="h-full transition-all"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className={`rounded-lg border p-4 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-base font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent jobs
          </h3>
          <div className="space-y-2">
            {recentJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => navigate(`/app/agent/jobs/${job.id}`)}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 active:bg-gray-700' 
                    : 'bg-gray-50 border-gray-200 active:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-blue-600">
                    {job.id}
                  </span>
                  {job.status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {job.type}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {job.time}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {job.duration}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/app/agent/jobs')}
            className={`w-full mt-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 active:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 active:bg-gray-200'
            }`}
          >
            View all jobs
          </button>
        </div>
      </div>
    </TabletLayout>
  );
}
