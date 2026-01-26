import { Shield, CheckCircle2, Eye, X, AlertTriangle, Activity, FileText } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';
import React from 'react';

interface PermissionRow {
  capability: string;
  category?: string;
  owner: 'full' | 'view' | 'none';
  planner: 'full' | 'view' | 'none';
  supervisor: 'full' | 'view' | 'none';
}

const permissions: PermissionRow[] = [
  { capability: 'View org KPIs + drilldowns', category: 'Dashboard & Analytics', owner: 'full', planner: 'view', supervisor: 'none' },
  { capability: 'Runs: view list/detail', owner: 'full', planner: 'full', supervisor: 'view' },
  { capability: 'Runs: create run', owner: 'view', planner: 'full', supervisor: 'none' },
  { capability: 'Inputs: upload + validation', category: 'Planning Operations', owner: 'view', planner: 'full', supervisor: 'none' },
  { capability: 'Events: create/edit events', owner: 'view', planner: 'full', supervisor: 'none' },
  { capability: 'Scheduling: generate schedule', owner: 'view', planner: 'full', supervisor: 'none' },
  { capability: 'Reschedule: create child run', owner: 'view', planner: 'full', supervisor: 'none' },
  { capability: 'Compare parent vs child', owner: 'full', planner: 'full', supervisor: 'none' },
  { capability: 'Publish active schedule', owner: 'view', planner: 'full', supervisor: 'none' },
  { capability: 'Today dashboard', category: 'Shopfloor Operations', owner: 'full', planner: 'full', supervisor: 'full' },
  { capability: 'Acknowledge tasks/alerts', owner: 'full', planner: 'full', supervisor: 'full' },
  { capability: 'Log setup actuals', owner: 'view', planner: 'view', supervisor: 'full' },
  { capability: 'Log first-piece quality', owner: 'view', planner: 'view', supervisor: 'full' },
  { capability: 'Admin: users & roles', category: 'Administration', owner: 'full', planner: 'none', supervisor: 'none' },
  { capability: 'Admin: org settings', owner: 'full', planner: 'none', supervisor: 'none' },
  { capability: 'Audit logs (governance)', owner: 'full', planner: 'view', supervisor: 'none' },
  { capability: 'AI: view shift brief', category: 'AI Agent Features', owner: 'full', planner: 'full', supervisor: 'full' },
  { capability: 'AI: regenerate shift brief', owner: 'view', planner: 'full', supervisor: 'none' },
  { capability: 'AI: explain chat ("Ask why")', owner: 'full', planner: 'full', supervisor: 'full' },
  { capability: 'AI: setup guidance request', owner: 'full', planner: 'full', supervisor: 'full' },
  { capability: 'AI: view Agent Jobs log', owner: 'full', planner: 'full', supervisor: 'none' },
  { capability: 'AI: retry failed agent job', owner: 'view', planner: 'full', supervisor: 'none' },
  { capability: 'AI: view AI metrics dashboard', owner: 'full', planner: 'view', supervisor: 'none' },
];

const PermissionIcon = ({ type }: { type: 'full' | 'view' | 'none' }) => {
  if (type === 'full') {
    return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />;
  }
  if (type === 'view') {
    return (
      <div className="flex items-center justify-center gap-1 mx-auto text-blue-600 dark:text-blue-400">
        <Eye className="w-4 h-4" />
        <span className="text-xs font-medium">View</span>
      </div>
    );
  }
  return <X className="w-5 h-5 text-gray-400 dark:text-gray-600 mx-auto" />;
};

export function RBACPermissionsPage() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0A0A0F]' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} transition-colors duration-300`}>
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 -left-20 w-96 h-96 ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-300/20'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-20 -right-20 w-96 h-96 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-300/20'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className={`mb-6 p-6 rounded-xl ${isDarkMode ? 'bg-white/5 backdrop-blur-xl border border-white/10' : 'bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-sm'}`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
              <Shield className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div className="flex-1">
              <h1 className={`text-2xl lg:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                Role Permissions & AI Boundaries
              </h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm lg:text-base`}>
                Who can start, monitor, and approve agentic runs
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-lg ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'} text-sm font-medium`}>
                  Acme Precision Works
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Permissions Matrix */}
          <div className="lg:col-span-2">
            <div className={`rounded-xl ${isDarkMode ? 'bg-white/5 backdrop-blur-xl border border-white/10' : 'bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-sm'} overflow-hidden`}>
              <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200'}`}>
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Permissions Matrix
                </h2>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Role-based access control across all capabilities
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={isDarkMode ? 'bg-white/5 border-b border-white/10' : 'bg-gray-50 border-b border-gray-200'}>
                      <th className={`px-6 py-3 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                        Capability
                      </th>
                      <th className={`px-4 py-3 text-center text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                        Owner<br />
                        <span className="font-normal normal-case text-xs opacity-75">Amit Mishra</span>
                      </th>
                      <th className={`px-4 py-3 text-center text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                        Planner<br />
                        <span className="font-normal normal-case text-xs opacity-75">Ravi Rampaul</span>
                      </th>
                      <th className={`px-4 py-3 text-center text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                        Supervisor<br />
                        <span className="font-normal normal-case text-xs opacity-75">Priya Patel</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                    {permissions.flatMap((perm, idx) => {
                      const rows = [];
                      if (perm.category) {
                        rows.push(
                          <tr key={`category-${idx}`} className={isDarkMode ? 'bg-white/5' : 'bg-gray-50'}>
                            <td colSpan={4} className={`px-6 py-2 text-xs font-semibold ${isDarkMode ? 'text-purple-400' : 'text-purple-700'} uppercase tracking-wide`}>
                              {perm.category}
                            </td>
                          </tr>
                        );
                      }
                      rows.push(
                        <tr 
                          key={`perm-${idx}`}
                          className={`${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}
                        >
                          <td className={`px-6 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {perm.capability}
                          </td>
                          <td className="px-4 py-3">
                            <PermissionIcon type={perm.owner} />
                          </td>
                          <td className="px-4 py-3">
                            <PermissionIcon type={perm.planner} />
                          </td>
                          <td className="px-4 py-3">
                            <PermissionIcon type={perm.supervisor} />
                          </td>
                        </tr>
                      );
                      return rows;
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Full Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>View Only</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No Access</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RBAC UX Patterns - Footer */}
            <div className={`mt-6 rounded-xl ${isDarkMode ? 'bg-white/5 backdrop-blur-xl border border-white/10' : 'bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-sm'} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <FileText className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  RBAC UX Patterns (In-Product)
                </h3>
              </div>
              <div className="space-y-3">
                <div className={`flex items-start gap-3 p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} mt-2 flex-shrink-0`}></div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    If user lacks permission, show <span className="font-semibold">"Permission denied"</span> screen and hide primary CTA.
                  </p>
                </div>
                <div className={`flex items-start gap-3 p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} mt-2 flex-shrink-0`}></div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    If view-only, show a <span className="font-semibold">"Read-only"</span> banner explaining why.
                  </p>
                </div>
                <div className={`flex items-start gap-3 p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} mt-2 flex-shrink-0`}></div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    All agent actions link to <span className="font-semibold">Agent Job detail</span> for audit.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Callouts */}
          <div className="space-y-6">
            {/* AI Hard Constraints */}
            <div className={`rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl border border-red-500/30' : 'bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 shadow-sm'} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className={`w-6 h-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Hard Constraints
                </h3>
              </div>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                Non-negotiable
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-red-400' : 'bg-red-600'} mt-2 flex-shrink-0`}></div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    <strong>No auto-publish:</strong> agent cannot publish schedules; only Planner can approve and publish.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-red-400' : 'bg-red-600'} mt-2 flex-shrink-0`}></div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    <strong>No hallucinated IDs:</strong> all orders/machines/ops must exist in scenario metadata.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-red-400' : 'bg-red-600'} mt-2 flex-shrink-0`}></div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    <strong>No unsourced numeric parameters:</strong> values must cite artifact/KB source; otherwise hide the value.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-red-400' : 'bg-red-600'} mt-2 flex-shrink-0`}></div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    <strong>No infeasible outputs:</strong> all schedules must pass CP-SAT feasibility; infeasible proposals are rejected.
                  </span>
                </li>
              </ul>
            </div>

            {/* Failure Handling */}
            <div className={`rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20 backdrop-blur-xl border border-amber-500/30' : 'bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 shadow-sm'} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className={`w-6 h-6 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Failure Handling & Audit Trail
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-amber-400' : 'bg-amber-600'} mt-2 flex-shrink-0`}></div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Validation guardrails enforce ID/time window/parameter-source correctness before execution.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-amber-400' : 'bg-amber-600'} mt-2 flex-shrink-0`}></div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Rules-based fallback used when model unavailable or validation fails.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-amber-400' : 'bg-amber-600'} mt-2 flex-shrink-0`}></div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    <strong>Loud failures</strong> recorded in <code className={`px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-black/30 text-amber-300' : 'bg-white text-amber-700'}`}>agent_jobs</code> with clear error messages (no silent failures).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-amber-400' : 'bg-amber-600'} mt-2 flex-shrink-0`}></div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Transactional safety prevents partial failures from corrupting runs or publishing incomplete schedules.
                  </span>
                </li>
              </ul>
            </div>

            {/* Success Metrics */}
            <div className={`rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/30' : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-sm'} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <Activity className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Success Metrics
                </h3>
              </div>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                Tracked on agent_jobs
              </p>
              <ul className="space-y-2 mb-4">
                <li className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  • Validation pass rate <strong>≥98%</strong> <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>(validation_pass)</span>
                </li>
                <li className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  • Fallback rate <strong>&lt;2%</strong> <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>(fallback_used)</span>
                </li>
                <li className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  • Replan speed <strong>&lt;10 minutes</strong> <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>(duration_ms)</span>
                </li>
                <li className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  • Setup clarity rating <strong>≥4.5/5</strong> <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>(user_rating)</span>
                </li>
              </ul>

              {/* This Week Stats */}
              <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-black/30 border border-green-500/20' : 'bg-white border border-green-200'}`}>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                  This Week
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pass Rate</p>
                    <p className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>98.4%</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fallback</p>
                    <p className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>1.6%</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>P95 Replan</p>
                    <p className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>7m 40s</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Clarity</p>
                    <p className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>4.6/5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Context Box */}
            <div className={`rounded-xl ${isDarkMode ? 'bg-white/5 backdrop-blur-xl border border-white/10' : 'bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-sm'} p-6`}>
              <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 uppercase tracking-wide`}>
                Context Reference
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Example Run:</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>RUN-2402 (Shift B)</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Bottleneck Machine:</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}>M03</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}