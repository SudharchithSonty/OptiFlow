# Dark Mode Implementation TODO List

## Status Legend
- ✅ **COMPLETED** - Dark mode fully implemented
- 🔄 **IN PROGRESS** - Partially implemented or needs verification
- ❌ **PENDING** - Not yet implemented

---

## Core Components & Context

### Dark Mode Infrastructure
- ✅ `/components/DarkModeContext.tsx` - Dark mode provider and hook
- ✅ `/components/ui/DarkModeChartTooltip.tsx` - Chart styling utilities
- ✅ `/App.tsx` - Main app with dark mode toggle in TopBar

---

## Main Dashboard Pages

### Owner Role
- ✅ `/components/OwnerDashboard.tsx` - Owner dashboard with charts and KPIs

### Planner Role
- ✅ `/components/PlannerDashboard.tsx` - Planner dashboard with runs and alerts

### Supervisor Role
- ✅ `/components/SupervisorDashboard.tsx` - Supervisor dashboard
- ✅ `/components/supervisor/TodayDashboard.tsx` - Today's shift dashboard

---

## Shared/Common Pages

### Metrics & Analytics
- ✅ `/components/MetricsPage.tsx` - Metrics page with charts

### Production Management
- ❌ `/components/RunsPage.tsx` - Production runs list and management
- ❌ `/components/RunDetailPage.tsx` - Individual run detail view
- ❌ `/components/SchedulePage.tsx` - Production schedule timeline
- ❌ `/components/AlertsPage.tsx` - Alerts and notifications
- ❌ `/components/UsersPage.tsx` - User management

### UI Components
- ❌ `/components/KPICard.tsx` - KPI display card
- ❌ `/components/StatusChip.tsx` - Status indicator chip
- ❌ `/components/VersionSelector.tsx` - Version selection component
- ❌ `/components/Modal.tsx` - Modal dialog component

---

## Owner-Specific Pages

### Analytics & Governance
- ❌ `/components/owner/KPIOverviewPage.tsx` - KPI metrics overview
- ❌ `/pages/owner/KPIOverviewPage.tsx` - KPI overview (pages version)
- ❌ `/components/owner/WeeklyMetricsPage.tsx` - Weekly trends and metrics
- ❌ `/components/owner/RunsAuditPage.tsx` - Run versioning audit trail
- ❌ `/pages/owner/RunsAuditPage.tsx` - Runs audit (pages version)
- ❌ `/pages/owner/TrendsPage.tsx` - Long-term trends analysis

### Administration
- ❌ `/pages/owner/AdminUsersPage.tsx` - User administration
- ❌ `/pages/owner/SettingsPage.tsx` - Organization settings

---

## Planner-Specific Pages

### Run Management
- ❌ `/components/planner/CreateRunPage.tsx` - Create new production run
- ❌ `/pages/planner/CreateRunPage.tsx` - Create run (pages version)
- ❌ `/components/planner/RunsListPage.tsx` - List all runs
- ❌ `/pages/planner/RunsListPage.tsx` - Runs list (pages version)
- ❌ `/components/planner/RunDetailPage.tsx` - Run details and lineage
- ❌ `/pages/planner/RunDetailPage.tsx` - Run detail (pages version)
- ❌ `/components/planner/RunLineagePage.tsx` - Version lineage tree
- ❌ `/components/planner/CompareRunsPage.tsx` - Compare run versions
- ❌ `/pages/planner/KPIComparePage.tsx` - KPI comparison between versions

### Scheduling & Events
- ❌ `/components/planner/ScheduleViewPage.tsx` - Schedule timeline view
- ❌ `/pages/planner/ScheduleViewPage.tsx` - Schedule view (pages version)
- ❌ `/components/planner/EventsListPage.tsx` - Downtime/setup events list
- ❌ `/components/planner/AddEventModal.tsx` - Add event modal dialog
- ❌ `/components/planner/CreateRescheduleWizard.tsx` - Reschedule wizard

### Data & Validation
- ❌ `/components/planner/InputsValidationPage.tsx` - Input data validation
- ❌ `/components/planner/GenerateDataPage.tsx` - Generate synthetic data
- ❌ `/components/planner/DraftImpactReportPage.tsx` - Impact analysis report

---

## Supervisor-Specific Pages

### Shop Floor Operations
- ❌ `/components/supervisor/AlertsListPage.tsx` - Shop floor alerts
- ❌ `/pages/supervisor/AlertsListPage.tsx` - Alerts list (pages version)
- ❌ `/components/supervisor/OrderDetailPage.tsx` - Order details and status
- ❌ `/pages/supervisor/OrderDetailPage.tsx` - Order detail (pages version)
- ❌ `/components/supervisor/MachineDetailPage.tsx` - Machine status and tasks
- ❌ `/pages/supervisor/MachineDetailPage.tsx` - Machine detail (pages version)
- ❌ `/pages/supervisor/TodayDashboard.tsx` - Today's dashboard (pages version)

### Data Logging
- ❌ `/components/supervisor/LogSetupActualsPage.tsx` - Log setup completion
- ❌ `/components/supervisor/LogFirstPieceQualityPage.tsx` - Log first piece quality

---

## AI Agent Pages

### AI Assistant Features
- ❌ `/components/agent/ShiftStartBriefPage.tsx` - AI-generated shift brief
- ❌ `/components/agent/ExplainChatPage.tsx` - AI Q&A with evidence grounding
- ❌ `/components/agent/DraftImpactReportAssistantPage.tsx` - AI impact report assistant
- ❌ `/pages/supervisor/AgentChatPage.tsx` - Agent chat interface

---

## Authentication Pages

### Auth Flow
- ❌ `/components/auth/LoginPage.tsx` - Login page
- ❌ `/pages/LoginPage.tsx` - Login (pages version)
- ❌ `/components/auth/OTPVerifyPage.tsx` - OTP verification
- ❌ `/components/auth/ForgotPasswordPage.tsx` - Password recovery
- ❌ `/components/auth/AuthDemo.tsx` - Auth demo/testing

---

## Admin/Settings Pages

### Organization Management
- ❌ `/components/admin/OrgSettingsPage.tsx` - Organization settings
- ❌ `/components/admin/UsersRolesPage.tsx` - User roles and permissions

---

## Layout Components

### Navigation & Structure
- ❌ `/components/layout/TopBar.tsx` - Top navigation bar (may have partial support)
- ❌ `/components/layout/BottomTabs.tsx` - Bottom tab navigation (tablet)
- ❌ `/components/layout/Sidebar.tsx` - Desktop sidebar navigation

---

## Summary

### Implementation Statistics
- ✅ **Completed**: 7 pages
- ❌ **Pending**: 65+ pages
- **Total**: 72+ pages requiring dark mode

### Priority Order (Recommended)
1. **High Priority** - Shared components (RunsPage, SchedulePage, AlertsPage, RunDetailPage)
2. **High Priority** - Layout components (TopBar, BottomTabs, Sidebar)
3. **Medium Priority** - Role-specific dashboards and main pages
4. **Medium Priority** - AI agent pages
5. **Lower Priority** - Admin and settings pages
6. **Lower Priority** - Auth pages (can maintain light theme for branding)

### Dark Mode Pattern to Follow
```tsx
import { useDarkMode } from './DarkModeContext';
// or for charts:
import { useDarkModeChartStyles } from './ui/DarkModeChartTooltip';

function MyComponent() {
  const { isDarkMode } = useDarkMode();
  const chartStyles = useDarkModeChartStyles(); // For chart components
  
  return (
    <div className={isDarkMode ? 'dark-class' : 'light-class'}>
      {/* or */}
      <div className={`base-class ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        {/* content */}
      </div>
    </div>
  );
}
```

### Common Dark Mode Class Patterns
- **Backgrounds**: `bg-white` → `bg-gray-800` / `bg-gray-900`
- **Cards**: `bg-white border-gray-200` → `bg-gray-800 border-gray-700`
- **Text**: `text-gray-900` → `text-white`, `text-gray-600` → `text-gray-400`
- **Borders**: `border-gray-200` → `border-gray-700`
- **Inputs**: `bg-white border-gray-300` → `bg-gray-700 border-gray-600`
- **Hover effects**: `hover:bg-gray-50` → `hover:bg-gray-700`
- **Charts**: Use `useDarkModeChartStyles()` for consistent theming
