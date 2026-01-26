import { LucideIcon, Inbox } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface EmptyStateProps {
  /**
   * Icon to display (from lucide-react)
   */
  icon?: LucideIcon;
  /**
   * Title of the empty state
   */
  title: string;
  /**
   * Description text
   */
  description?: string;
  /**
   * Call-to-action button text
   */
  actionLabel?: string;
  /**
   * Callback when CTA button is clicked
   */
  onAction?: () => void;
  /**
   * Secondary action button text
   */
  secondaryActionLabel?: string;
  /**
   * Callback when secondary CTA button is clicked
   */
  onSecondaryAction?: () => void;
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Custom icon color class
   */
  iconColorClass?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  size = 'md',
  iconColorClass,
}: EmptyStateProps) {
  const { isDarkMode } = useDarkMode();

  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'w-10 h-10 mb-3',
      title: 'text-base',
      description: 'text-xs',
      button: 'text-sm px-3 py-2',
    },
    md: {
      container: 'py-12',
      icon: 'w-12 h-12 mb-4',
      title: 'text-lg',
      description: 'text-sm',
      button: 'text-sm px-4 py-2.5',
    },
    lg: {
      container: 'py-16',
      icon: 'w-16 h-16 mb-6',
      title: 'text-xl',
      description: 'text-base',
      button: 'text-base px-5 py-3',
    },
  };

  const currentSize = sizeClasses[size];

  const defaultIconColor = isDarkMode ? 'text-gray-600' : 'text-gray-400';
  const iconColor = iconColorClass || defaultIconColor;

  return (
    <div className={`text-center ${currentSize.container}`}>
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <Icon className={`${currentSize.icon} ${iconColor}`} />
      </div>

      {/* Title */}
      <h3 className={`font-semibold mb-2 ${currentSize.title} ${
        isDarkMode ? 'text-gray-200' : 'text-gray-900'
      }`}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={`max-w-md mx-auto mb-6 ${currentSize.description} ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {description}
        </p>
      )}

      {/* Action Buttons */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className={`${currentSize.button} rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className={`${currentSize.button} rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
              }`}
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Wrapper component for empty states with border and background
 */
interface EmptyStateCardProps extends EmptyStateProps {
  /**
   * Add border and background to the empty state
   */
  withCard?: boolean;
}

export function EmptyStateCard({ withCard = true, ...props }: EmptyStateCardProps) {
  const { isDarkMode } = useDarkMode();

  if (!withCard) {
    return <EmptyState {...props} />;
  }

  return (
    <div className={`rounded-lg border ${
      isDarkMode 
        ? 'bg-gray-800/30 border-gray-700 backdrop-blur-sm' 
        : 'bg-white border-gray-200'
    }`}>
      <EmptyState {...props} />
    </div>
  );
}
