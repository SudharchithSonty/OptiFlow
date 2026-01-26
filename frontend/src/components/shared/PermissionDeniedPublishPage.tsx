import { useNavigate } from 'react-router';
import { 
  ShieldOff,
  ChevronRight,
  Activity,
  FileText,
  Clock,
  Settings,
  Zap,
  ArrowLeft,
  Send,
  Lock,
  AlertCircle
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface PermissionDeniedPublishPageProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

export function PermissionDeniedPublishPage({ userRole = 'supervisor' }: PermissionDeniedPublishPageProps) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const handleBackToCompare = () => {
    navigate('/app/runs/compare/draft-impact-report');
  };

  const handleRequestAccess = () => {
    console.log('Request access to publish schedules');
    // In real app, would send notification to admin
  };

  const handleViewRBAC = () => {
    navigate('/app/settings/rbac-permissions');
  };

  const userName = userRole === 'owner' ? 'Amit Mishra' : userRole === 'planner' ? 'Ravi Rampaul' : 'Priya Patel';
  const userRoleLabel = userRole === 'owner' ? 'Owner' : userRole === 'planner' ? 'Planner' : 'Supervisor';

  return (
    <div className={`h-full overflow-auto px-4 sm:px-6 lg:px-8 py-6`}>
      {/* Read-only Banner */}
      <div className={`rounded-lg border mb-6 ${
        isDarkMode 
          ? 'bg-amber-900/20 border-amber-700' 
          : 'bg-amber-50 border-amber-200'
      }`}>
        <div className="px-6 py-3">
          <div className="flex items-center gap-3">
            <Lock className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            <p className={`text-sm font-medium ${isDarkMode ? 'text-amber-300' : 'text-amber-900'}`}>
              Read-only mode: publishing disabled for your role.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <button
            onClick={() => navigate('/app/runs')}
            className={`hover:underline ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Runs
          </button>
          <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <button
            onClick={() => navigate('/app/runs/compare')}
            className={`hover:underline ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Compare
          </button>
          <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>Permission Denied</span>
        </div>

        {/* Centered Permission Denied Card */}
        <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
          <div className={`max-w-lg w-full rounded-xl border p-8 text-center ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-red-900/20 border-2 border-red-700' 
                  : 'bg-red-50 border-2 border-red-200'
              }`}>
                <ShieldOff className={`w-10 h-10 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
              </div>
            </div>

            {/* Title */}
            <h1 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              You don't have permission to publish schedules.
            </h1>

            {/* Explanation */}
            <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Only Planners can approve and set the active schedule. Your current role ({userRoleLabel}) allows you to view and analyze schedule comparisons, but publishing changes requires Planner permissions.
            </p>

            {/* Info Box */}
            <div className={`p-4 rounded-lg border mb-6 text-left ${
              isDarkMode 
                ? 'bg-blue-900/10 border-blue-800' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start gap-2">
                <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div className="flex-1">
                  <p className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                    <strong>What you can do:</strong> View impact reports, analyze KPI deltas, and export comparison data. To publish schedules, contact your administrator to request Planner role access.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleBackToCompare}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Compare
              </button>
              
              <button
                onClick={handleRequestAccess}
                className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Send className="w-4 h-4" />
                Request access
              </button>

              <button
                onClick={handleViewRBAC}
                className={`w-full text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                View RBAC permissions →
              </button>
            </div>

            {/* Additional Context */}
            <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Current role: <span className="font-semibold">{userRoleLabel}</span> • Required role: <span className="font-semibold">Planner</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}