export type ProductTab = {
  label: string;
  title: string;
  img: string;
  points: string[];
  desc?: string;
  link: { label: string; href: string };
};

export type Benefit = { big: string; unit: string; title: string; desc: string };

export type Feature = { title: string; desc: string; img?: string };

export type Shop = { kicker: string; title: string; desc: string; img: string; alt: string };

export type Stat = { prefix?: string; value: string; suffix?: string; label: string };

export type Step = { title: string; desc: string };

export type Faq = { question: string; answer: string };
