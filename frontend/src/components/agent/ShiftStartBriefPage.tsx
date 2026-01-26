import { useParams } from 'react-router';
import { ShiftStartBrief } from './ShiftStartBrief';

interface ShiftStartBriefPageProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

export function ShiftStartBriefPage({ userRole = 'planner' }: ShiftStartBriefPageProps) {
  const { runId } = useParams<{ runId: string }>();
  
  return (
    <div className="h-full overflow-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <ShiftStartBrief userRole={userRole} />
      </div>
    </div>
  );
}
