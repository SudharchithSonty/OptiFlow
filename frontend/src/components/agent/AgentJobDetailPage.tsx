import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ChevronRight,
  CheckCircle2,
  Clock,
  Zap,
  FileText,
  ExternalLink,
  Copy,
  Download,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Play,
  AlertTriangle,
  Settings,
  Database,
  Shield,
  Activity
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface AgentJobDetailPageProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

type TabType = 'summary' | 'inputs' | 'outputs' | 'validation' | 'evidence' | 'logs';

// Mock job data
const jobData = {
  id: 'AJ-98320',
  status: 'completed' as const,
  jobType: 'Shift Brief',
  trigger: 'Shift Start',
  runId: 'RUN-2402',
  createdAt: 'Jan 25, 11:30 AM',
  duration: '12.3s',
  validation: 'Passed',
  fallback: 'Not used',
  summary: {
    produced: [
      'Top 3 late orders: ORD-1243 (2.5h late), ORD-1189 (1.2h late), ORD-1156 (0.8h late)',
      'Bottleneck risk: Machine M03 running at 94% utilization with 3 setup changes',
      'Recommended actions: Prioritize ORD-1243 setup prep, monitor M03 for quality alerts'
    ]
  },
  artifacts: [
    { label: 'Open Shift Brief', path: '/app/agent/brief' },
    { label: 'Open Run', path: '/app/runs/RUN-2402' },
    { label: 'Open Evidence', path: '#evidence' }
  ],
  audit: {
    validation_pass: true,
    fallback_used: false,
    duration_ms: 12340,
    user_rating: null
  },
  evidence: [
    { 
      id: 'ev1',
      title: 'Schedule snapshot reference',
      description: 'Active schedule v2.3 @ 11:30 AM',
      source: 'schedules/RUN-2402-v2.3.json'
    },
    { 
      id: 'ev2',
      title: 'Constraints used',
      description: 'Hard: due dates, capacity. Soft: setup time minimization',
      source: 'constraints/scenario-base.yaml'
    },
    { 
      id: 'ev3',
      title: 'Late orders list',
      description: '3 orders beyond due date, total lateness: 4.5 hours',
      source: 'metrics/otd-calculation.csv'
    },
    { 
      id: 'ev4',
      title: 'Bottleneck machine M03',
      description: 'Utilization 94%, 8 operations queued',
      source: 'machines/M03-state.json'
    }
  ]
};

export function AgentJobDetailPage({ userRole = 'planner' }: AgentJobDetailPageProps) {
  const navigate = useNavigate();
  const params = useParams();
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [evidenceOpen, setEvidenceOpen] = useState(true);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'summary', label: 'Summary' },
    { id: 'inputs', label: 'Inputs' },
    { id: 'outputs', label: 'Outputs' },
    { id: 'validation', label: 'Validation' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'logs', label: 'Logs' }
  ];

  const handleCopyJobId = () => {
    navigator.clipboard.writeText(jobData.id);
    // Could add a toast notification here
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(jobData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${jobData.id}.json`;
    link.click();
  };

  return (
    <div className={`h-full flex ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate('/app/agent/home')}
              className={`hover:underline ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Agent
            </button>
            <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <button
              onClick={() => navigate('/app/agent/jobs')}
              className={`hover:underline ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Agent Jobs
            </button>
            <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>Job Detail</span>
          </div>

          {/* Title & Status */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Job {jobData.id}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </span>
              </div>

              {/* Metadata Row */}
              <div className="flex items-center gap-4 text-sm">
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Job Type: </span>
                  <span className="font-medium">{jobData.jobType}</span>
                </div>
                <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Trigger: </span>
                  <span className="font-medium">{jobData.trigger}</span>
                </div>
                <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Run ID: </span>
                  <button
                    onClick={() => navigate(`/app/runs/${jobData.runId}`)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {jobData.runId}
                  </button>
                </div>
                <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Created: </span>
                  <span className="font-medium">{jobData.createdAt}</span>
                </div>
                <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Duration: </span>
                  <span className="font-medium">{jobData.duration}</span>
                </div>
              </div>

              {/* Metric Chips */}
              <div className="flex items-center gap-3 mt-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Validation: {jobData.validation}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  Fallback: {jobData.fallback}
                </div>
              </div>
            </div>

            {/* Evidence Toggle */}
            <button
              onClick={() => setEvidenceOpen(!evidenceOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Database className="w-4 h-4" />
              Evidence
              {evidenceOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Tabs */}
          <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? isDarkMode 
                        ? 'text-blue-400' 
                        : 'text-blue-600'
                      : isDarkMode 
                        ? 'text-gray-400 hover:text-gray-300' 
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Card 1: What the agent produced */}
              <div className={`rounded-xl border p-6 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Zap className="w-5 h-5 text-blue-600" />
                  What the agent produced
                </h3>
                <ul className="space-y-3">
                  {jobData.summary.produced.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                        isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
                      }`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 2: Downstream artifacts */}
              <div className={`rounded-xl border p-6 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <FileText className="w-5 h-5 text-purple-600" />
                  Downstream artifacts
                </h3>
                <div className="flex items-center gap-3">
                  {jobData.artifacts.map((artifact, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigate(artifact.path)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      {artifact.label}
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Card 3: Audit fields */}
              <div className={`rounded-xl border p-6 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Shield className="w-5 h-5 text-green-600" />
                  Audit fields
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      validation_pass
                    </div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {jobData.audit.validation_pass ? 'true' : 'false'}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      fallback_used
                    </div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {jobData.audit.fallback_used ? 'true' : 'false'}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      duration_ms
                    </div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {jobData.audit.duration_ms.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      user_rating
                    </div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {jobData.audit.user_rating || '(blank)'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inputs' && (
            <div className={`rounded-xl border p-6 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Input data and parameters will be displayed here.
              </p>
            </div>
          )}

          {activeTab === 'outputs' && (
            <div className={`rounded-xl border p-6 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Output data and generated content will be displayed here.
              </p>
            </div>
          )}

          {activeTab === 'validation' && (
            <div className={`rounded-xl border p-6 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Validation checks and results will be displayed here.
              </p>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className={`rounded-xl border p-6 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Evidence references and sources will be displayed here.
              </p>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className={`rounded-xl border p-6 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Execution logs and debugging information will be displayed here.
              </p>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate('/app/agent/jobs')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Agent Jobs
            </button>
            <button
              onClick={handleCopyJobId}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Copy className="w-4 h-4" />
              Copy Job ID
            </button>
            <button
              onClick={handleExportJson}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Drawer (Right Panel) */}
      {evidenceOpen && (
        <div className={`w-80 border-l ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} overflow-auto`}>
          <div className="p-6 space-y-4">
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Evidence drawer
              </h3>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Source references for this job
              </p>
            </div>

            <div className="space-y-3">
              {jobData.evidence.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </h4>
                  <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.description}
                  </p>
                  <button className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline">
                    View source
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <div className={`text-xs mt-2 font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {item.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}