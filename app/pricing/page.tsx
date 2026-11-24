import DesignPage from '@/components/DesignPage';
import BlackFridayBand from '@/components/BlackFridayBand';
import Pricing from '@/components/redesign/Pricing';

export default function Page() {
  return <DesignPage path="/pricing" vertical="/" Design={Pricing} top={<BlackFridayBand />} />;
}
