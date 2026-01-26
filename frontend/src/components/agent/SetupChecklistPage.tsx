import { SetupChecklist } from './SetupChecklist';

interface SetupChecklistPageProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

export function SetupChecklistPage({ userRole = 'supervisor' }: SetupChecklistPageProps) {
  return (
    <div className="h-full overflow-auto px-4 sm:px-6 lg:px-8 py-6">
      <SetupChecklist userRole={userRole} />
    </div>
  );
}
