# Dark Mode Implementation - Progress Report

## ✅ COMPLETED (11 files)

### Core Infrastructure (3 files)
- ✅ `/components/DarkModeContext.tsx` - Dark mode provider and hook
- ✅ `/components/ui/DarkModeChartTooltip.tsx` - Chart styling utilities  
- ✅ `/App.tsx` - Main app with dark mode toggle

### Main Dashboards (3 files)
- ✅ `/components/OwnerDashboard.tsx` - Owner dashboard with charts and KPIs
- ✅ `/components/PlannerDashboard.tsx` - Planner dashboard with runs and alerts
- ✅ `/components/SupervisorDashboard.tsx` - Supervisor dashboard
- ✅ `/components/supervisor/TodayDashboard.tsx` - Today's shift dashboard

### Shared/Common Pages (2 files)
- ✅ `/components/MetricsPage.tsx` - Metrics page with charts
- ✅ `/components/RunsPage.tsx` - Production runs list and management (**JUST COMPLETED**)
- ✅ `/components/AlertsPage.tsx` - Alerts and notifications (**JUST COMPLETED**)

### Layout Components (3 files) - **JUST COMPLETED**
- ✅ `/components/layout/TopBar.tsx` - Top navigation bar
- ✅ `/components/layout/BottomTabs.tsx` - Bottom tab navigation (tablet)
- ✅ `/components/layout/Sidebar.tsx` - Desktop sidebar navigation

---

## 🔄 IN PROGRESS - PRIORITY QUEUE

### High Priority - Core Shared Components (7 files)
1. `/components/SchedulePage.tsx` - Production schedule timeline
2. `/components/RunDetailPage.tsx` - Individual run detail view
3. `/components/UsersPage.tsx` - User management
4. `/components/KPICard.tsx` - KPI display card (small, widely used)
5. `/components/StatusChip.tsx` - Status indicator chip (small, widely used)
6. `/components/VersionSelector.tsx` - Version selection component
7. `/components/Modal.tsx` - Modal dialog component

---

## ❌ REMAINING - ORGANIZED BY ROLE

### Owner-Specific Pages (8 files)
- `/components/owner/KPIOverviewPage.tsx`
- `/pages/owner/KPIOverviewPage.tsx`
- `/components/owner/WeeklyMetricsPage.tsx`
- `/components/owner/RunsAuditPage.tsx`
- `/pages/owner/RunsAuditPage.tsx`
- `/pages/owner/TrendsPage.tsx`
- `/pages/owner/AdminUsersPage.tsx`
- `/pages/owner/SettingsPage.tsx`

### Planner-Specific Pages (16 files)
- `/components/planner/CreateRunPage.tsx`
- `/pages/planner/CreateRunPage.tsx`
- `/components/planner/RunsListPage.tsx`
- `/pages/planner/RunsListPage.tsx`
- `/components/planner/RunDetailPage.tsx`
- `/pages/planner/RunDetailPage.tsx`
- `/components/planner/RunLineagePage.tsx`
- `/components/planner/CompareRunsPage.tsx`
- `/pages/planner/KPIComparePage.tsx`
- `/components/planner/ScheduleViewPage.tsx`
- `/pages/planner/ScheduleViewPage.tsx`
- `/components/planner/EventsListPage.tsx`
- `/components/planner/AddEventModal.tsx`
- `/components/planner/CreateRescheduleWizard.tsx`
- `/components/planner/InputsValidationPage.tsx`
- `/components/planner/GenerateDataPage.tsx`
- `/components/planner/DraftImpactReportPage.tsx`

### Supervisor-Specific Pages (7 files)
- `/components/supervisor/AlertsListPage.tsx`
- `/pages/supervisor/AlertsListPage.tsx`
- `/components/supervisor/OrderDetailPage.tsx`
- `/pages/supervisor/OrderDetailPage.tsx`
- `/components/supervisor/MachineDetailPage.tsx`
- `/pages/supervisor/MachineDetailPage.tsx`
- `/pages/supervisor/TodayDashboard.tsx`
- `/components/supervisor/LogSetupActualsPage.tsx`
- `/components/supervisor/LogFirstPieceQualityPage.tsx`

### AI Agent Pages (4 files)
- `/components/agent/ShiftStartBriefPage.tsx`
- `/components/agent/ExplainChatPage.tsx`
- `/components/agent/DraftImpactReportAssistantPage.tsx`
- `/pages/supervisor/AgentChatPage.tsx`

### Authentication Pages (5 files)
- `/components/auth/LoginPage.tsx`
- `/pages/LoginPage.tsx`
- `/components/auth/OTPVerifyPage.tsx`
- `/components/auth/ForgotPasswordPage.tsx`
- `/components/auth/AuthDemo.tsx`

### Admin/Settings Pages (2 files)
- `/components/admin/OrgSettingsPage.tsx`
- `/components/admin/UsersRolesPage.tsx`

---

## 📊 STATISTICS

- **Completed**: 11 files (15%)
- **In Progress Queue**: 7 files (10%)
- **Remaining**: 54 files (75%)
- **Total**: 72 files

---

## 🎯 RECOMMENDED APPROACH

### Batch 1: Critical Shared Components (Next 7 files)
Focus on components used across all roles:
- SchedulePage, RunDetailPage, UsersPage
- Small utility components: KPICard, StatusChip, VersionSelector, Modal

### Batch 2: Owner Pages (8 files)
All owner-specific dashboards and admin pages

### Batch 3: Planner Pages (16 files)  
All planner-specific run and schedule management pages

### Batch 4: Supervisor Pages (9 files)
All supervisor shop floor and logging pages

### Batch 5: AI & Auth Pages (9 files)
AI agent interfaces and authentication flows

### Batch 6: Admin Pages (2 files)
Organization settings and user management

---

## 🔧 DARK MODE PATTERN TEMPLATE

```tsx
// 1. Import hook
import { useDarkMode } from './DarkModeContext'; // or '../DarkModeContext' or '../../components/DarkModeContext'

// 2. Use in component
export function MyComponent() {
  const { isDarkMode } = useDarkMode();
  
  return (
    <div className={`... ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      {/* Conditional classes */}
    </div>
  );
}
```

### Common Replacements:
- `bg-white` → `${isDarkMode ? 'bg-gray-800' : 'bg-white'}`
- `bg-gray-50` → `${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`
- `text-gray-900` → `${isDarkMode ? 'text-white' : 'text-gray-900'}`
- `text-gray-600` → `${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`
- `border-gray-200` → `${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`
- `hover:bg-gray-50` → `${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`

---

## ⚡ QUICK WINS

Small components that can be updated quickly:
1. **KPICard.tsx** (~50 lines)
2. **StatusChip.tsx** (~30 lines)
3. **VersionSelector.tsx** (~40 lines)
4. **Modal.tsx** (~60 lines)

These 4 files affect many pages across the app!
