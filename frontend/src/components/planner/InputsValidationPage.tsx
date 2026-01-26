import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { ArrowLeft, Upload, Wand2, CheckCircle2, XCircle, AlertTriangle, FileText, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type ValidationStatus = 'pending' | 'validating' | 'valid' | 'error' | 'missing';

interface ValidationError {
  row: number;
  column: string;
  value: string;
  error: string;
}

interface FileValidation {
  fileName: string;
  status: ValidationStatus;
  required: boolean;
  rowCount?: number;
  expectedColumns?: string[];
  missingColumns?: string[];
  errors?: ValidationError[];
  uploadedAt?: string;
}

interface DataValidationState {
  files: FileValidation[];
  overallValid: boolean;
}

const mockValidationData: DataValidationState = {
  overallValid: false,
  files: [
    {
      fileName: 'demand.csv',
      status: 'valid',
      required: true,
      rowCount: 1247,
      expectedColumns: ['product_id', 'date', 'quantity', 'priority'],
      missingColumns: [],
      errors: [],
      uploadedAt: '2026-01-10 14:23:15',
    },
    {
      fileName: 'inventory.csv',
      status: 'error',
      required: true,
      rowCount: 856,
      expectedColumns: ['product_id', 'warehouse_id', 'quantity', 'unit'],
      missingColumns: ['unit'],
      errors: [
        { row: 23, column: 'quantity', value: '-15', error: 'Negative quantity not allowed' },
        { row: 47, column: 'product_id', value: '', error: 'Required field is empty' },
        { row: 128, column: 'quantity', value: 'abc', error: 'Invalid number format' },
      ],
      uploadedAt: '2026-01-10 14:23:18',
    },
    {
      fileName: 'bom.csv',
      status: 'valid',
      required: true,
      rowCount: 2134,
      expectedColumns: ['parent_id', 'component_id', 'quantity', 'unit'],
      missingColumns: [],
      errors: [],
      uploadedAt: '2026-01-10 14:23:20',
    },
    {
      fileName: 'operations.csv',
      status: 'missing',
      required: true,
      expectedColumns: ['operation_id', 'product_id', 'machine_id', 'setup_time', 'run_time'],
    },
    {
      fileName: 'machines.csv',
      status: 'missing',
      required: false,
      expectedColumns: ['machine_id', 'name', 'capacity', 'availability'],
    },
  ],
};

const statusConfig: Record<ValidationStatus, { label: string; icon: any; color: string; bgColor: string }> = {
  pending: { label: 'Pending', icon: AlertTriangle, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  validating: { label: 'Validating...', icon: AlertTriangle, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  valid: { label: 'Valid', icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100' },
  error: { label: 'Has Errors', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
  missing: { label: 'Missing', icon: AlertTriangle, color: 'text-orange-600', bgColor: 'bg-orange-100' },
};

export function InputsValidationPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { runId } = useParams<{ runId: string }>();
  const location = useLocation();
  const isFromCreate = location.state?.fromCreate;

  const [validationState, setValidationState] = useState<DataValidationState>(mockValidationData);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set(['inventory.csv']));
  const [isUploading, setIsUploading] = useState(false);

  const toggleFileExpansion = (fileName: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(fileName)) {
      newExpanded.delete(fileName);
    } else {
      newExpanded.add(fileName);
    }
    setExpandedFiles(newExpanded);
  };

  const handleFileUpload = async (fileName: string, file: File) => {
    setIsUploading(true);

    // Update file to validating state
    setValidationState(prev => ({
      ...prev,
      files: prev.files.map(f =>
        f.fileName === fileName
          ? { ...f, status: 'validating' as ValidationStatus }
          : f
      ),
    }));

    // Simulate upload and validation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock successful validation
    setValidationState(prev => ({
      ...prev,
      files: prev.files.map(f =>
        f.fileName === fileName
          ? {
              ...f,
              status: 'valid' as ValidationStatus,
              rowCount: Math.floor(Math.random() * 1000) + 100,
              missingColumns: [],
              errors: [],
              uploadedAt: new Date().toLocaleString(),
            }
          : f
      ),
    }));

    setIsUploading(false);
  };

  const handleGenerateSynthetic = () => {
    navigate(`/app/runs/${runId}/generate-data`);
  };

  const handleMarkAsReady = () => {
    navigate(`/app/runs/${runId}/schedule`);
  };

  const handleUploadAgain = (fileName: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(fileName, file);
      }
    };
    input.click();
  };

  const requiredFiles = validationState.files.filter(f => f.required);
  const optionalFiles = validationState.files.filter(f => !f.required);
  
  const validCount = validationState.files.filter(f => f.status === 'valid').length;
  const errorCount = validationState.files.filter(f => f.status === 'error').length;
  const missingCount = validationState.files.filter(f => f.status === 'missing' && f.required).length;
  
  const allRequiredValid = requiredFiles.every(f => f.status === 'valid');

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

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Input Data Validation</h1>
              {allRequiredValid ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Ready
                </span>
              ) : (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-sm rounded flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Issues Found
                </span>
              )}
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Run ID: <span className="font-mono text-blue-600">{runId || 'RUN-2401'}</span>
            </p>
          </div>

          {/* Summary Stats */}
          <div className={`flex items-center gap-4 px-4 py-3 rounded-lg border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="text-center">
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xl">{validCount}</span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Valid</p>
            </div>
            <div className={`w-px h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <div className="text-center">
              <div className="flex items-center gap-1 text-red-600">
                <XCircle className="w-4 h-4" />
                <span className="text-xl">{errorCount}</span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Errors</p>
            </div>
            <div className={`w-px h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <div className="text-center">
              <div className="flex items-center gap-1 text-orange-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xl">{missingCount}</span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Missing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Required Files */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Required Files</h2>
              <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                {requiredFiles.length} required
              </span>
            </div>

            <div className="space-y-3">
              {requiredFiles.map((file) => {
                const config = statusConfig[file.status];
                const Icon = config.icon;
                const isExpanded = expandedFiles.has(file.fileName);
                const hasDetails = file.status !== 'missing';

                return (
                  <div key={file.fileName} className={`border rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    {/* File Header */}
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Status Icon */}
                        <div className={`p-2 rounded-lg ${config.bgColor} flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className={`font-mono ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{file.fileName}</h3>
                                <span className={`px-2 py-0.5 text-xs rounded ${config.bgColor} ${config.color}`}>
                                  {config.label}
                                </span>
                              </div>
                              {file.uploadedAt && (
                                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                  Uploaded: {file.uploadedAt}
                                </p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              {file.status === 'missing' ? (
                                <label className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer transition-colors flex items-center gap-2">
                                  <Upload className="w-4 h-4" />
                                  <span>Upload</span>
                                  <input
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={(e) => {
                                      const uploadedFile = e.target.files?.[0];
                                      if (uploadedFile) {
                                        handleFileUpload(file.fileName, uploadedFile);
                                      }
                                    }}
                                  />
                                </label>
                              ) : (
                                <button
                                  onClick={() => handleUploadAgain(file.fileName)}
                                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                  Re-upload
                                </button>
                              )}
                              
                              {hasDetails && (
                                <button
                                  onClick={() => toggleFileExpansion(file.fileName)}
                                  className={`p-1.5 rounded transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="w-5 h-5" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Quick Stats */}
                          {file.rowCount !== undefined && (
                            <div className="flex items-center gap-4 text-sm">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                Rows: <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{file.rowCount.toLocaleString()}</span>
                              </span>
                              {file.missingColumns && file.missingColumns.length > 0 && (
                                <span className="text-red-600">
                                  Missing columns: {file.missingColumns.join(', ')}
                                </span>
                              )}
                              {file.errors && file.errors.length > 0 && (
                                <span className="text-red-600">
                                  {file.errors.length} error{file.errors.length !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && hasDetails && (
                      <div className={`border-t p-4 ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                        {/* Expected Columns */}
                        {file.expectedColumns && (
                          <div className="mb-4">
                            <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Expected Columns:</p>
                            <div className="flex flex-wrap gap-2">
                              {file.expectedColumns.map((col) => {
                                const isMissing = file.missingColumns?.includes(col);
                                return (
                                  <span
                                    key={col}
                                    className={`px-2 py-1 text-xs rounded font-mono ${
                                      isMissing
                                        ? 'bg-red-100 text-red-700 line-through'
                                        : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                    }`}
                                  >
                                    {col}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Sample Errors */}
                        {file.errors && file.errors.length > 0 && (
                          <div>
                            <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Sample Errors (showing {Math.min(file.errors.length, 3)} of {file.errors.length}):
                            </p>
                            <div className="space-y-2">
                              {file.errors.slice(0, 3).map((error, idx) => (
                                <div key={idx} className={`p-3 border rounded-lg ${isDarkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'}`}>
                                  <div className="flex items-start justify-between gap-4 mb-1">
                                    <span className={`text-sm ${isDarkMode ? 'text-red-200' : 'text-red-900'}`}>
                                      Row {error.row}, Column: <span className="font-mono">{error.column}</span>
                                    </span>
                                    <span className="text-xs text-red-600 font-mono bg-red-100 px-2 py-0.5 rounded">
                                      {error.value || '(empty)'}
                                    </span>
                                  </div>
                                  <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>{error.error}</p>
                                </div>
                              ))}
                            </div>
                            {file.errors.length > 3 && (
                              <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                + {file.errors.length - 3} more error{file.errors.length - 3 !== 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Valid File Message */}
                        {file.status === 'valid' && (
                          <div className={`flex items-start gap-2 p-3 border rounded-lg ${isDarkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'}`}>
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className={`text-sm ${isDarkMode ? 'text-green-200' : 'text-green-900'}`}>
                                All {file.rowCount?.toLocaleString()} rows validated successfully
                              </p>
                              <p className={`text-sm mt-1 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                                All required columns present and data format is correct
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional Files */}
          {optionalFiles.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Optional Files</h2>
                <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded">
                  Optional
                </span>
              </div>

              <div className="space-y-3">
                {optionalFiles.map((file) => {
                  const config = statusConfig[file.status];
                  const Icon = config.icon;

                  return (
                    <div key={file.fileName} className={`border rounded-lg p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                          <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-mono mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{file.fileName}</h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Optional - improves scheduling accuracy</p>
                        </div>
                        {file.status === 'missing' && (
                          <label className={`px-3 py-1.5 text-sm rounded-lg cursor-pointer transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                            Upload
                            <input
                              type="file"
                              accept=".csv"
                              className="hidden"
                              onChange={(e) => {
                                const uploadedFile = e.target.files?.[0];
                                if (uploadedFile) {
                                  handleFileUpload(file.fileName, uploadedFile);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Alternative Action */}
          {!allRequiredValid && (
            <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-start gap-4">
                <Wand2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className={`mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>Need help with data?</h3>
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                    Generate synthetic data automatically to complete your run setup without uploading files.
                  </p>
                  <button
                    onClick={handleGenerateSynthetic}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Generate Synthetic Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className={`border-t px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-5xl mx-auto flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            onClick={() => navigate(`/app/runs/${runId}`)}
            className={`px-6 py-3 border rounded-lg transition-colors ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            Save & Exit
          </button>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleGenerateSynthetic}
              className={`px-6 py-3 border rounded-lg transition-colors flex items-center justify-center gap-2 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              <Wand2 className="w-5 h-5" />
              <span>Generate Synthetic</span>
            </button>

            <button
              onClick={handleMarkAsReady}
              disabled={!allRequiredValid}
              className={`px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                allRequiredValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Continue to Schedule</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}