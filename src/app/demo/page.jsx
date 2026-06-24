import { DEMO_EQUIPMENT, DEMO_SECTIONS } from '../../lib/demoData';
import Dashboard from '../../components/Dashboard';

export default function DemoPage() {
  return (
    <Dashboard 
      demo 
      initialData={DEMO_EQUIPMENT} 
      initialSections={DEMO_SECTIONS} 
    />
  );
}
