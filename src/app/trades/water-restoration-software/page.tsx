import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { TrustMarquee } from "@/components/site/TrustMarquee";
import { ButtonLink } from "@/components/ui/Button";
import { FeatureBrowser } from "@/components/vertical/FeatureBrowser";
import { Hero, HeroPhoto } from "@/components/vertical/Hero";
import { ProductTabs } from "@/components/vertical/ProductTabs";
import { BenefitGrid, FaqSection } from "@/components/vertical/Sections";
import styles from "@/components/vertical/vertical.module.css";
import { benefits, faqs, features, tabs } from "@/content/verticals/water-restoration";
import { brands } from "@/lib/brands";
import { BOOK_DEMO, CONTACT } from "@/lib/links";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const PATH = "/trades/water-restoration-software";

export const metadata = pageMetadata({
  title: "Water Damage Restoration Software | ZenTrades",
  absoluteTitle: true,
  description:
    "Water damage restoration software: dispatch crews fast, document jobs on site, invoice and get paid, and manage every customer and claim in one platform.",
  path: PATH,
});

const brand = brands.zentrades;

export default function WaterRestorationPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Trades", path: "/trades" },
            { name: "Water Damage Restoration Software", path: PATH },
          ]),
          faqSchema(faqs),
        ]}
      />
      <Header brand={brand} />
      <main>
        <Hero
          badge={{ tag: "Restoration", text: "Water damage software by ZenTrades" }}
          title={
            <>
              Water damage restoration software: <span className="accent">voted #1 by contractors like you</span>
            </>
          }
          intro="For better customer and project management. Run every water mitigation job, from first call to final invoice, in one platform."
          actions={
            <>
              <ButtonLink href={BOOK_DEMO} arrow>
                Request demo
              </ButtonLink>
              <ButtonLink href="#features" variant="outline">
                Explore features
              </ButtonLink>
            </>
          }
          media={<HeroPhoto src="/images/hero-water.jpg" alt="Water damage restoration crew drying a flooded room" aspect="5 / 4" position="30% center" />}
        />

        <TrustMarquee title="Trusted by restoration teams across the country" />

        <section id="features" className={`section ${styles.pt128}`}>
          <div className="container">
            <ProductTabs
              layout="inline"
              tabs={tabs}
              heading={
                <h2 className={`${styles.h2} ${styles.h2Lg}`}>
                  Elevate your operations with these <span className="accent">powerful</span> tools
                </h2>
              }
            />
          </div>
        </section>

        <section className={`section ${styles.py128}`}>
          <div className="container">
            <div className={styles.head}>
              <h2 className={`${styles.h2} ${styles.h2Lg}`} style={{ maxWidth: 700 }}>
                Key benefits. <span className={styles.muted}>Why ZenTrades is the choice for restoration professionals.</span>
              </h2>
            </div>
            <BenefitGrid items={benefits} />
          </div>
        </section>

        <section className={`section ${styles.dark} ${styles.py128}`}>
          <div className={styles.glow} style={{ left: -240, top: -240, width: 900, height: 700 }} />
          <div className={`container ${styles.rel}`}>
            <div className={styles.head} style={{ marginBottom: 56 }}>
              <h2 className={`${styles.h2} ${styles.h2Lg}`} style={{ maxWidth: 720 }}>
                Why ZenTrades fits. Features that make <span className="accent">a difference.</span>
              </h2>
              <p className={styles.lead} style={{ maxWidth: 340 }}>
                Eight tools built around how restoration crews actually work, from the first call to the final invoice.
              </p>
            </div>
            <FeatureBrowser items={features} theme="dark" ctaHref={BOOK_DEMO} />
          </div>
        </section>

        <FaqSection
          title="Frequently asked questions"
          intro="Everything restoration teams ask before switching to ZenTrades. Can’t find the answer you’re looking for? Our team is one click away."
          actions={
            <>
              <ButtonLink href={BOOK_DEMO} arrow>
                Book a demo
              </ButtonLink>
              <ButtonLink href={CONTACT} variant="outline">
                Contact us
              </ButtonLink>
            </>
          }
          faqs={faqs}
        />
      </main>
      <Footer brand={brand} />
    </>
  );
}
