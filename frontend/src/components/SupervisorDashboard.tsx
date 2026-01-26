import { AlertTriangle, Clock, CheckCircle2, Play, MessageSquare, Map, GitBranch, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { mockRuns, mockAlerts, mockOrders } from '../types';
import { useDarkMode } from './DarkModeContext';

export function SupervisorDashboard() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const todayDate = '2026-01-02';
  const currentShift = 'A';
  
  const currentRun = mockRuns.find(
    r => r.shiftDate === todayDate && r.shift === currentShift && r.status === 'scheduled'
  );

  const activeOrders = currentRun ? currentRun.orders.filter(o => o.status === 'in-progress') : [];
  const pendingOrders = currentRun ? currentRun.orders.filter(o => o.status === 'pending') : [];
  const recentAlerts = mockAlerts.slice(0, 3);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-gray-900 dark:text-gray-100">Shopfloor Dashboard</h1>
          <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
            <span className="text-sm font-semibold">Shift {currentShift}</span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Today's production plan and active tasks</p>
      </div>

      {/* Current Time & Status */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 dark:text-blue-200 mb-1">Current Time</p>
            <p className="text-2xl lg:text-3xl font-bold">10:45 AM</p>
            <p className="text-blue-100 dark:text-blue-200 mt-2">Thursday, January 2, 2026</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 dark:text-blue-200 mb-1">Shift Progress</p>
            <p className="text-2xl lg:text-3xl font-bold">2h 45m</p>
            <p className="text-blue-100 dark:text-blue-200 mt-2">of 8 hours</p>
          </div>
        </div>
        <div className="mt-4 h-2 bg-blue-800 dark:bg-blue-900 rounded-full overflow-hidden">
          <div className="h-full bg-white dark:bg-blue-100 rounded-full transition-all duration-500" style={{ width: '34%' }} />
        </div>
      </div>

      {/* Critical Alerts */}
      {recentAlerts.filter(a => !a.acknowledged && a.severity === 'critical').length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-red-900 dark:text-red-200 mb-2 font-semibold">Critical Alert</h3>
              {recentAlerts.filter(a => !a.acknowledged && a.severity === 'critical').map(alert => (
                <div key={alert.id} className="mb-3">
                  <p className="text-red-800 dark:text-red-300 mb-1 font-medium">{alert.title}</p>
                  <p className="text-sm text-red-700 dark:text-red-400">{alert.description}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/app/alerts')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex-shrink-0 transition-colors"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Active Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 mb-6 hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900 dark:text-gray-100 font-semibold">Active Orders</h2>
          <span className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-lg font-medium">
            {activeOrders.length} In Progress
          </span>
        </div>
        
        {activeOrders.length > 0 ? (
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <div key={order.id} className="border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Play className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <h3 className="text-gray-900 dark:text-gray-100 font-semibold">{order.orderNumber}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        order.priority === 'rush' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                        order.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      }`}>
                        {order.priority}
                      </span>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100 mb-1">{order.product}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quantity: {order.quantity} · Machine: {order.assignedMachine}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">45 / {order.quantity}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500" style={{ width: '30%' }} />
                  </div>
                </div>

                {/* Timing */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Started</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">08:00 AM</p>
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Est. Completion</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">02:05 PM</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Complete
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors dark:text-gray-200">
                    <MessageSquare className="w-4 h-4" />
                    Ask Why
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
            <p>No active orders at the moment</p>
          </div>
        )}
      </div>

      {/* Pending Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 mb-6 hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-gray-900 dark:text-gray-100 mb-4 font-semibold">Pending Orders</h2>
        {pendingOrders.length > 0 ? (
          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all bg-white dark:bg-gray-700/50 hover:border-blue-300 dark:hover:border-blue-500">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.product}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{order.scheduledStart?.split('T')[1].slice(0, 5)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">All orders are active or completed</p>
        )}
      </div>

      {/* Recent Alerts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900 dark:text-gray-100 font-semibold">Recent Alerts</h2>
          <button
            onClick={() => navigate('/app/alerts')}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            View All →
          </button>
        </div>
        <div className="space-y-3">
          {recentAlerts.map((alert) => (
            <div key={alert.id} className={`p-3 rounded-lg border transition-all ${
              !alert.acknowledged 
                ? 'border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20' 
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${
                      alert.severity === 'critical' ? 'bg-red-500' :
                      alert.severity === 'high' ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }`} />
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{alert.title}</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{alert.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                {alert.acknowledged && (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 ml-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}