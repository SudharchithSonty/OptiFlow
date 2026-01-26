import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { 
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowRight,
  FileText,
  Wrench,
  Eye,
  EyeOff,
  ExternalLink,
  Info,
  Star,
  AlertTriangle,
  RefreshCw,
  X
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface SetupChecklistProps {
  userRole: 'owner' | 'planner' | 'supervisor';
}

interface ChecklistStep {
  id: string;
  step: number;
  description: string;
  completed: boolean;
  category: 'preparation' | 'changeover' | 'first-piece';
}

interface Parameter {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  source?: {
    type: 'artifact' | 'kb';
    reference: string;
    description: string;
  };
}

type ChecklistState = 'loaded' | 'validation-failed' | 'model-unavailable';

export function SetupChecklist({ userRole }: SetupChecklistProps) {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get params from URL
  const runId = searchParams.get('runId') || 'RUN-2402';
  const machineId = searchParams.get('machineId') || 'M03';
  const fromFamily = searchParams.get('fromFamily') || 'Widget A';
  const toFamily = searchParams.get('toFamily') || 'Gear B';
  const productId = searchParams.get('productId') || 'PROD-201';

  const [checklistState, setChecklistState] = useState<ChecklistState>('loaded');
  const [steps, setSteps] = useState<ChecklistStep[]>([
    { id: '1', step: 1, description: 'Review work order and product specifications', completed: false, category: 'preparation' },
    { id: '2', step: 2, description: 'Verify tool inventory and gather required tooling', completed: false, category: 'preparation' },
    { id: '3', step: 3, description: 'Clear previous workpiece and clean work area', completed: false, category: 'preparation' },
    { id: '4', step: 4, description: 'Remove Widget A tooling (T-450 set)', completed: false, category: 'changeover' },
    { id: '5', step: 5, description: 'Install Gear B tooling (T-620 set)', completed: false, category: 'changeover' },
    { id: '6', step: 6, description: 'Adjust machine parameters (RPM, DOC, feed rate)', completed: false, category: 'changeover' },
    { id: '7', step: 7, description: 'Verify tool offsets and Z-axis calibration', completed: false, category: 'changeover' },
    { id: '8', step: 8, description: 'Run first piece and measure critical dimensions', completed: false, category: 'first-piece' },
    { id: '9', step: 9, description: 'Verify surface finish and visual inspection', completed: false, category: 'first-piece' },
    { id: '10', step: 10, description: 'Document first-piece inspection results', completed: false, category: 'first-piece' },
  ]);

  const [parameters, setParameters] = useState<Parameter[]>([
    {
      id: 'rpm',
      name: 'Spindle RPM',
      value: 1200,
      unit: 'RPM',
      source: {
        type: 'artifact',
        reference: 'setup_params.csv:row_42',
        description: 'Historical setup for Gear B on M03',
      },
    },
    {
      id: 'doc',
      name: 'Depth of Cut',
      value: 0.8,
      unit: 'mm',
      source: {
        type: 'kb',
        reference: 'KB-112',
        description: 'Standard DOC for Gear B family',
      },
    },
    {
      id: 'feed',
      name: 'Feed Rate',
      value: 250,
      unit: 'mm/min',
      source: {
        type: 'artifact',
        reference: 'setup_params.csv:row_42',
        description: 'Historical setup for Gear B on M03',
      },
    },
    {
      id: 'offset-x',
      name: 'X-axis Offset',
      value: 15.2,
      unit: 'mm',
      source: {
        type: 'artifact',
        reference: 'tool_offsets.json:M03_T620',
        description: 'T-620 tooling offset for M03',
      },
    },
    {
      id: 'offset-z',
      name: 'Z-axis Offset',
      value: -3.5,
      unit: 'mm',
      source: {
        type: 'artifact',
        reference: 'tool_offsets.json:M03_T620',
        description: 'T-620 tooling offset for M03',
      },
    },
    {
      id: 'coolant',
      name: 'Coolant Flow',
      value: 8.5,
      unit: 'L/min',
      // No source - this will be hidden
    },
  ]);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [clarityRating, setClarityRating] = useState(0);
  const [ratingNotes, setRatingNotes] = useState('');

  const allStepsCompleted = steps.every(s => s.completed);
  const completedCount = steps.filter(s => s.completed).length;

  const handleToggleStep = (stepId: string) => {
    setSteps(prev => prev.map(s => 
      s.id === stepId ? { ...s, completed: !s.completed } : s
    ));
  };

  const handleCompleteChecklist = () => {
    if (allStepsCompleted) {
      setShowRatingModal(true);
    }
  };

  const handleSubmitRating = () => {
    console.log('Rating submitted:', { clarityRating, ratingNotes });
    setShowRatingModal(false);
    navigate('/app/agent/setup-guidance');
  };

  const getCategoryLabel = (category: ChecklistStep['category']) => {
    switch (category) {
      case 'preparation':
        return 'Preparation';
      case 'changeover':
        return 'Changeover';
      case 'first-piece':
        return 'First-Piece Inspection';
    }
  };

  const getCategoryColor = (category: ChecklistStep['category']) => {
    switch (category) {
      case 'preparation':
        return isDarkMode ? 'text-blue-400' : 'text-blue-600';
      case 'changeover':
        return isDarkMode ? 'text-purple-400' : 'text-purple-600';
      case 'first-piece':
        return isDarkMode ? 'text-green-400' : 'text-green-600';
    }
  };

  // Group steps by category
  const groupedSteps = {
    preparation: steps.filter(s => s.category === 'preparation'),
    changeover: steps.filter(s => s.category === 'changeover'),
    'first-piece': steps.filter(s => s.category === 'first-piece'),
  };

  // Validation Failed State
  if (checklistState === 'validation-failed') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-xl border-2 p-6 mb-6 ${
          isDarkMode 
            ? 'bg-red-500/10 border-red-500/30' 
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-start gap-4 mb-4">
            <AlertCircle className={`w-8 h-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>
                Validation Failed: Missing Sources
              </h3>
              <p className={`mb-3 ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                Critical parameters are missing source citations. For safety and auditability, numeric values cannot be displayed without verified sources.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>
              Fallback: Standard Operating Procedure Template
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
              A generic SOP template is available below, but numeric parameters are hidden for safety.
            </p>
          </div>

          <button
            onClick={() => setChecklistState('loaded')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate with Sources
          </button>
        </div>

        {/* Fallback SOP Template */}
        <div className={`rounded-xl border p-6 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Generic Setup Checklist (Fallback)
          </h3>
          <div className="space-y-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}
              >
                <Circle className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {step.description}
                </span>
              </div>
            ))}
          </div>
          <div className={`mt-4 p-4 rounded-lg border ${
            isDarkMode ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <p className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
              ⚠️ Numeric parameters hidden due to missing source citations. Consult process engineer before proceeding.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Model Unavailable State
  if (checklistState === 'model-unavailable') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-xl border-2 border-dashed p-6 mb-6 ${
          isDarkMode 
            ? 'bg-yellow-500/10 border-yellow-500/30' 
            : 'bg-yellow-50 border-yellow-300'
        }`}>
          <div className="flex items-start gap-4">
            <Info className={`w-8 h-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-900'}`}>
                AI Model Unavailable
              </h3>
              <p className={`${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                The AI model is temporarily unavailable. A fallback standard operating procedure template is shown below.
              </p>
            </div>
          </div>
        </div>

        {/* Fallback SOP Template */}
        <div className={`rounded-xl border p-6 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Standard Setup Procedure (Fallback)
          </h3>
          <div className="space-y-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}
              >
                <Circle className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {step.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Loaded State (Normal)
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className={`rounded-xl border p-6 mb-6 ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <Wrench className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {machineId} - Changeover {fromFamily} <ArrowRight className="inline w-5 h-5 mx-1" /> {toFamily}
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {runId} • Product: {productId}
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg ${
            isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
          }`}>
            <div className="text-2xl font-bold">{completedCount}/{steps.length}</div>
            <div className="text-xs">Steps Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`h-2 rounded-full overflow-hidden ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(completedCount / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Checklist Steps by Category */}
      {Object.entries(groupedSteps).map(([category, categorySteps]) => (
        <div
          key={category}
          className={`rounded-xl border p-6 mb-6 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
              : 'bg-white border-gray-200'
          }`}
        >
          <h3 className={`font-semibold mb-4 flex items-center gap-2 ${getCategoryColor(category as ChecklistStep['category'])}`}>
            {category === 'first-piece' && <Eye className="w-5 h-5" />}
            {category === 'changeover' && <Wrench className="w-5 h-5" />}
            {category === 'preparation' && <FileText className="w-5 h-5" />}
            {getCategoryLabel(category as ChecklistStep['category'])}
          </h3>

          <div className="space-y-2">
            {categorySteps.map((step) => (
              <button
                key={step.id}
                onClick={() => handleToggleStep(step.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                  step.completed
                    ? isDarkMode
                      ? 'bg-green-500/20 border border-green-500/30'
                      : 'bg-green-50 border border-green-200'
                    : isDarkMode
                    ? 'bg-gray-700/50 hover:bg-gray-700 border border-transparent'
                    : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 className={`w-6 h-6 flex-shrink-0 ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`} />
                ) : (
                  <Circle className={`w-6 h-6 flex-shrink-0 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                )}
                <div className="flex-1 text-left">
                  <span className={`font-medium ${
                    step.completed
                      ? isDarkMode ? 'text-green-300 line-through' : 'text-green-800 line-through'
                      : isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    Step {step.step}:
                  </span>
                  <span className={`ml-2 ${
                    step.completed
                      ? isDarkMode ? 'text-green-300 line-through' : 'text-green-800 line-through'
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {step.description}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Parameters Section */}
      <div className={`rounded-xl border p-6 mb-6 ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Machine Parameters
          </h3>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium ${
            isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
          }`}>
            <Info className="w-3.5 h-3.5" />
            All values sourced
          </div>
        </div>

        <div className="space-y-3">
          {parameters.map((param) => (
            <div
              key={param.id}
              className={`p-4 rounded-lg border ${
                isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {param.name}
                    </span>
                    {param.source ? (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                        param.source.type === 'artifact'
                          ? isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                          : isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                      }`}>
                        <FileText className="w-3 h-3" />
                        Source: {param.source.reference}
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                        isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                      }`}>
                        <EyeOff className="w-3 h-3" />
                        Source required
                      </span>
                    )}
                  </div>
                  {param.source && (
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {param.source.description}
                    </p>
                  )}
                </div>
              </div>

              {param.source ? (
                <div className={`inline-flex items-baseline gap-2 px-3 py-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-600/50' : 'bg-white'
                }`}>
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {param.value}
                  </span>
                  {param.unit && (
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {param.unit}
                    </span>
                  )}
                </div>
              ) : (
                <div className={`p-3 rounded-lg border-2 border-dashed ${
                  isDarkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                      Source required—value hidden
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                    This parameter cannot be displayed without a verified source citation for auditability.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Complete Checklist Button */}
      <div className="flex gap-3">
        <button
          onClick={handleCompleteChecklist}
          disabled={!allStepsCompleted}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
            allStepsCompleted
              ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          <CheckCircle2 className="w-6 h-6" />
          Complete Checklist
        </button>

        <button
          onClick={() => navigate('/app/agent/setup-guidance')}
          className={`px-6 py-4 rounded-xl font-medium transition-colors ${
            isDarkMode
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Cancel
        </button>
      </div>

      {!allStepsCompleted && (
        <p className={`text-center mt-3 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Complete all steps to finish the checklist
        </p>
      )}

      {/* Clarity Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowRatingModal(false)}
          />

          {/* Modal */}
          <div className={`relative w-full max-w-md rounded-xl shadow-2xl ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Rate Checklist Clarity
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Help us improve the AI-generated checklists
                  </p>
                </div>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  How clear and helpful was this checklist?
                </label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setClarityRating(rating)}
                      className={`p-2 transition-all ${
                        clarityRating >= rating
                          ? 'text-yellow-500'
                          : isDarkMode ? 'text-gray-600 hover:text-gray-400' : 'text-gray-300 hover:text-gray-400'
                      }`}
                    >
                      <Star
                        className="w-10 h-10"
                        fill={clarityRating >= rating ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs mt-2">
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Not helpful</span>
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Very helpful</span>
                </div>
              </div>

              {/* Optional Notes */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Additional feedback (optional)
                </label>
                <textarea
                  value={ratingNotes}
                  onChange={(e) => setRatingNotes(e.target.value)}
                  placeholder="Any suggestions or issues with the checklist?"
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border resize-none outline-none transition-colors ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  }`}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmitRating}
                  disabled={clarityRating === 0}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    clarityRating === 0
                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Submit Rating
                </button>
                <button
                  onClick={() => {
                    setShowRatingModal(false);
                    navigate('/app/agent/setup-guidance');
                  }}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
