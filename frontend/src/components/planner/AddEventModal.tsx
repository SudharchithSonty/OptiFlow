import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { ArrowLeft, Save, AlertTriangle, Zap, Wrench, Package } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type EventType = 'machine_breakdown' | 'rush_order' | 'maintenance' | 'material_delay';
type Severity = 'low' | 'medium' | 'high' | 'critical';

interface EventFormData {
  type: EventType;
  startTime: string;
  duration: string;
  machineId: string;
  orderId: string;
  severity: Severity;
  notes: string;
}

const eventTypeConfig = {
  machine_breakdown: { label: 'Machine Breakdown', icon: AlertTriangle, requiresMachine: true },
  rush_order: { label: 'Rush Order', icon: Zap, requiresOrder: true },
  maintenance: { label: 'Scheduled Maintenance', icon: Wrench, requiresMachine: true },
  material_delay: { label: 'Material Delay', icon: Package, requiresOrder: true },
};

export function AddEventModal() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { runId } = useParams<{ runId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [formData, setFormData] = useState<EventFormData>({
    type: 'machine_breakdown',
    startTime: '',
    duration: '',
    machineId: '',
    orderId: '',
    severity: 'medium',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read query parameter and pre-select event type
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && typeParam in eventTypeConfig) {
      handleChange('type', typeParam as EventType);
    }
  }, [searchParams]);

  const handleChange = (field: keyof EventFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Navigate back to events list
    navigate(`/app/runs/${runId}/events`);
  };

  const config = eventTypeConfig[formData.type];
  const Icon = config.icon;

  const isValid = 
    formData.startTime &&
    formData.duration &&
    formData.notes &&
    (config.requiresMachine ? formData.machineId : true) &&
    (config.requiresOrder ? formData.orderId : true);

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <button
          onClick={() => navigate(`/app/runs/${runId}/events`)}
          className={`flex items-center gap-2 mb-4 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Events</span>
        </button>

        <div>
          <h1 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add Production Event</h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Run ID: <span className="font-mono text-blue-600">{runId || 'RUN-2401'}</span>
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className={`border rounded-lg p-6 space-y-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {/* Event Type */}
            <div>
              <label htmlFor="type" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Event Type <span className="text-red-600">*</span>
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                required
              >
                {Object.entries(eventTypeConfig).map(([type, config]) => (
                  <option key={type} value={type}>
                    {config.label}
                  </option>
                ))}
              </select>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Select the type of production event
              </p>
            </div>

            {/* Start Time */}
            <div>
              <label htmlFor="startTime" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Start Time <span className="text-red-600">*</span>
              </label>
              <input
                type="datetime-local"
                id="startTime"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                required
              />
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                When did the event start?
              </p>
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Duration (minutes) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                id="duration"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                min="1"
                placeholder="e.g., 30"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
                required
              />
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Expected or actual duration of the event
              </p>
            </div>

            {/* Machine ID (conditional) */}
            {config.requiresMachine && (
              <div>
                <label htmlFor="machineId" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Machine ID <span className="text-red-600">*</span>
                </label>
                <select
                  id="machineId"
                  value={formData.machineId}
                  onChange={(e) => handleChange('machineId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                >
                  <option value="">Select machine...</option>
                  <option value="M01">M01 - CNC Mill 1</option>
                  <option value="M02">M02 - Lathe 2</option>
                  <option value="M03">M03 - Press 3 (Bottleneck)</option>
                  <option value="M04">M04 - Grinder 4</option>
                  <option value="M05">M05 - Drill 5</option>
                </select>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Which machine is affected?
                </p>
              </div>
            )}

            {/* Order ID (conditional) */}
            {config.requiresOrder && (
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
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                />
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Which order is affected?
                </p>
              </div>
            )}

            {/* Severity */}
            <div>
              <label htmlFor="severity" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Severity <span className="text-red-600">*</span>
              </label>
              <select
                id="severity"
                value={formData.severity}
                onChange={(e) => handleChange('severity', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                required
              >
                <option value="low">Low - Minor impact</option>
                <option value="medium">Medium - Moderate impact</option>
                <option value="high">High - Significant impact</option>
                <option value="critical">Critical - Severe impact</option>
              </select>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Impact level on production schedule
              </p>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Notes <span className="text-red-600">*</span>
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={4}
                placeholder="Describe the event and any relevant details..."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
                required
              />
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Detailed description of the event
              </p>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                type="button"
                onClick={() => navigate(`/app/runs/${runId}/events`)}
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
                    <span>Add Event</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className={`mt-6 border rounded-lg p-4 ${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
            <div className="flex items-start gap-3">
              <Icon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className={`text-sm mb-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                  <span className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>Adding {config.label}</span>
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                  {config.requiresMachine && 'This event requires a machine assignment. '}
                  {config.requiresOrder && 'This event requires an order assignment. '}
                  Events help the system understand production disruptions and can trigger reschedule recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}