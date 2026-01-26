import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Sparkles, GitCompare, Download, AlertCircle, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { mockRuns, Run } from '../types';
import { useDarkMode } from './DarkModeContext';

export function RunDetailPage() {
  const { isDarkMode } = useDarkMode();
  const { runId } = useParams<{ runId: string }>();
  const navigate = useNavigate();
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [showCompareDialog, setShowCompareDialog] = useState(false);

  const run = mockRuns.find(r => r.id === runId);
  
  if (!run) {
    return (
      <div className="p-6 text-center">
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Run not found</p>
        <button onClick={() => navigate('/runs')} className={`mt-4 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
          ← Back to Runs
        </button>
      </div>
    );
  }

  // Find other versions of this run
  const baseId = run.id.split('-v')[0];
  const allVersions = mockRuns.filter(r => r.id.startsWith(baseId)).sort((a, b) => b.version - a.version);

  const handleAskAI = () => {
    // Simulate AI response
    console.log('AI Question:', aiQuestion);
    setShowAIDialog(false);
    setAiQuestion('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/runs')}
          className={`flex items-center gap-2 mb-4 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Runs</span>
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                {run.shiftDate} - Shift {run.shift}
              </h1>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg">
                v{run.version}
              </span>
              <span className={`px-3 py-1 rounded-lg text-sm ${
                run.status === 'scheduled' ? 'bg-green-50 text-green-700' :
                run.status === 'generating' ? 'bg-yellow-50 text-yellow-700' :
                run.status === 'completed' ? 'bg-blue-50 text-blue-700' :
                'bg-gray-50 text-gray-700'
              }`}>
                {run.status}
              </span>
            </div>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Created by {run.createdBy} · {new Date(run.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2">
            {allVersions.length > 1 && (
              <button
                onClick={() => setShowCompareDialog(true)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                <GitCompare className="w-5 h-5" />
                <span className="hidden sm:inline">Compare</span>
              </button>
            )}
            <button className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}>
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      {run.metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`rounded-lg border p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>OEE</p>
            <p className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{run.metrics.oee}%</p>
            <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${run.metrics.oee}%` }} />
            </div>
          </div>
          <div className={`rounded-lg border p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>On-Time Delivery</p>
            <p className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{run.metrics.otd}%</p>
            <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="h-full bg-green-600 rounded-full" style={{ width: `${run.metrics.otd}%` }} />
            </div>
          </div>
          <div className={`rounded-lg border p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Utilization</p>
            <p className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{run.metrics.utilization}%</p>
            <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="h-full bg-purple-600 rounded-full" style={{ width: `${run.metrics.utilization}%` }} />
            </div>
          </div>
          <div className={`rounded-lg border p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Setup Time</p>
            <p className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{run.metrics.setupTime}<span className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>m</span></p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Avg per order</p>
          </div>
        </div>
      )}

      {/* AI Brief */}
      {run.aiBrief && (
        <div className={`rounded-lg border p-4 lg:p-6 mb-6 ${isDarkMode ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-700' : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>AI Brief</h2>
              <span className={`px-2 py-0.5 text-xs rounded ${isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                {Math.round(run.aiBrief.confidence * 100)}% confidence
              </span>
            </div>
            <button
              onClick={() => setShowAIDialog(true)}
              className={`px-3 py-1.5 rounded-lg text-sm ${isDarkMode ? 'bg-purple-600 hover:bg-purple-500' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
            >
              Ask AI
            </button>
          </div>

          <p className={`mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{run.aiBrief.summary}</p>

          {/* Key Insights */}
          <div className="mb-4">
            <h3 className={`text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Key Insights</h3>
            <ul className="space-y-2">
              {run.aiBrief.keyInsights.map((insight, idx) => (
                <li key={idx} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-green-500' : 'text-green-600'}`} />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          {run.aiBrief.risks.length > 0 && (
            <div className="mb-4">
              <h3 className={`text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Identified Risks</h3>
              <div className="space-y-2">
                {run.aiBrief.risks.map((risk, idx) => (
                  <div key={idx} className={`rounded-lg p-3 border ${isDarkMode ? 'bg-gray-800/50 border-orange-700' : 'bg-white border-orange-200'}`}>
                    <div className="flex items-start gap-2 mb-1">
                      <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        risk.severity === 'high' ? 'text-red-600' :
                        risk.severity === 'medium' ? 'text-orange-600' :
                        'text-yellow-600'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{risk.description}</span>
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            risk.severity === 'high' ? 'bg-red-100 text-red-700' :
                            risk.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {risk.severity}
                          </span>
                        </div>
                        {risk.mitigation && (
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mitigation: {risk.mitigation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div>
            <h3 className={`text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recommendations</h3>
            <ul className="space-y-2">
              {run.aiBrief.recommendations.map((rec, idx) => (
                <li key={idx} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <TrendingUp className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Orders */}
      <div className={`rounded-lg border p-4 lg:p-6 mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Scheduled Orders ({run.orders.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left text-sm pb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Order</th>
                <th className={`text-left text-sm pb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Product</th>
                <th className={`text-left text-sm pb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Priority</th>
                <th className={`text-left text-sm pb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Machine</th>
                <th className={`text-right text-sm pb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quantity</th>
                <th className={`text-right text-sm pb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Setup</th>
                <th className={`text-right text-sm pb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Runtime</th>
              </tr>
            </thead>
            <tbody>
              {run.orders.map((order) => (
                <tr key={order.id} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <td className={`py-3 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{order.orderNumber}</td>
                  <td className={`py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{order.product}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      order.priority === 'rush' ? 'bg-red-100 text-red-700' :
                      order.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className={`py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{order.assignedMachine}</td>
                  <td className={`py-3 text-sm text-right ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{order.quantity}</td>
                  <td className={`py-3 text-sm text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{order.setupTime}m</td>
                  <td className={`py-3 text-sm text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{order.runTime}m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Machines */}
      <div className={`rounded-lg border p-4 lg:p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Machine Allocation</h2>
        <div className="space-y-3">
          {run.machines.map((machine) => (
            <div key={machine.machineId} className={`border rounded-lg p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className={`mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{machine.machineName}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {machine.orders.length} order{machine.orders.length > 1 ? 's' : ''} assigned
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm ${
                  machine.status === 'operational' ? 'bg-green-50 text-green-700' :
                  machine.status === 'maintenance' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {machine.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Utilization</p>
                  <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{machine.utilization}%</p>
                  <div className={`mt-1 h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${machine.utilization}%` }}
                    />
                  </div>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Downtime</p>
                  <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{machine.downtime}<span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>m</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ask AI Dialog */}
      {showAIDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg max-w-lg w-full p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Ask AI About This Run</h3>
            </div>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Ask questions about scheduling decisions, risks, or recommendations.
            </p>
            <textarea
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="e.g., Why was M1 chosen for this order instead of M2?"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
              rows={4}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAIDialog(false)}
                className={`flex-1 px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleAskAI}
                className={`flex-1 px-4 py-2 rounded-lg text-white ${isDarkMode ? 'bg-purple-600 hover:bg-purple-500' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                Ask AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare Dialog */}
      {showCompareDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg max-w-2xl w-full p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Compare Versions</h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Select another version to compare with v{run.version}
            </p>
            <div className="space-y-2 mb-4">
              {allVersions
                .filter(v => v.version !== run.version)
                .map(version => (
                  <button
                    key={version.id}
                    className={`w-full text-left p-3 border rounded-lg ${isDarkMode ? 'border-gray-700 hover:border-blue-500 hover:bg-gray-700' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Version {version.version}</span>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {version.orders.length} orders · {new Date(version.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {version.metrics && (
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>OEE: {version.metrics.oee}%</span>
                      )}
                    </div>
                  </button>
                ))}
            </div>
            <button
              onClick={() => setShowCompareDialog(false)}
              className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}