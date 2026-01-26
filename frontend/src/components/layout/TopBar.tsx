import { User } from '../../types';
import { getRoleDisplayName } from '../../lib/auth';
import { LogOut, Menu } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface TopBarProps {
  user: User;
  onLogout: () => void;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function TopBar({ user, onLogout, onMenuClick, showMenuButton = false }: TopBarProps) {
  const { isDarkMode } = useDarkMode();
  
  return (
    <div className={`border-b px-4 py-3 flex items-center justify-between ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <button 
            onClick={onMenuClick} 
            className={`p-2 rounded lg:hidden ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>Precision Scheduling</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {user.name} • {getRoleDisplayName(user.role)}
          </div>
        </div>
      </div>
      <button
        onClick={onLogout}
        className={`flex items-center gap-2 px-3 py-2 rounded ${
          isDarkMode 
            ? 'text-gray-300 hover:bg-gray-700' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
}