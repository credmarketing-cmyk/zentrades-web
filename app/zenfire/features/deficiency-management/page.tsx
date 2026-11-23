import DesignPage from '@/components/DesignPage';
import ZfDeficiencyManagement from '@/components/redesign/ZfDeficiencyManagement';

export default function Page() {
  return <DesignPage path="/zenfire/features/deficiency-management" vertical="/zenfire" Design={ZfDeficiencyManagement} />;
}
