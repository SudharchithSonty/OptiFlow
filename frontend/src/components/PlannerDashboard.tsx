import { Plus, Calendar, TrendingUp, AlertCircle, Clock, CheckCircle2, Map, GitBranch, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { mockRuns, mockAlerts } from '../types';

export function PlannerDashboard() {
  const navigate = useNavigate();
  const todayRuns = mockRuns.filter(r => r.shiftDate === '2026-01-02');
  const upcomingRuns = mockRuns.filter(r => r.shiftDate > '2026-01-02');
  const unacknowledgedAlerts = mockAlerts.filter(a => !a.acknowledged);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900 dark:text-gray-100 mb-2">Planning Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage production runs and schedules</p>
        </div>
        <button
          onClick={() => navigate('/app/runs/create')}
          className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Create Run</span>
        </button>
      </div>

      {/* Alert Banner */}
      {unacknowledgedAlerts.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-yellow-900 dark:text-yellow-200 mb-1 font-semibold">Action Required</h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                {unacknowledgedAlerts.length} unacknowledged alert{unacknowledgedAlerts.length > 1 ? 's' : ''} require attention
              </p>
            </div>
            <button
              onClick={() => navigate('/app/alerts')}
              className="px-3 py-1.5 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
            >
              View
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Today's Runs</p>
          </div>
          <p className="text-2xl text-gray-900 dark:text-gray-100 font-bold">{todayRuns.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
          </div>
          <p className="text-2xl text-gray-900 dark:text-gray-100 font-bold">
            {mockRuns.filter(r => r.status === 'scheduled').length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Generating</p>
          </div>
          <p className="text-2xl text-gray-900 dark:text-gray-100 font-bold">
            {mockRuns.filter(r => r.status === 'generating').length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Utilization</p>
          </div>
          <p className="text-2xl text-gray-900 dark:text-gray-100 font-bold">82%</p>
        </div>
      </div>

      {/* Today's Runs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 mb-6 hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900 dark:text-gray-100 font-semibold">Today's Production Runs</h2>
          <button
            onClick={() => navigate('/app/schedule')}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            View Schedule →
          </button>
        </div>
        <div className="space-y-3">
          {todayRuns.map((run) => (
            <div
              key={run.id}
              onClick={() => navigate(`/runs/${run.id}`)}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-700/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-gray-900 dark:text-gray-100 font-semibold">Shift {run.shift}</h3>
                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                      v{run.version}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      run.status === 'scheduled' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                      run.status === 'generating' ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                      'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {run.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {run.orders.length} order{run.orders.length > 1 ? 's' : ''} · {run.machines.length} machine{run.machines.length > 1 ? 's' : ''}
                  </p>
                </div>
                {run.metrics && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">OEE</p>
                    <p className="text-gray-900 dark:text-gray-100 font-semibold">{run.metrics.oee}%</p>
                  </div>
                )}
              </div>

              {/* Orders Preview */}
              <div className="space-y-2">
                {run.orders.slice(0, 2).map((order) => (
                  <div key={order.id} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-600/50 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        order.priority === 'rush' ? 'bg-red-500' :
                        order.priority === 'high' ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`} />
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{order.orderNumber}</span>
                      <span className="text-gray-600 dark:text-gray-400">· {order.product}</span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">{order.assignedMachine}</span>
                  </div>
                ))}
                {run.orders.length > 2 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    +{run.orders.length - 2} more order{run.orders.length - 2 > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Runs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-gray-900 dark:text-gray-100 mb-4 font-semibold">Upcoming Runs</h2>
        <div className="space-y-3">
          {upcomingRuns.length > 0 ? (
            upcomingRuns.slice(0, 3).map((run) => (
              <div
                key={run.id}
                onClick={() => navigate(`/runs/${run.id}`)}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 dark:bg-gray-600 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{run.shiftDate} - Shift {run.shift}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {run.orders.length} order{run.orders.length > 1 ? 's' : ''} · {run.status}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                  v{run.version}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No upcoming runs scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
}