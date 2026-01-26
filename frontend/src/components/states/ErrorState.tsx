import { AlertCircle, RefreshCw, Mail, Home } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface ErrorStateProps {
  /**
   * Error title
   */
  title?: string;
  /**
   * Error message/description
   */
  message?: string;
  /**
   * Error code (e.g., 500, 503, etc.)
   */
  errorCode?: string | number;
  /**
   * Technical error details (for developers)
   */
  technicalDetails?: string;
  /**
   * Show retry button
   */
  showRetry?: boolean;
  /**
   * Callback when retry button is clicked
   */
  onRetry?: () => void;
  /**
   * Show contact admin button
   */
  showContactAdmin?: boolean;
  /**
   * Admin email address
   */
  adminEmail?: string;
  /**
   * Show go to dashboard button
   */
  showGoToDashboard?: boolean;
  /**
   * Callback when dashboard button is clicked
   */
  onGoToDashboard?: () => void;
  /**
   * Loading state for retry button
   */
  isRetrying?: boolean;
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Error type/severity
   */
  type?: 'error' | 'warning' | 'network';
}

export function ErrorState({
  title,
  message,
  errorCode,
  technicalDetails,
  showRetry = true,
  onRetry,
  showContactAdmin = true,
  adminEmail = 'admin@yourcompany.com',
  showGoToDashboard = false,
  onGoToDashboard,
  isRetrying = false,
  size = 'md',
  type = 'error',
}: ErrorStateProps) {
  const { isDarkMode } = useDarkMode();

  // Default messages based on error type
  const getDefaultTitle = () => {
    if (title) return title;
    switch (type) {
      case 'network':
        return 'Connection Error';
      case 'warning':
        return 'Something Went Wrong';
      default:
        return 'Error Loading Data';
    }
  };

  const getDefaultMessage = () => {
    if (message) return message;
    switch (type) {
      case 'network':
        return 'Unable to connect to the server. Please check your internet connection and try again.';
      case 'warning':
        return 'We encountered an issue while processing your request. Please try again.';
      default:
        return 'We encountered an unexpected error. Please try again or contact support if the problem persists.';
    }
  };

  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'w-10 h-10',
      iconContainer: 'w-16 h-16',
      title: 'text-base',
      message: 'text-xs',
      button: 'text-sm px-3 py-2',
    },
    md: {
      container: 'py-12',
      icon: 'w-12 h-12',
      iconContainer: 'w-20 h-20',
      title: 'text-xl',
      message: 'text-sm',
      button: 'text-sm px-4 py-2.5',
    },
    lg: {
      container: 'py-16',
      icon: 'w-14 h-14',
      iconContainer: 'w-24 h-24',
      title: 'text-2xl',
      message: 'text-base',
      button: 'text-base px-5 py-3',
    },
  };

  const currentSize = sizeClasses[size];

  const iconColors = {
    error: isDarkMode ? 'text-red-400' : 'text-red-600',
    warning: isDarkMode ? 'text-yellow-400' : 'text-yellow-600',
    network: isDarkMode ? 'text-orange-400' : 'text-orange-600',
  };

  const iconBgColors = {
    error: isDarkMode ? 'bg-red-900/30 ring-red-900/20' : 'bg-red-50 ring-red-100',
    warning: isDarkMode ? 'bg-yellow-900/30 ring-yellow-900/20' : 'bg-yellow-50 ring-yellow-100',
    network: isDarkMode ? 'bg-orange-900/30 ring-orange-900/20' : 'bg-orange-50 ring-orange-100',
  };

  return (
    <div className={`text-center ${currentSize.container}`}>
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className={`${currentSize.iconContainer} rounded-full flex items-center justify-center ring-8 ${iconBgColors[type]}`}>
          <AlertCircle className={`${currentSize.icon} ${iconColors[type]}`} />
        </div>
      </div>

      {/* Title */}
      <h2 className={`font-semibold mb-3 ${currentSize.title} ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {getDefaultTitle()}
      </h2>

      {/* Message */}
      <p className={`max-w-md mx-auto mb-6 ${currentSize.message} ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {getDefaultMessage()}
      </p>

      {/* Error Code */}
      {errorCode && (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-6 ${
          isDarkMode 
            ? 'bg-gray-800 border border-gray-700 text-gray-400' 
            : 'bg-gray-100 border border-gray-200 text-gray-600'
        }`}>
          <span className="text-xs font-medium">Error Code:</span>
          <span className="text-xs font-mono">{errorCode}</span>
        </div>
      )}

      {/* Technical Details (Collapsible) */}
      {technicalDetails && (
        <details className={`max-w-md mx-auto mb-6 text-left ${
          isDarkMode ? 'text-gray-500' : 'text-gray-500'
        }`}>
          <summary className="text-xs cursor-pointer hover:underline mb-2">
            View technical details
          </summary>
          <pre className={`text-xs p-3 rounded-lg overflow-x-auto ${
            isDarkMode 
              ? 'bg-gray-900 border border-gray-800' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            {technicalDetails}
          </pre>
        </details>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className={`${currentSize.button} rounded-lg font-medium transition-colors inline-flex items-center gap-2 ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-800 disabled:text-gray-400'
                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300 disabled:text-gray-500'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </button>
        )}

        {showGoToDashboard && onGoToDashboard && (
          <button
            onClick={onGoToDashboard}
            className={`${currentSize.button} rounded-lg font-medium transition-colors inline-flex items-center gap-2 ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
            }`}
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>
        )}
      </div>

      {/* Contact Admin */}
      {showContactAdmin && (
        <div className={`max-w-md mx-auto pt-6 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <p className={`text-xs mb-3 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            If this problem persists, please contact your system administrator.
          </p>
          <a
            href={`mailto:${adminEmail}`}
            className={`inline-flex items-center gap-2 text-xs font-medium transition-colors ${
              isDarkMode 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            <Mail className="w-4 h-4" />
            {adminEmail}
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * Wrapper component for error states with border and background
 */
interface ErrorStateCardProps extends ErrorStateProps {
  /**
   * Add border and background to the error state
   */
  withCard?: boolean;
}

export function ErrorStateCard({ withCard = true, ...props }: ErrorStateCardProps) {
  const { isDarkMode } = useDarkMode();

  if (!withCard) {
    return <ErrorState {...props} />;
  }

  return (
    <div className={`rounded-lg border ${
      isDarkMode 
        ? 'bg-gray-800/30 border-gray-700 backdrop-blur-sm' 
        : 'bg-white border-gray-200'
    }`}>
      <ErrorState {...props} />
    </div>
  );
}
