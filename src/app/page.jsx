import { getSetupData } from '@/lib/actions';
import Dashboard from '@/components/ui/Dashboard';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const setup = await getSetupData();
  const preview = process.env.MISETUP_MODE !== 'database';

  return (
    <Dashboard
      preview={preview}
      initialData={setup.items}
      initialSections={setup.sections}
      initialProfile={setup.profile}
      initialEvents={setup.events}
      initialEditorMode={preview}
    />
  );
}
