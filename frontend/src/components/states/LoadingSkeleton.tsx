import { useDarkMode } from '../DarkModeContext';
import { Skeleton } from '../ui/skeleton';

/**
 * Loading skeleton for list items
 */
interface ListSkeletonProps {
  /**
   * Number of skeleton items to show
   */
  count?: number;
  /**
   * Show avatar/icon on the left
   */
  showAvatar?: boolean;
  /**
   * Show badge/status on the right
   */
  showBadge?: boolean;
  /**
   * Number of text lines per item
   */
  lines?: number;
}

export function ListSkeleton({ 
  count = 5, 
  showAvatar = false, 
  showBadge = false,
  lines = 2 
}: ListSkeletonProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`flex items-center gap-4 p-4 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800/30 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          {/* Avatar */}
          {showAvatar && (
            <Skeleton className={`w-10 h-10 rounded-full flex-shrink-0 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
          )}

          {/* Content */}
          <div className="flex-1 space-y-2">
            {Array.from({ length: lines }).map((_, lineIndex) => (
              <Skeleton
                key={lineIndex}
                className={`h-4 ${
                  lineIndex === 0 ? 'w-3/4' : 'w-1/2'
                } ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              />
            ))}
          </div>

          {/* Badge */}
          {showBadge && (
            <Skeleton className={`w-20 h-6 rounded-full ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Loading skeleton for detail pages
 */
interface DetailSkeletonProps {
  /**
   * Show header section
   */
  showHeader?: boolean;
  /**
   * Number of info sections
   */
  sections?: number;
  /**
   * Show action buttons
   */
  showActions?: boolean;
}

export function DetailSkeleton({ 
  showHeader = true, 
  sections = 3,
  showActions = true 
}: DetailSkeletonProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className={`p-6 rounded-lg border ${
          isDarkMode 
            ? 'bg-gray-800/30 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 space-y-3">
              <Skeleton className={`h-8 w-1/3 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`} />
              <Skeleton className={`h-4 w-1/2 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`} />
            </div>
            {showActions && (
              <div className="flex gap-2">
                <Skeleton className={`w-24 h-10 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`} />
                <Skeleton className={`w-24 h-10 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`} />
              </div>
            )}
          </div>

          {/* Metadata row */}
          <div className="flex gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className={`h-3 w-16 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`} />
                <Skeleton className={`h-4 w-20 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Sections */}
      {Array.from({ length: sections }).map((_, sectionIndex) => (
        <div
          key={sectionIndex}
          className={`p-6 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800/30 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          <Skeleton className={`h-6 w-1/4 mb-4 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, lineIndex) => (
              <Skeleton
                key={lineIndex}
                className={`h-4 ${
                  lineIndex % 2 === 0 ? 'w-full' : 'w-5/6'
                } ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Loading skeleton for data tables
 */
interface TableSkeletonProps {
  /**
   * Number of columns
   */
  columns?: number;
  /**
   * Number of rows
   */
  rows?: number;
  /**
   * Show table header
   */
  showHeader?: boolean;
}

export function TableSkeleton({ 
  columns = 5, 
  rows = 8,
  showHeader = true 
}: TableSkeletonProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`rounded-lg border overflow-hidden ${
      isDarkMode 
        ? 'bg-gray-800/30 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          {showHeader && (
            <thead className={isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}>
              <tr>
                {Array.from({ length: columns }).map((_, index) => (
                  <th key={index} className="px-4 py-3 text-left">
                    <Skeleton className={`h-4 w-24 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                    }`} />
                  </th>
                ))}
              </tr>
            </thead>
          )}

          {/* Body */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-4">
                    <Skeleton className={`h-4 ${
                      colIndex === 0 ? 'w-32' : colIndex === columns - 1 ? 'w-20' : 'w-24'
                    } ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for card grid layouts
 */
interface CardGridSkeletonProps {
  /**
   * Number of cards
   */
  count?: number;
  /**
   * Grid columns (responsive)
   */
  columns?: 2 | 3 | 4;
}

export function CardGridSkeleton({ count = 6, columns = 3 }: CardGridSkeletonProps) {
  const { isDarkMode } = useDarkMode();

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`p-6 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800/30 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          <Skeleton className={`h-6 w-2/3 mb-4 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          <Skeleton className={`h-12 w-full mb-3 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          <div className="space-y-2">
            <Skeleton className={`h-3 w-full ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
            <Skeleton className={`h-3 w-4/5 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Loading skeleton for dashboard/KPI metrics
 */
interface MetricsSkeletonProps {
  /**
   * Number of metric cards
   */
  count?: number;
}

export function MetricsSkeleton({ count = 4 }: MetricsSkeletonProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`p-6 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800/30 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <Skeleton className={`h-4 w-20 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
            <Skeleton className={`w-8 h-8 rounded ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
          </div>
          <Skeleton className={`h-10 w-24 mb-2 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          <Skeleton className={`h-3 w-16 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
        </div>
      ))}
    </div>
  );
}
