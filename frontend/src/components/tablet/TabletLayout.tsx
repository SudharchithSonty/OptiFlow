import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  Home,
  FileText,
  Calendar,
  BarChart3,
  Zap,
  Settings,
  User
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface TabletLayoutProps {
  children: ReactNode;
  userRole?: 'owner' | 'planner' | 'supervisor';
  userName?: string;
  showAgentTab?: boolean;
}

export function TabletLayout({ 
  children, 
  userRole = 'supervisor',
  userName,
  showAgentTab = true
}: TabletLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useDarkMode();

  const displayName = userName || (
    userRole === 'owner' ? 'Amit Mishra' :
    userRole === 'planner' ? 'Ravi Rampaul' :
    'Priya Patel'
  );

  const roleLabel = userRole === 'owner' ? 'Owner' : 
                    userRole === 'planner' ? 'Planner' : 
                    'Supervisor';

  const isActive = (path: string) => {
    if (path === '/app' && location.pathname === '/app') return true;
    if (path !== '/app' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const tabs = [
    { path: '/app', icon: Home, label: 'Home' },
    { path: '/app/runs', icon: FileText, label: 'Runs' },
    { path: '/app/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/app/metrics', icon: BarChart3, label: 'Metrics' },
    ...(showAgentTab ? [{ path: '/app/agent/home', icon: Zap, label: 'Agent' }] : []),
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Bar */}
      <div className={`h-14 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} px-4 flex items-center justify-between flex-shrink-0`}>
        <div className="flex items-center gap-3">
          <Zap className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h1 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            OptiFlow
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="font-medium">{displayName}</span>
            <span className={`ml-1 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>({roleLabel})</span>
          </div>
          <button
            onClick={() => navigate('/app/settings/profile')}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto pb-16">
        {children}
      </div>

      {/* Bottom Tab Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 h-16 border-t ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } flex items-center justify-around px-2`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[64px] ${
                active
                  ? isDarkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}