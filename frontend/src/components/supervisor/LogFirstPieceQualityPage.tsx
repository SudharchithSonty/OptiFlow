import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Save, ClipboardCheck, XCircle, CheckCircle2 } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type QualityResult = 'pass' | 'fail';

interface QualityFormData {
  date: string;
  shift: 'A' | 'B' | 'C';
  orderId: string;
  machineId: string;
  timestamp: string;
  result: QualityResult;
  defectCategory: string;
  notes: string;
  scrapQty: string;
}

const machines = ['M01', 'M02', 'M03', 'M04', 'M05'];
const defectCategories = [
  'Dimensional - Oversized',
  'Dimensional - Undersized',
  'Surface Finish',
  'Burr/Sharp Edge',
  'Tool Mark',
  'Material Defect',
  'Incomplete Operation',
  'Wrong Specification',
  'Other',
];

export function LogFirstPieceQualityPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<QualityFormData>({
    date: new Date().toISOString().split('T')[0],
    shift: 'A',
    orderId: '',
    machineId: '',
    timestamp: new Date().toTimeString().slice(0, 5),
    result: 'pass',
    defectCategory: '',
    notes: '',
    scrapQty: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof QualityFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleResultChange = (result: QualityResult) => {
    setFormData(prev => ({
      ...prev,
      result,
      // Clear defect fields if passing
      ...(result === 'pass' ? { defectCategory: '', scrapQty: '' } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('First-piece quality logged:', formData);
    
    // Navigate back
    navigate('/app');
  };

  const isValid = 
    formData.date &&
    formData.orderId &&
    formData.machineId &&
    formData.timestamp &&
    (formData.result === 'pass' || (formData.result === 'fail' && formData.defectCategory));

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <button
          onClick={() => navigate('/app')}
          className={`flex items-center gap-2 mb-4 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <ClipboardCheck className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Log First-Piece Quality Check</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Record quality inspection results for first piece
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className={`border rounded-lg p-6 space-y-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {/* Date & Shift Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date */}
              <div>
                <label htmlFor="date" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                />
              </div>

              {/* Shift */}
              <div>
                <label htmlFor="shift" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Shift <span className="text-red-600">*</span>
                </label>
                <select
                  id="shift"
                  value={formData.shift}
                  onChange={(e) => handleChange('shift', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                >
                  <option value="A">Shift A</option>
                  <option value="B">Shift B</option>
                  <option value="C">Shift C</option>
                </select>
              </div>
            </div>

            {/* Order ID */}
            <div>
              <label htmlFor="orderId" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Order ID <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="orderId"
                value={formData.orderId}
                onChange={(e) => handleChange('orderId', e.target.value)}
                placeholder="e.g., ORD-1234"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
                required
              />
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Which order is this first piece from?
              </p>
            </div>

            {/* Machine & Timestamp Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Machine */}
              <div>
                <label htmlFor="machineId" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Machine <span className="text-red-600">*</span>
                </label>
                <select
                  id="machineId"
                  value={formData.machineId}
                  onChange={(e) => handleChange('machineId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                >
                  <option value="">Select machine...</option>
                  {machines.map(machine => (
                    <option key={machine} value={machine}>
                      {machine}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timestamp */}
              <div>
                <label htmlFor="timestamp" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Inspection Time <span className="text-red-600">*</span>
                </label>
                <input
                  type="time"
                  id="timestamp"
                  value={formData.timestamp}
                  onChange={(e) => handleChange('timestamp', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                />
              </div>
            </div>

            {/* Pass/Fail Result */}
            <div>
              <p className={`block text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Inspection Result <span className="text-red-600">*</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                {/* Pass Button */}
                <button
                  type="button"
                  onClick={() => handleResultChange('pass')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    formData.result === 'pass'
                      ? 'border-green-600 bg-green-50'
                      : (isDarkMode ? 'border-gray-700 bg-gray-800 hover:border-gray-600' : 'border-gray-200 bg-white hover:border-gray-300')
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`p-3 rounded-lg ${
                      formData.result === 'pass' ? 'bg-green-100' : (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                    }`}>
                      <CheckCircle2 className={`w-8 h-8 ${
                        formData.result === 'pass' ? 'text-green-600' : (isDarkMode ? 'text-gray-600' : 'text-gray-400')
                      }`} />
                    </div>
                    <div>
                      <p className={`font-medium ${
                        formData.result === 'pass' ? 'text-green-900' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                      }`}>
                        Pass
                      </p>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        Meets specifications
                      </p>
                    </div>
                  </div>
                </button>

                {/* Fail Button */}
                <button
                  type="button"
                  onClick={() => handleResultChange('fail')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    formData.result === 'fail'
                      ? 'border-red-600 bg-red-50'
                      : (isDarkMode ? 'border-gray-700 bg-gray-800 hover:border-gray-600' : 'border-gray-200 bg-white hover:border-gray-300')
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`p-3 rounded-lg ${
                      formData.result === 'fail' ? 'bg-red-100' : (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                    }`}>
                      <XCircle className={`w-8 h-8 ${
                        formData.result === 'fail' ? 'text-red-600' : (isDarkMode ? 'text-gray-600' : 'text-gray-400')
                      }`} />
                    </div>
                    <div>
                      <p className={`font-medium ${
                        formData.result === 'fail' ? 'text-red-900' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                      }`}>
                        Fail
                      </p>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        Has defects
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Defect Category (Conditional) */}
            {formData.result === 'fail' && (
              <div>
                <label htmlFor="defectCategory" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Defect Category <span className="text-red-600">*</span>
                </label>
                <select
                  id="defectCategory"
                  value={formData.defectCategory}
                  onChange={(e) => handleChange('defectCategory', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                >
                  <option value="">Select defect category...</option>
                  {defectCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  What type of defect was found?
                </p>
              </div>
            )}

            {/* Scrap Quantity (Optional, conditional) */}
            {formData.result === 'fail' && (
              <div>
                <label htmlFor="scrapQty" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Scrap Quantity (Optional)
                </label>
                <input
                  type="number"
                  id="scrapQty"
                  value={formData.scrapQty}
                  onChange={(e) => handleChange('scrapQty', e.target.value)}
                  min="0"
                  placeholder="e.g., 1"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
                />
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  How many pieces were scrapped due to this defect?
                </p>
              </div>
            )}

            {/* Notes */}
            <div>
              <label htmlFor="notes" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Notes {formData.result === 'fail' ? <span className="text-red-600">*</span> : '(Optional)'}
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={4}
                placeholder={
                  formData.result === 'fail'
                    ? "Describe the defect in detail..."
                    : "Add any relevant notes about the inspection..."
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
                required={formData.result === 'fail'}
              />
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {formData.result === 'fail'
                  ? 'Required: Provide details about the defect'
                  : 'Optional: Record any observations'
                }
              </p>
            </div>

            {/* Info Box */}
            <div className={`border rounded-lg p-4 ${
              formData.result === 'pass'
                ? (isDarkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200')
                : (isDarkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200')
            }`}>
              <p className={`text-sm mb-2 ${
                formData.result === 'pass' ? (isDarkMode ? 'text-green-200' : 'text-green-900') : (isDarkMode ? 'text-red-200' : 'text-red-900')
              }`}>
                <span className="font-medium">
                  {formData.result === 'pass' ? 'Quality Check Passed' : 'Quality Check Failed'}
                </span>
              </p>
              <p className={`text-sm ${
                formData.result === 'pass' ? (isDarkMode ? 'text-green-300' : 'text-green-800') : (isDarkMode ? 'text-red-300' : 'text-red-800')
              }`}>
                {formData.result === 'pass'
                  ? 'First piece meets quality standards. Production can proceed.'
                  : 'First piece has defects. Review setup and correct before continuing production.'
                }
              </p>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                type="button"
                onClick={() => navigate('/app')}
                className={`flex-1 px-6 py-3 border rounded-lg transition-colors ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`flex-1 px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isValid && !isSubmitting
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Log Quality Check</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}