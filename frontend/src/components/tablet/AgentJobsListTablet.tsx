import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  Download,
  ChevronDown
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';
import { TabletLayout } from './TabletLayout';

interface AgentJobsListTabletProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

interface Job {
  id: string;
  type: string;
  status: 'success' | 'failed' | 'running';
  startTime: string;
  duration: string;
  user: string;
  runId?: string;
}

export function AgentJobsListTablet({ userRole = 'supervisor' }: AgentJobsListTabletProps) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const jobs: Job[] = [
    { id: 'AJ-98347', type: 'Setup guidance', status: 'success', startTime: 'Jan 25, 2:15 PM', duration: '1.4s', user: 'Priya Patel', runId: 'RUN-2402' },
    { id: 'AJ-98346', type: 'Brief generation', status: 'success', startTime: 'Jan 25, 2:10 PM', duration: '2.1s', user: 'Ravi Rampaul', runId: 'RUN-2402' },
    { id: 'AJ-98345', type: 'Q&A', status: 'failed', startTime: 'Jan 25, 1:58 PM', duration: '0.8s', user: 'Priya Patel' },
    { id: 'AJ-98344', type: 'Setup guidance', status: 'success', startTime: 'Jan 25, 1:42 PM', duration: '1.7s', user: 'Priya Patel', runId: 'RUN-2401' },
    { id: 'AJ-98343', type: 'Run comparison', status: 'success', startTime: 'Jan 25, 1:30 PM', duration: '3.2s', user: 'Ravi Rampaul', runId: 'RUN-2402' },
    { id: 'AJ-98342', type: 'Setup guidance', status: 'success', startTime: 'Jan 25, 1:15 PM', duration: '1.5s', user: 'Priya Patel', runId: 'RUN-2401' },
    { id: 'AJ-98341', type: 'Brief generation', status: 'success', startTime: 'Jan 25, 12:45 PM', duration: '2.3s', user: 'Ravi Rampaul', runId: 'RUN-2401' },
    { id: 'AJ-98340', type: 'Q&A', status: 'success', startTime: 'Jan 25, 12:30 PM', duration: '1.1s', user: 'Priya Patel' },
    { id: 'AJ-98339', type: 'Setup guidance', status: 'failed', startTime: 'Jan 25, 12:10 PM', duration: '0.6s', user: 'Priya Patel', runId: 'RUN-2400' },
    { id: 'AJ-98338', type: 'Run comparison', status: 'success', startTime: 'Jan 25, 11:55 AM', duration: '2.8s', user: 'Ravi Rampaul', runId: 'RUN-2401' },
    { id: 'AJ-98337', type: 'Brief generation', status: 'success', startTime: 'Jan 25, 11:30 AM', duration: '2.0s', user: 'Ravi Rampaul', runId: 'RUN-2400' },
    { id: 'AJ-98336', type: 'Q&A', status: 'success', startTime: 'Jan 25, 11:10 AM', duration: '1.3s', user: 'Priya Patel' },
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesType = typeFilter === 'all' || job.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const jobTypes = ['all', ...Array.from(new Set(jobs.map(j => j.type)))];
  
  const stats = {
    total: jobs.length,
    success: jobs.filter(j => j.status === 'success').length,
    failed: jobs.filter(j => j.status === 'failed').length,
    successRate: ((jobs.filter(j => j.status === 'success').length / jobs.length) * 100).toFixed(1)
  };

  return (
    <TabletLayout userRole={userRole}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Agent jobs
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            History of AI assistant operations
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className={`p-2.5 rounded-lg border text-center ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {stats.total}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Total
            </div>
          </div>
          <div className={`p-2.5 rounded-lg border text-center ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="text-lg font-bold text-green-600">
              {stats.success}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Success
            </div>
          </div>
          <div className={`p-2.5 rounded-lg border text-center ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="text-lg font-bold text-red-600">
              {stats.failed}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Failed
            </div>
          </div>
          <div className={`p-2.5 rounded-lg border text-center ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {stats.successRate}%
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Rate
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition-colors ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
            }`}
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={`text-xs font-medium mb-1.5 block ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className={`text-xs font-medium mb-1.5 block ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All types</option>
              {jobTypes.filter(t => t !== 'all').map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
          </span>
          <button
            className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Jobs List */}
        <div className="space-y-2">
          {filteredJobs.map((job) => (
            <button
              key={job.id}
              onClick={() => navigate(`/app/agent/jobs/${job.id}`)}
              className={`w-full p-3 rounded-lg border text-left transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 active:bg-gray-700' 
                  : 'bg-white border-gray-200 active:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-600">
                  {job.id}
                </span>
                {job.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : job.status === 'failed' ? (
                  <XCircle className="w-4 h-4 text-red-600" />
                ) : (
                  <Clock className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                )}
              </div>
              
              <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {job.type}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {job.user}
                  </span>
                  {job.runId && (
                    <>
                      <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {job.runId}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
                    {job.duration}
                  </span>
                  <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
                    {job.startTime}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filteredJobs.length === 0 && (
          <div className={`p-8 rounded-lg border text-center ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No jobs found matching your filters
            </p>
          </div>
        )}
      </div>
    </TabletLayout>
  );
}