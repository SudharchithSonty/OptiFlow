# Dark Mode - Remaining Files Implementation Guide

## ✅ COMPLETED SO FAR: 26 files (36%)

### Recently Completed (Current Session - Priority 2 Owner Pages):
**✅ ALL PRIORITY 2 OWNER PAGES COMPLETE (8/8 files)**

#### `/components/owner/` directory (3 files):
1. ✅ `/components/owner/KPIOverviewPage.tsx` - Organization KPI dashboard
2. ✅ `/components/owner/WeeklyMetricsPage.tsx` - Weekly metrics with filters
3. ✅ `/components/owner/RunsAuditPage.tsx` - Run lineage and audit trail

#### `/pages/owner/` directory (5 files):
4. ✅ `/pages/owner/KPIOverviewPage.tsx` - Alternative KPI implementation
5. ✅ `/pages/owner/TrendsPage.tsx` - Long-term analytics with trend charts
6. ✅ `/pages/owner/AdminUsersPage.tsx` - User administration
7. ✅ `/pages/owner/SettingsPage.tsx` - Organization settings
8. ✅ `/pages/owner/RunsAuditPage.tsx` - Alternative audit implementation

### Previously Completed (Priority 1):
1. ✅ `/components/SchedulePage.tsx` - Production schedule timeline (All roles)
2. ✅ `/components/RunDetailPage.tsx` - Individual run detail view (All roles)
3. ✅ `/components/UsersPage.tsx` - User management (Owner/Admin)

---

## ❌ REMAINING: 46 FILES (64%)

### Priority 1: Critical Shared Pages (0 files) ✅ COMPLETE
All Priority 1 files are now complete!

---

### Priority 2: Owner Pages (8 files)

#### `/components/owner/` directory:
1. `KPIOverviewPage.tsx` - KPI metrics dashboard
2. `WeeklyMetricsPage.tsx` - Weekly trends with charts
3. `RunsAuditPage.tsx` - Run versioning audit trail

#### `/pages/owner/` directory:
4. `KPIOverviewPage.tsx` - Duplicate/alternative implementation
5. `RunsAuditPage.tsx` - Duplicate/alternative implementation
6. `TrendsPage.tsx` - Long-term analytics
7. `AdminUsersPage.tsx` - User administration
8. `SettingsPage.tsx` - Organization settings

**Common Pattern for ALL Owner Pages**:
```tsx
import { useDarkMode } from '../../components/DarkModeContext'; // Adjust path
const { isDarkMode } = useDarkMode();

// Charts: Use useDarkModeChartStyles() from DarkModeChartTooltip
import { useDarkModeChartStyles } from '../../components/ui/DarkModeChartTooltip';
const chartStyles = useDarkModeChartStyles();
```

---

### Priority 3: Planner Pages (16 files)

#### Run Management:
1. `/components/planner/CreateRunPage.tsx` - Create new run wizard
2. `/pages/planner/CreateRunPage.tsx` - Duplicate/alternative
3. `/components/planner/RunsListPage.tsx` - All runs list
4. `/pages/planner/RunsListPage.tsx` - Duplicate/alternative
5. `/components/planner/RunDetailPage.tsx` - Run details
6. `/pages/planner/RunDetailPage.tsx` - Duplicate/alternative
7. `/components/planner/RunLineagePage.tsx` - Version lineage tree
8. `/components/planner/CompareRunsPage.tsx` - Compare versions
9. `/pages/planner/KPIComparePage.tsx` - KPI comparison

#### Scheduling:
10. `/components/planner/ScheduleViewPage.tsx` - Schedule timeline
11. `/pages/planner/ScheduleViewPage.tsx` - Duplicate/alternative
12. `/components/planner/EventsListPage.tsx` - Events list
13. `/components/planner/AddEventModal.tsx` - Add event modal
14. `/components/planner/CreateRescheduleWizard.tsx` - Reschedule wizard

#### Data Management:
15. `/components/planner/InputsValidationPage.tsx` - Input validation
16. `/components/planner/GenerateDataPage.tsx` - Generate synthetic data
17. `/components/planner/DraftImpactReportPage.tsx` - Impact report

**Common Pattern for ALL Planner Pages**:
```tsx
import { useDarkMode } from '../DarkModeContext'; // From /components/planner/
// or
import { useDarkMode } from '../../components/DarkModeContext'; // From /pages/planner/
```

---

### Priority 4: Supervisor Pages (9 files)

#### Shop Floor Operations:
1. `/components/supervisor/AlertsListPage.tsx` - Alerts list
2. `/pages/supervisor/AlertsListPage.tsx` - Duplicate/alternative
3. `/components/supervisor/OrderDetailPage.tsx` - Order details
4. `/pages/supervisor/OrderDetailPage.tsx` - Duplicate/alternative
5. `/components/supervisor/MachineDetailPage.tsx` - Machine status
6. `/pages/supervisor/MachineDetailPage.tsx` - Duplicate/alternative
7. `/pages/supervisor/TodayDashboard.tsx` - Alternative today view

#### Data Logging:
8. `/components/supervisor/LogSetupActualsPage.tsx` - Log setup times
9. `/components/supervisor/LogFirstPieceQualityPage.tsx` - Log quality checks

**Common Pattern for ALL Supervisor Pages**:
```tsx
import { useDarkMode } from '../DarkModeContext'; // From /components/supervisor/
// or
import { useDarkMode } from '../../components/DarkModeContext'; // From /pages/supervisor/
```

---

### Priority 5: AI Agent Pages (4 files)

1. `/components/agent/ShiftStartBriefPage.tsx` - AI shift brief
2. `/components/agent/ExplainChatPage.tsx` - AI Q&A chat
3. `/components/agent/DraftImpactReportAssistantPage.tsx` - AI report assistant
4. `/pages/supervisor/AgentChatPage.tsx` - Agent chat interface

**Pattern**:
```tsx
import { useDarkMode } from '../DarkModeContext'; // From /components/agent/
// or  
import { useDarkMode } from '../../components/DarkModeContext'; // From /pages/supervisor/

// AI chat bubbles:
// User messages: isDarkMode ? 'bg-blue-900/50 text-white' : 'bg-blue-600 text-white'
// AI messages: isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-900'
```

---

### Priority 6: Authentication Pages (5 files)

1. `/components/auth/LoginPage.tsx` - Login form
2. `/pages/LoginPage.tsx` - Duplicate/alternative
3. `/components/auth/OTPVerifyPage.tsx` - OTP verification
4. `/components/auth/ForgotPasswordPage.tsx` - Password reset
5. `/components/auth/AuthDemo.tsx` - Auth testing demo

**Pattern**:
```tsx
import { useDarkMode } from '../DarkModeContext'; // From /components/auth/
// or
import { useDarkMode } from '../components/DarkModeContext'; // From /pages/

// Special consideration: Auth pages can maintain branded light theme if preferred
// But if implementing dark mode, use softer backgrounds for better UX
```

---

### Priority 7: Admin Pages (2 files)

1. `/components/admin/OrgSettingsPage.tsx` - Organization settings
2. `/components/admin/UsersRolesPage.tsx` - User roles management

**Pattern**:
```tsx
import { useDarkMode } from '../DarkModeContext'; // From /components/admin/
```

---

## 🔧 STANDARD IMPLEMENTATION PATTERN

### Step 1: Import Hook
```tsx
import { useDarkMode } from './DarkModeContext'; // Adjust relative path based on location
```

### Step 2: Add Hook in Component
```tsx
export function MyComponent() {
  const { isDarkMode } = useDarkMode();
  // ... rest of component
}
```

### Step 3: Update Class Names

#### Backgrounds:
```tsx
// Containers/Cards
className={`... ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}

// Page backgrounds
className={`... ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}

// Nested cards
className={`... ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
```

#### Text:
```tsx
// Headings
className={`... ${isDarkMode ? 'text-white' : 'text-gray-900'}`}

// Body text
className={`... ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}

// Secondary text
className={`... ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}

// Muted text
className={`... ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}
```

#### Borders:
```tsx
className={`border ... ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
```

#### Inputs & Selects:
```tsx
className={`border ... ${
  isDarkMode 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-900'
}`}
```

#### Hover States:
```tsx
className={`... ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
```

#### Icons:
```tsx
className={`... ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
```

---

## 📊 CHART-SPECIFIC PATTERN

For pages with Recharts:
```tsx
import { useDarkModeChartStyles } from './ui/DarkModeChartTooltip'; // Adjust path
const chartStyles = useDarkModeChartStyles();

// Then use:
<BarChart {...chartStyles.chart}>
  <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.grid.stroke} />
  <XAxis stroke={chartStyles.axis.stroke} tick={{ fill: chartStyles.axis.tick.fill }} />
  <YAxis stroke={chartStyles.axis.stroke} tick={{ fill: chartStyles.axis.tick.fill }} />
  <Tooltip content={<CustomTooltip {...chartStyles.tooltip} />} />
  // ... rest of chart
</BarChart>
```

---

## 🎯 QUICK REFERENCE: File Path to Import Path

### From `/components/` (root level):
```tsx
import { useDarkMode } from './DarkModeContext';
```

### From `/components/owner/`, `/components/planner/`, `/components/supervisor/`, `/components/admin/`, `/components/agent/`, `/components/auth/`:
```tsx
import { useDarkMode } from '../DarkModeContext';
```

### From `/pages/owner/`, `/pages/planner/`, `/pages/supervisor/`:
```tsx
import { useDarkMode } from '../../components/DarkModeContext';
```

### From `/pages/` (root level):
```tsx
import { useDarkMode } from '../components/DarkModeContext';
```

---

## ⚡ EFFICIENCY TIPS

1. **Search & Replace**: Use IDE find/replace with regex for common patterns
2. **Batch Similar Files**: Update all owner pages together, then planner, etc.
3. **Test Incrementally**: Test dark mode after each batch of 5-10 files
4. **Reuse Patterns**: Copy conditional className logic between similar components

---

## 🔍 TESTING CHECKLIST

After updating each file, verify:
- [ ] Page loads without errors
- [ ] All backgrounds adapt to dark mode
- [ ] All text is readable (proper contrast)
- [ ] All borders are visible
- [ ] Input fields and selects work properly
- [ ] Hover states are visible
- [ ] Charts render correctly (if applicable)
- [ ] Modals/dialogs adapt to dark mode
- [ ] No white flashes on load
- [ ] Smooth transitions between modes

---

## 📈 PROGRESS TRACKER

- **Completed**: 26/72 files (36%)
- **Remaining**: 46/72 files (64%)

### By Priority:
- Priority 1 (Critical Shared): 0/3 remaining
- Priority 2 (Owner): 0/8 remaining  
- Priority 3 (Planner): 0/16 remaining
- Priority 4 (Supervisor): 0/9 remaining
- Priority 5 (AI Agent): 0/4 remaining
- Priority 6 (Auth): 0/5 remaining
- Priority 7 (Admin): 0/2 remaining

---

**Next Steps**: Start with Priority 2 (Owner Pages) as these are used by the Owner/Admin roles and will have a significant impact.