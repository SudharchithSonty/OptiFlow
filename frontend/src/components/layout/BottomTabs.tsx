import { UserRole } from '../../types';
import { LayoutDashboard, ClipboardList, BarChart3, Bell, Calendar, MoreHorizontal } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface BottomTabsProps {
  role: UserRole;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function BottomTabs({ role, currentPage, onNavigate }: BottomTabsProps) {
  const { isDarkMode } = useDarkMode();
  
  const getTabItems = () => {
    if (role === 'owner') {
      return [
        { id: 'kpi-overview', label: 'KPIs', icon: BarChart3 },
        { id: 'trends', label: 'Trends', icon: BarChart3 },
        { id: 'runs-audit', label: 'Audit', icon: ClipboardList },
        { id: 'more', label: 'More', icon: MoreHorizontal },
      ];
    } else if (role === 'planner') {
      return [
        { id: 'runs', label: 'Runs', icon: ClipboardList },
        { id: 'create-run', label: 'Create', icon: Calendar },
      ];
    } else {
      return [
        { id: 'today', label: 'Today', icon: LayoutDashboard },
        { id: 'alerts', label: 'Alerts', icon: Bell },
      ];
    }
  };

  const tabItems = getTabItems();

  return (
    <div className={`lg:hidden fixed bottom-0 left-0 right-0 border-t safe-area-inset-bottom ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-around px-2 py-2">
        {tabItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg min-w-[64px] ${
                isActive 
                  ? 'text-blue-500' 
                  : isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}