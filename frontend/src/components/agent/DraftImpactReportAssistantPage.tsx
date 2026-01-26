import { useParams } from 'react-router';
import { DraftImpactReport } from './DraftImpactReport';

interface DraftImpactReportAssistantPageProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

export function DraftImpactReportAssistantPage({ userRole = 'planner' }: DraftImpactReportAssistantPageProps) {
  const { runId } = useParams<{ runId: string }>();
  
  return (
    <div className="h-full overflow-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <DraftImpactReport userRole={userRole} runId={runId} />
      </div>
    </div>
  );
}
