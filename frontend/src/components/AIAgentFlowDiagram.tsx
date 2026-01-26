import { useDarkMode } from './DarkModeContext';
import { ArrowDown, CheckCircle2, XCircle, AlertTriangle, Database, Cpu, FileText, Zap } from 'lucide-react';

export function AIAgentFlowDiagram() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AI Agent Node Flow
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            System architecture with validation, fallback logic, and evidence grounding
          </p>
        </div>

        {/* Legend */}
        <div className="mb-8 flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Validation Pass</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Validation Fail</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fallback Logic</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Evidence Source</span>
          </div>
        </div>

        {/* AI Agent Flow Diagram - Placeholder */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-8`}>
          <div className="space-y-6">
            {/* Trigger Events */}
            <div className={`p-6 rounded-lg border-2 ${isDarkMode ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-300'}`}>
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-purple-600" />
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>TRIGGER EVENTS</h3>
              </div>
              <ul className={`text-sm ml-9 space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• Generate Brief (Planner)</li>
                <li>• Ask "Why" Question (Supervisor)</li>
                <li>• Regenerate Brief</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <ArrowDown className={`w-6 h-6 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>

            {/* Load Run Artifacts */}
            <div className={`p-6 rounded-lg border-2 ${isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300'}`}>
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-6 h-6 text-blue-600" />
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>LOAD RUN ARTIFACTS</h3>
              </div>
              <ul className={`text-sm ml-9 space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• Schedule (all versions)</li>
                <li>• KPIs (current & deltas)</li>
                <li>• Events log</li>
                <li>• Operations timeline</li>
                <li>• Machine utilization</li>
                <li>• Order statuses</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <ArrowDown className={`w-6 h-6 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>

            {/* Evidence Builder */}
            <div className={`p-6 rounded-lg border-2 ${isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300'}`}>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-6 h-6 text-green-600" />
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>EVIDENCE BUILDER</h3>
              </div>
              <div className={`ml-9 space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div>
                  <p className="text-sm font-semibold">1. Identify Deltas</p>
                  <ul className="text-xs ml-4 space-y-0.5">
                    <li>• KPI changes between versions</li>
                    <li>• Schedule modifications</li>
                    <li>• Setup time improvements</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold">2. Detect Bottlenecks</p>
                  <ul className="text-xs ml-4 space-y-0.5">
                    <li>• High utilization machines (&gt;90%)</li>
                    <li>• Critical path operations</li>
                    <li>• Resource conflicts</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold">3. Track Late Orders</p>
                  <ul className="text-xs ml-4 space-y-0.5">
                    <li>• Orders past deadline</li>
                    <li>• At-risk orders (buffer &lt; 30 min)</li>
                    <li>• Root cause events</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold">4. Extract Schedule Changes</p>
                  <ul className="text-xs ml-4 space-y-0.5">
                    <li>• Rush order insertions</li>
                    <li>• Machine reassignments</li>
                    <li>• Event-triggered reschedules</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDown className={`w-6 h-6 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>

            {/* LLM Call with Validation */}
            <div className={`p-6 rounded-lg border-2 ${isDarkMode ? 'bg-amber-900/20 border-amber-700' : 'bg-amber-50 border-amber-300'}`}>
              <div className="flex items-center gap-3 mb-2">
                <Cpu className="w-6 h-6 text-amber-600" />
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>LLM CALL + VALIDATION</h3>
              </div>
              <ul className={`text-sm ml-9 space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• Prompt with structured evidence</li>
                <li>• Parse LLM response (JSON)</li>
                <li>• Validate grounding references</li>
                <li>• Check ID existence (orders, machines)</li>
                <li>• Verify numeric parameters have sources</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {/* Validation Pass */}
              <div className={`p-4 rounded-lg border-2 ${isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>If Validation Passes</h4>
                </div>
                <ul className={`text-xs ml-7 space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• Return formatted response</li>
                  <li>• Include evidence references</li>
                  <li>• Log success to agent_jobs</li>
                  <li>• Display to user</li>
                </ul>
              </div>

              {/* Validation Fail - Fallback */}
              <div className={`p-4 rounded-lg border-2 ${isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-300'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>If Validation Fails</h4>
                </div>
                <ul className={`text-xs ml-7 space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• Trigger fallback logic</li>
                  <li>• Use rules-based response</li>
                  <li>• Log failure details</li>
                  <li>• Mark fallback_used=true</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className={`mt-8 p-4 rounded-lg border ${isDarkMode ? 'bg-blue-900/10 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
            <p className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              <strong>AI Hard Constraint:</strong> No auto-publish — agent cannot publish schedules; only Planner can approve and publish. All agent actions are audited in agent_jobs table.
            </p>
          </div>
        </div>

        {/* Metrics Section */}
        <div className={`mt-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Success Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Validation Pass Rate</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>≥98%</p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fallback Rate</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>&lt;2%</p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Replan Speed</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>&lt;10min</p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Setup Clarity</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>≥4.5/5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
