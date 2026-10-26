// Every internal link on the site lives here so URLs stay consistent with the live site.
// Paths marked TODO have no matching page on the current WordPress site yet.

export const APP_LOGIN_URL = "https://app.zentrades.pro"; // TODO: confirm the login URL
export const BOOK_DEMO = "/book-demo";
export const CONTACT = "/contact-us";
export const PRICING = "/pricing";

export const featureLinks = {
  invoicing: "/feature/estimating-and-invoicing",
  estimates: "/feature/estimate-proposals",
  payments: "/invoicing-payments",
  scheduling: "/feature/scheduling-and-dispatching",
  crew: "/feature/crew-management",
  inspections: "/feature/recurring-inspection",
  projects: "/feature/project-management",
  inventory: "/features/inventory-management",
  all: "/feature/all-feature",
};

export type NavLink = { label: string; href: string };
export type NavMenu = { label: string; href?: string; items?: NavLink[] };

export const industryLinks: NavLink[] = [
  { label: "HVAC", href: "/zenhvac" },
  { label: "Plumbing", href: "/zenplumbing" },
  { label: "Electrical", href: "/zenelectrical" },
  { label: "Fire & Life Safety", href: "/zenfire" },
  { label: "Elevator", href: "/elevator" },
  { label: "Water Restoration", href: "/trades/water-restoration-software" },
  { label: "Kitchen Equipment", href: "/trades/kitchen-equipment-software" },
];

export const solutionLinks: NavLink[] = [
  { label: "Invoicing & Estimates", href: featureLinks.invoicing },
  { label: "Online Payments", href: featureLinks.payments },
  { label: "Schedule & Dispatch", href: featureLinks.scheduling },
  { label: "Crew Management", href: featureLinks.crew },
  { label: "Recurring Inspections", href: featureLinks.inspections },
  { label: "Project Management", href: featureLinks.projects },
  { label: "Inventory Management", href: featureLinks.inventory },
  { label: "All features", href: featureLinks.all },
];

export const resourceLinks: NavLink[] = [
  { label: "Blog", href: "/blog" },
  { label: "Guides", href: "/guides" },
  { label: "Templates", href: "/templates" },
  { label: "Checklists", href: "/zenfire/checklist" },
  { label: "NFPA Handbook", href: "/nfpa" },
  { label: "Forms", href: "/zenfire/forms/free-digital-forms" },
  { label: "Podcast", href: "/zenfire/podcast" },
  { label: "Case Studies", href: "/case-studies" },
];

export const companyLinks: NavLink[] = [
  { label: "Our Story", href: "/about-us" },
  { label: "Contact Us", href: CONTACT },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Referrals", href: "/referral" },
  { label: "Events", href: "/events" },
  { label: "Integrations", href: "/integrations" },
];

export function mainNav(whyLabel = "Why ZenTrades"): NavMenu[] {
  return [
    { label: "Company", items: companyLinks },
    { label: "Industry", items: industryLinks },
    { label: "Solution", items: solutionLinks },
    { label: "Resources", items: resourceLinks },
    { label: "Pricing", href: PRICING },
    { label: whyLabel, href: "/zentrades-vs-the-competitors" },
  ];
}

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Features",
    links: [
      { label: "Invoicing & Estimates", href: featureLinks.invoicing },
      { label: "Online Payments", href: featureLinks.payments },
      { label: "Schedule & Dispatch", href: featureLinks.scheduling },
      { label: "Recurring Inspection", href: featureLinks.inspections },
      { label: "Project Management", href: featureLinks.projects },
      { label: "Crew Management", href: featureLinks.crew },
      { label: "Inventory Management", href: featureLinks.inventory },
      { label: "See all features", href: featureLinks.all },
    ],
  },
  {
    title: "Verticals",
    links: [
      { label: "HVAC", href: "/zenhvac" },
      { label: "Plumbing", href: "/zenplumbing" },
      { label: "Water", href: "/trades/water-restoration-software" },
      { label: "Fire", href: "/zenfire" },
      { label: "Kitchen", href: "/trades/kitchen-equipment-software" },
      { label: "Electrical", href: "/zenelectrical" },
      { label: "Elevator", href: "/elevator" },
      { label: "See all verticals", href: "/trades" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Templates", href: "/templates" },
      { label: "NFPA Handbook", href: "/nfpa" },
      { label: "Checklists", href: "/zenfire/checklist" },
      { label: "Blog", href: "/blog" },
      { label: "Forms", href: "/zenfire/forms/free-digital-forms" },
      { label: "Podcast", href: "/zenfire/podcast" },
      { label: "Guides", href: "/guides" },
      { label: "See all resources", href: "/guides" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/about-us" },
      { label: "Contact Us", href: CONTACT },
      { label: "Referrals", href: "/referral" },
      { label: "Events", href: "/events" },
      { label: "Integrations", href: "/integrations" },
    ],
  },
];
