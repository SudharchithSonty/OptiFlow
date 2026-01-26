# Information Architecture - Digital Operations Assistant

## Site Map

```
┌─────────────────────────────────────────────────────────────┐
│                    TOP BAR (All Roles)                      │
│  Logo + Title | Role Indicator | Demo Role Switcher | User  │
└─────────────────────────────────────────────────────────────┘
       │
       ├─── OWNER ROLE ───────────────────────────────
       │    ├── Dashboard (/)
       │    │   ├── KPI Grid (6 metrics with trends)
       │    │   ├── Weekly Performance Chart
       │    │   ├── Production Summary
       │    │   ├── Reject Analysis
       │    │   └── Recent Activities
       │    │
       │    ├── Metrics (/metrics)
       │    │   ├── Detailed KPI Cards
       │    │   ├── Weekly Trends (Line Chart)
       │    │   ├── Setup Time by Machine
       │    │   ├── Downtime Analysis
       │    │   ├── Reject Analysis
       │    │   └── Machine Performance Table
       │    │
       │    ├── Users (/users)
       │    │   ├── User Stats
       │    │   ├── Search & Filters
       │    │   ├── User Table
       │    │   └── Add User Dialog
       │    │
       │    └── Settings (/settings)
       │
       ├─── PLANNER ROLE ─────────────────────────────
       │    ├── Dashboard (/)
       │    │   ├── Quick Stats (4 cards)
       │    │   ├── Alert Banner
       │    │   ├── Today's Runs (expandable cards)
       │    │   └── Upcoming Runs
       │    │
       │    ├── Runs (/runs)
       │    │   ├── Search & Filters
       │    │   ├── Run Groups (by date/shift)
       │    │   │   ├── Latest Version (primary)
       │    │   │   └── Version History (expandable)
       │    │   └── Create Run Button
       │    │
       │    ├── Run Detail (/runs/:runId)
       │    │   ├── Run Header (with Compare, Export)
       │    │   ├── Metrics Grid (4 cards)
       │    │   ├── AI Brief Panel
       │    │   │   ├── Summary
       │    │   │   ├── Key Insights
       │    │   │   ├── Identified Risks
       │    │   │   └── Recommendations
       │    │   ├── Orders Table
       │    │   ├── Machine Allocation Cards
       │    │   ├── Ask AI Dialog (modal)
       │    │   └── Compare Versions Dialog (modal)
       │    │
       │    ├── Schedule (/schedule)
       │    │   ├── Date Navigation
       │    │   ├── Shift Selector (A/B/C)
       │    │   ├── View Toggle (Timeline/List)
       │    │   ├── Timeline View
       │    │   │   ├── Time Grid Header
       │    │   │   └── Machine Rows with Order Blocks
       │    │   ├── List View
       │    │   │   └── Order Cards
       │    │   └── Machine Status Summary
       │    │
       │    └── Metrics (/metrics)
       │        └── [Same as Owner with role-specific access]
       │
       └─── SUPERVISOR ROLE ──────────────────────────
            ├── Dashboard (/)
            │   ├── Current Time & Shift Progress
            │   ├── Critical Alert Banner
            │   ├── Active Orders Section
            │   │   └── Order Cards (with progress)
            │   ├── Pending Orders Section
            │   └── Recent Alerts
            │
            ├── Alerts (/alerts)
            │   ├── Stats Cards (4)
            │   ├── Filters (Severity, Status)
            │   ├── Alert Cards
            │   │   ├── Alert Details
            │   │   ├── Acknowledge Button
            │   │   └── Ask Why Button
            │   └── Ask AI Dialog (modal)
            │
            └── Today (/schedule)
                └── [Schedule view, read-only, today only]

┌─────────────────────────────────────────────────────────────┐
│          BOTTOM TABS (Tablet < 1200px, 4 items)             │
│     Dashboard  |  Primary  |  Secondary  |  Tertiary        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│          SIDEBAR (Desktop ≥ 1200px, full nav)               │
│  ┌─────────────────┐                                        │
│  │ Dashboard       │                                        │
│  │ [Role Items]    │                                        │
│  │ [Role Items]    │                                        │
│  │ [Role Items]    │                                        │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

## Navigation Patterns

### Owner Navigation
**Desktop Sidebar:**
1. Dashboard (Home)
2. Metrics (BarChart3)
3. Users (Users)
4. Settings (Settings)

**Tablet Bottom Tabs:**
1. Dashboard
2. Metrics
3. Users
4. Settings

### Planner Navigation
**Desktop Sidebar:**
1. Dashboard (Home)
2. Runs (ClipboardList)
3. Schedule (Calendar)
4. Metrics (BarChart3)

**Tablet Bottom Tabs:**
1. Dashboard
2. Runs
3. Schedule
4. Metrics

### Supervisor Navigation
**Desktop Sidebar:**
1. Dashboard (Home)
2. Alerts (Bell)
3. Today (Calendar)

**Tablet Bottom Tabs:**
1. Dashboard
2. Alerts
3. Today
4. [Reserved]

## Page Hierarchy & Depth

```
Level 0: Role Selection (implicit via demo switcher)
  │
Level 1: Dashboard (Landing page per role)
  │
Level 2: Primary Features
  ├── Runs List (Planner)
  ├── Metrics (Owner/Planner)
  ├── Users (Owner)
  ├── Alerts (Supervisor)
  └── Schedule (Planner/Supervisor)
  │
Level 3: Detail Views
  ├── Run Detail (from Runs List)
  ├── [Order Detail] (potential expansion)
  └── [Machine Detail] (potential expansion)
  │
Level 4: Modals/Dialogs
  ├── Ask AI Dialog
  ├── Compare Versions Dialog
  ├── Add User Dialog
  └── Alert Acknowledgment
```

**Maximum Depth:** 4 levels (with modals)  
**Recommended Path:** Dashboard → Feature → Detail → Action

## Information Flow

### Owner User Flow
```
Login → Dashboard → View KPIs → Drill into Metrics → Export Report
                  → View Activities → Check User Access → Manage Users
```

### Planner User Flow
```
Login → Dashboard → Check Alerts → Runs Page → Select Run
                                              → View AI Brief
                                              → Compare Versions
                                              → Schedule Timeline
                                              → Adjust if needed
                                              → Approve Run
```

### Supervisor User Flow
```
Login → Dashboard → Check Critical Alerts → Acknowledge
                  → View Active Orders → Update Progress
                  → Ask Why (if unclear) → Get AI Explanation
                  → Mark Complete → Next Order
```

## Content Hierarchy

### Primary Actions (Blue)
- Create Run
- Acknowledge Alert
- Mark Complete
- Add User
- Export Report

### Secondary Actions (Gray)
- Compare Versions
- Ask AI / Ask Why
- View Details
- Edit
- Filter/Search

### Tertiary Actions (Text Links)
- View All
- View More
- Expand/Collapse
- Navigate

## Data Visualization Hierarchy

### Level 1: Dashboard KPIs
- **Purpose:** At-a-glance status
- **Format:** Large numbers with trend indicators
- **Update:** Real-time

### Level 2: Summary Charts
- **Purpose:** Weekly/monthly trends
- **Format:** Line/bar charts
- **Update:** Daily

### Level 3: Detailed Metrics
- **Purpose:** Deep analysis
- **Format:** Multi-chart dashboards, tables
- **Update:** Hourly

### Level 4: Raw Data
- **Purpose:** Export/audit
- **Format:** Tables, CSV export
- **Update:** On-demand

## Component Reusability

### Shared Components
- KPI Card (used in Owner, Planner dashboards)
- Alert Card (used in Planner, Supervisor views)
- Order Card (used in multiple contexts)
- Machine Card (used in schedules, run details)
- Status Badge (used everywhere)
- Priority Badge (used for orders)
- Version Badge (used for runs)

### Role-Specific Components
- Owner: Trend charts, user tables
- Planner: Run creation, AI brief panels
- Supervisor: Shift progress, active task lists

## Modal/Dialog Patterns

### Full-Screen Modals (Mobile)
- Create Run
- Run Detail (on small screens)

### Centered Dialogs (All sizes)
- Ask AI
- Compare Versions
- Add User
- Confirm Actions

### Side Panels (Desktop only)
- Filters
- Settings
- Notifications

## Search & Filter Patterns

### Global Search
- **Location:** Not implemented (could be top bar)
- **Scope:** All content for role

### Contextual Filters
- **Runs Page:** Status, Date, Shift
- **Alerts Page:** Severity, Status
- **Users Page:** Role, Status
- **Metrics Page:** Time Range

### Filter Persistence
- Session-based (resets on navigation)
- URL parameters (for deep linking)

## Accessibility Considerations

### Navigation
- Keyboard accessible (Tab, Enter, Arrows)
- Screen reader friendly
- Focus indicators visible
- Skip navigation links

### Content
- Semantic HTML (h1, h2, nav, main)
- ARIA labels for icons
- Alt text for images
- Color + text for status

### Interactive Elements
- Minimum 48×48px touch targets (tablet)
- Hover states (desktop)
- Active states (touch)
- Disabled states (clear indication)

## Responsive Strategy

### Breakpoint: 1200px

**< 1200px (Tablet/Mobile)**
- Bottom tab navigation
- Single column layouts
- Stacked cards
- Simplified charts
- Touch-optimized spacing

**≥ 1200px (Desktop)**
- Left sidebar navigation
- Multi-column layouts
- Side-by-side comparisons
- Full-featured charts
- Dense information display

## State Management

### Global State
- Current user/role
- Authentication status
- Screen size (mobile/desktop)

### Page State
- Selected filters
- Active tab/view
- Sort order
- Pagination

### Component State
- Modal open/closed
- Accordion expanded
- Form values
- Loading states

## Error States

### No Data
- Empty state illustrations
- Clear messaging
- Action buttons (Create, Refresh)

### Loading
- Skeleton screens
- Progress indicators
- Timeout handling

### Errors
- Inline validation
- Toast notifications
- Error boundaries
- Retry actions

---

This IA supports intuitive navigation, clear information hierarchy, and role-appropriate access across tablet and desktop devices.
