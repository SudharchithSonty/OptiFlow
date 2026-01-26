# Digital Operations Assistant - Technical Architecture

## Application Structure

### Core Files

- **`/App.tsx`**: Main application component with routing, role-based navigation, and responsive layout
- **`/types/index.ts`**: TypeScript interfaces and mock data for the entire application
- **`/styles/globals.css`**: Tailwind CSS configuration with custom design tokens

### Components

#### Dashboard Components (Role-Specific)
- **`/components/OwnerDashboard.tsx`**: Owner view with KPIs, weekly trends, production summary, and activity log
- **`/components/PlannerDashboard.tsx`**: Planner view with runs management, quick stats, and alerts
- **`/components/SupervisorDashboard.tsx`**: Supervisor view with shift plan, active orders, and task management

#### Page Components
- **`/components/RunsPage.tsx`**: List of all production runs with version grouping and filtering
- **`/components/RunDetailPage.tsx`**: Detailed run view with AI brief, orders, machines, and comparison tools
- **`/components/SchedulePage.tsx`**: Schedule visualization with timeline and list views, shift selection
- **`/components/AlertsPage.tsx`**: Alert management with acknowledgment and AI explanations
- **`/components/MetricsPage.tsx`**: Comprehensive metrics dashboard with charts and trends
- **`/components/UsersPage.tsx`**: User management for owner role

## Data Model

### Core Entities

#### Run
```typescript
{
  id: string;                    // Format: "RUN-YYYYMMDD-{A|B|C}[-v{N}]"
  shiftDate: string;             // ISO date
  shift: 'A' | 'B' | 'C';
  status: 'created' | 'generating' | 'generated' | 'scheduling' | 'scheduled' | 'completed' | 'failed';
  version: number;               // 1, 2, 3...
  createdAt: string;             // ISO datetime
  createdBy: string;
  orders: Order[];
  machines: MachineAllocation[];
  aiBrief?: AIBrief;
  metrics?: RunMetrics;
}
```

#### Order
```typescript
{
  id: string;
  orderNumber: string;           // Format: "PO-YYYY-NNN"
  customer: string;
  product: string;
  quantity: number;
  priority: 'rush' | 'high' | 'normal' | 'low';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  setupTime: number;             // minutes
  runTime: number;               // minutes
  assignedMachine?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
}
```

#### AIBrief
```typescript
{
  id: string;
  generatedAt: string;
  summary: string;
  keyInsights: string[];
  risks: Risk[];                 // {type, severity, description, mitigation}
  recommendations: string[];
  confidence: number;            // 0-1
}
```

#### Alert
```typescript
{
  id: string;
  type: 'breakdown' | 'rush-order' | 'delay' | 'quality' | 'resource';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  machine?: string;
  order?: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}
```

## Navigation Flow

### Owner Journey
1. Dashboard → View KPIs and trends
2. Metrics → Detailed performance analysis
3. Users → Manage team members
4. Settings → System configuration

### Planner Journey
1. Dashboard → Overview of production status
2. Runs → Create/manage production runs
3. Run Detail → View AI brief, compare versions
4. Schedule → Visualize timeline, adjust allocations
5. Metrics → Track performance

### Supervisor Journey
1. Dashboard → Today's shift plan
2. Alerts → Acknowledge critical events
3. Schedule/Today → View detailed order information
4. Ask Why → Get AI explanations

## Responsive Design

### Breakpoint: 1200px

**< 1200px (Tablet)**
- Bottom tab navigation (4 items max)
- Touch-optimized buttons (min 48×48px)
- Simplified charts
- Stacked layouts

**≥ 1200px (Desktop)**
- Left sidebar navigation
- Full-width charts
- Grid layouts
- Additional columns in tables

## Mock Data Scenarios

### Scenario 1: Normal Operations (Shift A, Jan 2)
- 2 orders scheduled
- 2 machines allocated
- 82% utilization
- OEE: 84%
- Version 2 (reschedule after adding rush order)

### Scenario 2: Rush Order (Shift B, Jan 2)
- Single rush order
- High utilization (91%)
- AI identifies delay risk
- Detailed mitigation plan

### Scenario 3: Machine Breakdown (Shift A, Jan 3)
- Critical alert active
- Lathe #2 (M4) down
- Requires rescheduling
- Run in "generating" status

## AI Agent Capabilities

### Brief Generation
1. Analyzes run configuration
2. Calculates utilization and timing
3. Identifies risks (capacity, delay, quality, resource)
4. Provides mitigation strategies
5. Recommends optimizations
6. Assigns confidence score

### Ask Why / Explain
- Scheduling decisions rationale
- Machine selection reasoning
- Risk assessment details
- Priority balancing logic
- Resource allocation trade-offs

## Key Metrics Calculations

### OEE (Overall Equipment Effectiveness)
```
OEE = Availability × Performance × Quality
```

### Utilization
```
Utilization = (Actual Production Time / Available Time) × 100
```

### On-Time Delivery (OTD)
```
OTD = (Orders Delivered On Time / Total Orders) × 100
```

### Setup Time
```
Avg Setup Time = Total Setup Time / Number of Orders
```

## Color Coding

- **Blue (#3b82f6)**: Primary actions, normal priority, system states
- **Green (#10b981)**: Success, operational, on-track
- **Red (#ef4444)**: Critical, rush priority, errors
- **Orange (#f59e0b)**: High priority, warnings, medium severity
- **Yellow (#fbbf24)**: Caution, low severity
- **Purple (#8b5cf6)**: AI features, insights
- **Gray**: Neutral, inactive, backgrounds

## Version Comparison Logic

When comparing run versions:
1. Show metrics delta (v2 - v1)
2. Highlight order changes (added/removed/modified)
3. Compare machine utilization
4. Show AI brief differences
5. Calculate impact on KPIs

## Event-Driven Rescheduling

### Triggers for New Versions
1. **Rush Order**: Add high-priority order, reoptimize
2. **Machine Breakdown**: Reallocate orders to available machines
3. **Delay**: Adjust timeline, notify stakeholders
4. **Quality Issue**: Add buffer time, change sequence
5. **Manual Edit**: Planner modifies schedule

### Auto-Generation Process
1. Receive trigger event
2. Status → "generating"
3. AI analyzes constraints
4. Generate schedule
5. Calculate metrics
6. Create AI brief
7. Status → "scheduled"
8. Increment version number

## Best Practices

### For Owners
- Review weekly trends regularly
- Monitor OEE and OTD targets
- Track reject patterns
- Validate user access levels

### For Planners
- Create runs 1 day in advance
- Review AI briefs before approval
- Compare versions when rescheduling
- Monitor setup time trends
- Address high-severity risks

### For Supervisors
- Check dashboard at shift start
- Acknowledge alerts promptly
- Use "Ask Why" for unclear decisions
- Update order status in real-time
- Report quality issues immediately

---

This architecture supports a complete production scheduling workflow with role-based access, AI-powered insights, and responsive design for tablet and desktop usage.
