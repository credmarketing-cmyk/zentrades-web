import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { TrustMarquee } from "@/components/site/TrustMarquee";
import { ButtonLink } from "@/components/ui/Button";
import { ValueChart } from "@/components/vertical/Charts";
import { Hero, HeroPhoto } from "@/components/vertical/Hero";
import { ProductTabs } from "@/components/vertical/ProductTabs";
import { BenefitGrid, FaqSection, ShopGrid, StatGrid, StepList } from "@/components/vertical/Sections";
import styles from "@/components/vertical/vertical.module.css";
import {
  benefits,
  caseStudy,
  faqs,
  revenueBars,
  shops,
  stats,
  steps,
  tabs,
} from "@/content/verticals/zenplumbing";
import { brands } from "@/lib/brands";
import { BOOK_DEMO, CONTACT, PRICING } from "@/lib/links";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const PATH = "/zenplumbing";

export const metadata = pageMetadata({
  title: "Plumbing Software for Your Whole Business | ZenPlumbing",
  absoluteTitle: true,
  description:
    "ZenPlumbing is plumbing business software: book jobs, dispatch plumbers, quote on site, invoice and get paid from one app. QuickBooks sync in every plan.",
  path: PATH,
});

const brand = brands.zenplumbing;

export default function ZenPlumbingPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "ZenPlumbing", path: PATH }]), faqSchema(faqs)]} />
      <Header brand={brand} />
      <main>
        <Hero
          badge={{ tag: "ZenPlumbing", text: "by ZenTrades" }}
          titleSize="md"
          title={
            <>
              ZenPlumbing: The <span className="accent">Plumbing Software</span> That Runs Your Whole Business
            </>
          }
          longIntro
          intro={
            <>
              ZenPlumbing is plumbing business software built for plumbers who’d rather be fixing leaks than filling out
              paperwork. Book jobs, dispatch the right plumber, quote on site, send the invoice, and get paid, all from one
              app your office and your crew will actually use. Our AI-powered tools handle up to <strong>60%</strong> of the
              busywork for you.
            </>
          }
          actions={
            <>
              <ButtonLink href={BOOK_DEMO} arrow>
                Book a Free Demo
              </ButtonLink>
              <ButtonLink href={PRICING} variant="outline">
                See Pricing
              </ButtonLink>
            </>
          }
          checks={["QuickBooks sync included in every plan", "Works offline in basements and crawl spaces"]}
          media={<HeroPhoto src="/images/hero-plumber.jpg" alt="Plumber working on pipes using ZenPlumbing" aspect="4 / 4.6" position="center 45%" />}
        />

        <TrustMarquee title="Trusted by plumbing teams across the country" />

        <section id="features" className={`section ${styles.pt128}`}>
          <div className="container">
            <ProductTabs
              layout="full"
              tabs={tabs}
              heading={
                <div className={styles.head} style={{ marginBottom: 32 }}>
                  <div>
                    <div className={styles.pill}>Plumbing business software</div>
                    <h2 className={styles.h2}>
                      ZenPlumbing Puts Your Whole Plumbing Business <span className="accent">in One Place</span>
                    </h2>
                  </div>
                  <p className={styles.lead}>
                    Five tools that replace the clipboards, the spreadsheets, and the group texts your team is juggling
                    today.
                  </p>
                </div>
              }
            />
          </div>
        </section>

        <section className={`section ${styles.py128}`}>
          <div className="container">
            <div className={styles.head}>
              <h2 className={styles.h2}>
                Why Plumbers Switch to ZenPlumbing.{" "}
                <span className={styles.muted}>Less time on paperwork. More time on paying jobs.</span>
              </h2>
            </div>
            <BenefitGrid items={benefits} />
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className={styles.head}>
              <h2 className={styles.h2}>
                ZenPlumbing: Plumbing Contractor Software <span className="accent">That Fits Your Shop</span>
              </h2>
              <p className={styles.lead} style={{ maxWidth: 380 }}>
                One truck or a full fleet, service calls or recurring maintenance, ZenPlumbing works the way your plumbing
                company already runs.
              </p>
            </div>
            <ShopGrid items={shops} theme="light" />
            <div className={styles.center}>
              <ButtonLink href={BOOK_DEMO} arrow>
                See How ZenPlumbing Fits Your Shop
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className={`section ${styles.pt128}`}>
          <div className="container">
            <div className={styles.head}>
              <h2 className={styles.h2}>
                Real Results From <span className="accent">Real Plumbing Companies</span>
              </h2>
            </div>
            <div className={styles.resultsRow}>
              <div className={styles.resultsCard}>
                <div>
                  <div className={styles.caseChip}>{caseStudy.company}</div>
                  <p className={styles.resultsText}>{caseStudy.text}</p>
                </div>
                <StatGrid items={stats} />
                <ButtonLink href={BOOK_DEMO} arrow>
                  Book a Free Demo
                </ButtonLink>
              </div>
              <ValueChart title="Call First Plumbing: Revenue Growth With ZenPlumbing" subtitle="Sep to Dec 2023" bars={revenueBars} />
            </div>
          </div>
        </section>

        <section className={`section ${styles.pt128}`}>
          <div className={`container ${styles.stepsBox}`}>
            <div className={styles.stepsHead}>
              <h2 className={styles.h2}>
                Switching to ZenPlumbing Is <span className="accent">Easier Than You Think</span>
              </h2>
              <p>Most plumbing teams are up and running in days, and you never have to stop taking calls while you switch.</p>
            </div>
            <StepList items={steps} />
            <div className={styles.center} style={{ marginTop: 40 }}>
              <ButtonLink href={BOOK_DEMO} arrow>
                Book a Free Demo
              </ButtonLink>
            </div>
          </div>
        </section>

        <FaqSection
          title={
            <>
              ZenPlumbing FAQs: <span className="accent">Your Plumbing Software Questions Answered</span>
            </>
          }
          intro="Everything plumbing teams ask before switching to ZenPlumbing. Can’t find the answer you’re looking for? Our team is one click away."
          actions={
            <>
              <ButtonLink href={BOOK_DEMO} arrow>
                Book a Free Demo
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
