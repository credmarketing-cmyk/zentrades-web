import Image from "next/image";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { TrustMarquee } from "@/components/site/TrustMarquee";
import { ButtonLink } from "@/components/ui/Button";
import { MonthlyChart } from "@/components/vertical/Charts";
import { FeatureBrowser } from "@/components/vertical/FeatureBrowser";
import { Hero } from "@/components/vertical/Hero";
import { HotspotHero } from "@/components/vertical/HotspotHero";
import { ProductTabs } from "@/components/vertical/ProductTabs";
import { BenefitGrid, FaqSection } from "@/components/vertical/Sections";
import styles from "@/components/vertical/vertical.module.css";
import {
  ZEL_BOOK_DEMO,
  ZEL_CONTACT,
  benefits,
  faqs,
  features,
  hotspots,
  revenueValues,
  tabs,
  testimonial,
} from "@/content/verticals/zenelectrical";
import { brands } from "@/lib/brands";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const PATH = "/zenelectrical";

export const metadata = pageMetadata({
  title: "Electrical Contractor Software | ZenElectrical",
  absoluteTitle: true,
  description:
    "Electrical contractor software for field and office teams: project management, estimating, job costing, invoicing, inventory and QuickBooks sync.",
  path: PATH,
});

const brand = brands.zenelectrical;

export default function ZenElectricalPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "ZenElectrical", path: PATH }]), faqSchema(faqs)]} />
      <Header brand={brand} />
      <main>
        <Hero
          badge={{ tag: "Electrical", text: "The best electrical contractor software for professionals" }}
          title={
            <>
              Smart electrical contracting solutions <span className="accent">for businesses</span>
            </>
          }
          intro="Streamline and automate the workflows of your electrical contracting business. Enable swift, data-driven decisions and real-time communication between field technicians and back-office teams."
          actions={
            <>
              <ButtonLink href={ZEL_BOOK_DEMO} arrow>
                Sign up
              </ButtonLink>
              {/* TODO: link to the demo video once it exists */}
              <ButtonLink href={ZEL_BOOK_DEMO} variant="outline">
                <span className={styles.playSmall} aria-hidden="true">▶</span>Watch demo
              </ButtonLink>
            </>
          }
          media={<HotspotHero img="/images/ill-elec-tech.svg" alt="Electrician testing a breaker panel with a multimeter" hotspots={hotspots} />}
        />

        <TrustMarquee title="Trusted by electrical contractors across the country" />

        <section id="features" className={`section ${styles.pt128}`}>
          <div className="container">
            <ProductTabs
              layout="stacked"
              tabs={tabs}
              heading={
                <h2 className={`${styles.h2} ${styles.h2Lg}`}>
                  Electrical service software <span className="accent">for field and office teams</span>
                </h2>
              }
            />
          </div>
        </section>

        <section className={`section ${styles.py128}`}>
          <div className="container">
            <div className={styles.head}>
              <h2 className={`${styles.h2} ${styles.h2Lg}`} style={{ maxWidth: 820 }}>
                Software benefits that aid electricians.
                <br />
                <span className={styles.muted}>Everything you need to power your business.</span>
              </h2>
            </div>
            <BenefitGrid items={benefits} />
          </div>
        </section>

        <section className={`section ${styles.pb128}`}>
          <div className={`container ${styles.stack12}`}>
            <div className={styles.support}>
              <div className={styles.glow} style={{ right: -160, top: -200, width: 560, height: 520, background: "radial-gradient(closest-side,rgba(238,85,102,.35),rgba(238,85,102,0))" }} />
              <div className={styles.supportCopy}>
                <div className={styles.online}>
                  <span />
                  Support team online
                </div>
                <p className={styles.supportTitle}>Late night queries? The ZenElectrical team is always at your service.</p>
                <p className={styles.supportSub}>Just an email away from a steadfast resolution.</p>
              </div>
              {/* TODO: confirm the support email address */}
              <ButtonLink href="mailto:hello@zentrades.pro" variant="light" size="lg" arrow className={styles.rel}>
                Email support
              </ButtonLink>
            </div>
            <div className={styles.quoteRow}>
              <figure className={styles.quoteLight}>
                <div className={styles.quoteMark} aria-hidden="true">“</div>
                <blockquote>
                  <p>{testimonial.quote}</p>
                </blockquote>
                <div className={styles.quoteLightFoot}>
                  <figcaption>
                    <span className={styles.quoteAvatar} aria-hidden="true">{testimonial.name[0]}</span>
                    <cite>
                      {testimonial.name}
                      <span>{testimonial.company}</span>
                    </cite>
                  </figcaption>
                  <ButtonLink href="/testimonials" variant="outline">
                    More customer stories
                  </ButtonLink>
                </div>
              </figure>
              <div className={`${styles.quotePhoto} ${styles.quotePhotoLg}`}>
                <Image src={testimonial.img} alt={`${testimonial.name} of ${testimonial.company}`} fill sizes="(max-width: 900px) 100vw, 560px" />
              </div>
            </div>
          </div>
        </section>

        <section className={`section ${styles.py128}`} style={{ borderTop: "1px solid var(--line-3)", position: "relative", overflow: "hidden" }}>
          <div className={styles.glow} style={{ left: -240, top: -240, width: 900, height: 700, background: "radial-gradient(closest-side,rgba(238,85,102,.08),rgba(238,85,102,0))" }} />
          <div className={`container ${styles.rel}`}>
            <div className={styles.head} style={{ marginBottom: 56 }}>
              <h2 className={`${styles.h2} ${styles.h2Lg}`}>
                Why ZenElectrical fits. <span className="accent">An electrical dispatch software that does it all.</span>
              </h2>
              <p className={styles.lead} style={{ maxWidth: 340 }}>
                Everything electricians and office teams need, from the first call to the final invoice.
              </p>
            </div>
            <FeatureBrowser items={features} theme="light" ctaHref={ZEL_BOOK_DEMO} />
          </div>
        </section>

        <section className={`section ${styles.dark} ${styles.py128}`}>
          <div className={styles.glow} style={{ left: "50%", top: -280, width: 1000, height: 640, transform: "translateX(-50%)" }} />
          <div className={`container ${styles.loveRow}`}>
            <div className={styles.loveCopy}>
              <h2 className={`${styles.h2} ${styles.h2Lg}`}>
                Our customers <span className="accent">love ZenElectrical.</span>
              </h2>
              <p>MJM Electric was able to double their revenue in 6 months with ZenElectrical.</p>
              <dl className={styles.bigStats}>
                <div>
                  <dt>revenue</dt>
                  <dd>2×</dd>
                </div>
                <span aria-hidden="true" />
                <div>
                  <dt>months</dt>
                  <dd>6</dd>
                </div>
              </dl>
              <ButtonLink href={ZEL_BOOK_DEMO} variant="light" size="lg" arrow>
                Request demo
              </ButtonLink>
            </div>
            <MonthlyChart
              title="MJM Electric · revenue, Jan to Dec 2023"
              brand="ZenElectrical"
              values={revenueValues}
              switchIndex={6}
              note="Switched to ZenElectrical in July"
            />
          </div>
        </section>

        <FaqSection
          title={
            <>
              Frequently asked <span className="accent">questions</span>
            </>
          }
          intro="Everything electrical contractors ask before switching to ZenElectrical. Can’t find the answer you’re looking for? Our team is one click away."
          actions={
            <>
              <ButtonLink href={ZEL_BOOK_DEMO} arrow>
                Book a demo
              </ButtonLink>
              <ButtonLink href={ZEL_CONTACT} variant="outline">
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
