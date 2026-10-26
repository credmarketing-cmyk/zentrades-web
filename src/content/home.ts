// Homepage copy, taken verbatim from the "ZenTrades Home" design export.
import { featureLinks } from "@/lib/links";

export const stats = [
  { value: "10,000+", label: "field teams" },
  { value: "$2.3M", label: "revenue saved" },
  { value: "99.9%", label: "uptime" },
];

export type Story = { company: string; trade: string; img: string; quote: string; name: string; role: string };

export const stories: Story[] = [
  {
    company: "Pastion Industries",
    trade: "Field operations",
    img: "/images/story-pastion.png",
    quote:
      "ZenTrades lifted a huge weight off our shoulders. The moment we switched from paper tickets to the platform, everything became faster, more organized, and much easier to track.",
    name: "Gabriela",
    role: "Director of Operations, Pastion Industries",
  },
  {
    company: "Icy Hot Heating & Air",
    trade: "HVAC",
    img: "/images/story-icyhot.png",
    quote:
      "The hard part was making the switch. Once you’re used to something, it’s hard to change. The unknown is always scary. But honestly, we were glad that we did.",
    name: "Frankie",
    role: "Owner, Icy Hot Heating & Air Conditioning",
  },
  {
    company: "Covenant Electric",
    trade: "Electrical",
    img: "/images/story-covenant.png",
    quote:
      "ZenTrades has made a huge difference in my day-to-day. It really does streamline everything. Once you start using it, you’ll get hooked.",
    name: "Tony",
    role: "Owner, Covenant Electric",
  },
];

export type Feature = { name: string; tag: string; desc: string; img: string; href: string };

export const featureGroups: { label: string; items: Feature[] }[] = [
  {
    label: "Win the job",
    items: [
      { name: "Invoicing & Estimates", tag: "Create & send invoices faster", desc: "Professional estimates and invoices in minutes. Reduce manual billing, avoid pricing errors, and get paid faster after every job.", img: "/images/f-estimates.jpg", href: featureLinks.invoicing },
      { name: "Online Payments", tag: "Get paid on site", desc: "Customers pay by card or ACH from the invoice or right at the job, with every payment synced automatically.", img: "/images/f-invoice.jpg", href: featureLinks.payments },
    ],
  },
  {
    label: "Run the day",
    items: [
      { name: "Schedule & Dispatch", tag: "Drag, drop, dispatch", desc: "Build the day on a live calendar and map, assign jobs in a tap, and push them to technicians’ phones.", img: "/images/f-scheduler.jpg", href: featureLinks.scheduling },
      { name: "Crew Management", tag: "Right tech, right job", desc: "Time cards, availability, and certifications in one view, so every job gets the right person.", img: "/images/f-timecard.jpg", href: featureLinks.crew },
      { name: "Recurring Inspections", tag: "Never miss a renewal", desc: "Automate recurring inspection visits and reminders so compliance work books itself.", img: "/images/f-inspections.jpg", href: featureLinks.inspections },
    ],
  },
  {
    label: "Manage the work",
    items: [
      { name: "Project Management", tag: "Track every job, start to finish", desc: "Multi-day jobs, materials, and crews on one timeline so nothing slips between office and field.", img: "/images/f-projects.webp", href: featureLinks.projects },
      { name: "Inventory Management", tag: "Know what’s on every truck", desc: "Track parts across the warehouse and vehicles, and reorder before you run out.", img: "/images/f-inventory.jpg", href: featureLinks.inventory },
    ],
  },
  {
    label: "Know your numbers",
    items: [
      { name: "Job Costing", tag: "See real margins per job", desc: "Compare labor, materials, and overhead against what you billed, job by job.", img: "/images/f-jobcosting.jpg", href: featureLinks.all },
      { name: "Reports", tag: "Decisions backed by data", desc: "Revenue, technician performance, and job trends in dashboards anyone can read.", img: "/images/f-reports.jpg", href: featureLinks.all },
    ],
  },
];

export const easyPoints = [
  { n: "01", t: "Learn it in one shift", d: "Big buttons, plain words, and only what techs need." },
  { n: "02", t: "Works offline on site", d: "Basements and rooftops included. Syncs when you’re back." },
  { n: "03", t: "Guided onboarding", d: "We import your customers and pricing with you." },
];

export const integrations = [
  { name: "Stripe", img: "/images/int-stripe2.png", text: "Card and ACH payments collected from every invoice.", col: 1, row: 1, href: "/integrations/stripe" },
  { name: "QuickBooks Online", img: "/images/int-quickbooks2.png", text: "Customers, invoices, and payments stay in sync with your books.", col: 1, row: 2, href: "/integrations/quickbooksonline" },
  { name: "Staxbill", img: "/images/int-staxbill2.png", text: "Recurring billing for service agreements and contracts.", col: 3, row: 1, href: "/integrations/stax" },
  { name: "Gravity Payments", img: "/images/int-gravity2.png", text: "In-person and online payment processing for your team.", col: 3, row: 2, href: "/integrations/gravity" },
  { name: "Salesforce", img: "/images/int-salesforce.png", text: "Customers and deals stay in sync with your CRM.", col: 1, row: 3, href: "/integrations" },
  { name: "Dialpad", img: "/images/int-dialpad.png", text: "Calls and texts logged against every customer and job.", col: 3, row: 3, href: "/integrations" },
];

export const complianceEngine = {
  name: "The Compliance Engine",
  text: "Inspection reports sent to your local AHJ without retyping.",
  href: "/zenfire/the-compliance-engine",
};

export const resources = [
  { title: "Calculators", desc: "Quick estimates and field calculations.", href: "/guides" }, // TODO: no calculators page yet
  { title: "Templates", desc: "Ready-made templates for quick job completion.", href: "/templates" },
  { title: "Checklists", desc: "NFPA-compliant checklists for error-free inspections.", href: "/zenfire/checklist" },
  { title: "NFPA Handbook", desc: "What each NFPA code requires.", href: "/nfpa" },
  { title: "Forms", desc: "Compliant forms for documentation and records.", href: "/zenfire/forms/free-digital-forms" },
];

export type Review = { text: string; name: string; trade: string };

export const reviews: Review[] = [
  { text: "ZenTrades has completely transformed our HVAC business. Scheduling is seamless, our technicians are more productive, and we’ve seen a 30% increase in customer satisfaction scores.", name: "David Wilson", trade: "HVAC" },
  { text: "The real-time tracking and notifications have virtually eliminated no-shows and late arrivals. Our customers love knowing exactly when our technicians will arrive.", name: "Jennifer", trade: "Plumbing" },
  { text: "The reporting features give me insights I never had before. Now I can make data-driven decisions about staffing, inventory, and which services to focus on.", name: "Robert", trade: "Fire & Safety" },
  { text: "ZenTrades lifted a huge weight off our shoulders. Everything became faster, more organized, and much easier to track.", name: "Gabriela", trade: "Pastion Industries" },
  { text: "Once you start using it, you’ll get hooked. It becomes part of your business, and you won’t want to go back.", name: "Tony", trade: "Covenant Electric" },
  { text: "Our office used to spend Fridays chasing paperwork. Now invoices go out before the tech leaves the driveway.", name: "Maria", trade: "Electrical" },
  { text: "The unknown is always scary. But honestly, we were glad that we did.", name: "Frankie", trade: "Icy Hot Heating & Air" },
  { text: "Setting up recurring inspections took one afternoon. We haven’t missed a renewal since.", name: "Kevin", trade: "Fire Inspection" },
];

// Review wall layout from the design: [review index, dark] or [photo number, height].
export type WallItem = { review: number; dark?: boolean } | { photo: number; height: number };
export const wallColumns: WallItem[][] = [
  [{ review: 0 }, { photo: 9, height: 240 }, { review: 3, dark: true }, { review: 6 }],
  [{ photo: 5, height: 280 }, { review: 1 }, { review: 4 }, { photo: 2, height: 200 }],
  [{ review: 2, dark: true }, { photo: 6, height: 260 }, { review: 5 }, { review: 7 }],
];

export const faqs = [
  { question: "What is ZenTrades?", answer: "ZenTrades is an all-in-one field service management (FSM) platform built for trade businesses. It puts scheduling, dispatching, estimates, invoicing, online payments, inventory, job costing, and inspection compliance in one system. It replaces paper tickets, spreadsheets, and disconnected apps. More than 10,000 field teams use ZenTrades to run their daily operations." },
  { question: "Which trades does ZenTrades support?", answer: "HVAC, plumbing, electrical, fire & life safety, water, kitchen exhaust, elevator, and more." },
  { question: "How much does ZenTrades cost?", answer: "Pricing depends on team size and modules. Book a demo and we’ll put together a plan that fits." },
  { question: "Is ZenTrades a good fit for small businesses?", answer: "Yes. Start with what you need today and add modules as you grow." },
  { question: "How long does it take to get started?", answer: "Most teams are running jobs in ZenTrades within days, with guided onboarding from our team." },
  { question: "Can I bring my existing data into ZenTrades?", answer: "Yes. We help import customers, equipment, pricing, and job history." },
  { question: "Will my technicians actually use it?", answer: "The mobile app is built for the field: big buttons, offline support, and only what techs need." },
  { question: "Does ZenTrades integrate with QuickBooks?", answer: "Yes, invoices, payments, and customers sync with QuickBooks." },
  { question: "What other tools does ZenTrades connect with?", answer: "Stripe, Staxbill, Gravity Payments, The Compliance Engine, and more." },
  { question: "How does ZenTrades help fire and inspection companies stay compliant?", answer: "NFPA-aligned checklists, recurring inspection scheduling, and automatic report submission." },
  { question: "How do customers pay through ZenTrades?", answer: "By card or ACH from the invoice link, the client portal, or on site via the technician app." },
  { question: "How is ZenTrades different from ServiceTitan, Jobber or Housecall Pro?", answer: "ZenTrades is modular and built for compliance-heavy trades, so you pay only for what you use and get set up faster." },
];
