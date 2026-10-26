import Image from "next/image";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { TrustMarquee } from "@/components/site/TrustMarquee";
import { ButtonLink } from "@/components/ui/Button";
import { BeforeAfterChart } from "@/components/vertical/Charts";
import { Hero, HeroPhoto } from "@/components/vertical/Hero";
import { ProductTabs } from "@/components/vertical/ProductTabs";
import { BenefitGrid, FaqSection, ShopGrid, StatGrid, StepList } from "@/components/vertical/Sections";
import styles from "@/components/vertical/vertical.module.css";
import { benefits, chartValues, faqs, shops, stats, steps, tabs, testimonial } from "@/content/verticals/zenhvac";
import { brands } from "@/lib/brands";
import { BOOK_DEMO, CONTACT, PRICING } from "@/lib/links";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const PATH = "/zenhvac";

export const metadata = pageMetadata({
  title: "HVAC Software That Runs Your Whole Shop | ZenHVAC",
  absoluteTitle: true,
  description:
    "ZenHVAC is HVAC service software for contractors: scheduling, dispatch, estimates, invoicing, payments and maintenance agreements in one app. Book a free demo.",
  path: PATH,
});

const brand = brands.zenhvac;

export default function ZenHvacPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "ZenHVAC", path: PATH }]), faqSchema(faqs)]} />
      <Header brand={brand} />
      <main>
        <Hero
          badge={{ tag: "ZenHVAC", text: "by ZenTrades" }}
          titleSize="md"
          title={
            <>
              ZenHVAC: The <span className="accent">HVAC Software</span> That Runs Your Whole Shop
            </>
          }
          longIntro
          intro="ZenHVAC is HVAC service software built for contractors who are tired of juggling whiteboards, spreadsheets and missed calls. Book jobs, dispatch the right tech, quote on site, collect payment, and keep every maintenance agreement on track, all from one app your office and your techs will actually use."
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
          checks={["QuickBooks sync included in every plan", "Works offline in basements and attics"]}
          media={<HeroPhoto src="/images/hero-hvac.jpg" alt="HVAC technician servicing a unit with ZenHVAC" aspect="4 / 4.6" position="center 40%" />}
        />

        <TrustMarquee title="Trusted by HVAC teams across the country" />

        <section id="features" className={`section ${styles.pt128}`}>
          <div className="container">
            <ProductTabs
              layout="full"
              tabs={tabs}
              heading={
                <div className={styles.head} style={{ marginBottom: 32 }}>
                  <div>
                    <div className={styles.pill}>HVAC management software</div>
                    <h2 className={styles.h2}>
                      ZenHVAC Puts Your Whole HVAC Business <span className="accent">in One Place</span>
                    </h2>
                  </div>
                  <p className={styles.lead}>
                    Six tools that replace the paper, the spreadsheets and the five different apps your team is switching
                    between today.
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
                Why HVAC Contractors Switch to ZenHVAC.{" "}
                <span className={styles.muted}>Less time in the office. More time on billable jobs.</span>
              </h2>
            </div>
            <BenefitGrid items={benefits} />
          </div>
        </section>

        <section className={`section ${styles.pb128}`}>
          <div className="container">
            <div className={styles.head} style={{ marginBottom: 40 }}>
              <h2 className={styles.h2}>
                Why HVAC Contractors <span className="accent">Trust ZenHVAC</span>
              </h2>
              <ButtonLink href="/testimonials" variant="outline">
                Read More Customer Stories →
              </ButtonLink>
            </div>
            <div className={styles.quoteRow}>
              <figure className={styles.quoteDark}>
                <div className={styles.glow} style={{ right: -160, top: -160, width: 420, height: 420 }} />
                <div className={styles.rel}>
                  <div className={styles.quoteMark} aria-hidden="true">“</div>
                  <blockquote>
                    <p>{testimonial.quote}</p>
                  </blockquote>
                </div>
                <figcaption className={styles.quoteBy}>
                  <span className={styles.quoteAvatar} aria-hidden="true">{testimonial.name[0]}</span>
                  <cite>
                    {testimonial.name}
                    <span>{testimonial.company}</span>
                  </cite>
                  <span className="stars" aria-label="5 out of 5 stars">★★★★★</span>
                </figcaption>
              </figure>
              <div className={styles.quotePhoto}>
                <Image src={testimonial.img} alt={`${testimonial.name} of ${testimonial.company} on a job`} fill sizes="(max-width: 900px) 100vw, 480px" />
              </div>
            </div>
          </div>
        </section>

        <section className={`section ${styles.dark} ${styles.py128}`}>
          <div className={styles.glow} style={{ left: "50%", top: -280, width: 1000, height: 640, transform: "translateX(-50%)" }} />
          <div className={`container ${styles.rel}`}>
            <div className={styles.head}>
              <h2 className={styles.h2}>
                ZenHVAC: HVAC Contractor Software <span className="accent">That Fits the Way You Work</span>
              </h2>
              <p className={styles.lead} style={{ maxWidth: 380 }}>
                Whether you run two trucks or twenty, residential service or commercial contracts, ZenHVAC adapts to your
                business instead of forcing you into someone else’s process.
              </p>
            </div>
            <ShopGrid items={shops} />
            <div className={styles.center}>
              <ButtonLink href={BOOK_DEMO} variant="light" arrow>
                See How ZenHVAC Fits Your Shop
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className={`section ${styles.pt128}`}>
          <div className="container">
            <div className={styles.head}>
              <h2 className={styles.h2}>
                Real Results From <span className="accent">HVAC Contractors</span>
              </h2>
            </div>
            <div className={styles.resultsRow}>
              <div className={styles.resultsCard}>
                <p className={styles.resultsText}>
                  One HVAC software for dispatching, invoicing and service agreements, and the numbers show the difference
                  after switching.
                </p>
                <StatGrid items={stats} />
                <ButtonLink href={BOOK_DEMO} arrow>
                  Book a Free Demo
                </ButtonLink>
              </div>
              <BeforeAfterChart title="Monthly jobs completed before and after switching to ZenHVAC" brand="ZenHVAC" values={chartValues} />
            </div>
          </div>
        </section>

        <section className={`section ${styles.pt128}`}>
          <div className={`container ${styles.stepsBox}`}>
            <div className={styles.stepsHead}>
              <h2 className={styles.h2}>
                Switching to ZenHVAC Is <span className="accent">Easier Than You Think</span>
              </h2>
              <p>Most HVAC teams are up and running in days, not months, and you never have to stop taking calls while you switch.</p>
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
              ZenHVAC FAQs: <span className="accent">Your HVAC Software Questions Answered</span>
            </>
          }
          intro="Everything HVAC teams ask before switching to ZenHVAC. Can’t find the answer you’re looking for? Our team is one click away."
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
