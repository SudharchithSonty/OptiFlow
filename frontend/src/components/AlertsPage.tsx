import { useState } from 'react';
import { CheckCircle2, AlertTriangle, MessageSquare, Filter, Clock } from 'lucide-react';
import { mockAlerts, Alert } from '../types';
import { useDarkMode } from './DarkModeContext';

export function AlertsPage() {
  const { isDarkMode } = useDarkMode();
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'acknowledged' | 'unacknowledged'>('all');
  const [showAskAI, setShowAskAI] = useState<string | null>(null);

  const handleAcknowledge = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true, acknowledgedBy: 'Current User', acknowledgedAt: new Date().toISOString() }
        : alert
    ));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterStatus === 'acknowledged' && !alert.acknowledged) return false;
    if (filterStatus === 'unacknowledged' && alert.acknowledged) return false;
    return true;
  });

  const severityConfig = {
    critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
    high: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
    medium: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700' },
    low: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Alerts & Notifications</h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Manage production alerts and respond to critical events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`rounded-lg border p-4 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Alerts</p>
          <p className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{alerts.length}</p>
        </div>
        <div className={`rounded-lg border p-4 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Unacknowledged</p>
          <p className="text-2xl text-red-600">{alerts.filter(a => !a.acknowledged).length}</p>
        </div>
        <div className={`rounded-lg border p-4 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Critical</p>
          <p className="text-2xl text-orange-600">{alerts.filter(a => a.severity === 'critical').length}</p>
        </div>
        <div className={`rounded-lg border p-4 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Acknowledged</p>
          <p className="text-2xl text-green-600">{alerts.filter(a => a.acknowledged).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-lg border p-4 mb-6 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Filter className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Status</option>
              <option value="unacknowledged">Unacknowledged</option>
              <option value="acknowledged">Acknowledged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const config = severityConfig[alert.severity];
            
            return (
              <div
                key={alert.id}
                className={`rounded-lg border-2 p-4 lg:p-6 transition-all duration-200 hover:shadow-lg ${
                  !alert.acknowledged 
                    ? config.border + ' ' + config.bg 
                    : isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
                    <AlertTriangle className={`w-6 h-6 ${config.text}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>{alert.title}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded ${config.badge}`}>
                            {alert.severity}
                          </span>
                          {alert.machine && (
                            <span className={`px-2 py-0.5 text-xs rounded ${
                              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {alert.machine}
                            </span>
                          )}
                          {alert.order && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                              {alert.order}
                            </span>
                          )}
                        </div>
                        <p className={isDarkMode ? 'text-gray-300 mb-2' : 'text-gray-700 mb-2'}>{alert.description}</p>
                        <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          <Clock className="w-4 h-4" />
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      {alert.acknowledged && (
                        <div className="flex-shrink-0">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                      )}
                    </div>

                    {/* Acknowledgement Info */}
                    {alert.acknowledged && alert.acknowledgedBy && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          Acknowledged by <span>{alert.acknowledgedBy}</span> at{' '}
                          {new Date(alert.acknowledgedAt!).toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    {!alert.acknowledged && (
                      <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <button
                          onClick={() => handleAcknowledge(alert.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Acknowledge
                        </button>
                        <button
                          onClick={() => setShowAskAI(alert.id)}
                          className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg ${
                            isDarkMode
                              ? 'border-gray-600 hover:bg-gray-700'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <MessageSquare className="w-4 h-4" />
                          Ask Why
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={`rounded-lg border p-12 text-center ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No alerts matching your filters</p>
          </div>
        )}
      </div>

      {/* Ask AI Dialog */}
      {showAskAI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg max-w-lg w-full p-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Ask AI About This Alert</h3>
            </div>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Get AI-powered insights and recommendations for this alert.
            </p>
            
            {/* Mock AI Response */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900 mb-2">
                <strong>AI Analysis:</strong>
              </p>
              <p className="text-sm text-blue-800">
                This machine breakdown was likely caused by wear on the spindle bearing, which was nearing 
                its maintenance interval. The breakdown impacts Order O003 scheduled for tomorrow. 
                Recommended actions: 1) Expedite spare parts delivery, 2) Reschedule O003 to Machine M3, 
                3) Update preventive maintenance schedule.
              </p>
            </div>

            <button
              onClick={() => setShowAskAI(null)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}