import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router';
import { Home, BarChart3, Users, Settings, ClipboardList, Calendar, Bell, LogOut, Moon, Sun, Bot, Menu, X } from 'lucide-react';

import { DarkModeProvider, useDarkMode } from './components/DarkModeContext';

// Auth Components
import { LoginPage } from './components/auth/LoginPage';
import { OTPVerifyPage } from './components/auth/OTPVerifyPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';

// Dashboard Components
import { OwnerDashboard } from './components/OwnerDashboard';
import { PlannerDashboard } from './components/PlannerDashboard';
import { SupervisorDashboard } from './components/SupervisorDashboard';
import { RunsPage } from './components/RunsPage';
import { SchedulePage } from './components/SchedulePage';
import { AlertsPage } from './components/AlertsPage';
import { MetricsPage } from './components/MetricsPage';
import { UsersPage } from './components/UsersPage';

// Planner Components
import { RunsListPage } from './components/planner/RunsListPage';
import { RunLineagePage } from './components/planner/RunLineagePage';
import { CreateRunPage } from './components/planner/CreateRunPage';
import { InputsValidationPage } from './components/planner/InputsValidationPage';
import { GenerateDataPage } from './components/planner/GenerateDataPage';
import { ScheduleViewPage } from './components/planner/ScheduleViewPage';
import { CompareRunsPage } from './components/planner/CompareRunsPage';
import { EventsListPage } from './components/planner/EventsListPage';
import { AddEventModal } from './components/planner/AddEventModal';
import { CreateRescheduleWizard } from './components/planner/CreateRescheduleWizard';
import { DraftImpactReportPage } from './components/planner/DraftImpactReportPage';
import { DraftImpactReportComparePage } from './components/planner/DraftImpactReportComparePage';
import { RunDetailPage } from './components/planner/RunDetailPage';

// Supervisor Components
import { OrderDetailPage } from './components/supervisor/OrderDetailPage';
import { MachineDetailPage } from './components/supervisor/MachineDetailPage';
import { LogSetupActualsPage } from './components/supervisor/LogSetupActualsPage';
import { LogFirstPieceQualityPage } from './components/supervisor/LogFirstPieceQualityPage';
import { TodayDashboard } from './components/supervisor/TodayDashboard';
import { AlertsListPage } from './components/supervisor/AlertsListPage';

// Owner Components
import { WeeklyMetricsPage } from './components/owner/WeeklyMetricsPage';
import { KPIOverviewPage } from './components/owner/KPIOverviewPage';
import { RunsAuditPage } from './components/owner/RunsAuditPage';

// Admin Components
import { UsersRolesPage } from './components/admin/UsersRolesPage';
import { OrgSettingsPage } from './components/admin/OrgSettingsPage';
import { RBACPermissionsPage } from './components/admin/RBACPermissionsPage';

// AI Agent Components
import { AgentHomePage } from './components/agent/AgentHomePage';
import { ShiftStartBriefPage } from './components/agent/ShiftStartBriefPage';
import { DraftImpactReportAssistantPage } from './components/agent/DraftImpactReportAssistantPage';
import { ExplainChatPage } from './components/agent/ExplainChatPage';
import { SetupGuidancePage } from './components/agent/SetupGuidancePage';
import { SetupChecklistPage } from './components/agent/SetupChecklistPage';
import { SetupChecklistOutputPage } from './components/agent/SetupChecklistOutputPage';
import { SetupChecklistUnsourcedPage } from './components/agent/SetupChecklistUnsourcedPage';
import { AgentJobsPage } from './components/agent/AgentJobsPage';
import { AgentJobDetailPage } from './components/agent/AgentJobDetailPage';
import { AgentJobDetailFailedPage } from './components/agent/AgentJobDetailFailedPage';
import { AIMetricsPage } from './components/agent/AIMetricsPage';
import { PermissionDeniedPublishPage } from './components/shared/PermissionDeniedPublishPage';


type UserRole = 'owner' | 'planner' | 'supervisor';

interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'Amit Mishra', role: 'owner', avatar: '👨‍💼' },
  { id: '2', name: 'Ravi Rampaul', role: 'planner', avatar: '👨‍💻' },
  { id: '3', name: 'Priya Patel', role: 'supervisor', avatar: '👷‍♀️' },
];

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  // Initialize user - prioritize location.state over localStorage
  const getInitialUser = (): User => {
    // ALWAYS prioritize role from navigation state (from login) first
    const stateRole = location.state?.role as UserRole | undefined;
    
    if (stateRole) {
      const user = mockUsers.find(u => u.role === stateRole);
      if (user) {
        localStorage.setItem('currentUserRole', stateRole);
        return user;
      }
    }
    
    const savedRole = localStorage.getItem('currentUserRole') as UserRole | null;
    if (savedRole) {
      const user = mockUsers.find(u => u.role === savedRole);
      if (user) {
        return user;
      }
    }
    
    return mockUsers[1];
  };
  
  const [currentUser, setCurrentUser] = useState<User>(getInitialUser);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const newValue = !prev;
      localStorage.setItem('sidebarCollapsed', String(newValue));
      return newValue;
    });
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1200);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const stateRole = location.state?.role as UserRole | undefined;
    if (stateRole) {
      const user = mockUsers.find(u => u.role === stateRole);
      if (user && user.role !== currentUser.role) {
        setCurrentUser(user);
        localStorage.setItem('currentUserRole', stateRole);
      }
    }
  }, [location]);

  useEffect(() => {
    const savedRole = localStorage.getItem('currentUserRole') as UserRole | null;
    if (savedRole) {
      const user = mockUsers.find(u => u.role === savedRole);
      if (user) {
        setCurrentUser(user);
      }
    }
  }, []);

  const getNavItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', path: '/app' }
    ];

    if (currentUser.role === 'owner') {
      return [
        ...baseItems,
        { icon: ClipboardList, label: 'Runs', path: '/app/runs' },
        { icon: BarChart3, label: 'Metrics', path: '/app/metrics' },
        { icon: Calendar, label: 'Schedule', path: '/app/schedule' },
        { icon: Bot, label: 'Agent', path: '/app/agent/home' },
        { icon: Users, label: 'Users', path: '/app/users' },
        { icon: Settings, label: 'Settings', path: '/app/settings' },
      ];
    }

    if (currentUser.role === 'planner') {
      return [
        ...baseItems,
        { icon: ClipboardList, label: 'Runs', path: '/app/runs' },
        { icon: Calendar, label: 'Schedule', path: '/app/schedule' },
        { icon: BarChart3, label: 'Metrics', path: '/app/metrics' },
        { icon: Bot, label: 'Agent', path: '/app/agent/home' },
      ];
    }

    // supervisor - no Agent access
    return [
      ...baseItems,
      { icon: Bell, label: 'Alerts', path: '/app/alerts' },
      { icon: Calendar, label: 'Today', path: '/app/schedule' },
    ];
  };

  const navItems = getNavItems();

  const handleRoleSwitch = (role: UserRole) => {
    const user = mockUsers.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUserRole', role);
      navigate('/app');
    }
  };

  const handleLogout = () => {
    // Clear localStorage on logout
    localStorage.removeItem('currentUserRole');
    // Navigate to login and force a clean state
    navigate('/auth/login', { replace: true, state: null });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Button (Desktop only) */}
            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={isSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
              >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            )}
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white">⚙️</span>
            </div>
            <div>
              <h1 className="text-lg text-gray-900 dark:text-gray-100">Digital Operations Assistant</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} View</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentUser.avatar}</span>
              <div className="hidden sm:block">
                <p className="text-sm text-gray-900 dark:text-gray-100">{currentUser.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && !isSidebarCollapsed && (
          <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300">
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          <Routes>
            <Route
              path="/"
              element={
                currentUser.role === 'owner' ? (
                  <OwnerDashboard />
                ) : currentUser.role === 'planner' ? (
                  <PlannerDashboard />
                ) : (
                  <TodayDashboard />
                )
              }
            />
            {/* New Planner Runs Pages */}
            <Route path="/runs" element={<RunsListPage />} />
            <Route path="/runs/create" element={<CreateRunPage />} />
            <Route path="/runs/:runId/lineage" element={<RunLineagePage />} />
            <Route path="/runs/:runId/inputs" element={<InputsValidationPage />} />
            <Route path="/runs/:runId/generate-data" element={<GenerateDataPage />} />
            <Route path="/runs/:runId/schedule" element={<ScheduleViewPage />} />
            <Route path="/runs/:runId/events" element={<EventsListPage />} />
            <Route path="/runs/:runId/events/add" element={<AddEventModal />} />
            <Route path="/runs/:runId/reschedule-wizard" element={<CreateRescheduleWizard />} />
            <Route path="/runs/:runId/impact-report" element={<DraftImpactReportPage />} />
            <Route path="/runs/compare/draft-impact-report" element={<DraftImpactReportComparePage userRole={currentUser.role} />} />
            <Route path="/runs/compare/permission-denied" element={<PermissionDeniedPublishPage userRole={currentUser.role} />} />
            <Route path="/runs/compare" element={<CompareRunsPage />} />
            <Route path="/runs/:runId" element={<RunDetailPage />} />
            {/* AI Agent Routes */}
            <Route path="/runs/:runId/brief" element={<ShiftStartBriefPage userRole={currentUser.role} />} />
            <Route path="/runs/:runId/draft-assistant" element={<DraftImpactReportAssistantPage userRole={currentUser.role} />} />
            <Route path="/agent/chat" element={<ExplainChatPage userRole={currentUser.role} />} />
            <Route path="/agent/home" element={<AgentHomePage userRole={currentUser.role} />} />
            <Route path="/agent/setup-guidance" element={<SetupGuidancePage userRole={currentUser.role} />} />
            <Route path="/agent/setup-checklist" element={<SetupChecklistPage userRole={currentUser.role} />} />
            <Route path="/agent/setup-checklist/output" element={<SetupChecklistOutputPage userRole={currentUser.role} />} />
            <Route path="/agent/setup-checklist/unsourced" element={<SetupChecklistUnsourcedPage userRole={currentUser.role} />} />
            <Route path="/agent/jobs" element={<AgentJobsPage userRole={currentUser.role} />} />
            <Route 
              path="/agent/jobs/:jobId" 
              element={
                // Show failed page for job AJ-98325, otherwise show normal detail page
                window.location.pathname.includes('AJ-98325') 
                  ? <AgentJobDetailFailedPage userRole={currentUser.role} />
                  : <AgentJobDetailPage userRole={currentUser.role} />
              } 
            />
            <Route path="/agent/metrics" element={<AIMetricsPage userRole={currentUser.role} />} />
            {/* Supervisor Routes */}
            <Route path="/orders/:orderId" element={<OrderDetailPage />} />
            <Route path="/machines/:machineId" element={<MachineDetailPage />} />
            <Route path="/machines/:machineId/setup-actuals" element={<LogSetupActualsPage />} />
            <Route path="/machines/:machineId/first-piece-quality" element={<LogFirstPieceQualityPage />} />
            {/* Other Routes */}
            <Route path="/schedule" element={<SchedulePage role={currentUser.role} />} />
            <Route path="/alerts" element={<AlertsListPage />} />
            <Route path="/metrics" element={currentUser.role === 'owner' ? <KPIOverviewPage /> : <MetricsPage role={currentUser.role} />} />
            <Route path="/metrics/weekly" element={<WeeklyMetricsPage />} />
            <Route path="/audit" element={<RunsAuditPage />} />
            <Route path="/users" element={<UsersRolesPage />} />
            <Route path="/settings" element={<OrgSettingsPage />} />
            <Route path="/permissions" element={<RBACPermissionsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Bottom Tab Bar (Mobile/Tablet) */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
          <div className="flex items-center justify-around h-16 px-2">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg min-w-[72px] ${
                    isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

export default function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/otp" element={<OTPVerifyPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          
          {/* App Routes - Only accessible after auth */}
          <Route path="/app/*" element={<AppLayout />} />
          
          {/* Catch-all: redirect any unmatched routes to app */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}