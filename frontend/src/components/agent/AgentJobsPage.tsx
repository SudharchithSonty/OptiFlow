import { AgentJobsList } from './AgentJobsList';

interface AgentJobsPageProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

export function AgentJobsPage({ userRole = 'planner' }: AgentJobsPageProps) {
  return (
    <div className="h-full overflow-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <AgentJobsList userRole={userRole} />
      </div>
    </div>
  );
}
