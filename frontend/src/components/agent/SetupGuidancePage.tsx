import { SetupGuidancePicker } from './SetupGuidancePicker';

interface SetupGuidancePageProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

export function SetupGuidancePage({ userRole = 'supervisor' }: SetupGuidancePageProps) {
  return (
    <div className="h-full overflow-auto px-4 sm:px-6 lg:px-8 py-6">
      <SetupGuidancePicker userRole={userRole} />
    </div>
  );
}
