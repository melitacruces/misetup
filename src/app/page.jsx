import { getSetupData } from '@/lib/actions';
import Dashboard from '@/components/ui/Dashboard';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const setup = await getSetupData();

  return (
    <Dashboard
      preview={setup.mode === 'preview'}
      persistent={setup.mode === 'database'}
      initialData={setup.items}
      initialSections={setup.sections}
      initialProfile={setup.profile}
      initialEvents={setup.events}
    />
  );
}
