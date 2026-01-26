import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Filter, X, Calendar, ChevronDown, Eye, GitBranch, RotateCcw, Trash2, Search } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type RunStatus = 'draft' | 'pending' | 'running' | 'completed' | 'failed';
type Shift = 'A' | 'B' | 'C';
type TriggerType = 'original' | 'reschedule';

interface Run {
  id: string;
  date: string;
  shift: Shift;
  status: RunStatus;
  createdAt: string;
  createdBy: string;
  trigger: TriggerType;
  parentRunId?: string;
  hasChildren: boolean;
  version: number;
}

const mockRuns: Run[] = [
  // Today
  { id: 'RUN-2401', date: '2026-01-01', shift: 'A', status: 'completed', createdAt: '2026-01-01 06:00', createdBy: 'Ravi Rampaul', trigger: 'original', hasChildren: true, version: 1 },
  { id: 'RUN-2402', date: '2026-01-01', shift: 'B', status: 'running', createdAt: '2026-01-01 14:00', createdBy: 'Ravi Rampaul', trigger: 'original', hasChildren: false, version: 1 },
  { id: 'RUN-2403', date: '2026-01-01', shift: 'C', status: 'pending', createdAt: '2026-01-01 18:00', createdBy: 'Ravi Rampaul', trigger: 'original', hasChildren: false, version: 1 },
  
  // Yesterday - with reschedules
  { id: 'RUN-2304', date: '2025-12-31', shift: 'A', status: 'completed', createdAt: '2025-12-31 06:00', createdBy: 'Ravi Rampaul', trigger: 'original', hasChildren: true, version: 1 },
  { id: 'RUN-2305', date: '2025-12-31', shift: 'A', status: 'completed', createdAt: '2025-12-31 08:30', createdBy: 'Amit Mishra', trigger: 'reschedule', parentRunId: 'RUN-2304', hasChildren: false, version: 2 },
  { id: 'RUN-2306', date: '2025-12-31', shift: 'B', status: 'completed', createdAt: '2025-12-31 14:00', createdBy: 'Ravi Rampaul', trigger: 'original', hasChildren: false, version: 1 },
  { id: 'RUN-2307', date: '2025-12-31', shift: 'C', status: 'completed', createdAt: '2025-12-31 22:00', createdBy: 'Ravi Rampaul', trigger: 'original', hasChildren: false, version: 1 },
  
  // 2 days ago
  { id: 'RUN-2208', date: '2025-12-30', shift: 'A', status: 'completed', createdAt: '2025-12-30 06:00', createdBy: 'Ravi Rampaul', trigger: 'original', hasChildren: false, version: 1 },
  { id: 'RUN-2209', date: '2025-12-30', shift: 'B', status: 'failed', createdAt: '2025-12-30 14:00', createdBy: 'Ravi Rampaul', trigger: 'original', hasChildren: true, version: 1 },
  { id: 'RUN-2210', date: '2025-12-30', shift: 'B', status: 'completed', createdAt: '2025-12-30 15:30', createdBy: 'Amit Mishra', trigger: 'reschedule', parentRunId: 'RUN-2209', hasChildren: false, version: 2 },
  { id: 'RUN-2211', date: '2025-12-30', shift: 'C', status: 'completed', createdAt: '2025-12-30 22:00', createdBy: 'Ravi Rampaul', trigger: 'original', hasChildren: false, version: 1 },
];

const statusConfig: Record<RunStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Draft', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  pending: { label: 'Pending', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  running: { label: 'Running', color: 'text-green-700', bgColor: 'bg-green-100' },
  completed: { label: 'Completed', color: 'text-gray-700', bgColor: 'bg-gray-200' },
  failed: { label: 'Failed', color: 'text-red-700', bgColor: 'bg-red-100' },
};

export function RunsListPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [runs] = useState<Run[]>(mockRuns);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterShift, setFilterShift] = useState<Shift | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<RunStatus | 'all'>('all');
  const [filterTrigger, setFilterTrigger] = useState<TriggerType | 'all'>('all');
  const [filterCreatedBy, setFilterCreatedBy] = useState('all');

  // Group runs by date
  const groupedRuns = runs.reduce((acc, run) => {
    if (!acc[run.date]) {
      acc[run.date] = [];
    }
    acc[run.date].push(run);
    return acc;
  }, {} as Record<string, Run[]>);

  // Sort dates descending
  const sortedDates = Object.keys(groupedRuns).sort((a, b) => b.localeCompare(a));

  // Filter runs
  const filteredRuns = (runs: Run[]) => {
    return runs.filter(run => {
      if (searchQuery && !run.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterShift !== 'all' && run.shift !== filterShift) return false;
      if (filterStatus !== 'all' && run.status !== filterStatus) return false;
      if (filterTrigger !== 'all' && run.trigger !== filterTrigger) return false;
      if (filterCreatedBy !== 'all' && run.createdBy !== filterCreatedBy) return false;
      return true;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date('2026-01-01');
    const yesterday = new Date('2025-12-31');
    
    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const activeFilterCount = [
    filterShift !== 'all',
    filterStatus !== 'all',
    filterTrigger !== 'all',
    filterCreatedBy !== 'all',
    dateRange.start || dateRange.end
  ].filter(Boolean).length;

  const handleCreateReschedule = (run: Run) => {
    navigate('/app/runs/create', { state: { parentRun: run, isReschedule: true } });
  };

  const handleViewLineage = (run: Run) => {
    navigate(`/app/runs/${run.id}/lineage`);
  };

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Production Runs</h1>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage production scheduling and execution</p>
          </div>
          <button
            onClick={() => navigate('/app/runs/create')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Create Run</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>

        {/* Search & Filters Row */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search run ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : isDarkMode
                  ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className={`mt-4 p-4 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Shift</label>
                <select
                  value={filterShift}
                  onChange={(e) => setFilterShift(e.target.value as Shift | 'all')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="all">All Shifts</option>
                  <option value="A">Shift A</option>
                  <option value="B">Shift B</option>
                  <option value="C">Shift C</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as RunStatus | 'all')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="running">Running</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Trigger</label>
                <select
                  value={filterTrigger}
                  onChange={(e) => setFilterTrigger(e.target.value as TriggerType | 'all')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="all">All Triggers</option>
                  <option value="original">Original</option>
                  <option value="reschedule">Reschedule</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Created By</label>
                <select
                  value={filterCreatedBy}
                  onChange={(e) => setFilterCreatedBy(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="all">All Users</option>
                  <option value="Ravi Rampaul">Ravi Rampaul</option>
                  <option value="Amit Mishra">Amit Mishra</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date Range</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => {
                    setFilterShift('all');
                    setFilterStatus('all');
                    setFilterTrigger('all');
                    setFilterCreatedBy('all');
                    setDateRange({ start: '', end: '' });
                  }}
                  className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Runs List */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
        {sortedDates.map((date) => {
          const dateRuns = filteredRuns(groupedRuns[date]);
          if (dateRuns.length === 0) return null;

          return (
            <div key={date} className="mb-8">
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-4">
                <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>{formatDate(date)}</h2>
                <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{date}</span>
              </div>

              {/* Runs Table */}
              <div className={`rounded-lg border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className={`border-b ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                      <tr>
                        <th className={`px-4 py-3 text-left text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                        <th className={`px-4 py-3 text-left text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Shift</th>
                        <th className={`px-4 py-3 text-left text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Run ID</th>
                        <th className={`px-4 py-3 text-left text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Created</th>
                        <th className={`px-4 py-3 text-left text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Created By</th>
                        <th className={`px-4 py-3 text-left text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Trigger</th>
                        <th className={`px-4 py-3 text-left text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Parent</th>
                        <th className={`px-4 py-3 text-right text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {dateRuns.map((run) => {
                        const status = statusConfig[run.status];
                        return (
                          <tr key={run.id} className={`transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 text-xs rounded-full ${status.bgColor} ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded">
                                {run.shift}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => navigate(`/app/runs/${run.id}`)}
                                className="text-sm text-blue-600 hover:text-blue-700 font-mono"
                              >
                                {run.id}
                              </button>
                            </td>
                            <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{run.createdAt}</td>
                            <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{run.createdBy}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 text-xs rounded ${
                                run.trigger === 'original' 
                                  ? 'bg-gray-100 text-gray-700' 
                                  : 'bg-orange-100 text-orange-700'
                              }`}>
                                {run.trigger}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {run.parentRunId ? (
                                <button
                                  onClick={() => navigate(`/app/runs/${run.parentRunId}`)}
                                  className={`text-sm font-mono ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}
                                >
                                  {run.parentRunId}
                                </button>
                              ) : (
                                <span className={`text-sm ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>—</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => navigate(`/app/runs/${run.id}`)}
                                  className={`p-1.5 rounded transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-gray-600 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                                  title="View run details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {run.hasChildren && (
                                  <button
                                    onClick={() => handleViewLineage(run)}
                                    className={`p-1.5 rounded transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-gray-600 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                                    title="View run lineage and versions"
                                  >
                                    <GitBranch className="w-4 h-4" />
                                  </button>
                                )}
                                {run.status === 'completed' && (
                                  <button
                                    onClick={() => handleCreateReschedule(run)}
                                    className={`p-1.5 rounded transition-colors ${isDarkMode ? 'text-orange-400 hover:bg-orange-900/30 hover:text-orange-300' : 'text-orange-600 hover:bg-orange-50 hover:text-orange-700'}`}
                                    title="Create reschedule from this run"
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  className={`p-1.5 rounded transition-colors ${isDarkMode ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300' : 'text-red-600 hover:bg-red-50 hover:text-red-700'}`}
                                  title="Delete run"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Tablet/Mobile Cards */}
                <div className={`lg:hidden divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {dateRuns.map((run) => {
                    const status = statusConfig[run.status];
                    return (
                      <div key={run.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-lg">
                              {run.shift}
                            </span>
                            <div>
                              <button
                                onClick={() => navigate(`/app/runs/${run.id}`)}
                                className="text-blue-600 hover:text-blue-700 font-mono"
                              >
                                {run.id}
                              </button>
                              <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{run.createdAt}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${status.bgColor} ${status.color}`}>
                            {status.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                          <div>
                            <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Created by:</span>
                            <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{run.createdBy}</p>
                          </div>
                          <div>
                            <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Trigger:</span>
                            <p className={run.trigger === 'original' ? (isDarkMode ? 'text-gray-300' : 'text-gray-700') : 'text-orange-700'}>
                              {run.trigger}
                            </p>
                          </div>
                        </div>

                        {run.parentRunId && (
                          <div className="mb-3 text-sm">
                            <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Parent run:</span>
                            <button
                              onClick={() => navigate(`/app/runs/${run.parentRunId}`)}
                              className="ml-2 text-blue-600 hover:text-blue-700 font-mono"
                            >
                              {run.parentRunId}
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/app/runs/${run.id}`)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                          {run.hasChildren && (
                            <button
                              onClick={() => handleViewLineage(run)}
                              className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                              title="View Lineage"
                            >
                              <GitBranch className="w-5 h-5" />
                            </button>
                          )}
                          {run.status === 'completed' && (
                            <button
                              onClick={() => handleCreateReschedule(run)}
                              className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-orange-900/30 text-orange-400 hover:bg-orange-900/50' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'}`}
                              title="Reschedule"
                            >
                              <RotateCcw className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {sortedDates.length === 0 && (
          <div className="text-center py-12">
            <p className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>No runs found. Create your first production run to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}