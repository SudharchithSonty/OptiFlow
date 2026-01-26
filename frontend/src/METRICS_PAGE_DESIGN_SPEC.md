# Metrics Page - Design Specification

## Overview
The Metrics Page is a comprehensive performance dashboard displaying KPIs, trends, and detailed analytics for manufacturing operations. It supports both light and dark modes with responsive design for tablet (1024×768) and desktop (1440×900) viewports.

---

## Layout Structure

### Container
- Max width: 1280px (max-w-7xl)
- Padding: 
  - Mobile: 16px
  - Tablet (sm): 24px
  - Desktop (lg): 32px
- Background: Inherits from app background (light/dark)

---

## Header Section

### Layout
- Display: flex
- Justify: space-between
- Align: center
- Margin bottom: 24px

### Left Side - Title & Subtitle
**Title:**
- Text: "Performance Metrics"
- Font: Default heading (h1)
- Color: 
  - Light: gray-900 (#111827)
  - Dark: gray-100 (#f3f4f6)
- Margin bottom: 8px

**Subtitle:**
- Dynamic text based on role:
  - Owner: "Comprehensive KPI overview and trends"
  - Planner/Supervisor: "Track production efficiency and quality metrics"
- Color:
  - Light: gray-600 (#4b5563)
  - Dark: gray-400 (#9ca3af)

### Right Side - Export Button
- Display: flex items-center gap-2
- Padding: 8px 16px
- Border: 1px solid
  - Light: gray-300 (#d1d5db)
  - Dark: gray-600 (#4b5563)
- Border radius: 8px
- Background hover:
  - Light: gray-50 (#f9fafb)
  - Dark: gray-700 (#374151)
- Icon: Download (lucide-react), 20×20
- Text: "Export Report" (hidden on small screens, shown on sm+)
- Transition: colors 150ms

---

## KPI Cards Grid

### Grid Layout
- Columns: 
  - Default: 2 columns
  - Desktop (lg): 3 columns
- Gap: 16px
- Margin bottom: 24px

### Individual KPI Card

**Container:**
- Background:
  - Light: white
  - Dark: gray-800 (#1f2937)
- Border: 1px solid
  - Light: gray-200 (#e5e7eb)
  - Dark: gray-700 (#374151)
- Border radius: 12px
- Padding: 
  - Default: 16px
  - Desktop (lg): 24px
- Shadow on hover: lg (light) / 2xl (dark)
- Transform on hover: translateY(-4px)
- Transition: all 300ms

**Card Header (flex layout):**
- Display: flex items-start justify-between
- Margin bottom: 12px

**Left Side - KPI Info:**
1. Label
   - Font size: 14px
   - Color:
     - Light: gray-600
     - Dark: gray-400
   - Margin bottom: 4px

2. Value
   - Font size: 
     - Default: 24px (text-2xl)
     - Desktop (lg): 30px (text-3xl)
   - Color:
     - Light: gray-900
     - Dark: gray-100
   - Font weight: bold
   
3. Unit (inline with value)
   - Font size:
     - Default: 16px (text-base)
     - Desktop (lg): 18px (text-lg)
   - Color:
     - Light: gray-500
     - Dark: gray-400
   - Margin left: 4px

**Right Side - Trend Icon:**
- Padding: 8px
- Border radius: 8px
- Background (conditional):
  - Good trend: 
    - Light: green-50 (#f0fdf4)
    - Dark: green-900/20
  - Bad trend:
    - Light: red-50 (#fef2f2)
    - Dark: red-900/20
  - Neutral: 
    - Light: gray-50
    - Dark: gray-700
- Icon: TrendingUp or TrendingDown (20×20)
- Icon color:
  - Good: green-600 (light) / green-400 (dark)
  - Bad: red-600 (light) / red-400 (dark)

**Change Indicator:**
- Display: flex items-center justify-between
- Font size: 14px
- Margin bottom: 12px

1. Change text
   - Format: "+2.3% vs last week" or "-5.2% vs last week"
   - Color (conditional):
     - Good change:
       - Light: green-600
       - Dark: green-400
     - Bad change:
       - Light: red-600
       - Dark: red-400
     - Neutral (< 1%):
       - Light: gray-600
       - Dark: gray-400
   - Font weight: medium

2. Target (if exists)
   - Font size: 12px
   - Color:
     - Light: gray-500
     - Dark: gray-400
   - Format: "Target: 85%"

**Progress Bar (if target exists):**
- Height: 8px
- Background:
  - Light: gray-100
  - Dark: gray-700
- Border radius: full (9999px)
- Fill:
  - Met target: gradient green-500 to green-600
  - Below target: gradient blue-500 to blue-600
- Fill width: (value/target) × 100% (max 100%)
- Transition: all 500ms

**KPI Data (6 cards):**
1. OEE: 84.5%, up 2.3%, target 85%
2. On-Time Delivery: 94.2%, up 1.8%, target 95%
3. Avg Setup Time: 48 min, down 5.2%, target 45 min
4. Utilization: 82.1%, stable 0.5%, target 80%
5. Downtime: 3.2 hrs/week, down 12.5%, target 3 hrs/week
6. Reject Rate: 1.8%, down 0.4%, target 2%

---

## Weekly Performance Trends Chart

### Container
- Background:
  - Light: white
  - Dark: gray-800
- Border: 1px solid
  - Light: gray-200
  - Dark: gray-700
- Border radius: 12px
- Padding: 
  - Default: 16px
  - Desktop (lg): 24px
- Margin bottom: 24px
- Shadow on hover: lg (light) / 2xl (dark)
- Transition: shadow 300ms

### Chart Header
- Display: flex items-center justify-between
- Margin bottom: 24px

**Left Side:**
1. Title
   - Text: "Weekly Performance Trends"
   - Color:
     - Light: gray-900
     - Dark: gray-100
   - Font weight: semibold
   - Margin bottom: 4px

2. Subtitle
   - Text: "Last 4 weeks comparison"
   - Font size: 14px
   - Color:
     - Light: gray-600
     - Dark: gray-400

**Right Side - Dropdown:**
- Padding: 6px 12px
- Border: 1px solid
  - Light: gray-300
  - Dark: gray-600
- Border radius: 8px
- Background:
  - Light: white
  - Dark: gray-700
- Text color:
  - Light: gray-900
  - Dark: gray-100
- Font size: 14px
- Options: Last 4 Weeks, Last 8 Weeks, Last Quarter, Last 6 Months

### Line Chart
- Width: 100% responsive
- Height: 350px
- Type: LineChart (recharts)

**Chart Configuration:**
1. CartesianGrid
   - Stroke dasharray: "3 3"
   - Dark mode specific styling from useDarkModeChartStyles

2. XAxis
   - Data key: "week"
   - Dark mode specific styling

3. YAxis
   - Dark mode specific styling

4. Lines (all with strokeWidth: 3, activeDot radius: 7):
   - OEE %: stroke #3b82f6 (blue-500), dot radius 4
   - OTD %: stroke #10b981 (green-500), dot radius 4
   - Utilization %: stroke #f59e0b (amber-500), dot radius 4

5. Gradient (linearGradient)
   - ID: colorOEE
   - Stop 5%: #3b82f6 opacity 0.3
   - Stop 95%: #3b82f6 opacity 0

**Data Points (4 weeks):**
- W1: OEE 81.2, OTD 92.5, Utilization 79.5
- W2: OEE 82.8, OTD 93.1, Utilization 80.2
- W3: OEE 83.5, OTD 93.8, Utilization 81.3
- W4: OEE 84.5, OTD 94.2, Utilization 82.1

---

## Two-Column Chart Section

### Grid Layout
- Columns: 1 (default), 2 (lg)
- Gap: 24px
- Margin bottom: 24px

### Setup Time by Machine (Left)

**Container:**
- Same styling as Weekly Trends container

**Header:**
- Text: "Setup Time by Machine"
- Color:
  - Light: gray-900
  - Dark: gray-100
- Font weight: semibold
- Margin bottom: 16px

**Bar Chart:**
- Width: 100% responsive
- Height: 300px
- Type: BarChart (recharts)

**Chart Configuration:**
1. Bars:
   - avgSetup: gradient (setupGradient), radius [8,8,0,0]
   - target: fill #9ca3af (gray-400), radius [8,8,0,0]

2. Gradients:
   - setupGradient: blue-500 (#3b82f6) to blue-600 (#2563eb)

3. YAxis label: "Minutes" (rotated -90°, position insideLeft)

**Data (5 machines):**
- M1: avg 45, target 40
- M2: avg 52, target 40
- M3: avg 38, target 40
- M4: avg 48, target 40
- M5: avg 42, target 40

### Downtime Analysis (Right)

**Container:**
- Same styling as Setup Time container

**Header:**
- Text: "Downtime Analysis - This Week"
- Styling same as Setup Time header

**Stacked Bar Chart:**
- Width: 100% responsive
- Height: 300px
- Type: BarChart with stacked bars (stackId: "a")

**Chart Configuration:**
1. Bars:
   - planned: gradient (plannedGradient), stackId "a", radius [0,0,0,0]
   - unplanned: gradient (unplannedGradient), stackId "a", radius [8,8,0,0]

2. Gradients:
   - plannedGradient: green-500 to green-600
   - unplannedGradient: red-500 (#ef4444) to red-600 (#dc2626)

3. YAxis label: "Hours" (rotated -90°)

**Data (5 days):**
- Mon: planned 0.5, unplanned 0.8
- Tue: planned 0.3, unplanned 1.2
- Wed: planned 0.6, unplanned 0.5
- Thu: planned 0.4, unplanned 0.3
- Fri: planned 0.7, unplanned 0.6

---

## Reject Analysis Section

### Container
- Same styling as Weekly Trends container
- Margin bottom: 24px

### Header
- Text: "Reject Analysis - Current Week"
- Styling consistent with other section headers

### Two-Column Layout (inside)
- Grid: 1 column (default), 2 columns (lg)
- Gap: 24px

### Left Side - Horizontal Bar Chart
- Width: 100% responsive
- Height: 250px
- Type: BarChart with layout="vertical"

**Chart Configuration:**
1. Bar
   - Data key: "count"
   - Fill: gradient (rejectGradient)
   - Radius: [0, 8, 8, 0]

2. Gradient:
   - rejectGradient: red-500 to red-600

3. XAxis: type "number"
4. YAxis: type "category", data key "category", width 120

**Data:**
- Dimensional: 12 units (42.9%)
- Surface Defects: 8 units (28.6%)
- Material Issues: 5 units (17.9%)
- Assembly Errors: 3 units (10.7%)

### Right Side - Detail Cards

**Summary Text:**
- Text: "Total Rejects: 28 units (1.8% of production)"
- Font size: 14px
- Color:
  - Light: gray-600
  - Dark: gray-400
- Font weight: medium
- Margin bottom: 12px (space-y-3 for cards)

**Individual Reject Cards:**
- Border: 1px solid
  - Light: gray-200
  - Dark: gray-700
- Border radius: 8px
- Padding: 12px
- Background:
  - Light: gray-50
  - Dark: gray-700/50
- Hover background:
  - Light: gray-100
  - Dark: gray-700
- Transition: colors

**Card Structure:**
1. Header row (flex justify-between, mb 8px)
   - Category name (14px, gray-900/gray-100, font-medium)
   - Unit count (14px, gray-600/gray-400)

2. Progress row (flex items-center, gap 8px)
   - Background bar:
     - Height: 8px
     - Background: gray-200 (light) / gray-600 (dark)
     - Border radius: full
   - Fill bar:
     - Height: 100%
     - Gradient: red-500 to red-600
     - Width: percentage value
     - Transition: all 500ms
   - Percentage label:
     - Font size: 12px
     - Color: gray-600/gray-400
     - Font weight: medium

---

## Machine Performance Summary Table

### Container
- Same styling as other major sections
- This is the last section (no margin bottom needed)

### Header
- Text: "Machine Performance Summary"
- Styling consistent with other section headers
- Margin bottom: 16px

### Table
- Width: 100%
- Overflow-x: auto (for small screens)

**Table Header:**
- Border bottom: 1px solid
  - Light: gray-200
  - Dark: gray-700
- Padding bottom: 12px

**Column Headers (all):**
- Font size: 14px
- Color:
  - Light: gray-600
  - Dark: gray-400
- Font weight: semibold
- Padding bottom: 12px

**Columns:**
1. Machine (text-left)
2. OEE (text-right)
3. Utilization (text-right)
4. Downtime (text-right)
5. Setup Time (text-right)
6. Rejects (text-right)

**Table Body Rows:**
- Border bottom: 1px solid
  - Light: gray-100
  - Dark: gray-700/50
- Hover background:
  - Light: gray-50
  - Dark: gray-700/30
- Transition: colors

**Cell Styling:**
- Padding vertical: 12px
- Font size: 14px
- Color:
  - Light: gray-900
  - Dark: gray-100
- Font weight: medium

**Data (5 machines):**
1. CNC Mill #1: OEE 87%, Util 91%, Down 0.5h, Setup 45m, Rejects 2
2. CNC Mill #2: OEE 89%, Util 93%, Down 0.3h, Setup 52m, Rejects 1
3. Lathe #1: OEE 82%, Util 85%, Down 1.2h, Setup 38m, Rejects 3
4. Lathe #2: OEE -, Util -, Down 8.0h, Setup -, Rejects 0 (maintenance)
5. Press #1: OEE 84%, Util 88%, Down 0.6h, Setup 42m, Rejects 2

---

## Responsive Behavior

### Breakpoints
- sm: 640px (tablet)
- lg: 1024px (desktop)

### Layout Changes
- KPI grid: 2 columns → 3 columns (lg)
- Font sizes increase slightly at lg breakpoint
- Export button text hidden on small screens
- Two-column chart sections stack on mobile
- Table becomes horizontally scrollable on small screens

---

## Color System

### Light Mode Base Colors
- Gray-50: #f9fafb
- Gray-100: #f3f4f6
- Gray-200: #e5e7eb
- Gray-300: #d1d5db
- Gray-400: #9ca3af
- Gray-500: #6b7280
- Gray-600: #4b5563
- Gray-900: #111827

### Dark Mode Base Colors
- Gray-700: #374151
- Gray-600: #4b5563
- Gray-400: #9ca3af
- Gray-100: #f3f4f6
- Gray-800: #1f2937

### Accent Colors
- Blue: #3b82f6 (charts, progress)
- Green: #10b981 (positive trends, OTD)
- Amber: #f59e0b (utilization)
- Red: #ef4444 (negative trends, rejects)

---

## Animations & Transitions

1. **Card Hover Effects:**
   - Transform: translateY(-4px)
   - Shadow: lg → 2xl
   - Duration: 300ms
   - Easing: default

2. **Progress Bars:**
   - Width animation
   - Duration: 500ms
   - Easing: default

3. **Color Transitions:**
   - Button hover states: 150ms
   - Table row hovers: colors transition
   - Card backgrounds: 300ms

4. **Chart Animations:**
   - Line charts: monotone curves with active dots
   - Active dot radius: 7px with 2px stroke
   - Hover interactions from recharts

---

## Dark Mode Implementation

The page uses the `useDarkModeChartStyles` hook for consistent chart styling across light/dark modes. All colors use Tailwind's dark: prefix for automatic theme switching.

### Chart-Specific Dark Mode
- Grid lines: adjusted opacity and color
- Axis text: lighter color in dark mode
- Tooltips: custom dark background and text colors
- Legend: adjusted text color

---

## Dependencies

- recharts: Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
- lucide-react: TrendingUp, TrendingDown, Download
- Custom hook: useDarkModeChartStyles
- Mock data: mockKPIs, weeklyTrendData from types/index.ts

---

## Notes for Design Recreation

1. **Glassmorphism Effects:** Cards have subtle shadow and hover effects
2. **Gradient Usage:** Progress bars and chart fills use linear gradients
3. **Conditional Colors:** KPI trends determine icon and text colors dynamically
4. **Data Visualization:** Mix of line charts, bar charts, and horizontal bars
5. **Typography Hierarchy:** Clear distinction between headers, values, and labels
6. **Spacing System:** Consistent 4px grid (mb-6 = 24px, gap-4 = 16px, etc.)
7. **Interactive Elements:** All cards, buttons, and table rows have hover states
8. **Accessibility:** Sufficient color contrast in both light and dark modes

---

This specification should provide all the information needed to recreate the Metrics page design in your design tool. The layout is production-ready with full dark mode support and responsive behavior.
