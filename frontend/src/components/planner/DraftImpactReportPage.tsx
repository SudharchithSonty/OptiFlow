import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, 
  FileText,
  TrendingDown,
  AlertTriangle,
  Settings,
  ArrowRight,
  Trash2,
  Cpu,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface ImpactedItem {
  id: string;
  type: 'machine' | 'order';
  name: string;
  impact: string;
  severity: 'low' | 'medium' | 'high';
}

interface RiskItem {
  category: string;
  risk: string;
  likelihood: 'low' | 'medium' | 'high';
  details: string;
}

const mockImpactedMachines: ImpactedItem[] = [
  {
    id: 'M03',
    type: 'machine',
    name: 'Press 3 (Bottleneck)',
    impact: '30-minute downtime will delay 3 operations',
    severity: 'high',
  },
  {
    id: 'M01',
    type: 'machine',
    name: 'CNC Mill 1',
    impact: '45-minute maintenance window affects 2 operations',
    severity: 'medium',
  },
];

const mockImpactedOrders: ImpactedItem[] = [
  {
    id: 'ORD-1234',
    type: 'order',
    name: 'Widget A Production',
    impact: 'Moved to bottleneck machine - completion delayed by 2h',
    severity: 'high',
  },
  {
    id: 'ORD-RUSH-456',
    type: 'order',
    name: 'Emergency Rush Order',
    impact: 'Requires immediate scheduling - displaces 4 existing orders',
    severity: 'high',
  },
  {
    id: 'ORD-1240',
    type: 'order',
    name: 'Flange Milling',
    impact: 'Material delay pushes start time by 2h',
    severity: 'medium',
  },
];

const mockRisks: RiskItem[] = [
  {
    category: 'On-Time Delivery',
    risk: '3 orders at risk of missing deadline',
    likelihood: 'high',
    details: 'ORD-1234, ORD-1236, ORD-1238 may not complete by EOD due to M03 bottleneck',
  },
  {
    category: 'Setup Switching on M03',
    risk: 'Increased setup time due to operation resequencing',
    likelihood: 'high',
    details: 'Bottleneck machine will require 2 additional setup cycles (+35 min total)',
  },
  {
    category: 'Resource Utilization',
    risk: 'M01 and M02 may have idle time during M03 maintenance',
    likelihood: 'medium',
    details: 'Approximately 20 minutes of combined idle time across non-bottleneck machines',
  },
];

const severityConfig = {
  low: { color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  medium: { color: 'text-orange-700', bgColor: 'bg-orange-100' },
  high: { color: 'text-red-700', bgColor: 'bg-red-100' },
};

export function DraftImpactReportPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { runId } = useParams<{ runId: string }>();
  
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const handleContinueToReschedule = () => {
    navigate(`/app/runs/${runId}/reschedule-wizard`, { 
      state: { resumeDraft: true } 
    });
  };

  const handleDiscard = () => {
    setShowDiscardConfirm(true);
  };

  const confirmDiscard = () => {
    // Navigate back
    navigate(`/app/runs/${runId}`);
  };

  return (
    <>
      <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <button
            onClick={() => navigate(`/app/runs/${runId}`)}
            className={`flex items-center gap-2 mb-4 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Run</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-6 h-6 text-purple-600" />
                <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Draft Impact Report</h1>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded">
                  Partial Analysis
                </span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Parent Run: <span className="font-mono text-blue-600">{runId || 'RUN-2401'}</span>
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Generated: 2026-01-01 14:30 • Auto-saved during reschedule wizard
              </p>
            </div>

            {/* AI Badge */}
            <div className={`flex items-center gap-2 px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-purple-900/30 border-purple-800' : 'bg-purple-50 border-purple-200'}`}>
              <Cpu className="w-4 h-4 text-purple-600" />
              <span className={`text-sm ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>AI-Generated Analysis</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Executive Summary */}
            <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-800' : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'}`}>
              <h2 className={`mb-3 ${isDarkMode ? 'text-purple-300' : 'text-purple-900'}`}>Executive Summary</h2>
              <p className={`mb-4 ${isDarkMode ? 'text-purple-200' : 'text-purple-800'}`}>
                Based on the selected events (M03 breakdown, rush order ORD-RUSH-456, and material delays), 
                the proposed reschedule will impact <strong>5 orders</strong> and <strong>2 machines</strong>. 
                The primary concern is the cascading delay on bottleneck machine M03, which could push 
                3 orders past their delivery deadlines.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-gray-800 border-purple-700' : 'bg-white border-purple-200'}`}>
                  <p className={`text-sm mb-1 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>Affected Orders</p>
                  <p className={`text-2xl ${isDarkMode ? 'text-purple-200' : 'text-purple-900'}`}>5</p>
                </div>
                <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-gray-800 border-purple-700' : 'bg-white border-purple-200'}`}>
                  <p className={`text-sm mb-1 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>Affected Machines</p>
                  <p className={`text-2xl ${isDarkMode ? 'text-purple-200' : 'text-purple-900'}`}>2</p>
                </div>
                <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-gray-800 border-purple-700' : 'bg-white border-purple-200'}`}>
                  <p className={`text-sm mb-1 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>High-Risk Items</p>
                  <p className="text-2xl text-red-600">5</p>
                </div>
              </div>
            </div>

            {/* Predicted Impacted Machines */}
            <div>
              <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Predicted Impacted Machines</h2>
              <div className="space-y-3">
                {mockImpactedMachines.map((item) => {
                  const config = severityConfig[item.severity];
                  return (
                    <div key={item.id} className={`border rounded-lg p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                          <Settings className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.id}</span>
                            <span className={isDarkMode ? 'text-gray-500' : 'text-gray-700'}>-</span>
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{item.name}</span>
                            <span className={`px-2 py-0.5 text-xs rounded ${config.bgColor} ${config.color}`}>
                              {item.severity} impact
                            </span>
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.impact}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Predicted Impacted Orders */}
            <div>
              <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Predicted Impacted Orders</h2>
              <div className="space-y-3">
                {mockImpactedOrders.map((item) => {
                  const config = severityConfig[item.severity];
                  return (
                    <div key={item.id} className={`border rounded-lg p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                          <Clock className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.id}</span>
                            <span className={isDarkMode ? 'text-gray-500' : 'text-gray-700'}>-</span>
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{item.name}</span>
                            <span className={`px-2 py-0.5 text-xs rounded ${config.bgColor} ${config.color}`}>
                              {item.severity} impact
                            </span>
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.impact}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Predicted OTD Risk */}
            <div>
              <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Predicted Risks</h2>
              <div className="space-y-3">
                {mockRisks.map((risk, idx) => {
                  const config = severityConfig[risk.likelihood];
                  return (
                    <div key={idx} className={`border rounded-lg p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                          {risk.category.includes('M03') ? (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          ) : risk.category.includes('Delivery') ? (
                            <TrendingDown className="w-5 h-5 text-red-600" />
                          ) : (
                            <Settings className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{risk.category}</span>
                                <span className={`px-2 py-0.5 text-xs rounded ${config.bgColor} ${config.color}`}>
                                  {risk.likelihood} likelihood
                                </span>
                              </div>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{risk.risk}</p>
                            </div>
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{risk.details}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Next Action */}
            <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className={`mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>Recommended Next Action</h3>
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                    Continue with the reschedule run creation using "Reschedule from Now" mode. 
                    This will preserve completed operations and minimize disruption while addressing 
                    the M03 breakdown and rush order. Consider flagging ORD-1234, ORD-1236, and ORD-1238 
                    for expedited review due to OTD risk.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleContinueToReschedule}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <span>Continue to Create Reschedule Run</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/app/runs/${runId}`)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${isDarkMode ? 'bg-gray-800 border-blue-700 text-blue-300 hover:bg-gray-700' : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50'}`}
                    >
                      Review Later
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Discard Section */}
            <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Discard Draft</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    If this analysis is no longer needed, you can discard the draft report. 
                    This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={handleDiscard}
                  className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 flex-shrink-0 ${isDarkMode ? 'border-red-700 text-red-300 hover:bg-red-900/30' : 'border-red-300 text-red-700 hover:bg-red-50'}`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Discard Draft</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discard Confirmation Modal */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Discard Draft Impact Report?</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  This will permanently delete the draft impact analysis. You will lose all the 
                  predicted impacts and risk assessments.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className={`flex-1 px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDiscard}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Discard Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}