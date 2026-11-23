import DesignPage from '@/components/DesignPage';
import ZfInspectionReports from '@/components/redesign/ZfInspectionReports';

export default function Page() {
  return <DesignPage path="/zenfire/features/inspection-reports" vertical="/zenfire" Design={ZfInspectionReports} />;
}
