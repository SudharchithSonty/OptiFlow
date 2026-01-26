import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ClipboardList,
  FileText,
  History,
  ArrowRight,
  Wrench,
  TrendingUp
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';
import { TabletLayout } from './TabletLayout';

interface SetupGuidanceTabletProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

export function SetupGuidanceTablet({ userRole = 'supervisor' }: SetupGuidanceTabletProps) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const upcomingSetups = [
    {
      id: '1',
      machine: 'M03',
      fromProduct: 'Widget A',
      toProduct: 'Gear B',
      scheduledTime: 'Today, 2:00 PM',
      shift: 'B',
      runId: 'RUN-2402',
      avgTime: '45 min',
      lastDone: 'Jan 18'
    },
    {
      id: '2',
      machine: 'M01',
      fromProduct: 'Gear B',
      toProduct: 'Widget C',
      scheduledTime: 'Today, 4:30 PM',
      shift: 'B',
      runId: 'RUN-2402',
      avgTime: '38 min',
      lastDone: 'Jan 20'
    },
    {
      id: '3',
      machine: 'M02',
      fromProduct: 'Widget A',
      toProduct: 'Shaft D',
      scheduledTime: 'Tomorrow, 8:00 AM',
      shift: 'A',
      runId: 'RUN-2403',
      avgTime: '52 min',
      lastDone: 'Jan 15'
    },
  ];

  const recentChecklists = [
    {
      id: 'CL-98347',
      machine: 'M03',
      productChange: 'Widget A → Gear B',
      generatedAt: '2 hours ago',
      status: 'completed'
    },
    {
      id: 'CL-98342',
      machine: 'M02',
      productChange: 'Gear B → Widget A',
      generatedAt: 'Yesterday, 3:15 PM',
      status: 'completed'
    },
    {
      id: 'CL-98338',
      machine: 'M01',
      productChange: 'Widget C → Gear B',
      generatedAt: 'Jan 23, 11:30 AM',
      status: 'completed'
    },
  ];

  return (
    <TabletLayout userRole={userRole}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Setup guidance
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            AI-generated machine setup checklists
          </p>
        </div>

        {/* Quick Action */}
        <button
          onClick={() => navigate('/app/agent/setup-checklist')}
          className="w-full p-4 rounded-lg border bg-gradient-to-r from-blue-600 to-blue-700 text-white transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-base">Generate new checklist</div>
                <div className="text-sm opacity-90">Create AI-powered setup guidance</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </div>
        </button>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Wrench className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Upcoming today
              </span>
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {upcomingSetups.filter(s => s.scheduledTime.includes('Today')).length}
            </div>
          </div>
          
          <div className={`p-3 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Success rate
              </span>
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              96%
            </div>
          </div>
        </div>

        {/* Upcoming Setups */}
        <div>
          <h2 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Upcoming changeovers
          </h2>
          <div className="space-y-2">
            {upcomingSetups.map((setup) => (
              <button
                key={setup.id}
                onClick={() => navigate('/app/agent/setup-checklist')}
                className={`w-full p-4 rounded-lg border text-left transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 active:bg-gray-700' 
                    : 'bg-white border-gray-200 active:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {setup.machine}
                    </span>
                    <span className={`mx-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>•</span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {setup.fromProduct} → {setup.toProduct}
                    </span>
                  </div>
                  <ArrowRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                    setup.scheduledTime.includes('Today')
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-700'
                  }`}>
                    {setup.scheduledTime}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Shift {setup.shift}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Avg: {setup.avgTime} • Last: {setup.lastDone}
                  </span>
                  <span className="text-blue-600 font-medium">
                    {setup.runId}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Checklists */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent checklists
            </h2>
            <button
              onClick={() => navigate('/app/agent/jobs')}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-2">
            {recentChecklists.map((checklist) => (
              <button
                key={checklist.id}
                onClick={() => navigate('/app/agent/setup-checklist/output')}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 active:bg-gray-700' 
                    : 'bg-white border-gray-200 active:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-blue-600">
                    {checklist.id}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                    isDarkMode 
                      ? 'bg-green-900/30 text-green-400' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    Completed
                  </span>
                </div>
                <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {checklist.machine} • {checklist.productChange}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {checklist.generatedAt}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Help Card */}
        <div className={`p-4 rounded-lg border ${
          isDarkMode 
            ? 'bg-purple-900/10 border-purple-800' 
            : 'bg-purple-50 border-purple-200'
        }`}>
          <div className="flex items-start gap-3">
            <FileText className={`w-5 h-5 flex-shrink-0 ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`} />
            <div>
              <h3 className={`text-sm font-semibold mb-1 ${
                isDarkMode ? 'text-purple-300' : 'text-purple-900'
              }`}>
                How it works
              </h3>
              <p className={`text-xs ${
                isDarkMode ? 'text-purple-400' : 'text-purple-700'
              }`}>
                The AI assistant generates step-by-step setup checklists by analyzing SOPs, knowledge base articles, machine programs, and historical data. All parameters are sourced and verified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </TabletLayout>
  );
}
