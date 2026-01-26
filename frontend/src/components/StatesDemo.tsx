import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FileX, Users, AlertTriangle, Package, Inbox, Database, Calendar, Bell } from 'lucide-react';
import { useDarkMode } from './DarkModeContext';
import { 
  PermissionDenied,
  EmptyState,
  EmptyStateCard,
  ListSkeleton,
  DetailSkeleton,
  TableSkeleton,
  CardGridSkeleton,
  MetricsSkeleton,
  ErrorState,
  ErrorStateCard
} from './states';

export function StatesDemo() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);
  const [activeTab, setActiveTab] = useState<'permission' | 'empty' | 'loading' | 'error'>('permission');

  const handleRetry = async () => {
    setIsRetrying(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRetrying(false);
  };

  const tabs = [
    { id: 'permission' as const, label: 'Permission Denied' },
    { id: 'empty' as const, label: 'Empty States' },
    { id: 'loading' as const, label: 'Loading Skeletons' },
    { id: 'error' as const, label: 'Error States' },
  ];

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBgClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const headerBgClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${textClass}`}>
            State Components Demo
          </h1>
          <p className={`text-sm ${textSecondaryClass}`}>
            Explore all the reusable state components for Permission Denied, Empty States, Loading Skeletons, and Error States
          </p>
        </div>

        <div className={`border-b ${borderClass}`}>
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              let btnClass = 'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ';
              if (isActive) {
                btnClass += isDarkMode ? 'border-blue-400 text-blue-400' : 'border-blue-600 text-blue-600';
              } else {
                btnClass += isDarkMode 
                  ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300';
              }
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={btnClass}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-8">
          {activeTab === 'permission' && (
            <div className="space-y-6">
              <div>
                <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>
                  Permission Denied Component
                </h2>
                <p className={`text-sm mb-6 ${textSecondaryClass}`}>
                  Shown when a user tries to access a resource they do not have permission for.
                </p>
              </div>

              <div className={`rounded-lg border overflow-hidden ${borderClass}`}>
                <div className={`px-4 py-2 border-b ${headerBgClass}`}>
                  <p className={`text-xs font-mono ${textSecondaryClass}`}>
                    Full Page Example
                  </p>
                </div>
                <div className="h-[600px]">
                  <PermissionDenied
                    requiredRole="Owner"
                    currentRole="Supervisor"
                    onGoBack={() => navigate(-1)}
                    onGoToDashboard={() => navigate('/app')}
                  />
                </div>
              </div>

              <div className={`rounded-lg border overflow-hidden ${borderClass}`}>
                <div className={`px-4 py-2 border-b ${headerBgClass}`}>
                  <p className={`text-xs font-mono ${textSecondaryClass}`}>
                    Custom Message Example
                  </p>
                </div>
                <div className="h-[500px]">
                  <PermissionDenied
                    title="Admin Access Required"
                    message="This section is only available to administrators. Please contact your system admin to request access."
                    onGoToDashboard={() => navigate('/app')}
                    showContactAdmin={true}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'empty' && (
            <div className="space-y-6">
              <div>
                <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>
                  Empty State Components
                </h2>
                <p className={`text-sm mb-6 ${textSecondaryClass}`}>
                  Shown when there is no data to display. Flexible with different icons, sizes, and actions.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`rounded-lg border ${cardBgClass}`}>
                  <div className={`px-4 py-2 border-b ${borderClass}`}>
                    <p className={`text-xs font-mono ${textSecondaryClass}`}>
                      Basic (No Action)
                    </p>
                  </div>
                  <EmptyState
                    icon={Inbox}
                    title="No items found"
                    description="There are no items to display at the moment."
                  />
                </div>

                <div className={`rounded-lg border ${cardBgClass}`}>
                  <div className={`px-4 py-2 border-b ${borderClass}`}>
                    <p className={`text-xs font-mono ${textSecondaryClass}`}>
                      With Primary Action
                    </p>
                  </div>
                  <EmptyState
                    icon={FileX}
                    title="No runs created yet"
                    description="Get started by creating your first production run."
                    actionLabel="Create Run"
                    onAction={() => alert('Navigate to create run')}
                  />
                </div>

                <div className={`rounded-lg border ${cardBgClass}`}>
                  <div className={`px-4 py-2 border-b ${borderClass}`}>
                    <p className={`text-xs font-mono ${textSecondaryClass}`}>
                      With Primary + Secondary Action
                    </p>
                  </div>
                  <EmptyState
                    icon={Database}
                    title="No data uploaded"
                    description="Upload your production data to start scheduling runs."
                    actionLabel="Upload Data"
                    onAction={() => alert('Upload data')}
                    secondaryActionLabel="Learn More"
                    onSecondaryAction={() => alert('Show documentation')}
                  />
                </div>

                <div className={`rounded-lg border ${cardBgClass}`}>
                  <div className={`px-4 py-2 border-b ${borderClass}`}>
                    <p className={`text-xs font-mono ${textSecondaryClass}`}>
                      Custom Icon Color
                    </p>
                  </div>
                  <EmptyState
                    icon={Bell}
                    title="No alerts"
                    description="All systems running smoothly. No alerts at this time."
                    iconColorClass="text-green-500"
                    size="sm"
                  />
                </div>

                <div className={`rounded-lg border ${cardBgClass}`}>
                  <div className={`px-4 py-2 border-b ${borderClass}`}>
                    <p className={`text-xs font-mono ${textSecondaryClass}`}>
                      Small Size
                    </p>
                  </div>
                  <EmptyState
                    icon={Users}
                    title="No team members"
                    description="Add team members to collaborate."
                    actionLabel="Invite"
                    onAction={() => alert('Invite')}
                    size="sm"
                  />
                </div>

                <div className={`rounded-lg border ${cardBgClass}`}>
                  <div className={`px-4 py-2 border-b ${borderClass}`}>
                    <p className={`text-xs font-mono ${textSecondaryClass}`}>
                      Large Size
                    </p>
                  </div>
                  <EmptyState
                    icon={Package}
                    title="No inventory"
                    description="Your inventory is empty. Start by adding materials."
                    actionLabel="Add Materials"
                    onAction={() => alert('Add materials')}
                    size="lg"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'loading' && (
            <div className="space-y-6">
              <div>
                <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>
                  Loading Skeleton Components
                </h2>
                <p className={`text-sm mb-6 ${textSecondaryClass}`}>
                  Shown while data is loading. Improves perceived performance.
                </p>
              </div>

              <div className={`rounded-lg border ${borderClass}`}>
                <div className={`px-4 py-3 border-b ${headerBgClass}`}>
                  <h3 className={`font-medium ${textClass}`}>
                    List Skeleton
                  </h3>
                  <p className={`text-xs mt-1 ${textSecondaryClass}`}>
                    For loading list items (runs, events, alerts)
                  </p>
                </div>
                <div className="p-6">
                  <ListSkeleton count={3} showAvatar={true} showBadge={true} lines={2} />
                </div>
              </div>

              <div className={`rounded-lg border ${borderClass}`}>
                <div className={`px-4 py-3 border-b ${headerBgClass}`}>
                  <h3 className={`font-medium ${textClass}`}>
                    Detail Skeleton
                  </h3>
                  <p className={`text-xs mt-1 ${textSecondaryClass}`}>
                    For loading detail pages (run detail, order detail)
                  </p>
                </div>
                <div className="p-6">
                  <DetailSkeleton showHeader={true} sections={2} showActions={true} />
                </div>
              </div>

              <div className={`rounded-lg border ${borderClass}`}>
                <div className={`px-4 py-3 border-b ${headerBgClass}`}>
                  <h3 className={`font-medium ${textClass}`}>
                    Table Skeleton
                  </h3>
                  <p className={`text-xs mt-1 ${textSecondaryClass}`}>
                    For loading data tables (schedule, metrics)
                  </p>
                </div>
                <div className="p-6">
                  <TableSkeleton columns={5} rows={6} showHeader={true} />
                </div>
              </div>

              <div className={`rounded-lg border ${borderClass}`}>
                <div className={`px-4 py-3 border-b ${headerBgClass}`}>
                  <h3 className={`font-medium ${textClass}`}>
                    Card Grid Skeleton
                  </h3>
                  <p className={`text-xs mt-1 ${textSecondaryClass}`}>
                    For loading card-based layouts
                  </p>
                </div>
                <div className="p-6">
                  <CardGridSkeleton count={6} columns={3} />
                </div>
              </div>

              <div className={`rounded-lg border ${borderClass}`}>
                <div className={`px-4 py-3 border-b ${headerBgClass}`}>
                  <h3 className={`font-medium ${textClass}`}>
                    Metrics Skeleton
                  </h3>
                  <p className={`text-xs mt-1 ${textSecondaryClass}`}>
                    For loading KPI and metrics cards
                  </p>
                </div>
                <div className="p-6">
                  <MetricsSkeleton count={4} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'error' && (
            <div className="space-y-6">
              <div>
                <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>
                  Error State Components
                </h2>
                <p className={`text-sm mb-6 ${textSecondaryClass}`}>
                  Shown when API calls fail, network errors occur, or unexpected errors happen.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`rounded-lg border ${cardBgClass}`}>
                  <div className={`px-4 py-2 border-b ${borderClass}`}>
                    <p className={`text-xs font-mono ${textSecondaryClass}`}>
                      Basic Error (Default)
                    </p>
                  </div>
                  <ErrorState
                    showRetry={true}
                    onRetry={handleRetry}
                    isRetrying={isRetrying}
                    size="sm"
                  />
                </div>

                <div className={`rounded-lg border ${cardBgClass}`}>
                  <div className={`px-4 py-2 border-b ${borderClass}`}>
                    <p className={`text-xs font-mono ${textSecondaryClass}`}>
                      Network Error
                    </p>
                  </div>
                  <ErrorState
                    type="network"
                    showRetry={true}
                    onRetry={handleRetry}
                    isRetrying={isRetrying}
                    size="sm"
                  />
                </div>

                <div className={`rounded-lg border ${cardBgClass}`}>
                  <div className={`px-4 py-2 border-b ${borderClass}`}>
                    <p className={`text-xs font-mono ${textSecondaryClass}`}>
                      With Error Code
                    </p>
                  </div>
                  <ErrorState
                    title="Server Error"
                    message="The server encountered an internal error and was unable to complete your request."
                    errorCode="500"
                    showRetry={true}
                    onRetry={handleRetry}
                    size="sm"
                  />
                </div>

                <div className={`rounded-lg border ${cardBgClass}`}>
                  <div className={`px-4 py-2 border-b ${borderClass}`}>
                    <p className={`text-xs font-mono ${textSecondaryClass}`}>
                      Warning Type
                    </p>
                  </div>
                  <ErrorState
                    type="warning"
                    title="Partial Data Available"
                    message="Some data could not be loaded. The page may be incomplete."
                    showRetry={true}
                    onRetry={handleRetry}
                    showGoToDashboard={true}
                    onGoToDashboard={() => navigate('/app')}
                    size="sm"
                  />
                </div>

                <div className={`rounded-lg border ${cardBgClass}`}>
                  <div className={`px-4 py-2 border-b ${borderClass}`}>
                    <p className={`text-xs font-mono ${textSecondaryClass}`}>
                      Custom Admin Email
                    </p>
                  </div>
                  <ErrorState
                    title="Service Unavailable"
                    message="This service is temporarily unavailable. We are working to restore it."
                    errorCode="503"
                    showContactAdmin={true}
                    adminEmail="support@manufacturing.com"
                    showRetry={false}
                    size="sm"
                  />
                </div>
              </div>

              <div className={`rounded-lg border ${borderClass}`}>
                <div className={`px-4 py-2 border-b ${headerBgClass}`}>
                  <p className={`text-xs font-mono ${textSecondaryClass}`}>
                    Large Size Example (Full Page)
                  </p>
                </div>
                <div className="p-12">
                  <ErrorState
                    title="Failed to Load Production Data"
                    message="We encountered an error while fetching your production schedule data. This could be due to a network issue or server problem."
                    errorCode="API_FETCH_ERROR"
                    showRetry={true}
                    onRetry={handleRetry}
                    isRetrying={isRetrying}
                    showGoToDashboard={true}
                    onGoToDashboard={() => navigate('/app')}
                    showContactAdmin={true}
                    adminEmail="it-support@factory.com"
                    size="lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
