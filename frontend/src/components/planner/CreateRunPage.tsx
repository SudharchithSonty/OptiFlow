import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Upload, Wand2, Calendar, Clock, FileText, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type Shift = 'A' | 'B' | 'C';
type InputMethod = 'upload' | 'synthetic';

interface CreateRunForm {
  date: string;
  shift: Shift;
  horizonDays: number;
  notes: string;
  inputMethod: InputMethod;
  uploadedFile?: File;
}

export function CreateRunPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const parentRun = location.state?.parentRun;
  const isReschedule = location.state?.isReschedule || false;

  const [form, setForm] = useState<CreateRunForm>({
    date: new Date().toISOString().split('T')[0],
    shift: 'A',
    horizonDays: 7,
    notes: isReschedule ? `Rescheduled from ${parentRun?.id}` : '',
    inputMethod: 'synthetic',
  });

  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const isFormValid = () => {
    const errors: string[] = [];

    if (!form.date) errors.push('Date is required');
    if (!form.shift) errors.push('Shift is required');
    if (form.horizonDays < 1 || form.horizonDays > 30) {
      errors.push('Horizon days must be between 1 and 30');
    }
    if (form.inputMethod === 'upload' && !form.uploadedFile) {
      errors.push('Please upload a CSV file');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setValidationErrors(['Please upload a CSV file']);
        return;
      }
      setForm({ ...form, uploadedFile: file });
      setUploadedFileName(file.name);
      setValidationErrors([]);
    }
  };

  const handleCreate = async () => {
    if (!isFormValid()) return;

    setIsCreating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Navigate to the new run detail page (mock)
    const newRunId = `RUN-${Math.floor(Math.random() * 9000) + 1000}`;
    navigate(`/app/runs/${newRunId}`, { 
      state: { 
        justCreated: true,
        isReschedule,
        parentRunId: parentRun?.id
      } 
    });
  };

  const handleCancel = () => {
    if (window.confirm('Discard this draft run?')) {
      navigate('/app/runs');
    }
  };

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <button
          onClick={handleCancel}
          className={`flex items-center gap-2 mb-4 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Runs</span>
        </button>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              {isReschedule ? 'Create Reschedule Run' : 'Create New Run'}
            </h1>
            {isReschedule && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-sm rounded">
                Reschedule
              </span>
            )}
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isReschedule 
              ? `Creating a rescheduled run based on ${parentRun?.id}`
              : 'Set up a new production run for your manufacturing schedule'
            }
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-3xl mx-auto">
          {/* Parent Run Info (Reschedule Only) */}
          {isReschedule && parentRun && (
            <div className={`mb-6 border rounded-lg p-4 ${isDarkMode ? 'bg-orange-900/30 border-orange-800' : 'bg-orange-50 border-orange-200'}`}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-orange-200' : 'text-orange-900'}`}>
                    <span className={isDarkMode ? 'text-orange-300' : 'text-orange-700'}>Rescheduling from:</span> {parentRun.id}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className={isDarkMode ? 'text-orange-300' : 'text-orange-700'}>Original Date:</span>{' '}
                      <span className={isDarkMode ? 'text-orange-200' : 'text-orange-900'}>{parentRun.date}</span>
                    </div>
                    <div>
                      <span className={isDarkMode ? 'text-orange-300' : 'text-orange-700'}>Original Shift:</span>{' '}
                      <span className={isDarkMode ? 'text-orange-200' : 'text-orange-900'}>Shift {parentRun.shift}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className={`mb-6 border rounded-lg p-4 ${isDarkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-red-200' : 'text-red-900'}`}>Please fix the following errors:</p>
                  <ul className={`list-disc list-inside space-y-1 text-sm ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                    {validationErrors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Run Configuration */}
          <div className={`border rounded-lg p-6 mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Run Configuration</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label htmlFor="date" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Production Date *
                </label>
                <div className="relative">
                  <Calendar className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>
              </div>

              {/* Shift */}
              <div>
                <label htmlFor="shift" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Shift *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['A', 'B', 'C'] as Shift[]).map((shift) => (
                    <button
                      key={shift}
                      type="button"
                      onClick={() => setForm({ ...form, shift })}
                      className={`py-3 px-4 border-2 rounded-lg transition-colors ${
                        form.shift === shift
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : isDarkMode 
                            ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      Shift {shift}
                    </button>
                  ))}
                </div>
              </div>

              {/* Horizon Days */}
              <div>
                <label htmlFor="horizon" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Planning Horizon (days) *
                </label>
                <div className="relative">
                  <Clock className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    id="horizon"
                    type="number"
                    min="1"
                    max="30"
                    value={form.horizonDays}
                    onChange={(e) => setForm({ ...form, horizonDays: parseInt(e.target.value) || 1 })}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Forecast period: 1-30 days
                </p>
              </div>

              {/* Notes */}
              <div className="lg:col-span-2">
                <label htmlFor="notes" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Notes (Optional)
                </label>
                <div className="relative">
                  <FileText className={`w-5 h-5 absolute left-3 top-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    placeholder="Add any notes or special instructions for this run..."
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Input Method */}
          <div className={`border rounded-lg p-6 mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Input Data Method *</h2>

            {/* Method Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setForm({ ...form, inputMethod: 'upload', uploadedFile: undefined })}
                className={`p-6 border-2 rounded-lg transition-all text-left ${
                  form.inputMethod === 'upload'
                    ? 'border-blue-600 bg-blue-50'
                    : isDarkMode
                      ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    form.inputMethod === 'upload' ? 'bg-blue-100' : isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
                  }`}>
                    <Upload className={`w-6 h-6 ${
                      form.inputMethod === 'upload' ? 'text-blue-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`mb-1 ${
                      form.inputMethod === 'upload' ? 'text-blue-900' : isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Upload CSV Bundle
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Upload your own demand, inventory, and BOM data files
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, inputMethod: 'synthetic' })}
                className={`p-6 border-2 rounded-lg transition-all text-left ${
                  form.inputMethod === 'synthetic'
                    ? 'border-blue-600 bg-blue-50'
                    : isDarkMode
                      ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    form.inputMethod === 'synthetic' ? 'bg-blue-100' : isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
                  }`}>
                    <Wand2 className={`w-6 h-6 ${
                      form.inputMethod === 'synthetic' ? 'text-blue-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`mb-1 ${
                      form.inputMethod === 'synthetic' ? 'text-blue-900' : isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Generate Synthetic
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Auto-generate realistic demo data for testing
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Upload Interface */}
            {form.inputMethod === 'upload' && (
              <div className={`border-2 border-dashed rounded-lg p-8 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                <div className="text-center">
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  
                  {uploadedFileName ? (
                    <div className={`border rounded-lg p-4 mb-4 ${isDarkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'}`}>
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className={`text-sm ${isDarkMode ? 'text-green-200' : 'text-green-900'}`}>{uploadedFileName}</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Drop your CSV file here, or click to browse</p>
                      <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Accepts: demand.csv, inventory.csv, bom.csv (or bundled .zip)
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    id="file-upload"
                    accept=".csv,.zip"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`inline-flex items-center gap-2 px-6 py-3 border rounded-lg cursor-pointer transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    <Upload className="w-5 h-5" />
                    <span>{uploadedFileName ? 'Change File' : 'Select File'}</span>
                  </label>
                </div>
              </div>
            )}

            {/* Synthetic Info */}
            {form.inputMethod === 'synthetic' && (
              <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-start gap-3">
                  <Wand2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                      <span className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>Synthetic data</span> will be generated automatically based on:
                    </p>
                    <ul className={`list-disc list-inside space-y-1 text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                      <li>Historical patterns from similar production runs</li>
                      <li>Current inventory levels and demand forecasts</li>
                      <li>Configured planning horizon ({form.horizonDays} days)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isCreating}
              className={`flex-1 sm:flex-initial px-6 py-3 border rounded-lg transition-colors disabled:opacity-50 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleCreate}
              disabled={isCreating}
              className={`flex-1 sm:flex-initial px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                isCreating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Run...</span>
                </>
              ) : (
                <>
                  <span>Create Run</span>
                </>
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className={`mt-6 border rounded-lg p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>What happens next?</span>
            </p>
            <ol className={`list-decimal list-inside space-y-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>Run will be created in "draft" status</li>
              <li>Input data will be validated and processed</li>
              <li>AI agent will generate initial production brief</li>
              <li>You can review, modify, and publish the run</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}