import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, CheckCircle2, Loader2, Clock, FileText, Download, ArrowRight, AlertCircle } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type GenerationStatus = 'created' | 'generating' | 'generated' | 'failed';

interface GeneratedFile {
  fileName: string;
  rowCount: number;
  size: string;
  generatedAt?: string;
}

interface GenerationState {
  status: GenerationStatus;
  startedAt?: string;
  completedAt?: string;
  files?: GeneratedFile[];
  progress?: number;
  currentStep?: string;
  error?: string;
}

const mockGeneratedFiles: GeneratedFile[] = [
  { fileName: 'demand.csv', rowCount: 1247, size: '85 KB', generatedAt: '2026-01-10 14:28:42' },
  { fileName: 'inventory.csv', rowCount: 856, size: '62 KB', generatedAt: '2026-01-10 14:28:43' },
  { fileName: 'bom.csv', rowCount: 2134, size: '145 KB', generatedAt: '2026-01-10 14:28:45' },
  { fileName: 'operations.csv', rowCount: 487, size: '38 KB', generatedAt: '2026-01-10 14:28:46' },
  { fileName: 'machines.csv', rowCount: 24, size: '4 KB', generatedAt: '2026-01-10 14:28:46' },
];

const generationSteps = [
  { id: 'created', label: 'Created', description: 'Generation request initialized' },
  { id: 'generating', label: 'Generating', description: 'Creating synthetic data files' },
  { id: 'generated', label: 'Generated', description: 'All files ready for review' },
];

export function GenerateDataPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { runId } = useParams<{ runId: string }>();
  
  const [generationState, setGenerationState] = useState<GenerationState>({
    status: 'created',
    startedAt: new Date().toLocaleString(),
  });

  const [showFiles, setShowFiles] = useState(false);

  // Simulate generation progress
  useEffect(() => {
    if (generationState.status === 'created') {
      // Start generation after 1 second
      const timer = setTimeout(() => {
        setGenerationState({
          status: 'generating',
          startedAt: generationState.startedAt,
          progress: 0,
          currentStep: 'Analyzing run configuration...',
        });
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (generationState.status === 'generating') {
      // Progress simulation
      const progressSteps = [
        { progress: 10, step: 'Analyzing run configuration...' },
        { progress: 25, step: 'Generating demand patterns...' },
        { progress: 45, step: 'Creating inventory snapshots...' },
        { progress: 65, step: 'Building bill of materials...' },
        { progress: 80, step: 'Generating operation sequences...' },
        { progress: 95, step: 'Finalizing machine assignments...' },
        { progress: 100, step: 'Complete!' },
      ];

      let currentStepIndex = 0;
      const interval = setInterval(() => {
        if (currentStepIndex < progressSteps.length) {
          const step = progressSteps[currentStepIndex];
          setGenerationState(prev => ({
            ...prev,
            progress: step.progress,
            currentStep: step.step,
          }));
          currentStepIndex++;
        } else {
          clearInterval(interval);
          setGenerationState({
            status: 'generated',
            startedAt: generationState.startedAt,
            completedAt: new Date().toLocaleString(),
            files: mockGeneratedFiles,
            progress: 100,
          });
        }
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [generationState.status, generationState.startedAt]);

  const handleViewFiles = () => {
    setShowFiles(!showFiles);
  };

  const handleContinueToSchedule = () => {
    navigate(`/app/runs/${runId}/schedule`);
  };

  const handleDownloadFile = (fileName: string) => {
    // Mock download
    alert(`Downloading ${fileName}...`);
  };

  const getStatusIndex = () => {
    return generationSteps.findIndex(step => step.id === generationState.status);
  };

  const currentStatusIndex = getStatusIndex();

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <button
          onClick={() => navigate(`/app/runs/${runId}`)}
          className={`flex items-center gap-2 mb-4 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Run</span>
        </button>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Generate Synthetic Data</h1>
            {generationState.status === 'generated' && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Complete
              </span>
            )}
            {generationState.status === 'generating' && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded flex items-center gap-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                In Progress
              </span>
            )}
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Run ID: <span className="font-mono text-blue-600">{runId || 'RUN-2401'}</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Status Timeline */}
          <div className="mb-12">
            <h2 className={`mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Generation Progress</h2>

            {/* Timeline */}
            <div className="relative">
              {/* Progress Line */}
              <div className={`absolute left-6 lg:left-12 top-0 bottom-0 w-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="bg-blue-600 w-full transition-all duration-500"
                  style={{
                    height: `${(currentStatusIndex / (generationSteps.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {/* Timeline Steps */}
              <div className="space-y-8">
                {generationSteps.map((step, index) => {
                  const isActive = index === currentStatusIndex;
                  const isComplete = index < currentStatusIndex;
                  const isPending = index > currentStatusIndex;

                  return (
                    <div key={step.id} className="relative">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute left-6 lg:left-12 w-6 h-6 rounded-full transform -translate-x-1/2 transition-all ${
                          isComplete
                            ? 'bg-blue-600'
                            : isActive
                            ? 'bg-blue-600 ring-4 ring-blue-200'
                            : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                        } ${isDarkMode ? 'border-4 border-gray-800' : 'border-4 border-white'}`}
                      />

                      {/* Content */}
                      <div className="ml-16 lg:ml-24">
                        <div className={`p-6 rounded-lg border-2 transition-all ${
                          isActive
                            ? 'bg-blue-50 border-blue-600'
                            : isComplete
                            ? (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
                            : (isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200')
                        }`}>
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className={`${
                                  isActive ? 'text-blue-900' : (isDarkMode ? 'text-white' : 'text-gray-900')
                                }`}>
                                  {step.label}
                                </h3>
                                {isComplete && (
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                )}
                                {isActive && generationState.status === 'generating' && (
                                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                )}
                              </div>
                              <p className={`text-sm ${
                                isActive ? 'text-blue-700' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
                              }`}>
                                {step.description}
                              </p>
                            </div>

                            {/* Timestamp */}
                            {isComplete && step.id === 'created' && generationState.startedAt && (
                              <div className={`text-sm flex items-center gap-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                <Clock className="w-4 h-4" />
                                <span>{generationState.startedAt}</span>
                              </div>
                            )}
                            {step.id === 'generated' && generationState.completedAt && (
                              <div className={`text-sm flex items-center gap-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                <Clock className="w-4 h-4" />
                                <span>{generationState.completedAt}</span>
                              </div>
                            )}
                          </div>

                          {/* Progress Bar (only during generating) */}
                          {isActive && generationState.status === 'generating' && (
                            <div className="mt-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-blue-700">
                                  {generationState.currentStep}
                                </span>
                                <span className="text-sm text-blue-900">
                                  {generationState.progress}%
                                </span>
                              </div>
                              <div className="w-full bg-blue-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${generationState.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Generated Files Section */}
          {generationState.status === 'generated' && generationState.files && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Generated Files</h2>
                <button
                  onClick={handleViewFiles}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {showFiles ? 'Hide Files' : 'View All Files'}
                </button>
              </div>

              {/* Files Summary */}
              <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className={`mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-900'}`}>
                      Successfully generated {generationState.files.length} files
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className={isDarkMode ? 'text-green-300' : 'text-green-700'}>Total Rows:</span>
                        <p className={isDarkMode ? 'text-green-200' : 'text-green-900'}>
                          {generationState.files.reduce((sum, f) => sum + f.rowCount, 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className={isDarkMode ? 'text-green-300' : 'text-green-700'}>Total Size:</span>
                        <p className={isDarkMode ? 'text-green-200' : 'text-green-900'}>334 KB</p>
                      </div>
                      <div>
                        <span className={isDarkMode ? 'text-green-300' : 'text-green-700'}>Format:</span>
                        <p className={isDarkMode ? 'text-green-200' : 'text-green-900'}>CSV</p>
                      </div>
                      <div>
                        <span className={isDarkMode ? 'text-green-300' : 'text-green-700'}>Validation:</span>
                        <p className={isDarkMode ? 'text-green-200' : 'text-green-900'}>All passed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* File List */}
              {showFiles && (
                <div className="space-y-2">
                  {generationState.files.map((file) => (
                    <div
                      key={file.fileName}
                      className={`border rounded-lg p-4 transition-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:shadow-xl' : 'bg-white border-gray-200 hover:shadow-sm'}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-mono mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{file.fileName}</h4>
                            <div className={`flex items-center gap-4 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                              <span>{file.rowCount.toLocaleString()} rows</span>
                              <span>•</span>
                              <span>{file.size}</span>
                              {file.generatedAt && (
                                <>
                                  <span>•</span>
                                  <span>{file.generatedAt}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadFile(file.fileName)}
                          className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Info Box */}
              <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                      <span className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>Data Generation Complete</span>
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                      All files have been validated and are ready to use. You can now continue to schedule generation or download the files for review.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {generationState.status === 'failed' && (
            <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className={`mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>Generation Failed</h3>
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                    {generationState.error || 'An error occurred while generating synthetic data. Please try again.'}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      {generationState.status === 'generated' && (
        <div className={`border-t px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="max-w-4xl mx-auto flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={handleViewFiles}
              className={`px-6 py-3 border rounded-lg transition-colors flex items-center justify-center gap-2 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              <FileText className="w-5 h-5" />
              <span>View Generated Files</span>
            </button>

            <button
              onClick={handleContinueToSchedule}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue to Schedule</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}