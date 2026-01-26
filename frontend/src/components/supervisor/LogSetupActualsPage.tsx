import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Save, Wrench, Clock } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface SetupFormData {
  date: string;
  shift: 'A' | 'B' | 'C';
  machineId: string;
  fromFamily: string;
  toFamily: string;
  setupStartTime: string;
  setupEndTime: string;
  notes: string;
}

const machines = ['M01', 'M02', 'M03', 'M04', 'M05'];
const productFamilies = ['Widget', 'Bracket', 'Shaft', 'Gear', 'Cover', 'Housing', 'Pin', 'Flange'];

export function LogSetupActualsPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<SetupFormData>({
    date: new Date().toISOString().split('T')[0],
    shift: 'A',
    machineId: '',
    fromFamily: '',
    toFamily: '',
    setupStartTime: '',
    setupEndTime: '',
    notes: '',
  });

  const [setupDuration, setSetupDuration] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-compute setup duration
  useEffect(() => {
    if (formData.setupStartTime && formData.setupEndTime) {
      const start = new Date(`2000-01-01T${formData.setupStartTime}`);
      const end = new Date(`2000-01-01T${formData.setupEndTime}`);
      const diffMs = end.getTime() - start.getTime();
      const diffMin = Math.round(diffMs / 60000);
      
      if (diffMin >= 0) {
        setSetupDuration(diffMin);
      } else {
        setSetupDuration(null);
      }
    } else {
      setSetupDuration(null);
    }
  }, [formData.setupStartTime, formData.setupEndTime]);

  const handleChange = (field: keyof SetupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Setup actuals logged:', { ...formData, setupDuration });
    
    // Navigate back
    navigate('/app');
  };

  const isValid = 
    formData.date &&
    formData.machineId &&
    formData.fromFamily &&
    formData.toFamily &&
    formData.setupStartTime &&
    formData.setupEndTime &&
    setupDuration !== null &&
    setupDuration >= 0;

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
          <div className="p-2 bg-blue-100 rounded-lg">
            <Wrench className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Log Setup Actuals</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Record actual changeover time and details
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
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                >
                  <option value="A">Shift A</option>
                  <option value="B">Shift B</option>
                  <option value="C">Shift C</option>
                </select>
              </div>
            </div>

            {/* Machine */}
            <div>
              <label htmlFor="machineId" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Machine <span className="text-red-600">*</span>
              </label>
              <select
                id="machineId"
                value={formData.machineId}
                onChange={(e) => handleChange('machineId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                required
              >
                <option value="">Select machine...</option>
                {machines.map(machine => (
                  <option key={machine} value={machine}>
                    {machine} {machine === 'M03' ? '(Press 3 - Bottleneck)' : ''}
                  </option>
                ))}
              </select>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Which machine was the setup performed on?
              </p>
            </div>

            {/* Product Family Transition */}
            <div>
              <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Product Family Transition <span className="text-red-600">*</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* From Family */}
                <div>
                  <label htmlFor="fromFamily" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    From:
                  </label>
                  <select
                    id="fromFamily"
                    value={formData.fromFamily}
                    onChange={(e) => handleChange('fromFamily', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    required
                  >
                    <option value="">Select family...</option>
                    {productFamilies.map(family => (
                      <option key={family} value={family}>
                        {family}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Arrow */}
                <div className="hidden sm:flex items-center justify-center pt-8">
                  <span className={`text-2xl ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>→</span>
                </div>

                {/* To Family */}
                <div>
                  <label htmlFor="toFamily" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    To:
                  </label>
                  <select
                    id="toFamily"
                    value={formData.toFamily}
                    onChange={(e) => handleChange('toFamily', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    required
                  >
                    <option value="">Select family...</option>
                    {productFamilies.map(family => (
                      <option key={family} value={family}>
                        {family}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                What product families were involved in the changeover?
              </p>
            </div>

            {/* Setup Timing */}
            <div>
              <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Setup Timing <span className="text-red-600">*</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Time */}
                <div>
                  <label htmlFor="setupStartTime" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Start Time:
                  </label>
                  <input
                    type="time"
                    id="setupStartTime"
                    value={formData.setupStartTime}
                    onChange={(e) => handleChange('setupStartTime', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    required
                  />
                </div>

                {/* End Time */}
                <div>
                  <label htmlFor="setupEndTime" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    End Time:
                  </label>
                  <input
                    type="time"
                    id="setupEndTime"
                    value={formData.setupEndTime}
                    onChange={(e) => handleChange('setupEndTime', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    required
                  />
                </div>
              </div>

              {/* Auto-computed Duration */}
              {setupDuration !== null && (
                <div className={`mt-3 p-3 border rounded-lg ${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                        <span className="font-medium">Computed Duration:</span> {setupDuration} minutes
                      </p>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        {Math.floor(setupDuration / 60)}h {setupDuration % 60}m
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {setupDuration !== null && setupDuration < 0 && (
                <p className="text-sm text-red-600 mt-2">
                  End time must be after start time
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={4}
                placeholder="Add any relevant notes about the setup (e.g., issues encountered, tooling changes, etc.)"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Optional: Record any observations or issues during setup
              </p>
            </div>

            {/* Info Box */}
            <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="font-medium">Why log setup actuals?</span>
              </p>
              <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Helps improve setup time estimates</li>
                <li>• Identifies bottleneck machines needing attention</li>
                <li>• Tracks changeover efficiency over time</li>
              </ul>
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
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
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
                    <span>Log Setup Actuals</span>
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