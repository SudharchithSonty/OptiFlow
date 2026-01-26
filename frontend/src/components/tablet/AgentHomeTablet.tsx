import { useNavigate } from 'react-router';
import { 
  MessageSquare,
  ClipboardList,
  FileText,
  BarChart3,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';
import { TabletLayout } from './TabletLayout';

interface AgentHomeTabletProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

export function AgentHomeTablet({ userRole = 'supervisor' }: AgentHomeTabletProps) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const quickActions = [
    {
      icon: ClipboardList,
      label: 'Setup guidance',
      description: 'Generate machine setup checklists',
      path: '/app/agent/setup-guidance',
      color: 'blue'
    },
    {
      icon: FileText,
      label: 'Shift brief',
      description: 'Get AI-generated shift summaries',
      path: '/app/runs/RUN-2402/brief',
      color: 'green'
    },
    {
      icon: MessageSquare,
      label: 'Ask anything',
      description: 'Chat with operations assistant',
      path: '/app/agent/chat',
      color: 'purple'
    },
    {
      icon: BarChart3,
      label: 'Impact analysis',
      description: 'Compare run versions with AI',
      path: '/app/runs/RUN-2402/draft-assistant',
      color: 'orange'
    },
  ];

  const recentActivity = [
    { 
      id: 'AJ-98347', 
      type: 'Setup guidance', 
      status: 'success', 
      time: '2 min ago',
      description: 'M03 changeover checklist'
    },
    { 
      id: 'AJ-98346', 
      type: 'Brief generation', 
      status: 'success', 
      time: '5 min ago',
      description: 'Shift B summary for RUN-2402'
    },
    { 
      id: 'AJ-98345', 
      type: 'Q&A', 
      status: 'failed', 
      time: '12 min ago',
      description: 'SOP lookup failed'
    },
  ];

  const stats = [
    { label: 'Jobs today', value: '43', icon: Zap, color: 'blue' },
    { label: 'Success rate', value: '94.7%', icon: TrendingUp, color: 'green' },
    { label: 'Avg response', value: '1.8s', icon: Clock, color: 'purple' },
  ];

  return (
    <TabletLayout userRole={userRole}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Digital Operations Assistant
            </h1>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            AI-powered guidance for manufacturing operations
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`p-3 rounded-lg border ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 ${
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  'text-purple-600'
                }`} />
                <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 active:bg-gray-700' 
                      : 'bg-white border-gray-200 active:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    action.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    action.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                    action.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                    'bg-orange-100 dark:bg-orange-900/30'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      action.color === 'blue' ? 'text-blue-600' :
                      action.color === 'green' ? 'text-green-600' :
                      action.color === 'purple' ? 'text-purple-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                  <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {action.label}
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {action.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent activity
            </h2>
            <button
              onClick={() => navigate('/app/agent/jobs')}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <button
                key={activity.id}
                onClick={() => navigate(`/app/agent/jobs/${activity.id}`)}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 active:bg-gray-700' 
                    : 'bg-white border-gray-200 active:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-blue-600">
                    {activity.id}
                  </span>
                  {activity.status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      isDarkMode ? 'border-red-400' : 'border-red-600'
                    }`} />
                  )}
                </div>
                <div className={`text-sm font-medium mb-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {activity.description}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {activity.type}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {activity.time}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className={`p-4 rounded-lg border ${
          isDarkMode 
            ? 'bg-blue-900/10 border-blue-800' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <h3 className={`text-sm font-semibold mb-1 ${
            isDarkMode ? 'text-blue-300' : 'text-blue-900'
          }`}>
            Need help?
          </h3>
          <p className={`text-xs mb-3 ${
            isDarkMode ? 'text-blue-400' : 'text-blue-700'
          }`}>
            The Digital Operations Assistant can help with setup guidance, brief generation, Q&A, and run analysis.
          </p>
          <button
            onClick={() => navigate('/app/agent/chat')}
            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}
          >
            Start a conversation
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Metrics Link */}
        <button
          onClick={() => navigate('/app/agent/metrics')}
          className={`w-full p-4 rounded-lg border transition-colors ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 active:bg-gray-700' 
              : 'bg-white border-gray-200 active:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <BarChart3 className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              <div className="text-left">
                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  View AI metrics
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Performance, costs, and usage analytics
                </div>
              </div>
            </div>
            <ArrowRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </div>
        </button>
      </div>
    </TabletLayout>
  );
}