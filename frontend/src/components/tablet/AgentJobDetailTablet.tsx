import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  AlertTriangle,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronUp,
  Database,
  FileText,
  User,
  Calendar
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';
import { TabletLayout } from './TabletLayout';

interface AgentJobDetailTabletProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

export function AgentJobDetailTablet({ userRole = 'planner' }: AgentJobDetailTabletProps) {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { isDarkMode } = useDarkMode();
  
  const isSuccess = jobId === 'AJ-98320';
  
  const jobData = isSuccess ? {
    id: 'AJ-98320',
    type: 'Setup guidance',
    status: 'success',
    startTime: 'Jan 25, 2:15 PM',
    endTime: 'Jan 25, 2:16 PM',
    duration: '1.4s',
    user: 'Mike Chen (Supervisor)',
    inputTokens: 3240,
    outputTokens: 1820,
    cost: '$0.14',
    model: 'gpt-4o',
    runId: 'RUN-2402',
    machineId: 'M03',
    productChange: 'Widget A → Gear B'
  } : {
    id: 'AJ-98325',
    type: 'Setup guidance',
    status: 'failed',
    startTime: 'Jan 25, 1:45 PM',
    endTime: 'Jan 25, 1:45 PM',
    duration: '0.8s',
    user: 'Mike Chen (Supervisor)',
    inputTokens: 2850,
    outputTokens: 0,
    cost: '$0.08',
    model: 'gpt-4o',
    errorType: 'Validation failure',
    errorMessage: 'Unable to locate SOP document SOP-12 Rev 3 in knowledge base',
    runId: 'RUN-2402',
    machineId: 'M03',
    productChange: 'Widget A → Gear B'
  };

  const [showInput, setShowInput] = useState(true);
  const [showOutput, setShowOutput] = useState(true);
  const [showAudit, setShowAudit] = useState(false);

  const handleRetry = () => {
    console.log('Retrying job...');
  };

  const handleExport = () => {
    console.log('Exporting job data...');
  };

  const auditTrail = [
    { timestamp: 'Jan 25, 2:15:32 PM', event: 'Job created', details: 'Setup guidance request initiated' },
    { timestamp: 'Jan 25, 2:15:33 PM', event: 'Input validated', details: 'Run RUN-2402, machine M03, product change confirmed' },
    ...(isSuccess ? [
      { timestamp: 'Jan 25, 2:15:34 PM', event: 'KB search', details: 'Found 3 relevant documents' },
      { timestamp: 'Jan 25, 2:15:36 PM', event: 'LLM invocation', details: 'gpt-4o (3240 input, 1820 output tokens)' },
      { timestamp: 'Jan 25, 2:15:38 PM', event: 'Output validated', details: 'All parameter sources verified' },
      { timestamp: 'Jan 25, 2:15:38 PM', event: 'Job completed', details: 'Success' },
    ] : [
      { timestamp: 'Jan 25, 1:45:33 PM', event: 'KB search', details: 'SOP-12 Rev 3 not found' },
      { timestamp: 'Jan 25, 1:45:33 PM', event: 'Validation failed', details: 'Missing required source document' },
      { timestamp: 'Jan 25, 1:45:33 PM', event: 'Job failed', details: 'Validation failure' },
    ])
  ];

  return (
    <TabletLayout userRole={userRole}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {jobData.id}
            </h1>
            {isSuccess ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
              isSuccess
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {isSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {jobData.status}
            </span>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {jobData.type}
            </span>
          </div>
        </div>

        {/* Error Banner (for failed jobs) */}
        {!isSuccess && (
          <div className={`rounded-lg border p-3 ${
            isDarkMode 
              ? 'bg-red-900/20 border-red-700' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-2">
              <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
              <div className="flex-1">
                <h3 className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>
                  {jobData.errorType}
                </h3>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                  {jobData.errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Duration
            </div>
            <div className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {jobData.duration}
            </div>
          </div>
          
          <div className={`p-3 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Cost
            </div>
            <div className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {jobData.cost}
            </div>
          </div>
          
          <div className={`p-3 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Model
            </div>
            <div className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {jobData.model}
            </div>
          </div>
          
          <div className={`p-3 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Tokens
            </div>
            <div className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {jobData.inputTokens} in / {jobData.outputTokens} out
            </div>
          </div>
        </div>

        {/* Context */}
        <div className={`rounded-lg border p-4 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-base font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Context
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <User className={`w-4 h-4 mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
              <div>
                <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>User: </span>
                <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {jobData.user}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className={`w-4 h-4 mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
              <div>
                <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Started: </span>
                <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {jobData.startTime}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText className={`w-4 h-4 mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
              <div>
                <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Run: </span>
                <button
                  onClick={() => navigate(`/app/runs/${jobData.runId}`)}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {jobData.runId}
                </button>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Database className={`w-4 h-4 mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
              <div>
                <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Machine: </span>
                <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {jobData.machineId}
                </span>
                <span className={`mx-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>•</span>
                <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {jobData.productChange}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Input */}
        <button
          onClick={() => setShowInput(!showInput)}
          className={`w-full flex items-center justify-between p-3 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Input
          </span>
          {showInput ? (
            <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </button>

        {showInput && (
          <div className={`p-4 rounded-lg border font-mono text-xs ${
            isDarkMode 
              ? 'bg-gray-900 border-gray-700 text-gray-300' 
              : 'bg-gray-50 border-gray-200 text-gray-700'
          }`}>
            <div className="space-y-1">
              <div><span className="text-blue-600">run_id:</span> "{jobData.runId}"</div>
              <div><span className="text-blue-600">machine_id:</span> "{jobData.machineId}"</div>
              <div><span className="text-blue-600">from_product:</span> "Widget A"</div>
              <div><span className="text-blue-600">to_product:</span> "Gear B"</div>
              <div><span className="text-blue-600">shift:</span> "B"</div>
            </div>
          </div>
        )}

        {/* Output */}
        {isSuccess && (
          <>
            <button
              onClick={() => setShowOutput(!showOutput)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Output
              </span>
              {showOutput ? (
                <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              ) : (
                <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              )}
            </button>

            {showOutput && (
              <div className={`p-4 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Setup checklist generated with 22 steps across 4 sections (Safety, Tooling, Machine settings, Inspection). All parameters sourced from SOP-12 Rev 3 and KB articles.
                </p>
                <button
                  onClick={() => navigate('/app/agent/setup-checklist/output')}
                  className="mt-3 text-sm font-medium text-blue-600 hover:underline"
                >
                  View full checklist →
                </button>
              </div>
            )}
          </>
        )}

        {/* Audit Trail */}
        <button
          onClick={() => setShowAudit(!showAudit)}
          className={`w-full flex items-center justify-between p-3 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Audit trail ({auditTrail.length})
          </span>
          {showAudit ? (
            <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </button>

        {showAudit && (
          <div className="space-y-2">
            {auditTrail.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.event}
                </div>
                <div className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.details}
                </div>
                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {item.timestamp}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleExport}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 active:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 active:bg-gray-200'
            }`}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          
          {!isSuccess && userRole === 'planner' && (
            <button
              onClick={handleRetry}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-blue-600 text-white active:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry job
            </button>
          )}
        </div>
      </div>
    </TabletLayout>
  );
}
