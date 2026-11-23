import DesignPage from '@/components/DesignPage';
import CaseStudy from '@/components/redesign/CaseStudy';
import studies from '@/components/redesign/case-studies.json';

type Study = (typeof studies)[keyof typeof studies] & {
  video?: { href: string; title: string; sub: string };
  flow?: unknown;
  testimonial?: unknown;
  card: { title: string; img: string; stat: string; statLabel: string };
};

const all = studies as Record<string, Study>;

// Three other stories for "Keep reading": same product first, then the rest.
function moreFor(path: string) {
  const self = all[path];
  return Object.entries(all)
    .filter(([p]) => p !== path)
    .sort(([, a], [, b]) => Number(b.product === self.product) - Number(a.product === self.product))
    .slice(0, 3)
    .map(([href, s]) => ({ href, tag: s.tag, co: s.company, title: s.card.title, img: s.card.img, stat: s.card.stat, statLabel: s.card.statLabel }));
}

/**
 * A customer case study in the redesigned template (components/redesign/
 * CaseStudy.jsx, from the Pastion case study design). Content lives in
 * components/redesign/case-studies.json, one entry per case study URL.
 */
export default function CaseStudyPage({ path }: { path: string }) {
  const s = all[path];
  if (!s) throw new Error('No case study data for ' + path);
  const data = {
    ...s,
    video: s.video ?? null,
    flow: s.flow ?? null,
    testimonial: s.testimonial ?? null,
    heroHref: s.video ? s.video.href : '#story',
    heroTarget: s.video ? '_blank' : '_self',
    more: moreFor(path),
  };
  function Design(props: { links: Record<string, string> }) {
    return <CaseStudy {...props} data={data} />;
  }
  return <DesignPage path={path} vertical={s.vertical} Design={Design} />;
}
