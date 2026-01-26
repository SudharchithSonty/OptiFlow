import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  CheckCircle2, 
  XCircle,
  Zap,
  ThumbsUp,
  MessageSquare,
  Activity,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AIMetricsPageProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

type TimeRange = '7d' | '30d' | '90d' | 'all';

// Mock data for AI metrics
const generateMetricsData = (range: TimeRange) => {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 180;
  
  return {
    overview: {
      totalJobs: range === '7d' ? 142 : range === '30d' ? 623 : range === '90d' ? 1847 : 3521,
      successRate: 94.2,
      avgResponseTime: 2.3, // seconds
      userSatisfaction: 4.6, // out of 5
      timeSaved: range === '7d' ? 18 : range === '30d' ? 76 : range === '90d' ? 234 : 456, // hours
    },
    trendData: Array.from({ length: Math.min(days, 30) }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      jobs: Math.floor(Math.random() * 30) + 10,
      successRate: Math.floor(Math.random() * 10) + 90,
      avgTime: (Math.random() * 2 + 1.5).toFixed(1),
    })),
    featureUsage: [
      { name: 'Shift Briefs', value: 342, color: '#3b82f6' },
      { name: 'Draft Reports', value: 289, color: '#8b5cf6' },
      { name: 'Setup Guidance', value: 256, color: '#10b981' },
      { name: 'Explain Chat', value: 198, color: '#f59e0b' },
      { name: 'Reschedule', value: 167, color: '#ef4444' },
    ],
    responseTimeDistribution: [
      { range: '0-1s', count: 523 },
      { range: '1-2s', count: 892 },
      { range: '2-3s', count: 634 },
      { range: '3-5s', count: 287 },
      { range: '>5s', count: 142 },
    ],
    userFeedback: {
      positive: 1842,
      negative: 124,
      neutral: 312,
    },
    impactMetrics: {
      scheduleOptimization: 12.3, // % improvement
      setupTimeReduction: 18.7, // % reduction
      otdImprovement: 8.4, // % improvement
      alertResolutionSpeed: 23.1, // % faster
    }
  };
};

export function AIMetricsPage({ userRole = 'planner' }: AIMetricsPageProps) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  
  const metrics = generateMetricsData(timeRange);
  
  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '7d', label: '7d' },
    { value: '30d', label: '30d' },
    { value: '90d', label: '90d' },
    { value: 'all', label: 'All' },
  ];

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    unit = '', 
    trend, 
    trendValue,
    color = 'blue' 
  }: { 
    icon: any; 
    label: string; 
    value: string | number; 
    unit?: string;
    trend?: 'up' | 'down';
    trendValue?: string;
    color?: string;
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
    };

    return (
      <div className={`rounded-lg border p-3 ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-start justify-between mb-2">
          <div className={`${colorClasses[color]} p-1.5 rounded-lg`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          {trend && trendValue && (
            <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
              trend === 'up' 
                ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700'
                : isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-700'
            }`}>
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="text-xs font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {label}
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </span>
          {unit && (
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {unit}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 space-y-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/app/agent/home')}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                AI Metrics Dashboard
              </h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {userRole === 'owner' ? 'Organization-wide performance' : 
                 userRole === 'planner' ? 'AI assistant effectiveness' : 
                 'View-only metrics'}
              </p>
            </div>
          </div>

          {/* Compact Time Range */}
          <div className={`flex gap-1 p-0.5 rounded-lg ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'
          }`}>
            {timeRanges.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTimeRange(value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  timeRange === value
                    ? isDarkMode 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-white text-blue-700 shadow-md'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Overview Stats */}
        <div className="grid grid-cols-5 gap-3">
          <StatCard
            icon={Activity}
            label="Total Jobs"
            value={metrics.overview.totalJobs.toLocaleString()}
            trend="up"
            trendValue="+12%"
            color="blue"
          />
          <StatCard
            icon={CheckCircle2}
            label="Success Rate"
            value={metrics.overview.successRate}
            unit="%"
            trend="up"
            trendValue="+2%"
            color="green"
          />
          <StatCard
            icon={Clock}
            label="Avg Response"
            value={metrics.overview.avgResponseTime}
            unit="s"
            trend="down"
            trendValue="-0.3"
            color="purple"
          />
          <StatCard
            icon={ThumbsUp}
            label="User Rating"
            value={metrics.overview.userSatisfaction}
            unit="/ 5"
            trend="up"
            trendValue="+0.2"
            color="orange"
          />
          <StatCard
            icon={Zap}
            label="Time Saved"
            value={metrics.overview.timeSaved}
            unit="hrs"
            trend="up"
            trendValue="+18%"
            color="green"
          />
        </div>

        {/* Main Charts Grid - 3 columns */}
        <div className="grid grid-cols-3 gap-4">
          {/* Jobs Over Time */}
          <div className={`rounded-lg border p-3 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <BarChart3 className="w-4 h-4" />
              AI Jobs Over Time
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={metrics.trendData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                  height={30}
                />
                <YAxis 
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                  width={30}
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

          {/* Success Rate Trend */}
          <div className={`rounded-lg border p-3 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <TrendingUp className="w-4 h-4" />
              Success Rate Trend
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={metrics.trendData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                  height={30}
                />
                <YAxis 
                  domain={[85, 100]}
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                  width={30}
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
                  dataKey="successRate" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Feature Usage */}
          <div className={`rounded-lg border p-3 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <MessageSquare className="w-4 h-4" />
              Feature Usage
            </h3>
            <div className="flex items-center gap-3">
              <ResponsiveContainer width="40%" height={140}>
                <PieChart>
                  <Pie
                    data={metrics.featureUsage}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {metrics.featureUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {metrics.featureUsage.map((feature) => (
                  <div key={feature.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: feature.color }}
                      />
                      <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {feature.name}
                      </span>
                    </div>
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {feature.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - 3 columns */}
        <div className="grid grid-cols-3 gap-4">
          {/* Response Time */}
          <div className={`rounded-lg border p-3 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Clock className="w-4 h-4" />
              Response Time
            </h3>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={metrics.responseTimeDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  type="number"
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                  height={25}
                />
                <YAxis 
                  type="category"
                  dataKey="range" 
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Business Impact */}
          <div className={`rounded-lg border p-3 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-sm font-semibold mb-3 flex items-center gap-1.5 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Zap className="w-4 h-4" />
              Business Impact
            </h3>
            <div className="space-y-2.5">
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Schedule Optimization
                  </span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    +{metrics.impactMetrics.scheduleOptimization}%
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Setup Time Reduction
                  </span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    -{metrics.impactMetrics.setupTimeReduction}%
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    OTD Improvement
                  </span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    +{metrics.impactMetrics.otdImprovement}%
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Alert Resolution Speed
                  </span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    +{metrics.impactMetrics.alertResolutionSpeed}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Feedback */}
          <div className={`rounded-lg border p-3 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-sm font-semibold mb-3 flex items-center gap-1.5 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <ThumbsUp className="w-4 h-4" />
              User Feedback
            </h3>
            <div className="space-y-2">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                    Positive
                  </span>
                  <ThumbsUp className={`w-3 h-3 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                    {metrics.userFeedback.positive.toLocaleString()}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-green-400/70' : 'text-green-600/70'}`}>
                    {((metrics.userFeedback.positive / (metrics.userFeedback.positive + metrics.userFeedback.negative + metrics.userFeedback.neutral)) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <span className={`text-xs font-medium block mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                    Neutral
                  </span>
                  <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {metrics.userFeedback.neutral}
                  </span>
                </div>
                
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                  <span className={`text-xs font-medium block mb-1 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                    Negative
                  </span>
                  <span className={`text-lg font-bold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                    {metrics.userFeedback.negative}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
