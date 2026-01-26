import { RunStatus } from '../types';
import { useDarkMode } from './DarkModeContext';

interface StatusChipProps {
  status: RunStatus;
}

export function StatusChip({ status }: StatusChipProps) {
  const { isDarkMode } = useDarkMode();
  
  const config = {
    created: { 
      label: 'Created', 
      className: isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'
    },
    generating: { 
      label: 'Generating', 
      className: isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-800'
    },
    generated: { 
      label: 'Generated', 
      className: isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800'
    },
    scheduling: { 
      label: 'Scheduling', 
      className: isDarkMode ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
    },
    completed: { 
      label: 'Completed', 
      className: isDarkMode ? 'bg-green-800/50 text-green-300' : 'bg-green-200 text-green-900'
    },
    failed: { 
      label: 'Failed', 
      className: isDarkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800'
    },
  };

  const { label, className } = config[status];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full ${className}`}>
      {label}
    </span>
  );
}