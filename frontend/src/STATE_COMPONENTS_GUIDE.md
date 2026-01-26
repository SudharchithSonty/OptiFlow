# State Components Guide

This guide documents the reusable state components for handling various application states: Permission Denied, Empty States, Loading Skeletons, and Error States.

## 📦 Components Overview

All state components are located in `/components/states/` and can be imported individually or through the index file:

```tsx
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
} from './components/states';
```

---

## 🚫 Permission Denied Component

**File:** `/components/states/PermissionDenied.tsx`

### Purpose
Displayed when a user attempts to access a resource they don't have permission for (403 Unauthorized).

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Access Denied"` | Main heading text |
| `message` | `string` | `"You do not have permission..."` | Description text |
| `requiredRole` | `string` | - | Role required to access the resource |
| `currentRole` | `string` | - | Current user's role |
| `onGoBack` | `() => void` | - | Callback for "Go Back" button |
| `onGoToDashboard` | `() => void` | - | Callback for "Go to Dashboard" button |
| `showContactAdmin` | `boolean` | `true` | Show contact admin message |

### Usage Examples

**Basic Usage:**
```tsx
<PermissionDenied
  requiredRole="Owner"
  currentRole="Supervisor"
  onGoBack={() => navigate(-1)}
  onGoToDashboard={() => navigate('/app')}
/>
```

**Custom Message:**
```tsx
<PermissionDenied
  title="Admin Access Required"
  message="This section is only available to administrators."
  onGoToDashboard={() => navigate('/app')}
/>
```

### When to Use
- User tries to access owner-only pages while logged in as planner/supervisor
- Feature is restricted to certain roles
- Administrative functions require elevated permissions

---

## 📭 Empty State Component

**File:** `/components/states/EmptyState.tsx`

### Purpose
Displayed when there's no data to show. Helps guide users with clear messaging and actionable next steps.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `LucideIcon` | `Inbox` | Icon component from lucide-react |
| `title` | `string` | **required** | Main heading |
| `description` | `string` | - | Supporting description text |
| `actionLabel` | `string` | - | Primary button text |
| `onAction` | `() => void` | - | Primary button callback |
| `secondaryActionLabel` | `string` | - | Secondary button text |
| `onSecondaryAction` | `() => void` | - | Secondary button callback |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `iconColorClass` | `string` | - | Custom Tailwind color class for icon |

### Variants

**EmptyState** - Basic component without border/background
**EmptyStateCard** - Wrapped with border and background (same props + `withCard`)

### Usage Examples

**No Data (Basic):**
```tsx
<EmptyState
  icon={Inbox}
  title="No items found"
  description="There are no items to display at the moment."
/>
```

**With Primary Action:**
```tsx
<EmptyState
  icon={FileX}
  title="No runs created yet"
  description="Get started by creating your first production run."
  actionLabel="Create Run"
  onAction={() => navigate('/app/runs/create')}
/>
```

**With Both Actions:**
```tsx
<EmptyState
  icon={Database}
  title="No data uploaded"
  description="Upload your production data to start scheduling runs."
  actionLabel="Upload Data"
  onAction={() => setShowUploadModal(true)}
  secondaryActionLabel="Learn More"
  onSecondaryAction={() => navigate('/help')}
/>
```

**Custom Icon Color:**
```tsx
<EmptyState
  icon={Bell}
  title="No alerts"
  description="All systems running smoothly."
  iconColorClass="text-green-500"
  size="sm"
/>
```

**With Card Wrapper:**
```tsx
<EmptyStateCard
  icon={Users}
  title="No team members"
  description="Add team members to collaborate."
  actionLabel="Invite"
  onAction={() => setShowInviteModal(true)}
/>
```

### When to Use
- No runs in list
- No events for a specific run
- No alerts or notifications
- Empty search results
- First-time user experience (no data uploaded)
- Filtered view returns no results

---

## ⏳ Loading Skeleton Components

**File:** `/components/states/LoadingSkeleton.tsx`

### Purpose
Shown while data is loading. Improves perceived performance by showing content structure before data arrives.

---

### 1. ListSkeleton

For loading list views (runs, events, alerts, orders).

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `5` | Number of skeleton items |
| `showAvatar` | `boolean` | `false` | Show avatar/icon placeholder |
| `showBadge` | `boolean` | `false` | Show badge/status placeholder |
| `lines` | `number` | `2` | Number of text lines per item |

**Usage:**
```tsx
<ListSkeleton count={3} showAvatar={true} showBadge={true} lines={2} />
```

---

### 2. DetailSkeleton

For loading detail pages (run detail, order detail, machine detail).

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showHeader` | `boolean` | `true` | Show header section |
| `sections` | `number` | `3` | Number of content sections |
| `showActions` | `boolean` | `true` | Show action buttons |

**Usage:**
```tsx
<DetailSkeleton showHeader={true} sections={2} showActions={true} />
```

---

### 3. TableSkeleton

For loading data tables (schedule grid, metrics tables).

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `number` | `5` | Number of columns |
| `rows` | `number` | `8` | Number of rows |
| `showHeader` | `boolean` | `true` | Show table header |

**Usage:**
```tsx
<TableSkeleton columns={5} rows={6} showHeader={true} />
```

---

### 4. CardGridSkeleton

For loading card-based layouts.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `6` | Number of cards |
| `columns` | `2 \| 3 \| 4` | `3` | Grid columns (responsive) |

**Usage:**
```tsx
<CardGridSkeleton count={6} columns={3} />
```

---

### 5. MetricsSkeleton

For loading KPI/metrics dashboard cards.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `4` | Number of metric cards |

**Usage:**
```tsx
<MetricsSkeleton count={4} />
```

---

### When to Use Loading Skeletons

Use loading skeletons when:
- Fetching data from API
- Loading runs list
- Loading run details
- Loading schedule data
- Loading metrics/KPIs
- Loading tables with many rows
- Any async operation that takes >500ms

**Pattern:**
```tsx
const [isLoading, setIsLoading] = useState(true);
const [data, setData] = useState([]);

useEffect(() => {
  fetchData().then(result => {
    setData(result);
    setIsLoading(false);
  });
}, []);

return (
  <div>
    {isLoading ? (
      <ListSkeleton count={5} showAvatar={true} />
    ) : data.length === 0 ? (
      <EmptyState title="No data" />
    ) : (
      <DataList items={data} />
    )}
  </div>
);
```

---

## ⚠️ Error State Component

**File:** `/components/states/ErrorState.tsx`

### Purpose
Displayed when API calls fail, network errors occur, or unexpected errors happen. Provides retry functionality and contact information.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Auto (based on type) | Error title |
| `message` | `string` | Auto (based on type) | Error description |
| `errorCode` | `string \| number` | - | Error code (e.g., 500, API_001) |
| `technicalDetails` | `string` | - | Technical error info (collapsible) |
| `showRetry` | `boolean` | `true` | Show retry button |
| `onRetry` | `() => void` | - | Retry callback |
| `showContactAdmin` | `boolean` | `true` | Show contact admin section |
| `adminEmail` | `string` | `"admin@yourcompany.com"` | Admin contact email |
| `showGoToDashboard` | `boolean` | `false` | Show dashboard button |
| `onGoToDashboard` | `() => void` | - | Dashboard callback |
| `isRetrying` | `boolean` | `false` | Loading state for retry |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `type` | `'error' \| 'warning' \| 'network'` | `'error'` | Error type/severity |

### Variants

**ErrorState** - Basic component without border/background
**ErrorStateCard** - Wrapped with border and background (same props + `withCard`)

### Usage Examples

**Basic Error:**
```tsx
<ErrorState
  showRetry={true}
  onRetry={handleRetry}
  isRetrying={isRetrying}
/>
```

**Network Error:**
```tsx
<ErrorState
  type="network"
  showRetry={true}
  onRetry={handleRetry}
/>
```

**API Error with Code:**
```tsx
<ErrorState
  title="Server Error"
  message="The server encountered an internal error."
  errorCode="500"
  showRetry={true}
  onRetry={handleRetry}
/>
```

**With Technical Details:**
```tsx
<ErrorState
  title="Database Connection Failed"
  errorCode="DB_001"
  technicalDetails={`
    Connection timeout after 30s
    Host: db.example.com:5432
    Database: production_db
  `}
  showRetry={true}
  onRetry={handleRetry}
/>
```

**Warning Type:**
```tsx
<ErrorState
  type="warning"
  title="Partial Data Available"
  message="Some data could not be loaded."
  showRetry={true}
  onRetry={handleRetry}
  showGoToDashboard={true}
  onGoToDashboard={() => navigate('/app')}
/>
```

**Service Unavailable:**
```tsx
<ErrorState
  title="Service Unavailable"
  message="This service is temporarily unavailable."
  errorCode="503"
  showContactAdmin={true}
  adminEmail="support@manufacturing.com"
  showRetry={false}
/>
```

**With Card Wrapper:**
```tsx
<ErrorStateCard
  title="Failed to Load Data"
  showRetry={true}
  onRetry={handleRetry}
/>
```

### Error Types

**`error`** (default)
- Color: Red
- Use for: API failures, server errors, unexpected errors
- Default message: "Error Loading Data"

**`warning`**
- Color: Yellow
- Use for: Partial failures, degraded functionality
- Default message: "Something Went Wrong"

**`network`**
- Color: Orange
- Use for: Network connectivity issues, timeouts
- Default message: "Connection Error"

### When to Use

- API call fails (4xx, 5xx errors)
- Network timeout
- Server unavailable
- Database connection error
- Invalid response format
- Permission errors (after authentication)
- Rate limiting
- Service maintenance

**Pattern:**
```tsx
const [error, setError] = useState(null);
const [isRetrying, setIsRetrying] = useState(false);

const handleRetry = async () => {
  setIsRetrying(true);
  setError(null);
  try {
    await fetchData();
  } catch (err) {
    setError(err);
  }
  setIsRetrying(false);
};

if (error) {
  return (
    <ErrorState
      type="network"
      errorCode={error.code}
      showRetry={true}
      onRetry={handleRetry}
      isRetrying={isRetrying}
    />
  );
}
```

---

## 🎨 Styling & Dark Mode

All components support dark mode automatically through the `useDarkMode()` hook. They will:
- Adapt colors based on theme
- Use glassmorphism effects in dark mode
- Maintain accessibility contrast ratios
- Animate smoothly when toggling themes

---

## 📍 Demo Page

**URL:** `/app/demo/states`

Visit the demo page to see all state components in action with various configurations. The demo includes:

1. **Permission Denied Tab** - Full page examples, custom messages
2. **Empty States Tab** - All size variants, icon colors, action combinations
3. **Loading Skeletons Tab** - All skeleton types with realistic data structures
4. **Error States Tab** - All error types, with/without retry, technical details

**Access the demo:**
```
Navigate to: http://localhost:5173/app/demo/states
```

---

## ✅ Best Practices

### 1. **Loading States**
- Always show skeleton while loading
- Match skeleton structure to actual content
- Use appropriate skeleton variant (list/detail/table)

### 2. **Empty States**
- Provide clear, helpful messaging
- Offer actionable next steps when possible
- Use appropriate icons (be consistent)
- Consider user's journey and intent

### 3. **Error States**
- Always provide retry option when applicable
- Use appropriate error type (error/warning/network)
- Include technical details for developers (collapsible)
- Provide contact information for support
- Log errors for debugging

### 4. **Permission Denied**
- Clearly state required permission/role
- Provide navigation options (back/dashboard)
- Include contact admin information

### 5. **Consistency**
- Use the same empty state pattern across similar views
- Keep messaging tone consistent
- Use standard icons for common scenarios

---

## 🔄 State Flow Pattern

Recommended pattern for handling all states:

```tsx
function DataPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [hasPermission, setHasPermission] = useState(true);

  // Check permission first
  if (!hasPermission) {
    return (
      <PermissionDenied
        requiredRole="Owner"
        currentRole="Supervisor"
        onGoToDashboard={() => navigate('/app')}
      />
    );
  }

  // Show loading
  if (isLoading) {
    return <ListSkeleton count={5} showAvatar={true} />;
  }

  // Show error
  if (error) {
    return (
      <ErrorState
        type="network"
        showRetry={true}
        onRetry={handleRetry}
      />
    );
  }

  // Show empty state
  if (data.length === 0) {
    return (
      <EmptyState
        icon={FileX}
        title="No runs found"
        description="Create your first run to get started."
        actionLabel="Create Run"
        onAction={() => navigate('/app/runs/create')}
      />
    );
  }

  // Show data
  return <DataList items={data} />;
}
```

---

## 📦 Component Summary

| Component | Use Case | Key Features |
|-----------|----------|--------------|
| **PermissionDenied** | 403 errors, role restrictions | Shows required vs current role, navigation options |
| **EmptyState** | No data scenarios | Customizable icon, title, actions, sizes |
| **ListSkeleton** | Loading lists | Configurable count, avatar, badge |
| **DetailSkeleton** | Loading detail pages | Header, sections, actions |
| **TableSkeleton** | Loading tables | Configurable columns/rows |
| **CardGridSkeleton** | Loading card grids | Responsive grid layout |
| **MetricsSkeleton** | Loading KPIs | Dashboard metrics layout |
| **ErrorState** | API/network failures | Retry, error codes, technical details |

---

## 🚀 Quick Start

1. **Import the component:**
   ```tsx
   import { EmptyState } from './components/states';
   ```

2. **Use in your component:**
   ```tsx
   {data.length === 0 && (
     <EmptyState
       title="No data"
       description="Get started by adding items."
       actionLabel="Add Item"
       onAction={handleAdd}
     />
   )}
   ```

3. **Test in demo page:**
   Visit `/app/demo/states` to see all variations

---

## 📝 Notes

- All components are fully responsive
- Dark mode support is automatic
- Icons use lucide-react library
- Components follow existing design system
- TypeScript types included for all props
- Accessible keyboard navigation
- Screen reader friendly

---

For questions or improvements, refer to the demo page or component source code.
