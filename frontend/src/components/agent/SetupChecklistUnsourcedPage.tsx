import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronRight,
  CheckCircle2,
  Clock,
  Zap,
  FileText,
  Settings,
  Activity,
  Printer,
  Download,
  Star,
  ExternalLink,
  Shield,
  Wrench,
  AlertTriangle,
  CheckSquare,
  Upload,
  Search,
  Send,
  EyeOff,
  Info,
  ChevronDown,
  ChevronUp,
  Database,
  FileCheck
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface SetupChecklistUnsourcedPageProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

interface ChecklistStep {
  id: string;
  text: string;
  completed: boolean;
  requiresNumeric?: boolean;
}

interface ChecklistSection {
  title: string;
  steps: ChecklistStep[];
}

interface ParameterCard {
  id: string;
  label: string;
  hasSource: boolean;
  source?: string;
}

interface Evidence {
  id: string;
  type: 'artifact' | 'kb' | 'manual';
  name: string;
  attachedAt: string;
  coveredParams: string[];
}

export function SetupChecklistUnsourcedPage({ userRole = 'supervisor' }: SetupChecklistUnsourcedPageProps) {
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
        { id: 't4', text: 'Torque fixture bolts to [value hidden] per SOP-12', completed: false, requiresNumeric: true },
        { id: 't5', text: 'Install cutting tool T03 (carbide end mill, [value hidden])', completed: false, requiresNumeric: true },
        { id: 't6', text: 'Measure tool offset and update controller', completed: false },
      ]
    },
    {
      title: 'Machine settings',
      steps: [
        { id: 'm1', text: 'Load program PRG-GEARB-v2.nc from controller library', completed: false },
        { id: 'm2', text: 'Set spindle speed to [value hidden]', completed: false, requiresNumeric: true },
        { id: 'm3', text: 'Set feed rate to [value hidden]', completed: false, requiresNumeric: true },
        { id: 'm4', text: 'Enable coolant system [value hidden]', completed: false, requiresNumeric: true },
        { id: 'm5', text: 'Verify work offset [value hidden] is set to fixture datum', completed: false, requiresNumeric: true },
        { id: 'm6', text: 'Run dry cycle (no part) to check tool path', completed: false },
      ]
    },
    {
      title: 'First-piece inspection steps',
      steps: [
        { id: 'i1', text: 'Load first blank into fixture', completed: false },
        { id: 'i2', text: 'Run cycle in single-block mode', completed: false },
        { id: 'i3', text: 'Measure critical dimension D1 (target: [value hidden])', completed: false, requiresNumeric: true },
        { id: 'i4', text: 'Measure surface finish on face A (target: [value hidden])', completed: false, requiresNumeric: true },
        { id: 'i5', text: 'Check gear tooth profile with template GT-B', completed: false },
        { id: 'i6', text: 'If all checks pass, proceed to production. Otherwise, adjust and re-inspect.', completed: false },
      ]
    }
  ]);

  const parameters: ParameterCard[] = [
    { id: 'p1', label: 'Spindle speed', hasSource: false },
    { id: 'p2', label: 'Feed rate', hasSource: false },
    { id: 'p3', label: 'Coolant', hasSource: false },
    { id: 'p4', label: 'Tool diameter', hasSource: false },
    { id: 'p5', label: 'Fixture torque', hasSource: false },
    { id: 'p6', label: 'Work offset', hasSource: false },
  ];

  const [evidenceList, setEvidenceList] = useState<Evidence[]>([
    {
      id: 'e1',
      type: 'kb',
      name: 'KB: General Machine Setup Guidelines',
      attachedAt: 'Jan 25, 2:25 PM',
      coveredParams: ['Safety procedures', 'PPE requirements']
    }
  ]);

  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(true);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

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

  const handleAttachArtifact = (paramId: string) => {
    console.log('Attach artifact for parameter:', paramId);
    // In real app, would open file upload dialog
  };

  const handleSearchKB = (paramId: string) => {
    console.log('Search KB for parameter:', paramId);
    // In real app, would open KB search modal
  };

  const handleRequestFromPlanner = (paramId: string) => {
    console.log('Request from planner for parameter:', paramId);
    // In real app, would send request notification
  };

  const handleExportWithoutValues = () => {
    console.log('Exporting without numeric values...');
  };

  const totalSteps = sections.reduce((acc, section) => acc + section.steps.length, 0);
  const completedSteps = sections.reduce(
    (acc, section) => acc + section.steps.filter(s => s.completed).length, 
    0
  );
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const sourcedCount = parameters.filter(p => p.hasSource).length;
  const totalParams = parameters.length;

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate('/app/agent/home')}
              className={`hover:underline ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Agent
            </button>
            <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <button
              onClick={() => navigate('/app/agent/setup-guidance')}
              className={`hover:underline ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Setup Guidance
            </button>
            <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>Setup Checklist (Unsourced)</span>
          </div>

          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Setup Checklist — M03 changeover
                </h1>
                <div className="flex items-center gap-3 text-sm">
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
                    <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Shift: </span>
                    <span className="font-medium">B</span>
                  </span>
                  <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>From: </span>
                    <span className="font-medium">Widget A</span>
                    <span className="mx-1">→</span>
                    <span className="font-medium">Gear B</span>
                  </span>
                  <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Generated: </span>
                    <span className="font-medium">Jan 25, 2:30 PM</span>
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
                <AlertTriangle className="w-4 h-4" />
                Partially sourced
              </span>
            </div>

            {/* Source Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Sources: {sourcedCount} / {totalParams} parameters
                </span>
                <button
                  onClick={() => setEvidenceDrawerOpen(!evidenceDrawerOpen)}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  Evidence
                  {evidenceDrawerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${(sourcedCount / totalParams) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div className={`rounded-xl border-2 p-4 ${
            isDarkMode 
              ? 'bg-amber-900/20 border-amber-700' 
              : 'bg-amber-50 border-amber-300'
          }`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-6 h-6 flex-shrink-0 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-amber-300' : 'text-amber-900'}`}>
                  Numeric settings are hidden unless sourced from an artifact or KB citation.
                </h3>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                  To reveal parameter values, attach source documents or search the knowledge base. This ensures all numeric values are traceable and verifiable.
                </p>
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Checklist */}
            <div className="lg:col-span-2 space-y-4">
              {sections.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className={`rounded-xl border p-6 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {sectionIndex === 0 && <Shield className="w-5 h-5 text-red-600" />}
                    {sectionIndex === 1 && <Wrench className="w-5 h-5 text-blue-600" />}
                    {sectionIndex === 2 && <Settings className="w-5 h-5 text-purple-600" />}
                    {sectionIndex === 3 && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    {section.title}
                  </h3>
                  <div className="space-y-3">
                    {section.steps.map((step, stepIndex) => (
                      <div key={step.id} className="flex items-start gap-3 group">
                        <button
                          onClick={() => toggleStep(sectionIndex, step.id)}
                          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                            step.completed
                              ? 'bg-blue-600 border-blue-600'
                              : isDarkMode
                                ? 'border-gray-600 hover:border-blue-500'
                                : 'border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {step.completed && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <span className={`text-sm font-medium ${
                              isDarkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {sectionIndex === 0 ? 'S' : sectionIndex === 1 ? 'T' : sectionIndex === 2 ? 'M' : 'I'}{stepIndex + 1}.
                            </span>
                            <div className="flex-1">
                              <span className={`text-sm ${
                                step.completed
                                  ? isDarkMode 
                                    ? 'text-gray-500 line-through' 
                                    : 'text-gray-400 line-through'
                                  : isDarkMode 
                                    ? 'text-gray-300' 
                                    : 'text-gray-700'
                              }`}>
                                {step.text}
                              </span>
                              {step.requiresNumeric && (
                                <div className="flex items-center gap-2 mt-2">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                                    isDarkMode 
                                      ? 'bg-amber-900/30 text-amber-400 border border-amber-700' 
                                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}>
                                    <EyeOff className="w-3 h-3" />
                                    value hidden
                                  </span>
                                  <button 
                                    onClick={() => setShowPolicyModal(true)}
                                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                                  >
                                    <Info className="w-3 h-3" />
                                    View policy
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Parameter Summary */}
            <div className="space-y-4">
              <div className={`rounded-xl border p-4 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Parameter summary
                </h3>
                <div className="space-y-3">
                  {parameters.map((param) => (
                    <div
                      key={param.id}
                      className={`p-3 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700/50 border-gray-600' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {param.label}
                      </div>
                      <div className={`text-base font-semibold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        —
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                          isDarkMode 
                            ? 'bg-amber-900/30 text-amber-400 border border-amber-700' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          Source required
                        </span>
                      </div>
                      
                      {/* Inline Actions */}
                      <div className="flex flex-col gap-2 mt-3">
                        <button 
                          onClick={() => handleAttachArtifact(param.id)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            isDarkMode 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Attach artifact
                        </button>
                        <button 
                          onClick={() => handleSearchKB(param.id)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          <Search className="w-3.5 h-3.5" />
                          Search KB
                        </button>
                        <button 
                          onClick={() => handleRequestFromPlanner(param.id)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          Request from Planner
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className={`flex items-center gap-3 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              disabled
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-not-allowed ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-500' 
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              disabled
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-not-allowed ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-500' 
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={handleExportWithoutValues}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Export without numeric values
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Drawer (Right Panel) */}
      {evidenceDrawerOpen && (
        <div className={`w-80 border-l ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} overflow-auto`}>
          <div className="p-6 space-y-4">
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Evidence drawer
              </h3>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Currently attached sources ({evidenceList.length})
              </p>
            </div>

            {evidenceList.length === 0 ? (
              <div className={`p-6 rounded-lg border-2 border-dashed text-center ${
                isDarkMode 
                  ? 'border-gray-700 bg-gray-700/30' 
                  : 'border-gray-300 bg-gray-50'
              }`}>
                <Database className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No sources attached
                </p>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Add artifacts or KB articles to reveal parameter values
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {evidenceList.map((evidence) => (
                  <div
                    key={evidence.id}
                    className={`p-4 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {evidence.type === 'kb' && <FileCheck className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />}
                      {evidence.type === 'artifact' && <FileText className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />}
                      {evidence.type === 'manual' && <Upload className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />}
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {evidence.name}
                        </h4>
                        <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {evidence.attachedAt}
                        </p>
                      </div>
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="font-medium">Covers:</span> {evidence.coveredParams.join(', ')}
                    </div>
                    <button className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline mt-2">
                      View source
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button 
                  className={`w-full py-2 px-3 rounded-lg border-2 border-dashed text-sm font-medium transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400' 
                      : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600'
                  }`}
                >
                  + Add more sources
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-lg w-full rounded-xl border p-6 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-start gap-3 mb-4">
              <Info className={`w-6 h-6 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <div>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Source Citation Policy
                </h3>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  All numeric parameter values must be sourced from verifiable artifacts or knowledge base articles. This policy ensures:
                </p>
                <ul className={`text-sm mt-3 space-y-2 list-disc list-inside ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>Traceability of all critical setup values</li>
                  <li>Prevention of silent failures from hallucinated data</li>
                  <li>Compliance with quality management standards</li>
                  <li>Accountability for setup parameters</li>
                </ul>
                <p className={`text-sm mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  To reveal hidden values, attach source documents via "Attach artifact", search the knowledge base, or request parameters from your Planner.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowPolicyModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}