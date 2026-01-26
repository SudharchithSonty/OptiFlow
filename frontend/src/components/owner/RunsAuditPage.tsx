import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Search,
  Filter,
  GitBranch,
  User,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronRight
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type RunStatus = 'draft' | 'pending' | 'completed' | 'archived';
type RunTrigger = 'baseline' | 'reschedule' | 'event' | 'manual';

interface RunRecord {
  id: string;
  name: string;
  trigger: RunTrigger;
  parentRunId: string | null;
  createdBy: string;
  createdAt: Date;
  status: RunStatus;
  hasDraftReport: boolean;
  childRuns?: string[];
}

const mockRuns: RunRecord[] = [
  {
    id: 'RUN-20260110-003',
    name: 'Run v3 (Breakdown Recovery)',
    trigger: 'event',
    parentRunId: 'RUN-20260110-002',
    createdBy: 'Ravi Rampaul',
    createdAt: new Date('2026-01-10T14:30:00'),
    status: 'completed',
    hasDraftReport: false,
  },
  {
    id: 'RUN-20260110-002',
    name: 'Run v2 (Rush Order)',
    trigger: 'reschedule',
    parentRunId: 'RUN-20260110-001',
    createdBy: 'Ravi Rampaul',
    createdAt: new Date('2026-01-10T09:15:00'),
    status: 'completed',
    hasDraftReport: true,
    childRuns: ['RUN-20260110-003'],
  },
  {
    id: 'RUN-20260110-001',
    name: 'Run v1 (Baseline)',
    trigger: 'baseline',
    parentRunId: null,
    createdBy: 'Ravi Rampaul',
    createdAt: new Date('2026-01-10T07:00:00'),
    status: 'completed',
    hasDraftReport: false,
    childRuns: ['RUN-20260110-002'],
  },
  {
    id: 'RUN-20260109-002',
    name: 'Run v2 (Material Delay)',
    trigger: 'event',
    parentRunId: 'RUN-20260109-001',
    createdBy: 'Ravi Rampaul',
    createdAt: new Date('2026-01-09T15:45:00'),
    status: 'completed',
    hasDraftReport: false,
  },
  {
    id: 'RUN-20260109-001',
    name: 'Run v1 (Baseline)',
    trigger: 'baseline',
    parentRunId: null,
    createdBy: 'Ravi Rampaul',
    createdAt: new Date('2026-01-09T07:00:00'),
    status: 'archived',
    hasDraftReport: false,
    childRuns: ['RUN-20260109-002'],
  },
];

export function RunsAuditPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RunStatus | 'all'>('all');
  const [triggerFilter, setTriggerFilter] = useState<RunTrigger | 'all'>('all');
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const filteredRuns = mockRuns.filter(run => {
    const matchesSearch = 
      run.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || run.status === statusFilter;
    const matchesTrigger = triggerFilter === 'all' || run.trigger === triggerFilter;
    
    return matchesSearch && matchesStatus && matchesTrigger;
  });

  const selectedRun = selectedRunId ? mockRuns.find(r => r.id === selectedRunId) : null;

  const getTriggerConfig = (trigger: RunTrigger) => {
    switch (trigger) {
      case 'baseline':
        return { label: 'Baseline', color: 'text-blue-700', bgColor: 'bg-blue-100' };
      case 'reschedule':
        return { label: 'Reschedule', color: 'text-purple-700', bgColor: 'bg-purple-100' };
      case 'event':
        return { label: 'Event', color: 'text-orange-700', bgColor: 'bg-orange-100' };
      case 'manual':
        return { label: 'Manual', color: 'text-gray-700', bgColor: 'bg-gray-100' };
    }
  };

  const getStatusConfig = (status: RunStatus) => {
    switch (status) {
      case 'draft':
        return { label: 'Draft', icon: FileText, color: 'text-gray-700', bgColor: 'bg-gray-100' };
      case 'pending':
        return { label: 'Pending', icon: Clock, color: 'text-yellow-700', bgColor: 'bg-yellow-100' };
      case 'completed':
        return { label: 'Completed', icon: CheckCircle2, color: 'text-green-700', bgColor: 'bg-green-100' };
      case 'archived':
        return { label: 'Archived', icon: AlertCircle, color: 'text-gray-700', bgColor: 'bg-gray-100' };
    }
  };

  const buildLineage = (runId: string): RunRecord[] => {
    const lineage: RunRecord[] = [];
    const run = mockRuns.find(r => r.id === runId);
    
    if (!run) return lineage;
    
    // Find all ancestors
    let current = run;
    while (current.parentRunId) {
      const parent = mockRuns.find(r => r.id === current.parentRunId);
      if (!parent) break;
      lineage.unshift(parent);
      current = parent;
    }
    
    // Add current run
    lineage.push(run);
    
    // Add children
    if (run.childRuns) {
      run.childRuns.forEach(childId => {
        const child = mockRuns.find(r => r.id === childId);
        if (child) lineage.push(child);
      });
    }
    
    return lineage;
  };

  const lineage = selectedRun ? buildLineage(selectedRun.id) : [];

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <GitBranch className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Runs Audit & History</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Track run lineage, triggers, and draft reports
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by run ID, name, or creator..."
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RunStatus | 'all')}
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>

          {/* Trigger Filter */}
          <select
            value={triggerFilter}
            onChange={(e) => setTriggerFilter(e.target.value as RunTrigger | 'all')}
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="all">All Triggers</option>
            <option value="baseline">Baseline</option>
            <option value="reschedule">Reschedule</option>
            <option value="event">Event</option>
            <option value="manual">Manual</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Runs List */}
          <div className={`border-r overflow-auto ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`px-4 sm:px-6 py-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {filteredRuns.length} run{filteredRuns.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredRuns.map(run => {
                const triggerConfig = getTriggerConfig(run.trigger);
                const statusConfig = getStatusConfig(run.status);
                const StatusIcon = statusConfig.icon;
                const isSelected = selectedRunId === run.id;

                return (
                  <button
                    key={run.id}
                    onClick={() => setSelectedRunId(run.id)}
                    className={`w-full p-4 sm:p-6 text-left transition-colors ${
                      isSelected 
                        ? isDarkMode ? 'bg-purple-900/30 border-l-4 border-purple-500' : 'bg-purple-50 border-l-4 border-purple-600'
                        : isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{run.name}</h3>
                          {run.hasDraftReport && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
                              Draft Report
                            </span>
                          )}
                        </div>
                        <p className={`text-sm font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{run.id}</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 flex-shrink-0 ${
                        isSelected ? (isDarkMode ? 'text-purple-400' : 'text-purple-600') : (isDarkMode ? 'text-gray-600' : 'text-gray-400')
                      }`} />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-flex px-2 py-1 rounded text-xs ${triggerConfig.bgColor} ${triggerConfig.color}`}>
                        {triggerConfig.label}
                      </span>
                      <span className={`inline-flex px-2 py-1 rounded text-xs ${statusConfig.bgColor} ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className={`space-y-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        <span>{run.createdBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{run.createdAt.toLocaleString()}</span>
                      </div>
                      {run.parentRunId && (
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-3 h-3" />
                          <span>Parent: {run.parentRunId}</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}

              {filteredRuns.length === 0 && (
                <div className="p-12 text-center">
                  <AlertCircle className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No runs match your filters</p>
                </div>
              )}
            </div>
          </div>

          {/* Lineage View */}
          <div className={`overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {selectedRun ? (
              <div className="p-4 sm:p-6">
                <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Run Lineage</h2>

                {/* Lineage Chain */}
                <div className="space-y-3">
                  {lineage.map((run, idx) => {
                    const triggerConfig = getTriggerConfig(run.trigger);
                    const statusConfig = getStatusConfig(run.status);
                    const StatusIcon = statusConfig.icon;
                    const isSelected = run.id === selectedRunId;

                    return (
                      <div key={run.id}>
                        <div 
                          className={`border-2 rounded-lg p-4 ${
                            isSelected 
                              ? isDarkMode ? 'bg-gray-800 border-purple-500 shadow-lg' : 'bg-white border-purple-600 shadow-md'
                              : isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`text-sm font-medium ${
                                  isSelected ? (isDarkMode ? 'text-purple-300' : 'text-purple-900') : (isDarkMode ? 'text-white' : 'text-gray-900')
                                }`}>
                                  {run.name}
                                </h4>
                                {isSelected && (
                                  <span className={`px-2 py-0.5 text-xs rounded ${isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                                    Selected
                                  </span>
                                )}
                              </div>
                              <p className={`text-xs font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{run.id}</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/app/runs/${run.id}`);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              View →
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs ${triggerConfig.bgColor} ${triggerConfig.color}`}>
                              {triggerConfig.label}
                            </span>
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs ${statusConfig.bgColor} ${statusConfig.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </span>
                            {run.hasDraftReport && (
                              <span className="inline-flex px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded items-center gap-1">
                                <FileText className="w-3 h-3" />
                                Draft Report
                              </span>
                            )}
                          </div>

                          <div className={`text-xs space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3" />
                              <span>{run.createdBy}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              <span>{run.createdAt.toLocaleString()}</span>
                            </div>
                          </div>

                          {run.hasDraftReport && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/app/runs/${run.id}/draft-assistant`);
                              }}
                              className="mt-3 w-full px-3 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm"
                            >
                              View Draft Report
                            </button>
                          )}
                        </div>

                        {/* Arrow */}
                        {idx < lineage.length - 1 && (
                          <div className="flex justify-center py-2">
                            <div className="flex flex-col items-center">
                              <div className={`w-0.5 h-4 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                              <div className={`w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${isDarkMode ? 'border-t-gray-600' : 'border-t-gray-300'}`}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Lineage Info */}
                <div className={`mt-6 border rounded-lg p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-medium">Lineage Summary:</span>
                  </p>
                  <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>• Total runs in chain: {lineage.length}</li>
                    <li>• Baseline run: {lineage[0]?.id}</li>
                    <li>• Latest run: {lineage[lineage.length - 1]?.id}</li>
                    <li>• Draft reports available: {lineage.filter(r => r.hasDraftReport).length}</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-12">
                <div className="text-center">
                  <GitBranch className={`w-16 h-16 mx-auto mb-3 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Select a run to view lineage</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}