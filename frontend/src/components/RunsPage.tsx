import { useState } from 'react';
import { Plus, Filter, Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { mockRuns, Run } from '../types';
import { useDarkMode } from './DarkModeContext';

export function RunsPage() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Group runs by base ID to show versions together
  const groupedRuns = mockRuns.reduce((acc, run) => {
    const baseId = run.id.split('-v')[0];
    if (!acc[baseId]) {
      acc[baseId] = [];
    }
    acc[baseId].push(run);
    return acc;
  }, {} as Record<string, Run[]>);

  const filteredGroups = Object.entries(groupedRuns).filter(([_, runs]) => {
    const latestRun = runs.sort((a, b) => b.version - a.version)[0];
    if (filterStatus !== 'all' && latestRun.status !== filterStatus) return false;
    if (searchQuery && !latestRun.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Production Runs</h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Manage and create production schedules</p>
        </div>
        <button
          onClick={() => {/* Create new run logic */}}
          className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">New Run</span>
        </button>
      </div>

      {/* Filters */}
      <div className={`rounded-lg border p-4 mb-6 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search runs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="generating">Generating</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Runs List */}
      <div className="space-y-4">
        {filteredGroups.map(([baseId, runs]) => {
          const latestRun = runs.sort((a, b) => b.version - a.version)[0];
          const hasMultipleVersions = runs.length > 1;

          return (
            <div key={baseId} className={`rounded-lg border overflow-hidden transition-all duration-200 hover:shadow-lg ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              {/* Latest Version */}
              <div
                onClick={() => navigate(`/runs/${latestRun.id}`)}
                className={`p-4 lg:p-6 cursor-pointer transition-colors ${
                  isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                        {latestRun.shiftDate} - Shift {latestRun.shift}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-50 text-blue-700'
                      }`}>
                        v{latestRun.version}
                      </span>
                      {hasMultipleVersions && (
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {runs.length} version{runs.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {latestRun.orders.length} order{latestRun.orders.length > 1 ? 's' : ''} · {latestRun.machines.length} machine{latestRun.machines.length > 1 ? 's' : ''}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      latestRun.status === 'scheduled' ? 'bg-green-50 text-green-700' :
                      latestRun.status === 'generating' ? 'bg-yellow-50 text-yellow-700' :
                      latestRun.status === 'completed' ? 'bg-blue-50 text-blue-700' :
                      latestRun.status === 'failed' ? 'bg-red-50 text-red-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {latestRun.status}
                    </span>
                  </div>

                  {latestRun.metrics && (
                    <div className="hidden lg:flex gap-6 ml-6">
                      <div className="text-center">
                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>OEE</p>
                        <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{latestRun.metrics.oee}%</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>OTD</p>
                        <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{latestRun.metrics.otd}%</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Utilization</p>
                        <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{latestRun.metrics.utilization}%</p>
                      </div>
                    </div>
                  )}

                  <ArrowRight className={`w-5 h-5 ml-4 flex-shrink-0 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                </div>

                {/* Orders Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {latestRun.orders.slice(0, 2).map((order) => (
                    <div key={order.id} className={`flex items-center justify-between text-sm p-2 rounded ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          order.priority === 'rush' ? 'bg-red-500' :
                          order.priority === 'high' ? 'bg-orange-500' :
                          'bg-blue-500'
                        }`} />
                        <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{order.orderNumber}</span>
                        <span className={`hidden sm:inline ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>· {order.product}</span>
                      </div>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{order.assignedMachine}</span>
                    </div>
                  ))}
                </div>

                {latestRun.orders.length > 2 && (
                  <p className={`text-xs text-center mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    +{latestRun.orders.length - 2} more order{latestRun.orders.length - 2 > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Version History (Collapsed) */}
              {hasMultipleVersions && runs.length > 1 && (
                <details className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <summary className={`px-4 lg:px-6 py-3 text-sm cursor-pointer transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-750 text-gray-400 hover:bg-gray-700'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}>
                    View {runs.length - 1} previous version{runs.length - 1 > 1 ? 's' : ''}
                  </summary>
                  <div className={`p-4 lg:p-6 space-y-2 ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                    {runs
                      .sort((a, b) => b.version - a.version)
                      .slice(1)
                      .map((run) => (
                        <div
                          key={run.id}
                          onClick={() => navigate(`/runs/${run.id}`)}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                            isDarkMode
                              ? 'bg-gray-800 border-gray-700 hover:border-blue-500'
                              : 'bg-white border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 text-xs rounded ${
                              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                              v{run.version}
                            </span>
                            <div>
                              <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {run.orders.length} order{run.orders.length > 1 ? 's' : ''}
                              </p>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Created {new Date(run.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded ${
                            run.status === 'completed' ? 'bg-blue-50 text-blue-700' : 
                            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {run.status}
                          </span>
                        </div>
                      ))}
                  </div>
                </details>
              )}
            </div>
          );
        })}

        {filteredGroups.length === 0 && (
          <div className={`rounded-lg border p-12 text-center ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <p className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>No runs found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}