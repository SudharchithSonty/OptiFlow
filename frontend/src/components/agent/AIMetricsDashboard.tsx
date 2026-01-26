import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Star,
  ArrowUpRight,
  FileText,
  Zap,
  Info,
  ArrowLeft
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { useDarkMode } from '../DarkModeContext';

interface AIMetricsDashboardProps {
  userRole: 'owner' | 'planner' | 'supervisor';
}

export function AIMetricsDashboard({ userRole }: AIMetricsDashboardProps) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  // Time period selector
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'quarter'>('week');

  // Key metrics for this week
  const metrics = {
    validationPassRate: {
      value: 96.8,
      target: 98,
      trend: -1.2, // percentage points change from last period
      totalJobs: 312,
      passedJobs: 302,
    },
    fallbackRate: {
      value: 3.2,
      target: 2,
      trend: 0.8,
      totalJobs: 312,
      fallbackJobs: 10,
    },
    replanSpeed: {
      avgMinutes: 8.4,
      p95Minutes: 14.2,
      target: 10,
      trend: -1.3, // negative is good (faster)
    },
    setupClarityRating: {
      value: 4.6,
      target: 4.5,
      trend: 0.2,
      totalRatings: 48,
    },
  };

  // Pass/Fail trend by day
  const passFailTrendData = [
    { date: 'Mon', passed: 42, failed: 3, total: 45 },
    { date: 'Tue', passed: 48, failed: 2, total: 50 },
    { date: 'Wed', passed: 51, failed: 3, total: 54 },
    { date: 'Thu', passed: 46, failed: 2, total: 48 },
    { date: 'Fri', passed: 58, failed: 4, total: 62 },
    { date: 'Sat', passed: 32, failed: 1, total: 33 },
    { date: 'Sun', passed: 25, failed: 0, total: 25 },
  ];

  // Fallback rate by job type
  const fallbackByJobType = [
    { jobType: 'Disruption Replan', fallbackRate: 8.5, total: 47, fallbacks: 4 },
    { jobType: 'Shift Brief', fallbackRate: 2.1, total: 95, fallbacks: 2 },
    { jobType: 'Setup Guidance', fallbackRate: 1.5, total: 68, fallbacks: 1 },
    { jobType: 'Explain Chat', fallbackRate: 0.8, total: 125, fallbacks: 1 },
    { jobType: 'Impact Report', fallbackRate: 5.2, total: 58, fallbacks: 3 },
  ];

  // Duration distribution by job type
  const durationByJobType = [
    { jobType: 'Disruption Replan', avg: 28.5, p50: 24, p95: 45, min: 12, max: 58 },
    { jobType: 'Shift Brief', avg: 4.2, p50: 3.8, p95: 6.5, min: 2.1, max: 8.2 },
    { jobType: 'Setup Guidance', avg: 2.8, p50: 2.5, p95: 4.2, min: 1.5, max: 5.8 },
    { jobType: 'Explain Chat', avg: 1.5, p50: 1.2, p95: 2.8, min: 0.5, max: 3.5 },
    { jobType: 'Impact Report', avg: 5.6, p50: 5.0, p95: 8.5, min: 3.2, max: 11.2 },
  ];

  // Setup clarity rating trend
  const clarityRatingTrend = [
    { date: 'Mon', rating: 4.5, count: 7 },
    { date: 'Tue', rating: 4.4, count: 8 },
    { date: 'Wed', rating: 4.7, count: 9 },
    { date: 'Thu', rating: 4.6, count: 6 },
    { date: 'Fri', rating: 4.8, count: 11 },
    { date: 'Sat', rating: 4.5, count: 4 },
    { date: 'Sun', rating: 4.3, count: 3 },
  ];

  const handleMetricClick = (metricType: string) => {
    // Navigate to Agent Jobs with pre-filtered view
    let filterParams = '';
    switch (metricType) {
      case 'validation':
        filterParams = '?validation_pass=false';
        break;
      case 'fallback':
        filterParams = '?fallback_used=true';
        break;
      case 'replan-slow':
        filterParams = '?job_type=disruption_replan';
        break;
      case 'setup-low':
        filterParams = '?job_type=setup_guidance';
        break;
    }
    navigate(`/app/agent/jobs${filterParams}`);
  };

  const getMetricStatus = (value: number, target: number, isReversed: boolean = false) => {
    if (isReversed) {
      // Lower is better (like fallback rate)
      if (value <= target) return 'success';
      if (value <= target * 1.5) return 'warning';
      return 'danger';
    } else {
      // Higher is better (like validation pass rate)
      if (value >= target) return 'success';
      if (value >= target * 0.9) return 'warning';
      return 'danger';
    }
  };

  const getMetricColorClasses = (status: string) => {
    switch (status) {
      case 'success':
        return isDarkMode ? 'text-green-400 bg-green-500/20 border-green-500/30' : 'text-green-700 bg-green-100 border-green-200';
      case 'warning':
        return isDarkMode ? 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' : 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'danger':
        return isDarkMode ? 'text-red-400 bg-red-500/20 border-red-500/30' : 'text-red-700 bg-red-100 border-red-200';
    }
  };

  const chartColors = {
    primary: isDarkMode ? '#3b82f6' : '#2563eb',
    secondary: isDarkMode ? '#8b5cf6' : '#7c3aed',
    success: isDarkMode ? '#10b981' : '#059669',
    danger: isDarkMode ? '#ef4444' : '#dc2626',
    warning: isDarkMode ? '#f59e0b' : '#d97706',
    grid: isDarkMode ? '#374151' : '#e5e7eb',
    text: isDarkMode ? '#9ca3af' : '#6b7280',
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <div className={`rounded-lg border p-3 shadow-lg ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <p className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <span style={{ color: entry.color }}>●</span> {entry.name}: {entry.value}
            {entry.dataKey === 'rating' && '/5'}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/app/agent/home')}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
        }`}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Agent Home</span>
      </button>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AI Metrics Dashboard
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {userRole === 'owner' ? 'Organization-wide view' : 
             userRole === 'planner' ? 'All accessible runs' : 
             'Your scope (view-only)'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value as 'week' | 'month' | 'quarter')}
            className={`px-4 py-2 rounded-lg border outline-none transition-colors ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            }`}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Validation Pass Rate */}
        <button
          onClick={() => handleMetricClick('validation')}
          className={`rounded-xl border p-6 text-left transition-all hover:shadow-lg ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:border-blue-500' 
              : 'bg-white border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${
              getMetricStatus(metrics.validationPassRate.value, metrics.validationPassRate.target) === 'success'
                ? isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
                : getMetricStatus(metrics.validationPassRate.value, metrics.validationPassRate.target) === 'warning'
                ? isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'
                : isDarkMode ? 'bg-red-500/20' : 'bg-red-100'
            }`}>
              <CheckCircle2 className={`w-6 h-6 ${
                getMetricStatus(metrics.validationPassRate.value, metrics.validationPassRate.target) === 'success'
                  ? isDarkMode ? 'text-green-400' : 'text-green-600'
                  : getMetricStatus(metrics.validationPassRate.value, metrics.validationPassRate.target) === 'warning'
                  ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                  : isDarkMode ? 'text-red-400' : 'text-red-600'
              }`} />
            </div>
            <ArrowUpRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          
          <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Validation Pass Rate
          </h3>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {metrics.validationPassRate.value}%
            </span>
            <span className={`inline-flex items-center gap-1 text-sm font-medium ${
              metrics.validationPassRate.trend < 0 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-green-600 dark:text-green-400'
            }`}>
              {metrics.validationPassRate.trend < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              {Math.abs(metrics.validationPassRate.trend)}%
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
              {metrics.validationPassRate.passedJobs}/{metrics.validationPassRate.totalJobs} jobs
            </span>
            <span className={`font-medium ${
              getMetricStatus(metrics.validationPassRate.value, metrics.validationPassRate.target) === 'success'
                ? 'text-green-600 dark:text-green-400'
                : 'text-yellow-600 dark:text-yellow-400'
            }`}>
              Target: {metrics.validationPassRate.target}%
            </span>
          </div>
        </button>

        {/* Fallback Rate */}
        <button
          onClick={() => handleMetricClick('fallback')}
          className={`rounded-xl border p-6 text-left transition-all hover:shadow-lg ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:border-blue-500' 
              : 'bg-white border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${
              getMetricStatus(metrics.fallbackRate.value, metrics.fallbackRate.target, true) === 'success'
                ? isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
                : getMetricStatus(metrics.fallbackRate.value, metrics.fallbackRate.target, true) === 'warning'
                ? isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'
                : isDarkMode ? 'bg-red-500/20' : 'bg-red-100'
            }`}>
              <AlertTriangle className={`w-6 h-6 ${
                getMetricStatus(metrics.fallbackRate.value, metrics.fallbackRate.target, true) === 'success'
                  ? isDarkMode ? 'text-green-400' : 'text-green-600'
                  : getMetricStatus(metrics.fallbackRate.value, metrics.fallbackRate.target, true) === 'warning'
                  ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                  : isDarkMode ? 'text-red-400' : 'text-red-600'
              }`} />
            </div>
            <ArrowUpRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          
          <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Fallback Rate
          </h3>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {metrics.fallbackRate.value}%
            </span>
            <span className={`inline-flex items-center gap-1 text-sm font-medium ${
              metrics.fallbackRate.trend > 0 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-green-600 dark:text-green-400'
            }`}>
              {metrics.fallbackRate.trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(metrics.fallbackRate.trend)}%
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
              {metrics.fallbackRate.fallbackJobs}/{metrics.fallbackRate.totalJobs} jobs
            </span>
            <span className={`font-medium ${
              getMetricStatus(metrics.fallbackRate.value, metrics.fallbackRate.target, true) === 'success'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              Target: {'<'}{metrics.fallbackRate.target}%
            </span>
          </div>
        </button>

        {/* Replan Speed */}
        <button
          onClick={() => handleMetricClick('replan-slow')}
          className={`rounded-xl border p-6 text-left transition-all hover:shadow-lg ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:border-blue-500' 
              : 'bg-white border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${
              metrics.replanSpeed.avgMinutes <= metrics.replanSpeed.target
                ? isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
                : metrics.replanSpeed.avgMinutes <= metrics.replanSpeed.target * 1.2
                ? isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'
                : isDarkMode ? 'bg-red-500/20' : 'bg-red-100'
            }`}>
              <Clock className={`w-6 h-6 ${
                metrics.replanSpeed.avgMinutes <= metrics.replanSpeed.target
                  ? isDarkMode ? 'text-green-400' : 'text-green-600'
                  : metrics.replanSpeed.avgMinutes <= metrics.replanSpeed.target * 1.2
                  ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                  : isDarkMode ? 'text-red-400' : 'text-red-600'
              }`} />
            </div>
            <ArrowUpRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          
          <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Avg Replan Speed
          </h3>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {metrics.replanSpeed.avgMinutes}
            </span>
            <span className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>min</span>
            <span className={`inline-flex items-center gap-1 text-sm font-medium ${
              metrics.replanSpeed.trend < 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {metrics.replanSpeed.trend < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              {Math.abs(metrics.replanSpeed.trend)}min
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
              p95: {metrics.replanSpeed.p95Minutes}min
            </span>
            <span className={`font-medium ${
              metrics.replanSpeed.avgMinutes <= metrics.replanSpeed.target
                ? 'text-green-600 dark:text-green-400'
                : 'text-yellow-600 dark:text-yellow-400'
            }`}>
              Target: {'<'}{metrics.replanSpeed.target}min
            </span>
          </div>
        </button>

        {/* Setup Clarity Rating */}
        <button
          onClick={() => handleMetricClick('setup-low')}
          className={`rounded-xl border p-6 text-left transition-all hover:shadow-lg ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:border-blue-500' 
              : 'bg-white border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${
              metrics.setupClarityRating.value >= metrics.setupClarityRating.target
                ? isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
                : metrics.setupClarityRating.value >= metrics.setupClarityRating.target * 0.9
                ? isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'
                : isDarkMode ? 'bg-red-500/20' : 'bg-red-100'
            }`}>
              <Star className={`w-6 h-6 ${
                metrics.setupClarityRating.value >= metrics.setupClarityRating.target
                  ? isDarkMode ? 'text-green-400' : 'text-green-600'
                  : metrics.setupClarityRating.value >= metrics.setupClarityRating.target * 0.9
                  ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                  : isDarkMode ? 'text-red-400' : 'text-red-600'
              }`} />
            </div>
            <ArrowUpRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          
          <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Setup Clarity Rating
          </h3>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {metrics.setupClarityRating.value}
            </span>
            <span className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>/5</span>
            <span className={`inline-flex items-center gap-1 text-sm font-medium ${
              metrics.setupClarityRating.trend > 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {metrics.setupClarityRating.trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(metrics.setupClarityRating.trend)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
              {metrics.setupClarityRating.totalRatings} ratings
            </span>
            <span className={`font-medium ${
              metrics.setupClarityRating.value >= metrics.setupClarityRating.target
                ? 'text-green-600 dark:text-green-400'
                : 'text-yellow-600 dark:text-yellow-400'
            }`}>
              Target: {metrics.setupClarityRating.target}/5
            </span>
          </div>
        </button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pass/Fail Trend */}
        <div className={`rounded-xl border p-6 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="mb-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Daily Pass/Fail Trend
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Validation outcomes over time
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={passFailTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                dataKey="date" 
                stroke={chartColors.text}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke={chartColors.text}
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="passed" 
                stackId="1"
                stroke={chartColors.success}
                fill={chartColors.success}
                fillOpacity={0.6}
                name="Passed"
              />
              <Area 
                type="monotone" 
                dataKey="failed" 
                stackId="1"
                stroke={chartColors.danger}
                fill={chartColors.danger}
                fillOpacity={0.6}
                name="Failed"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Fallback Rate by Job Type */}
        <div className={`rounded-xl border p-6 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="mb-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Fallback Rate by Job Type
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              AI fallback frequency across features
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fallbackByJobType} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                type="number" 
                stroke={chartColors.text}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                type="category" 
                dataKey="jobType" 
                stroke={chartColors.text}
                style={{ fontSize: '12px' }}
                width={120}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (!active || !payload || !payload[0]) return null;
                  const data = payload[0].payload;
                  return (
                    <div className={`rounded-lg border p-3 shadow-lg ${
                      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <p className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {data.jobType}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Fallback Rate: {data.fallbackRate}%
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {data.fallbacks}/{data.total} jobs
                      </p>
                    </div>
                  );
                }}
              />
              <Bar 
                dataKey="fallbackRate" 
                fill={chartColors.warning}
                radius={[0, 4, 4, 0]}
                name="Fallback Rate (%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Duration by Job Type */}
        <div className={`rounded-xl border p-6 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="mb-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Average Duration by Job Type
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              AI processing time in minutes
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={durationByJobType}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                dataKey="jobType" 
                stroke={chartColors.text}
                style={{ fontSize: '12px' }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke={chartColors.text}
                style={{ fontSize: '12px' }}
                label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { fill: chartColors.text } }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (!active || !payload || !payload[0]) return null;
                  const data = payload[0].payload;
                  return (
                    <div className={`rounded-lg border p-3 shadow-lg ${
                      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <p className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {data.jobType}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Avg: {data.avg}min
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        P50: {data.p50}min | P95: {data.p95}min
                      </p>
                    </div>
                  );
                }}
              />
              <Bar 
                dataKey="avg" 
                fill={chartColors.primary}
                radius={[4, 4, 0, 0]}
                name="Average Duration"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Setup Clarity Rating Trend */}
        <div className={`rounded-xl border p-6 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="mb-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Setup Clarity Rating Trend
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Operator feedback on setup guidance
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={clarityRatingTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                dataKey="date" 
                stroke={chartColors.text}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke={chartColors.text}
                style={{ fontSize: '12px' }}
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (!active || !payload || !payload[0]) return null;
                  const data = payload[0].payload;
                  return (
                    <div className={`rounded-lg border p-3 shadow-lg ${
                      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <p className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {data.date}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Rating: {data.rating}/5
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {data.count} ratings
                      </p>
                    </div>
                  );
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="rating" 
                stroke={chartColors.warning}
                strokeWidth={3}
                dot={{ fill: chartColors.warning, r: 5 }}
                activeDot={{ r: 7 }}
                name="Average Rating"
              />
              {/* Target line */}
              <Line 
                type="monotone" 
                dataKey={() => 4.5} 
                stroke={chartColors.success}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Target (4.5)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Info Card */}
      <div className={`rounded-xl border p-4 ${
        isDarkMode 
          ? 'bg-blue-500/10 border-blue-500/30' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-start gap-3">
          <Info className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
            Click any metric card to drill down into the Agent Jobs list with pre-applied filters. Use the time period selector to view historical trends.
          </p>
        </div>
      </div>
    </div>
  );
}