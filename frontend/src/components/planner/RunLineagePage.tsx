import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Eye, GitCompare, FileText, Clock, User, ArrowDown } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type RunStatus = 'draft' | 'pending' | 'running' | 'completed' | 'failed';

interface LineageNode {
  id: string;
  version: number;
  status: RunStatus;
  trigger: 'original' | 'reschedule';
  createdAt: string;
  createdBy: string;
  reason?: string;
  hasDraftReport: boolean;
}

const mockLineage: Record<string, LineageNode[]> = {
  'RUN-2401': [
    {
      id: 'RUN-2401',
      version: 1,
      status: 'completed',
      trigger: 'original',
      createdAt: '2026-01-01 06:00',
      createdBy: 'Ravi Rampaul',
      hasDraftReport: false,
    },
    {
      id: 'RUN-2412',
      version: 2,
      status: 'completed',
      trigger: 'reschedule',
      createdAt: '2026-01-01 08:30',
      createdBy: 'Ravi Rampaul',
      reason: 'Material shortage - supplier delayed delivery',
      hasDraftReport: true,
    },
    {
      id: 'RUN-2423',
      version: 3,
      status: 'running',
      trigger: 'reschedule',
      createdAt: '2026-01-01 11:15',
      createdBy: 'Ravi Rampaul',
      reason: 'Equipment breakdown on Line 3',
      hasDraftReport: true,
    },
  ],
  'RUN-2304': [
    {
      id: 'RUN-2304',
      version: 1,
      status: 'completed',
      trigger: 'original',
      createdAt: '2025-12-31 06:00',
      createdBy: 'Ravi Rampaul',
      hasDraftReport: false,
    },
    {
      id: 'RUN-2305',
      version: 2,
      status: 'completed',
      trigger: 'reschedule',
      createdAt: '2025-12-31 08:30',
      createdBy: 'Ravi Rampaul',
      reason: 'Quality issue detected in batch #4521',
      hasDraftReport: true,
    },
  ],
  'RUN-2209': [
    {
      id: 'RUN-2209',
      version: 1,
      status: 'failed',
      trigger: 'original',
      createdAt: '2025-12-30 14:00',
      createdBy: 'Ravi Rampaul',
      hasDraftReport: false,
    },
    {
      id: 'RUN-2210',
      version: 2,
      status: 'completed',
      trigger: 'reschedule',
      createdAt: '2025-12-30 15:30',
      createdBy: 'Ravi Rampaul',
      reason: 'Recovery from power outage',
      hasDraftReport: true,
    },
  ],
};

const statusConfig: Record<RunStatus, { label: string; color: string; bgColor: string; dotColor: string }> = {
  draft: { label: 'Draft', color: 'text-gray-700', bgColor: 'bg-gray-100', dotColor: 'bg-gray-400' },
  pending: { label: 'Pending', color: 'text-blue-700', bgColor: 'bg-blue-100', dotColor: 'bg-blue-500' },
  running: { label: 'Running', color: 'text-green-700', bgColor: 'bg-green-100', dotColor: 'bg-green-500' },
  completed: { label: 'Completed', color: 'text-gray-700', bgColor: 'bg-gray-200', dotColor: 'bg-gray-500' },
  failed: { label: 'Failed', color: 'text-red-700', bgColor: 'bg-red-100', dotColor: 'bg-red-500' },
};

export function RunLineagePage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { runId } = useParams<{ runId: string }>();
  
  const lineage = runId ? mockLineage[runId] || [] : [];

  if (lineage.length === 0) {
    return (
      <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <button
            onClick={() => navigate('/app/runs')}
            className={`flex items-center gap-2 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Runs</span>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>No lineage found for this run.</p>
            <button
              onClick={() => navigate('/app/runs')}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Return to runs list
            </button>
          </div>
        </div>
      </div>
    );
  }

  const originalRun = lineage[0];

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <button
          onClick={() => navigate('/app/runs')}
          className={`flex items-center gap-2 mb-4 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Runs</span>
        </button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Run Lineage</h1>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                {lineage.length} version{lineage.length !== 1 ? 's' : ''}
              </span>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Version history for <span className="font-mono text-blue-600">{originalRun.id}</span>
            </p>
          </div>

          <button
            onClick={() => navigate(`/app/runs/${originalRun.id}`)}
            className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            View Original
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className={`absolute left-6 lg:left-12 top-0 bottom-0 w-0.5 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />

            {/* Timeline Nodes */}
            <div className="space-y-8">
              {lineage.map((node, index) => {
                const status = statusConfig[node.status];
                const isLatest = index === lineage.length - 1;
                const parentNode = index > 0 ? lineage[index - 1] : null;

                return (
                  <div key={node.id} className="relative">
                    {/* Timeline Dot */}
                    <div className={`absolute left-6 lg:left-12 w-5 h-5 rounded-full transform -translate-x-1/2 ${status.dotColor} ${
                      isLatest ? 'ring-4 ring-opacity-30 ' + (status.dotColor.replace('bg-', 'ring-')) : ''
                    } ${isDarkMode ? 'border-4 border-gray-800' : 'border-4 border-white'}`} />

                    {/* Connector Arrow */}
                    {index > 0 && (
                      <div className="absolute left-6 lg:left-12 -top-6 transform -translate-x-1/2">
                        <ArrowDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                      </div>
                    )}

                    {/* Content Card */}
                    <div className="ml-16 lg:ml-24">
                      <div className={`border rounded-lg p-4 lg:p-6 transition-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:shadow-xl' : 'bg-white border-gray-200 hover:shadow-md'}`}>
                        {/* Header Row */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className={`font-mono ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{node.id}</h3>
                              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                                v{node.version}
                              </span>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${status.bgColor} ${status.color}`}>
                                {status.label}
                              </span>
                              {node.trigger === 'reschedule' && (
                                <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded">
                                  Reschedule
                                </span>
                              )}
                            </div>
                          </div>

                          {isLatest && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                              Latest
                            </span>
                          )}
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Created:</span>
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{node.createdAt}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <User className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>By:</span>
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{node.createdBy}</span>
                          </div>
                        </div>

                        {/* Reschedule Reason */}
                        {node.reason && (
                          <div className={`mb-4 p-3 border rounded-lg ${isDarkMode ? 'bg-orange-900/30 border-orange-800' : 'bg-orange-50 border-orange-200'}`}>
                            <p className={`text-sm ${isDarkMode ? 'text-orange-200' : 'text-orange-900'}`}>
                              <span className={isDarkMode ? 'text-orange-300' : 'text-orange-700'}>Reason:</span> {node.reason}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => navigate(`/app/runs/${node.id}`)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">View</span>
                          </button>

                          {parentNode && (
                            <button
                              onClick={() => navigate(`/app/runs/compare?a=${parentNode.id}&b=${node.id}`)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${isDarkMode ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-900/60' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                            >
                              <GitCompare className="w-4 h-4" />
                              <span className="text-sm">Compare to v{parentNode.version}</span>
                            </button>
                          )}

                          {node.hasDraftReport && (
                            <button
                              onClick={() => navigate(`/app/runs/${node.id}/impact-report`)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${isDarkMode ? 'bg-green-900/40 text-green-300 hover:bg-green-900/60' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                            >
                              <FileText className="w-4 h-4" />
                              <span className="text-sm">Draft Impact Report</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className={`mt-12 border rounded-lg p-4 lg:p-6 ${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
            <h3 className={`mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>Lineage Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>Total Versions:</span>
                <p className={`mt-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>{lineage.length}</p>
              </div>
              <div>
                <span className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>Reschedules:</span>
                <p className={`mt-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                  {lineage.filter(n => n.trigger === 'reschedule').length}
                </p>
              </div>
              <div>
                <span className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>Latest Status:</span>
                <p className={`mt-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                  {statusConfig[lineage[lineage.length - 1].status].label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}