import { getEquipment, getSections } from '../lib/actions';
import Dashboard from '../components/Dashboard';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [data, sections] = await Promise.all([
    getEquipment(),
    getSections()
  ]);
  
  return <Dashboard initialData={data} initialSections={sections} />;
}
