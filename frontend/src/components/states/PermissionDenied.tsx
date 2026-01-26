import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface PermissionDeniedProps {
  /**
   * Title of the permission denied message
   */
  title?: string;
  /**
   * Description of why access was denied
   */
  message?: string;
  /**
   * Required role to access this resource
   */
  requiredRole?: string;
  /**
   * Current user role
   */
  currentRole?: string;
  /**
   * Callback when user clicks "Go Back" button
   */
  onGoBack?: () => void;
  /**
   * Callback when user clicks "Go to Dashboard" button
   */
  onGoToDashboard?: () => void;
  /**
   * Show contact admin message
   */
  showContactAdmin?: boolean;
}

export function PermissionDenied({
  title = 'Access Denied',
  message = 'You do not have permission to access this page.',
  requiredRole,
  currentRole,
  onGoBack,
  onGoToDashboard,
  showContactAdmin = true,
}: PermissionDeniedProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`max-w-md w-full rounded-2xl border p-8 text-center ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm' 
          : 'bg-white border-gray-200 shadow-lg'
      }`}>
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
            isDarkMode 
              ? 'bg-red-900/30 ring-8 ring-red-900/20' 
              : 'bg-red-50 ring-8 ring-red-100'
          }`}>
            <ShieldAlert className={`w-10 h-10 ${
              isDarkMode ? 'text-red-400' : 'text-red-600'
            }`} />
          </div>
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h1>

        {/* Message */}
        <p className={`text-sm mb-6 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {message}
        </p>

        {/* Role Information */}
        {requiredRole && currentRole && (
          <div className={`rounded-lg p-4 mb-6 ${
            isDarkMode ? 'bg-gray-900/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-500' : 'text-gray-600'}>
                  Your Role:
                </span>
                <span className={`font-medium px-2.5 py-1 rounded ${
                  isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'
                }`}>
                  {currentRole}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-500' : 'text-gray-600'}>
                  Required Role:
                </span>
                <span className={`font-medium px-2.5 py-1 rounded ${
                  isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700'
                }`}>
                  {requiredRole}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Contact Admin Message */}
        {showContactAdmin && (
          <p className={`text-xs mb-6 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            If you believe this is an error, please contact your system administrator.
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {onGoBack && (
            <button
              onClick={onGoBack}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          )}
          {onGoToDashboard && (
            <button
              onClick={onGoToDashboard}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </button>
          )}
        </div>

        {/* Error Code */}
        <p className={`text-xs mt-6 font-mono ${
          isDarkMode ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Error Code: 403
        </p>
      </div>
    </div>
  );
}
