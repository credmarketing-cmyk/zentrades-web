import Image from "next/image";
import type { CSSProperties } from "react";
import Link from "next/link";
import { FaqList } from "@/components/home/FaqList";
import { FeatureTabs } from "@/components/home/FeatureTabs";
import { IntegrationHub } from "@/components/home/IntegrationHub";
import { JobDemo } from "@/components/home/JobDemo";
import { ModulePicker } from "@/components/home/ModulePicker";
import { StoryPanels } from "@/components/home/StoryPanels";
import styles from "@/components/home/home.module.css";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { TrustMarquee } from "@/components/site/TrustMarquee";
import { ButtonLink } from "@/components/ui/Button";
import {
  complianceEngine,
  easyPoints,
  faqs,
  featureGroups,
  integrations,
  resources,
  reviews,
  stats,
  stories,
  wallColumns,
} from "@/content/home";
import { brands } from "@/lib/brands";
import { BOOK_DEMO, CONTACT } from "@/lib/links";
import { faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/site";

export const metadata = pageMetadata({
  title: DEFAULT_TITLE,
  absoluteTitle: true,
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

const brand = brands.zentrades;

export default function Home() {
  const moduleNames = featureGroups.flatMap((g) => g.items.map((f) => f.name));

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <Header brand={brand} />
      <main>
        {/* Hero */}
        <section className={`section ${styles.hero}`}>
          <div className={`container ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <p className={styles.badge}>
                <span>New</span>Mobile-first, compliance-ready, real-time
              </p>
              <h1 className={styles.h1}>
                <span className="accent">All-in-one</span> field service platform for trade businesses
              </h1>
              <p className={styles.heroText}>
                Replace pen and paper, spreadsheets, and disconnected tools with one simple platform to schedule jobs,
                dispatch techs, invoice faster, and grow revenue.
              </p>
              <div className={styles.ctaRow}>
                <ButtonLink href={BOOK_DEMO} arrow>
                  Get started
                </ButtonLink>
                {/* TODO: link to the product tour video once it exists */}
                <ButtonLink href={BOOK_DEMO} variant="outline" className={styles.tourBtn}>
                  <span className={styles.playIcon} aria-hidden="true">▶</span>Product tour
                </ButtonLink>
              </div>
              <div className={styles.ratings}>
                <div className={styles.rating}>
                  <strong>4.7</strong>
                  <div>
                    <div className="stars" aria-label="4.7 out of 5 stars">★★★★★</div>
                    App Store
                  </div>
                </div>
                <div className={styles.ratingDivider} />
                <div className={styles.rating}>
                  <strong>4.5</strong>
                  <div>
                    <div className="stars" aria-label="4.5 out of 5 stars">★★★★★</div>
                    Google Play
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.heroMedia}>
              <Image
                src="/images/hero-tech.png"
                alt="Technician using ZenTrades field service software on a tablet"
                width={2196}
                height={1949}
                sizes="(max-width: 900px) 100vw, 520px"
                preload
              />
            </div>
          </div>
          <ul className={`container ${styles.stats}`}>
            {stats.map((s) => (
              <li key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <TrustMarquee
          title={
            <>
              Trusted by <strong>10,000+</strong> trade businesses
            </>
          }
        />

        {/* Customer stories */}
        <section className={`section ${styles.stories}`}>
          <div className="container">
            <div className={styles.sectionHead}>
              <div>
                <h2 className="display">
                  Why field teams choose <span className="accent">ZenTrades</span>
                </h2>
              </div>
              <div className={styles.sectionAside}>
                <p className={styles.lead}>Built for the way field service actually works. Hear it from the owners.</p>
                <ButtonLink href="/testimonials" variant="underline">
                  More customer proof →
                </ButtonLink>
              </div>
            </div>
            <StoryPanels stories={stories} />
          </div>
        </section>

        {/* Features */}
        <section className={`section ${styles.dark} ${styles.features}`}>
          <div className={styles.glowTop} />
          <div className="container">
            <div className={styles.sectionHead}>
              <div>
                <h2 className="display">
                  One platform. <span className="accent">Every</span> field service workflow.
                </h2>
              </div>
              <p className={styles.lead}>
                Run every job, crew, and dollar through one system built for field service teams.
              </p>
            </div>
            <FeatureTabs groups={featureGroups} />
          </div>
        </section>

        {/* Day one */}
        <section className={`section ${styles.dayOne}`}>
          <div className={`container ${styles.split}`}>
            <div className={styles.splitCopy}>
              <h2 className="display">
                Simple from day one. Easy for <span className="accent">every</span> technician.
              </h2>
              <p className={styles.bigText}>
                Exactly what you need to run your trade service business, in a system so simple even a new hire can use
                it on day one.
              </p>
              <ol className={styles.points}>
                {easyPoints.map((p) => (
                  <li key={p.n}>
                    <span className={`mono ${styles.num}`}>{p.n}</span>
                    <div>
                      <h3>{p.t}</h3>
                      <p>{p.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className={styles.ctaRow}>
                <ButtonLink href={BOOK_DEMO} size="lg" arrow>
                  Get started
                </ButtonLink>
                <span className={styles.dayNote}>Give us 15 minutes. Get your time and margins back.</span>
              </div>
            </div>
            <div className={styles.phoneStage}>
              <div className={styles.dayWatermark} aria-hidden="true">Day 1</div>
              <div className={styles.tryIt}>
                <span />
                Try it. This is what your techs see.
              </div>
              <JobDemo />
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className={`section ${styles.integrations}`}>
          <div className="container">
            <div className={styles.centerHead}>
              <h2 className="display">
                Works with what you <span className="accent">already</span> use.
              </h2>
              <p>
                Connect ZenTrades with the tools your team already relies on, without changing how you run your
                day-to-day operations.
              </p>
            </div>
            <IntegrationHub items={integrations} tce={complianceEngine} />
            <div className={styles.centerLink}>
              <ButtonLink href="/integrations" variant="underline">
                Explore integrations →
              </ButtonLink>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className={`section ${styles.resourcesSec}`}>
          <div className="container">
            <div className={styles.sectionHead}>
              <div>
                <h2 className="display">
                  Resources for the field. <span className="accent">Run</span> your business better.
                </h2>
              </div>
              <div className={styles.sectionAside}>
                <p className={styles.lead}>
                  Guides, checklists, and compliance forms built to help trade teams run jobs better, faster, and more
                  profitably.
                </p>
                <ButtonLink href="/guides" size="lg" arrow>
                  Explore resources
                </ButtonLink>
              </div>
            </div>
            <div className={styles.resGrid}>
              <Link href="/zenfire/podcast/fire-safety-podcast/episode-01" className={styles.podcast}>
                <Image
                  src="/images/podcast.png"
                  alt="Fire safety podcast episode 1 with Carlos Morett"
                  fill
                  sizes="(max-width: 900px) 100vw, 640px"
                />
                <div className={styles.podcastBody}>
                  <div>
                    <div className={`mono ${styles.podcastKicker}`}>PODCAST · EP 01</div>
                    <h3 className={styles.podcastTitle}>Inspections going digital, with Carlos Morett</h3>
                  </div>
                  <span className={styles.playRing} aria-hidden="true">
                    <span>▶</span>
                  </span>
                </div>
              </Link>
              <div className={styles.resCards}>
                {resources.map((r, i) => (
                  <Link key={r.title} href={r.href} className={styles.resCard}>
                    <div className={`mono ${styles.resCardTop}`}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <span aria-hidden="true">↗</span>
                    </div>
                    <div>
                      <h3>{r.title}</h3>
                      <p>{r.desc}</p>
                    </div>
                  </Link>
                ))}
                <Link href="/guides" className={styles.resAll}>
                  <span aria-hidden="true">→</span>
                  See all resources
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className={`section ${styles.reviewsSec}`}>
          <div className={`container ${styles.split}`}>
            <div className={styles.reviewsCopy}>
              <h2 className="display">
                <span className="accent">Trusted</span> by teams in the field.
              </h2>
              <p>Real reviews and ratings from trade service businesses using ZenTrades every day.</p>
              <ul className={styles.scoreList}>
                <li>
                  <div>
                    <h3>App Store</h3>
                    <span className="stars" aria-hidden="true">★★★★★</span>
                  </div>
                  <strong aria-label="4.7 out of 5">4.7</strong>
                </li>
                <li>
                  <div>
                    <h3>Google Play</h3>
                    <span className="stars" aria-hidden="true">★★★★★</span>
                  </div>
                  <strong aria-label="4.5 out of 5">4.5</strong>
                </li>
              </ul>
            </div>
            <div className={styles.wall}>
              {wallColumns.map((col, ci) => (
                <div key={ci} className={styles.wallCol} style={{ "--dur": `${[44, 52, 48][ci]}s` } as CSSProperties}>
                  {[0, 1].map((copy) =>
                    col.map((item, ii) => {
                      const hidden = copy === 1 || undefined;
                      if ("photo" in item) {
                        return (
                          <div key={`${copy}-${ii}`} className={styles.wallPhoto} style={{ height: item.height }} aria-hidden="true">
                            <Image src={`/images/ph${item.photo}.png`} alt="" fill sizes="240px" />
                          </div>
                        );
                      }
                      const r = reviews[item.review];
                      return (
                        <figure key={`${copy}-${ii}`} className={styles.review} data-dark={!!item.dark} aria-hidden={hidden}>
                          <span className="stars" aria-hidden="true">★★★★★</span>
                          <blockquote>
                            <p>{r.text}</p>
                          </blockquote>
                          <figcaption>
                            <span className={styles.avatar} aria-hidden="true">{r.name[0]}</span>
                            <span>
                              {r.name}
                              <small>{r.trade}</small>
                            </span>
                          </figcaption>
                        </figure>
                      );
                    }),
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video story */}
        <section className={`section ${styles.videoSec}`}>
          <div className="container">
            <h2 className={styles.videoTitle}>
              If a 70-year-old business owner runs ZenTrades daily, onboarding your team{" "}
              <span className="accent">won’t be the hard part.</span>
            </h2>
            {/* TODO: link to Vicky's video */}
            <Link href="/testimonials" className={styles.video}>
              <Image
                src="/images/vid-vicky.png"
                alt="Vicky Amend of C&W Fire & Safety, a ZenFire customer"
                fill
                sizes="(max-width: 1248px) 100vw, 1200px"
              />
              <div className={styles.videoCaption}>
                <strong>Vicky Amend</strong>
                <span>C&amp;W Fire &amp; Safety · ZenFire customer</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Pricing */}
        <section className={`section ${styles.dark} ${styles.pricingSec}`}>
          <div className={styles.glowBottom} />
          <div className={`container ${styles.split}`}>
            <div className={styles.splitCopy}>
              <h2 className={`display ${styles.pricingTitle}`}>
                Stop paying for software you never <span className="accent">fully use.</span>
              </h2>
              <p>No unused features. No steep learning curve. Just what your operation needs to run smoothly.</p>
            </div>
            <ModulePicker modules={moduleNames} />
          </div>
        </section>

        {/* FAQ */}
        <section className={`section ${styles.faqSec}`}>
          <div className="container">
            <div className={styles.faqHead}>
              <div>
                <h2 className={styles.faqTitle}>Frequently asked questions</h2>
                <p>
                  Everything you need to know about ZenTrades. Can’t find the answer you’re looking for? Our team is one
                  click away.
                </p>
              </div>
              <div className={styles.ctaRow}>
                <ButtonLink href={BOOK_DEMO} arrow>
                  Book a demo
                </ButtonLink>
                <ButtonLink href={CONTACT} variant="outline">
                  Contact us
                </ButtonLink>
              </div>
            </div>
            <FaqList faqs={faqs} />
          </div>
        </section>
      </main>
      <Footer brand={brand} />
    </>
  );
}
