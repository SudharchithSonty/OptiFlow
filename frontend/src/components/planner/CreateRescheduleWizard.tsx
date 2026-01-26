import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2,
  Zap,
  AlertTriangle,
  Hand,
  Save,
  Clock,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type TriggerType = 'rush_order' | 'breakdown' | 'manual';
type RescheduleMode = 'from_now' | 'full_recompute';

interface ProductionEvent {
  id: string;
  type: string;
  label: string;
  startTime: string;
  duration: number;
  severity: string;
  machineId?: string;
  orderId?: string;
}

interface WizardState {
  currentStep: number;
  trigger: TriggerType | null;
  selectedEvents: Set<string>;
  rescheduleMode: RescheduleMode;
  draftSaved: boolean;
  draftSavedAt: string | null;
  newRunId: string | null;
}

const triggerOptions = [
  {
    type: 'rush_order' as TriggerType,
    label: 'Rush Order',
    icon: Zap,
    description: 'High-priority order needs immediate scheduling',
    color: 'orange',
  },
  {
    type: 'breakdown' as TriggerType,
    label: 'Machine Breakdown',
    icon: AlertTriangle,
    description: 'Machine failure requires schedule adjustment',
    color: 'red',
  },
  {
    type: 'manual' as TriggerType,
    label: 'Manual Reschedule',
    icon: Hand,
    description: 'Planner-initiated schedule optimization',
    color: 'blue',
  },
];

const mockEvents: ProductionEvent[] = [
  {
    id: 'EVT-001',
    type: 'machine_breakdown',
    label: 'M03 Hydraulic Failure',
    startTime: '2026-01-01 11:30',
    duration: 30,
    severity: 'high',
    machineId: 'M03',
  },
  {
    id: 'EVT-002',
    type: 'rush_order',
    label: 'Rush Order ORD-RUSH-456',
    startTime: '2026-01-01 09:15',
    duration: 180,
    severity: 'critical',
    orderId: 'ORD-RUSH-456',
  },
  {
    id: 'EVT-003',
    type: 'maintenance',
    label: 'M01 Scheduled Calibration',
    startTime: '2026-01-01 14:00',
    duration: 45,
    severity: 'medium',
    machineId: 'M01',
  },
  {
    id: 'EVT-004',
    type: 'material_delay',
    label: 'Steel Component Delay',
    startTime: '2026-01-01 08:00',
    duration: 120,
    severity: 'high',
    orderId: 'ORD-1240',
  },
];

export function CreateRescheduleWizard() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { runId } = useParams<{ runId: string }>();
  const location = useLocation();
  const parentRun = location.state?.parentRun;

  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 1,
    trigger: null,
    selectedEvents: new Set(),
    rescheduleMode: 'from_now',
    draftSaved: false,
    draftSavedAt: null,
    newRunId: null,
  });

  const [isCreatingRun, setIsCreatingRun] = useState(false);

  // Auto-save draft impact report after Step 2
  useEffect(() => {
    if (wizardState.currentStep === 3 && !wizardState.draftSaved && wizardState.selectedEvents.size > 0) {
      // Simulate auto-save
      const timer = setTimeout(() => {
        setWizardState(prev => ({
          ...prev,
          draftSaved: true,
          draftSavedAt: new Date().toLocaleString(),
        }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [wizardState.currentStep, wizardState.draftSaved, wizardState.selectedEvents]);

  const handleNext = () => {
    if (wizardState.currentStep < 4) {
      setWizardState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const handleBack = () => {
    if (wizardState.currentStep > 1) {
      setWizardState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const handleTriggerSelect = (trigger: TriggerType) => {
    setWizardState(prev => ({ ...prev, trigger }));
  };

  const handleEventToggle = (eventId: string) => {
    setWizardState(prev => {
      const newSelected = new Set(prev.selectedEvents);
      if (newSelected.has(eventId)) {
        newSelected.delete(eventId);
      } else {
        newSelected.add(eventId);
      }
      return { ...prev, selectedEvents: newSelected };
    });
  };

  const handleModeChange = (mode: RescheduleMode) => {
    setWizardState(prev => ({ ...prev, rescheduleMode: mode }));
  };

  const handleSaveDraftNow = async () => {
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 500));
    setWizardState(prev => ({
      ...prev,
      draftSaved: true,
      draftSavedAt: new Date().toLocaleString(),
    }));
  };

  const handleCreateRun = async () => {
    setIsCreatingRun(true);
    
    // Simulate run creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newRunId = `RUN-${Math.floor(Math.random() * 9000) + 1000}`;
    setWizardState(prev => ({ ...prev, newRunId }));
    setIsCreatingRun(false);
    
    // Move to final step
    handleNext();
  };

  const canProceedStep1 = wizardState.trigger !== null;
  const canProceedStep2 = wizardState.selectedEvents.size > 0;

  const steps = [
    { number: 1, label: 'Choose Trigger' },
    { number: 2, label: 'Select Events' },
    { number: 3, label: 'Reschedule Mode' },
    { number: 4, label: 'Create Run' },
  ];

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <button
          onClick={() => navigate(`/app/runs/${runId || parentRun?.id}/events`)}
          className={`flex items-center gap-2 mb-4 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Events</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <RotateCcw className="w-6 h-6 text-orange-600" />
              <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Create Reschedule Run</h1>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Parent Run: <span className="font-mono text-blue-600">{runId || parentRun?.id || 'RUN-2401'}</span>
            </p>
          </div>

          {/* Draft Saved Indicator */}
          {wizardState.draftSaved && wizardState.draftSavedAt && (
            <div className={`flex items-center gap-2 px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'}`}>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                Draft saved at {wizardState.draftSavedAt}
              </span>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mt-6">
          <div className="flex items-center justify-between max-w-3xl">
            {steps.map((step, idx) => {
              const isActive = wizardState.currentStep === step.number;
              const isCompleted = wizardState.currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isCompleted
                          ? 'bg-green-600 border-green-600 text-white'
                          : isActive
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-white border-gray-300 text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span>{step.number}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center ${
                        isActive ? 'text-blue-700' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded transition-colors ${
                        isCompleted ? 'bg-green-600' : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Choose Trigger */}
          {wizardState.currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Step 1: Choose Trigger</h2>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  What is the primary reason for creating this reschedule?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {triggerOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = wizardState.trigger === option.type;

                  return (
                    <button
                      key={option.type}
                      onClick={() => handleTriggerSelect(option.type)}
                      className={`p-6 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50'
                          : isDarkMode ? 'border-gray-700 bg-gray-800 hover:border-gray-600' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                          option.color === 'orange'
                            ? 'bg-orange-100'
                            : option.color === 'red'
                            ? 'bg-red-100'
                            : 'bg-blue-100'
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            option.color === 'orange'
                              ? 'text-orange-600'
                              : option.color === 'red'
                              ? 'text-red-600'
                              : 'text-blue-600'
                          }`}
                        />
                      </div>
                      <h3 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{option.label}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Select Events */}
          {wizardState.currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Step 2: Select Events to Include</h2>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Choose which production events should be considered in the reschedule
                </p>
              </div>

              <div className="space-y-3">
                {mockEvents.map((event) => {
                  const isSelected = wizardState.selectedEvents.has(event.id);

                  return (
                    <button
                      key={event.id}
                      onClick={() => handleEventToggle(event.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50'
                          : isDarkMode ? 'border-gray-700 bg-gray-800 hover:border-gray-600' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>{event.label}</h3>
                            <span className={`px-2 py-0.5 text-xs rounded ${
                              event.severity === 'critical'
                                ? 'bg-red-100 text-red-700'
                                : event.severity === 'high'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {event.severity}
                            </span>
                          </div>
                          <div className={`flex items-center gap-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <span>{event.startTime}</span>
                            <span>•</span>
                            <span>{event.duration} min</span>
                            {event.machineId && (
                              <>
                                <span>•</span>
                                <span className="font-mono">{event.machineId}</span>
                              </>
                            )}
                            {event.orderId && (
                              <>
                                <span>•</span>
                                <span className="font-mono">{event.orderId}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600'
                              : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                  <span className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>Selected {wizardState.selectedEvents.size} event(s)</span>
                  <br />
                  These events will be factored into the reschedule calculation
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Reschedule Mode */}
          {wizardState.currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Step 3: Reschedule Mode</h2>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Choose how the scheduler should handle existing operations
                </p>
              </div>

              {/* Draft Save Status */}
              {!wizardState.draftSaved && (
                <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-yellow-900/30 border-yellow-800' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="flex items-start gap-3">
                    <Loader2 className="w-5 h-5 text-yellow-600 animate-spin flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className={`text-sm mb-2 ${isDarkMode ? 'text-yellow-200' : 'text-yellow-900'}`}>
                        Generating draft impact report...
                      </p>
                      <button
                        onClick={handleSaveDraftNow}
                        className={`text-sm underline ${isDarkMode ? 'text-yellow-300 hover:text-yellow-200' : 'text-yellow-700 hover:text-yellow-800'}`}
                      >
                        Save draft now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {wizardState.draftSaved && (
                <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`text-sm mb-1 ${isDarkMode ? 'text-green-200' : 'text-green-900'}`}>
                        Draft Impact Report saved ✓ at {wizardState.draftSavedAt}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                        A partial impact analysis has been saved to the parent run. You can review it later from the run detail page.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode Selection */}
              <div className="space-y-4">
                {/* From Now (Default) */}
                <button
                  onClick={() => handleModeChange('from_now')}
                  className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                    wizardState.rescheduleMode === 'from_now'
                      ? 'border-blue-600 bg-blue-50'
                      : isDarkMode ? 'border-gray-700 bg-gray-800 hover:border-gray-600' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 text-blue-600" />
                      <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Reschedule from Now</h3>
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                        DEFAULT
                      </span>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        wizardState.rescheduleMode === 'from_now'
                          ? 'bg-blue-600 border-blue-600'
                          : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                      }`}
                    >
                      {wizardState.rescheduleMode === 'from_now' && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                  <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Reschedule from current time forward, preserving completed work
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        <strong className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>Completed operations:</strong> Locked and preserved
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        <strong className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>In-progress operations:</strong> Flagged for review
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        <strong className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>Future operations:</strong> Rescheduled based on events
                      </span>
                    </li>
                  </ul>
                </button>

                {/* Full Recompute */}
                <button
                  onClick={() => handleModeChange('full_recompute')}
                  className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                    wizardState.rescheduleMode === 'full_recompute'
                      ? 'border-blue-600 bg-blue-50'
                      : isDarkMode ? 'border-gray-700 bg-gray-800 hover:border-gray-600' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <RotateCcw className="w-6 h-6 text-purple-600" />
                      <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Full Recompute</h3>
                      <span className={`px-2 py-0.5 text-xs rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        OPTIONAL
                      </span>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        wizardState.rescheduleMode === 'full_recompute'
                          ? 'bg-blue-600 border-blue-600'
                          : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                      }`}
                    >
                      {wizardState.rescheduleMode === 'full_recompute' && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Completely recompute the entire schedule from scratch
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Use when you want to optimize the full schedule without constraints from past decisions
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Create Run */}
          {wizardState.currentStep === 4 && (
            <div className="space-y-6">
              {!wizardState.newRunId ? (
                <>
                  <div>
                    <h2 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Step 4: Create New Run</h2>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Review your configuration and create the reschedule run
                    </p>
                  </div>

                  {/* Summary */}
                  <div className={`border rounded-lg p-6 space-y-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div>
                      <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Trigger:</p>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                        {triggerOptions.find(t => t.type === wizardState.trigger)?.label}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Events:</p>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{wizardState.selectedEvents.size} event(s) selected</p>
                    </div>
                    <div>
                      <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mode:</p>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                        {wizardState.rescheduleMode === 'from_now' ? 'Reschedule from Now' : 'Full Recompute'}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Draft Report:</p>
                      <p className="text-green-700">✓ Saved at {wizardState.draftSavedAt}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateRun}
                    disabled={isCreatingRun}
                    className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isCreatingRun ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating New Run...</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-5 h-5" />
                        <span>Create Reschedule Run</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  {/* Success State */}
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Reschedule Run Created!</h2>
                    <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Your new run has been created successfully
                    </p>
                    <div className={`border rounded-lg p-6 mb-6 max-w-md mx-auto ${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                      <p className={`text-sm mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>New Run ID:</p>
                      <p className={`text-2xl font-mono ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>{wizardState.newRunId}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/app/runs/${wizardState.newRunId}`)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    >
                      <span>Go to New Run</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      {wizardState.currentStep < 4 && (
        <div className={`border-t px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={wizardState.currentStep === 1}
              className={`px-6 py-3 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={
                (wizardState.currentStep === 1 && !canProceedStep1) ||
                (wizardState.currentStep === 2 && !canProceedStep2)
              }
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>Next</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}