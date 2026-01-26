import { useParams } from 'react-router';
import { ExplainChat } from './ExplainChat';

interface ExplainChatPageProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

export function ExplainChatPage({ userRole = 'planner' }: ExplainChatPageProps) {
  const { runId } = useParams<{ runId: string }>();
  
  return (
    <div className="h-full">
      <ExplainChat userRole={userRole} runId={runId} />
    </div>
  );
}
