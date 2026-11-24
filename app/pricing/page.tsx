import DesignPage from '@/components/DesignPage';
import BlackFridayBand from '@/components/BlackFridayBand';
import Pricing from '@/components/redesign/Pricing';

export default function Page() {
  return (
    <DesignPage
      path="/pricing"
      vertical="/"
      Design={Pricing}
      top={
        <>
          {/* The price calculator (from the WordPress page) gets its HubSpot form as jQuery. */}
          <script src="/wp-includes/js/jquery/jquery.min.js?ver=3.7.1" />
          <BlackFridayBand />
        </>
      }
    />
  );
}
