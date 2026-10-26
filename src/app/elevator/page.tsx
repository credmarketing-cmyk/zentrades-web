import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { TrustMarquee } from "@/components/site/TrustMarquee";
import { ButtonLink } from "@/components/ui/Button";
import { FeatureBrowser } from "@/components/vertical/FeatureBrowser";
import { Hero, HeroPhoto } from "@/components/vertical/Hero";
import { ProductTabs } from "@/components/vertical/ProductTabs";
import { BenefitGrid } from "@/components/vertical/Sections";
import styles from "@/components/vertical/vertical.module.css";
import { benefits, features, tabs } from "@/content/verticals/elevator";
import { brands } from "@/lib/brands";
import { BOOK_DEMO } from "@/lib/links";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const PATH = "/elevator";

export const metadata = pageMetadata({
  title: "Elevator Maintenance Software | ZenTrades",
  absoluteTitle: true,
  description:
    "Elevator maintenance and service software by ZenTrades: technician scheduling, equipment and warranty records, on-site invoicing and a mobile app for your crew.",
  path: PATH,
});

const brand = brands.zentrades;

export default function ElevatorPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Elevator", path: PATH }])} />
      <Header brand={brand} />
      <main>
        <Hero
          badge={{ tag: "Elevator", text: "Elevator service software by ZenTrades" }}
          title={
            <>
              Elevator maintenance services, <span className="accent">made simpler</span>
            </>
          }
          intro="An integrated, one-stop solution tailored for every step of your workflow in the elevator industry."
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
          media={<HeroPhoto src="/images/hero-elevator.jpg" alt="Elevator technician servicing an elevator" aspect="4 / 4.4" position="center 35%" />}
        />

        <TrustMarquee title="Trusted by elevator service teams across the country" />

        <section id="features" className={`section ${styles.pt128}`}>
          <div className="container">
            <ProductTabs
              layout="inline"
              tabs={tabs}
              heading={
                <h2 className={`${styles.h2} ${styles.h2Lg}`}>
                  Purpose-built tools to optimize <span className="accent">elevator service</span> operations
                </h2>
              }
            />
          </div>
        </section>

        <section className={`section ${styles.py128}`}>
          <div className="container">
            <div className={styles.head}>
              <h2 className={`${styles.h2} ${styles.h2Lg}`}>
                Key benefits.
                <br />
                <span className={styles.muted}>Smarter solutions to elevate your business.</span>
              </h2>
            </div>
            <BenefitGrid items={benefits} />
          </div>
        </section>

        <section className={`section ${styles.py128}`} style={{ borderTop: "1px solid var(--line-3)", position: "relative", overflow: "hidden" }}>
          <div className={styles.glow} style={{ left: -240, top: -240, width: 900, height: 700, background: "radial-gradient(closest-side,rgba(238,85,102,.08),rgba(238,85,102,0))" }} />
          <div className={`container ${styles.rel}`}>
            <div className={styles.head} style={{ marginBottom: 56 }}>
              <h2 className={`${styles.h2} ${styles.h2Lg}`} style={{ maxWidth: 720 }}>
                Why ZenTrades fits. Features that make a difference for <span className="accent">elevator service providers.</span>
              </h2>
              <p className={styles.lead} style={{ maxWidth: 340 }}>
                Everything elevator technicians and office teams need, from the first inspection to the final service
                report.
              </p>
            </div>
            <FeatureBrowser items={features} theme="light" ctaHref={BOOK_DEMO} />
          </div>
        </section>
      </main>
      <Footer brand={brand} />
    </>
  );
}
