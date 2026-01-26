import { UserRole } from '../../types';
import { LayoutDashboard, ClipboardList, BarChart3, Users, Settings, Bell, Calendar } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface SidebarProps {
  role: UserRole;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ role, currentPage, onNavigate }: SidebarProps) {
  const { isDarkMode } = useDarkMode();
  
  const getNavItems = () => {
    if (role === 'owner') {
      return [
        { id: 'kpi-overview', label: 'KPI Overview', icon: BarChart3 },
        { id: 'trends', label: 'Trends', icon: BarChart3 },
        { id: 'runs-audit', label: 'Runs Audit', icon: ClipboardList },
        { id: 'admin-users', label: 'Users & Roles', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    } else if (role === 'planner') {
      return [
        { id: 'runs', label: 'Runs', icon: ClipboardList },
        { id: 'create-run', label: 'Create Run', icon: Calendar },
      ];
    } else {
      return [
        { id: 'today', label: 'Today Dashboard', icon: LayoutDashboard },
        { id: 'alerts', label: 'Alerts', icon: Bell },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className={`hidden lg:flex lg:flex-col w-64 border-r h-full ${
      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
    }`}>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? isDarkMode 
                    ? 'bg-blue-900/50 text-blue-400' 
                    : 'bg-blue-50 text-blue-700'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}