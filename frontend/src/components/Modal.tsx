import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useDarkMode } from './DarkModeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  const { isDarkMode } = useDarkMode();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>{title}</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
        
        {footer && (
          <div className={`px-6 py-4 border-t ${
            isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
          }`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}