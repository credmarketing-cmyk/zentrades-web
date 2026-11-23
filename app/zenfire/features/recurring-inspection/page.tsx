import DesignPage from '@/components/DesignPage';
import ZfRecurringInspections from '@/components/redesign/ZfRecurringInspections';

export default function Page() {
  return <DesignPage path="/zenfire/features/recurring-inspection" vertical="/zenfire" Design={ZfRecurringInspections} />;
}
