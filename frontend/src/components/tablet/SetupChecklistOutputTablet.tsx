import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronRight,
  CheckCircle2,
  Printer,
  Download,
  Star,
  ExternalLink,
  Shield,
  Wrench,
  Settings,
  CheckSquare,
  Database,
  ChevronDown,
  ChevronUp,
  EyeOff
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';
import { TabletLayout } from './TabletLayout';

interface SetupChecklistOutputTabletProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

interface ChecklistStep {
  id: string;
  text: string;
  completed: boolean;
}

interface ChecklistSection {
  title: string;
  steps: ChecklistStep[];
}

interface ParameterCard {
  id: string;
  label: string;
  value: string;
  source: string;
}

export function SetupChecklistOutputTablet({ userRole = 'supervisor' }: SetupChecklistOutputTabletProps) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  
  const [sections, setSections] = useState<ChecklistSection[]>([
    {
      title: 'Safety & prep',
      steps: [
        { id: 's1', text: 'Verify machine is in safe state (E-stop accessible)', completed: false },
        { id: 's2', text: 'Put on required PPE (safety glasses, gloves)', completed: false },
        { id: 's3', text: 'Clear work area of debris and old tooling', completed: false },
        { id: 's4', text: 'Lock out machine per SOP-12 section 2.1', completed: false },
      ]
    },
    {
      title: 'Tooling & fixtures',
      steps: [
        { id: 't1', text: 'Remove Widget A fixture (Part# FIX-WA-01)', completed: false },
        { id: 't2', text: 'Clean spindle taper and fixture mounting surface', completed: false },
        { id: 't3', text: 'Install Gear B fixture (Part# FIX-GB-02)', completed: false },
        { id: 't4', text: 'Torque fixture bolts to 45 Nm per SOP-12', completed: false },
        { id: 't5', text: 'Install cutting tool T03 (carbide end mill, 12mm)', completed: false },
        { id: 't6', text: 'Measure tool offset and update controller', completed: false },
      ]
    },
    {
      title: 'Machine settings',
      steps: [
        { id: 'm1', text: 'Load program PRG-GEARB-v2.nc from controller library', completed: false },
        { id: 'm2', text: 'Set spindle speed to 3200 RPM', completed: false },
        { id: 'm3', text: 'Set feed rate to 0.25 mm/rev', completed: false },
        { id: 'm4', text: 'Enable coolant system (ON)', completed: false },
        { id: 'm5', text: 'Verify work offset G54 is set to fixture datum', completed: false },
        { id: 'm6', text: 'Run dry cycle (no part) to check tool path', completed: false },
      ]
    },
    {
      title: 'First-piece inspection steps',
      steps: [
        { id: 'i1', text: 'Load first blank into fixture', completed: false },
        { id: 'i2', text: 'Run cycle in single-block mode', completed: false },
        { id: 'i3', text: 'Measure critical dimension D1 (target: 24.5mm ±0.05mm)', completed: false },
        { id: 'i4', text: 'Measure surface finish on face A (target: Ra ≤ 1.6 μm)', completed: false },
        { id: 'i5', text: 'Check gear tooth profile with template GT-B', completed: false },
        { id: 'i6', text: 'If all checks pass, proceed to production. Otherwise, adjust and re-inspect.', completed: false },
      ]
    }
  ]);

  const parameters: ParameterCard[] = [
    { id: 'p1', label: 'Spindle speed', value: '3200 RPM', source: 'SOP-12 Rev 3' },
    { id: 'p2', label: 'Feed rate', value: '0.25 mm/rev', source: 'KB: GearB setup guide' },
    { id: 'p3', label: 'Coolant', value: 'ON', source: 'SOP-12 Rev 3' },
    { id: 'p4', label: 'Tool', value: 'T03 (12mm carbide)', source: 'PRG-GEARB-v2.nc' },
    { id: 'p5', label: 'Fixture torque', value: '45 Nm', source: 'SOP-12 Rev 3' },
    { id: 'p6', label: 'Work offset', value: 'G54', source: 'KB: GearB setup guide' },
  ];

  const [isCompleted, setIsCompleted] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingNote, setRatingNote] = useState('');
  const [showParameters, setShowParameters] = useState(true);

  const toggleStep = (sectionIndex: number, stepId: string) => {
    setSections(prev => prev.map((section, idx) => {
      if (idx === sectionIndex) {
        return {
          ...section,
          steps: section.steps.map(step => 
            step.id === stepId ? { ...step, completed: !step.completed } : step
          )
        };
      }
      return section;
    }));
  };

  const handleMarkComplete = () => {
    setIsCompleted(true);
    setShowRating(true);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleExportPDF = () => {
    console.log('Exporting PDF...');
  };

  const handleSubmitRating = () => {
    console.log('Rating submitted:', rating, ratingNote);
    setShowRating(false);
  };

  const totalSteps = sections.reduce((acc, section) => acc + section.steps.length, 0);
  const completedSteps = sections.reduce(
    (acc, section) => acc + section.steps.filter(s => s.completed).length, 
    0
  );
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <TabletLayout userRole={userRole}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Setup Checklist — M03 changeover
          </h1>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Run: </span>
              <button
                onClick={() => navigate('/app/runs/RUN-2402')}
                className="font-medium text-blue-600 hover:underline"
              >
                RUN-2402
              </button>
            </span>
            <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              <span className="font-medium">Shift B</span>
            </span>
            <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              <span className="font-medium">Widget A → Gear B</span>
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
              <Database className="w-3.5 h-3.5" />
              Sourced
            </span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Jan 25, 2:30 PM
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {!isCompleted && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Progress: {completedSteps} / {totalSteps}
              </span>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {progressPercent}%
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {isCompleted && (
          <div className={`p-3 rounded-lg border ${
            isDarkMode 
              ? 'bg-green-900/20 border-green-700' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              <span className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                Checklist marked complete
              </span>
            </div>
          </div>
        )}

        {/* Parameters Toggle */}
        <button
          onClick={() => setShowParameters(!showParameters)}
          className={`w-full flex items-center justify-between p-3 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Parameter summary ({parameters.length})
          </span>
          {showParameters ? (
            <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </button>

        {/* Parameters */}
        {showParameters && (
          <div className="grid grid-cols-2 gap-3">
            {parameters.map((param) => (
              <div
                key={param.id}
                className={`p-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {param.label}
                </div>
                <div className={`text-base font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {param.value}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {param.source}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Checklist Sections */}
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className={`rounded-lg border p-4 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <h3 className={`text-base font-semibold mb-3 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {sectionIndex === 0 && <Shield className="w-4 h-4 text-red-600" />}
              {sectionIndex === 1 && <Wrench className="w-4 h-4 text-blue-600" />}
              {sectionIndex === 2 && <Settings className="w-4 h-4 text-purple-600" />}
              {sectionIndex === 3 && <CheckCircle2 className="w-4 h-4 text-green-600" />}
              {section.title}
            </h3>
            <div className="space-y-2.5">
              {section.steps.map((step, stepIndex) => (
                <div key={step.id} className="flex items-start gap-3">
                  <button
                    onClick={() => toggleStep(sectionIndex, step.id)}
                    disabled={isCompleted}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5 ${
                      step.completed
                        ? 'bg-blue-600 border-blue-600'
                        : isDarkMode
                          ? 'border-gray-600 hover:border-blue-500'
                          : 'border-gray-300 hover:border-blue-500'
                    } ${isCompleted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {step.completed && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <span className={`text-sm flex-1 ${
                    step.completed
                      ? isDarkMode 
                        ? 'text-gray-500 line-through' 
                        : 'text-gray-400 line-through'
                      : isDarkMode 
                        ? 'text-gray-300' 
                        : 'text-gray-700'
                  }`}>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mr-1`}>
                      {sectionIndex === 0 ? 'S' : sectionIndex === 1 ? 'T' : sectionIndex === 2 ? 'M' : 'I'}{stepIndex + 1}.
                    </span>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Rating Section */}
        {showRating && (
          <div className={`rounded-lg border p-4 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-base font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Rate clarity
            </h3>
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-95"
                >
                  <Star
                    className={`w-9 h-9 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : isDarkMode
                          ? 'text-gray-600'
                          : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={ratingNote}
              onChange={(e) => setRatingNote(e.target.value)}
              placeholder="Optional: Add a note..."
              className={`w-full px-3 py-2.5 rounded-lg border outline-none transition-colors resize-none ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              }`}
              rows={3}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSubmitRating}
                disabled={rating === 0}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  rating > 0
                    ? 'bg-blue-600 text-white active:bg-blue-700'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit rating
              </button>
              <button
                onClick={() => setShowRating(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 active:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                }`}
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handlePrintPDF}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 active:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 active:bg-gray-200'
            }`}
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleExportPDF}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 active:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 active:bg-gray-200'
            }`}
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>

        <button
          onClick={handleMarkComplete}
          disabled={isCompleted}
          className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-sm font-medium transition-colors ${
            isCompleted
              ? isDarkMode
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white active:bg-blue-700'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          {isCompleted ? 'Checklist completed' : 'Mark checklist complete'}
        </button>
      </div>
    </TabletLayout>
  );
}
