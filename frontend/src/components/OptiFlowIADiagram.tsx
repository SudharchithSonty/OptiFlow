import { useDarkMode } from './DarkModeContext';

export function OptiFlowIADiagram() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            OptiFlow Information Architecture
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Role-based navigation structure and shared data objects
          </p>
        </div>

        {/* Legend */}
        <div className="mb-8 flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded border-2 border-blue-600 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}></div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Read Access</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded border-2 border-green-600 ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'}`}></div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Read + Write Access</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded border-2 border-purple-600 ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50'}`}></div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Shared Object</span>
          </div>
        </div>

        {/* Main Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Owner Lane */}
          <div className={`p-6 rounded-xl border-2 ${
            isDarkMode ? 'bg-gray-800 border-orange-600' : 'bg-white border-orange-400'
          }`}>
            <div className="mb-6 text-center">
              <div className={`inline-block px-4 py-2 rounded-lg mb-2 ${
                isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-800'
              }`}>
                <span className="text-lg font-bold">👨‍💼 Owner</span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Strategic oversight
              </p>
            </div>

            <div className="space-y-3">
              <NavBox label="Dashboard" subtext="Org-level KPIs" isDarkMode={isDarkMode} />
              <NavBox label="Metrics" subtext="Org → Shift → Machine drill-down" isDarkMode={isDarkMode} />
              <NavBox label="Runs" subtext="View only" isDarkMode={isDarkMode} color="blue" />
              <NavBox label="Schedule" subtext="View only" isDarkMode={isDarkMode} />
              <NavBox label="Users" subtext="Manage roles" isDarkMode={isDarkMode} color="green" />
              <NavBox label="Settings" subtext="Org config" isDarkMode={isDarkMode} color="green" />
              <NavBox label="Audit Trail" subtext="Full history" isDarkMode={isDarkMode} color="blue" />
              <NavBox label="Agent" subtext="View metrics & jobs" isDarkMode={isDarkMode} color="blue" />
            </div>
          </div>

          {/* Planner Lane */}
          <div className={`p-6 rounded-xl border-2 ${
            isDarkMode ? 'bg-gray-800 border-blue-600' : 'bg-white border-blue-400'
          }`}>
            <div className="mb-6 text-center">
              <div className={`inline-block px-4 py-2 rounded-lg mb-2 ${
                isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
              }`}>
                <span className="text-lg font-bold">👨‍💻 Planner</span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Schedule management
              </p>
            </div>

            <div className="space-y-3">
              <NavBox label="Dashboard" subtext="Planner overview" isDarkMode={isDarkMode} />
              <NavBox label="Runs" subtext="Create, edit, version" isDarkMode={isDarkMode} color="green" />
              <NavBox label="Schedule" subtext="Plan & optimize" isDarkMode={isDarkMode} color="green" />
              <NavBox label="Metrics" subtext="OTD, utilization, setup" isDarkMode={isDarkMode} />
              <NavBox label="Events" subtext="Downtime, quality issues" isDarkMode={isDarkMode} color="green" />
              <NavBox label="Compare" subtext="Parent vs child runs" isDarkMode={isDarkMode} />
              <NavBox label="Publish" subtext="Approve & release runs" isDarkMode={isDarkMode} color="green" />
              <NavBox label="Agent" subtext="Jobs, metrics, retry failed" isDarkMode={isDarkMode} color="green" />
            </div>
          </div>

          {/* Supervisor Lane */}
          <div className={`p-6 rounded-xl border-2 ${
            isDarkMode ? 'bg-gray-800 border-green-600' : 'bg-white border-green-400'
          }`}>
            <div className="mb-6 text-center">
              <div className={`inline-block px-4 py-2 rounded-lg mb-2 ${
                isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
              }`}>
                <span className="text-lg font-bold">👷‍♀️ Supervisor</span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Shop floor execution
              </p>
            </div>

            <div className="space-y-3">
              <NavBox label="Today Dashboard" subtext="Active orders & machines" isDarkMode={isDarkMode} />
              <NavBox label="Alerts" subtext="Real-time issues" isDarkMode={isDarkMode} />
              <NavBox label="Schedule" subtext="View assignments" isDarkMode={isDarkMode} color="blue" />
              <NavBox label="Log Breakdown" subtext="Record downtime" isDarkMode={isDarkMode} color="green" />
              <NavBox label="Log Setup Actuals" subtext="Actual vs planned" isDarkMode={isDarkMode} color="green" />
              <NavBox label="Log First-piece Check" subtext="Quality verification" isDarkMode={isDarkMode} color="green" />
              <NavBox label="Setup Guidance" subtext="AI checklist generation" isDarkMode={isDarkMode} color="green" />
              <NavBox label="Explain Chat" subtext="Q&A assistant" isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>

        {/* Shared Objects Section */}
        <div className={`p-8 rounded-xl border-2 ${
          isDarkMode ? 'bg-gray-800/50 border-purple-600' : 'bg-purple-50 border-purple-300'
        }`}>
          <h2 className={`text-xl font-bold mb-6 text-center ${
            isDarkMode ? 'text-purple-300' : 'text-purple-900'
          }`}>
            Shared Data Objects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Runs Object */}
            <SharedObject
              title="Runs"
              isDarkMode={isDarkMode}
              permissions={[
                { role: 'Owner', access: 'Read', color: 'orange' },
                { role: 'Planner', access: 'Read + Write', color: 'blue' },
                { role: 'Supervisor', access: 'Read (via Schedule)', color: 'green' },
              ]}
            />

            {/* Events Object */}
            <SharedObject
              title="Events"
              isDarkMode={isDarkMode}
              permissions={[
                { role: 'Owner', access: 'Read (via Audit)', color: 'orange' },
                { role: 'Planner', access: 'Read + Write', color: 'blue' },
                { role: 'Supervisor', access: 'Write (Log breakdowns)', color: 'green' },
              ]}
            />

            {/* Agent Jobs Object */}
            <SharedObject
              title="Agent Jobs"
              isDarkMode={isDarkMode}
              permissions={[
                { role: 'Owner', access: 'Read metrics only', color: 'orange' },
                { role: 'Planner', access: 'Read + Retry', color: 'blue' },
                { role: 'Supervisor', access: 'Create + Read', color: 'green' },
              ]}
            />

            {/* Audit Trail Object */}
            <SharedObject
              title="Audit Trail"
              isDarkMode={isDarkMode}
              permissions={[
                { role: 'Owner', access: 'Full read access', color: 'orange' },
                { role: 'Planner', access: 'Read own actions', color: 'blue' },
                { role: 'Supervisor', access: 'Read own actions', color: 'green' },
              ]}
            />
          </div>
        </div>

        {/* Key Workflows */}
        <div className={`mt-8 p-6 rounded-xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Key Cross-Role Workflows
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <WorkflowCard
              title="Run Creation & Approval"
              steps={[
                'Planner creates run (RUN-2401)',
                'Planner analyzes impact',
                'Planner publishes run',
                'Supervisor views in schedule',
                'Owner monitors via metrics'
              ]}
              isDarkMode={isDarkMode}
            />
            
            <WorkflowCard
              title="Setup Guidance (AI)"
              steps={[
                'Supervisor requests checklist',
                'Agent generates from SOPs',
                'Supervisor executes steps',
                'Supervisor logs actuals',
                'Planner views variance data'
              ]}
              isDarkMode={isDarkMode}
            />
            
            <WorkflowCard
              title="Downtime Event Logging"
              steps={[
                'Supervisor logs breakdown',
                'Event saved to shared DB',
                'Planner sees in Events list',
                'Planner adjusts schedule',
                'Owner views in audit trail'
              ]}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Agent Integration */}
        <div className={`mt-8 p-6 rounded-xl border-2 ${
          isDarkMode ? 'bg-blue-900/10 border-blue-700' : 'bg-blue-50 border-blue-300'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
            🤖 AI Agent Integration Points
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AgentFeatureBox
              title="Setup Guidance"
              users="Supervisor"
              description="Generates machine changeover checklists from SOPs and historical data"
              isDarkMode={isDarkMode}
            />
            
            <AgentFeatureBox
              title="Shift Brief"
              users="Supervisor"
              description="AI-generated shift summaries with priorities and risks"
              isDarkMode={isDarkMode}
            />
            
            <AgentFeatureBox
              title="Explain Chat (Q&A)"
              users="All roles"
              description="Natural language queries about runs, metrics, and procedures"
              isDarkMode={isDarkMode}
            />
            
            <AgentFeatureBox
              title="Impact Analysis"
              users="Planner"
              description="Chat-based comparison of parent vs child run metrics"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components

interface NavBoxProps {
  label: string;
  subtext: string;
  isDarkMode: boolean;
  color?: 'blue' | 'green';
}

function NavBox({ label, subtext, isDarkMode, color }: NavBoxProps) {
  const borderColor = color === 'blue' 
    ? 'border-blue-600' 
    : color === 'green'
      ? 'border-green-600'
      : isDarkMode ? 'border-gray-700' : 'border-gray-300';
  
  const bgColor = color === 'blue'
    ? isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'
    : color === 'green'
      ? isDarkMode ? 'bg-green-900/30' : 'bg-green-50'
      : isDarkMode ? 'bg-gray-900' : 'bg-gray-50';

  return (
    <div className={`p-3 rounded-lg border-2 ${borderColor} ${bgColor}`}>
      <div className={`font-semibold text-sm mb-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {label}
      </div>
      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {subtext}
      </div>
    </div>
  );
}

interface SharedObjectProps {
  title: string;
  isDarkMode: boolean;
  permissions: Array<{
    role: string;
    access: string;
    color: 'orange' | 'blue' | 'green';
  }>;
}

function SharedObject({ title, isDarkMode, permissions }: SharedObjectProps) {
  return (
    <div className={`p-4 rounded-lg border-2 ${
      isDarkMode ? 'bg-purple-900/20 border-purple-600' : 'bg-white border-purple-400'
    }`}>
      <h4 className={`font-bold text-center mb-3 ${
        isDarkMode ? 'text-purple-300' : 'text-purple-900'
      }`}>
        {title}
      </h4>
      
      <div className="space-y-2">
        {permissions.map((perm, idx) => {
          const dotColor = perm.color === 'orange'
            ? 'bg-orange-600'
            : perm.color === 'blue'
              ? 'bg-blue-600'
              : 'bg-green-600';

          return (
            <div key={idx} className="flex items-start gap-2">
              <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${dotColor}`}></div>
              <div>
                <div className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {perm.role}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {perm.access}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface WorkflowCardProps {
  title: string;
  steps: string[];
  isDarkMode: boolean;
}

function WorkflowCard({ title, steps, isDarkMode }: WorkflowCardProps) {
  return (
    <div className={`p-4 rounded-lg border ${
      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-300'
    }`}>
      <h4 className={`font-semibold text-sm mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h4>
      
      <div className="space-y-2">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
            }`}>
              {idx + 1}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface AgentFeatureBoxProps {
  title: string;
  users: string;
  description: string;
  isDarkMode: boolean;
}

function AgentFeatureBox({ title, users, description, isDarkMode }: AgentFeatureBoxProps) {
  return (
    <div className={`p-4 rounded-lg border ${
      isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-white border-blue-300'
    }`}>
      <h4 className={`font-semibold text-sm mb-1 ${
        isDarkMode ? 'text-blue-300' : 'text-blue-900'
      }`}>
        {title}
      </h4>
      
      <div className={`text-xs mb-2 ${
        isDarkMode ? 'text-blue-400' : 'text-blue-700'
      }`}>
        👤 {users}
      </div>
      
      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>
    </div>
  );
}
