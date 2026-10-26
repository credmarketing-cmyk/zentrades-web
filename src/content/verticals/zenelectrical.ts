// ZenElectrical page copy, verbatim from the "ZenElectrical" design export.
import type { Benefit, Faq, Feature, ProductTab } from "./types";

// ZenElectrical has its own copies of these pages on the live site.
export const ZEL_BOOK_DEMO = "/zenelectrical/book-demo";
export const ZEL_CONTACT = "/zenelectrical/contact-us";
const ZEL_FEATURES = "/zenelectrical/feature/all-feature";

export const hotspots = [
  { x: 39, y: 30, label: "Technician · On site", text: "Mike R. arrived at 9:42 AM" },
  { x: 68, y: 20, label: "Job checklist", text: "Panel inspection · 6 of 8 circuits tested" },
  { x: 62, y: 43, label: "Reading logged to job", text: "240 V · within spec" },
  { x: 79, y: 56, label: "Parts used", text: "20A breaker ×2 · synced to inventory" },
];

const explore = { label: "Explore features", href: ZEL_FEATURES };

export const tabs: ProductTab[] = [
  { label: "Project Management", title: "Manage electrical projects with ease", img: "/images/f-projects.webp", link: explore, desc: "ZenElectrical stores customer data and shows job progress, job history, and other job details each time, so you can access all your projects in a simplified visual format.", points: ["Keep every electrical project and its stages in one view.", "See job progress, history, and details at a glance.", "Store customer data alongside every job.", "Deliver reliable service and keep customers satisfied."] },
  { label: "QuickBooks & Accounting", title: "Accounting that stays in sync", img: "/images/f-invoice.jpg", link: explore, desc: "Connect ZenElectrical to QuickBooks so invoices, payments, and customers flow into your books automatically.", points: ["Two-way sync with QuickBooks.", "No double entry for invoices and payments.", "Customer records stay consistent everywhere.", "Cleaner books at month end."] },
  { label: "Job Costs & Invoices", title: "Know your margins on every job", img: "/images/f-jobcosting.jpg", link: explore, desc: "Track labor, materials, and overhead against what you billed, then turn the job into an invoice in one tap.", points: ["Track labor and materials per job.", "Compare estimated vs. actual costs.", "Generate invoices straight from completed jobs.", "Get paid faster with online payments."] },
  { label: "Estimating", title: "Win more bids with faster estimates", img: "/images/f-estimates.jpg", link: explore, desc: "Build accurate, professional electrical estimates from your price book in minutes.", points: ["Create estimates from a customizable price book.", "Add options, photos, and notes.", "Send for e-signature approval.", "Convert approved estimates into jobs."] },
  { label: "Online Booking & CRM", title: "Let customers book, keep them coming back", img: "/images/f-tickets.jpeg", link: explore, desc: "Accept online bookings and keep every customer’s history, equipment, and communication in one place.", points: ["Online booking straight into your calendar.", "Full customer and service history.", "Automated reminders and follow-ups.", "Better retention with every visit."] },
  { label: "Inventory", title: "Know what’s on every truck", img: "/images/f-inventory.jpg", link: explore, desc: "Track parts and materials across the warehouse and vehicles so technicians always have what they need.", points: ["Track stock across warehouses and trucks.", "Low-stock alerts and reordering.", "Parts used are logged against each job.", "Fewer return trips to the supply house."] },
];

export const benefits: Benefit[] = [
  { big: "40%", unit: "Cost tracking", title: "Accurate cost tracking by 40%", desc: "Improve business financial management with real-time data insights. Track costs precisely, automate estimates, and boost profitability." },
  { big: "Live", unit: "Communication", title: "Enhanced communication between teams", desc: "Facilitate seamless collaboration between field technicians and the back office, ensuring better decision-making and more efficient operations." },
  { big: "+25%", unit: "Earnings", title: "Increase monthly earnings by 25%", desc: "Boost your revenue by automating administrative tasks and payments on the job, and enable flexible payment options." },
  { big: "Repeat", unit: "Customers", title: "Happy customers, happy business", desc: "Our electrical business software keeps your customers coming back for more. Enhance each aspect of your business, from service calls to collections." },
];

export const testimonial = {
  quote: "Instead of trying to guess what my employees are thinking, the information is right there in front of me. ZenElectrical has improved our flow and gotten us more organized.",
  name: "Heather",
  company: "Zimmick Electric",
  img: "/images/ph3.png",
};

export const features: (Feature & { img: string })[] = [
  { title: "Intuitive design", desc: "ZenElectrical is designed for ease of use, with minimal disruption and no extensive training required.", img: "/images/f-projects.webp" },
  { title: "Offline accessibility", desc: "Your technicians can work offline. Data syncs with the back office once they’re connected, keeping them productive without a stable connection.", img: "/images/f-map-framed.png" },
  { title: "QuickBooks integration", desc: "ZenElectrical integrates seamlessly with QuickBooks, ensuring smooth and error-free financial management.", img: "/images/f-invoice.jpg" },
  { title: "Customizable job costing", desc: "Easily create professional job proposals using a streamlined price book, tailored to your specific needs.", img: "/images/f-jobcosting.jpg" },
  { title: "Automated scheduling & routing", desc: "Assign jobs, optimize routes, and monitor progress in real time, ensuring maximum efficiency for your technicians.", img: "/images/f-scheduler.jpg" },
  { title: "Guaranteed virtual on-field support", desc: "Receive virtual support anytime during an on-field visit from your account manager to help you navigate the platform.", img: "/images/f-timecard.jpg" },
];

export const revenueValues = [22, 26, 24, 30, 28, 32, 46, 52, 60, 58, 70, 82];

export const faqs: Faq[] = [
  { question: "What is ZenElectrical?", answer: "ZenElectrical is field service software built for electrical contractors. It brings project management, scheduling, dispatch, estimates, invoicing, payments, and inventory into one platform." },
  { question: "Does ZenElectrical integrate with QuickBooks?", answer: "Yes. Invoices, payments, and customers sync with QuickBooks, so there’s no double entry." },
  { question: "Can my technicians use it offline?", answer: "Yes. Technicians keep working without signal, and everything syncs with the office once they’re back online." },
  { question: "How does job costing work?", answer: "Track labor, materials, and overhead on every job and compare them against what you billed to see real margins." },
  { question: "Can customers book jobs online?", answer: "Yes. Online bookings land straight in your calendar, ready to dispatch." },
  { question: "How long does setup take?", answer: "Most electrical teams are up and running within days, with guided onboarding and a dedicated account manager." },
];
