// ZenPlumbing page copy, verbatim from the "ZenPlumbing" design export.
import { featureLinks } from "@/lib/links";
import type { Benefit, Faq, ProductTab, Shop, Stat, Step } from "./types";

export const tabs: ProductTab[] = [
  { label: "Plumbing Invoicing Software", title: "Send the Invoice Before You Pack Up the Truck", img: "/images/app-invoice.png", link: { label: "Explore plumbing invoicing", href: featureLinks.invoicing }, points: ["Turn a finished job into an invoice in a few taps, right on site", "Take card payments in the field or text a pay-by-link to the customer", "Invoices, payments, and customers sync to QuickBooks, included in every plan", "See who’s paid, who’s late, and what’s still open at a glance"] },
  { label: "Plumbing Dispatching Software", title: "Get the Right Plumber to the Right Job, Fast", img: "/images/f-scheduler.jpg", link: { label: "Explore scheduling and dispatch", href: featureLinks.scheduling }, points: ["See every plumber, every job, and every open slot on one board", "Drag a job onto a plumber, and it lands on their phone instantly", "Send the closest plumber when a burst pipe or backed-up drain call comes in", "Customers get an on-the-way text, so your office fields fewer “when are you coming?” calls"] },
  { label: "Plumbing Mobile App", title: "Everything Your Plumbers Need, Right on Their Phone", img: "/images/f-map-framed.png", link: { label: "Explore the ZenPlumbing app", href: featureLinks.all }, points: ["Job details, customer notes, and directions in one place", "Take before and after photos and attach them to the job", "Collect signatures, create invoices, and take payments on site", "Keeps working with no signal and syncs when your plumber is back online"] },
  { label: "Plumbing CRM Software", title: "A CRM for Plumbers That Remembers Every Customer", img: "/images/f-tickets.jpeg", link: { label: "Explore plumbing CRM", href: featureLinks.all }, points: ["Every customer, address, and past job in one record", "See what was fixed last time, what was quoted, and what’s still open", "Automatic reminders for follow-ups, maintenance, and unpaid invoices", "Turn one-time callers into repeat customers who call you first"] },
  { label: "Estimates and Quotes", title: "Quote Plumbing Jobs on Site and Win Them Before You Leave", img: "/images/f-estimates.jpg", link: { label: "Explore estimates and quotes", href: featureLinks.estimates }, points: ["Build good, better, best options for repairs, repipes, and water heater installs", "Pull prices from your own flat-rate price book so every plumber quotes the same way", "Customers approve and sign right on your plumber’s phone or tablet", "Turn an approved quote into a job or invoice with one tap"] },
];

export const benefits: Benefit[] = [
  { big: "50%", unit: "Faster workflows", title: "Get Your Evenings Back", desc: "Scheduling, invoicing, and customer messages run on their own, so workflows move up to 50% faster, and you’re not doing paperwork at night." },
  { big: "25%", unit: "More revenue", title: "Make More on Every Call", desc: "Less drive time, faster invoices, and fewer missed upsells. Plumbing businesses using ZenPlumbing grow revenue by up to 25%." },
  { big: "20%", unit: "Technician efficiency", title: "Run Every Job Like Clockwork", desc: "Real-time job updates mean your plumbers know where to go and what to bring, with up to 20% better technician efficiency." },
  { big: "★", unit: "Customer loyalty", title: "Keep Customers Calling You First", desc: "Reminders, on-the-way texts, and easy online payments make you the plumber customers save in their phone and recommend to neighbors." },
];

export const shops: Shop[] = [
  { kicker: "Small Plumbing Shops", title: "Plumbing Software for Small Businesses", img: "/images/ph8.png", alt: "Small plumbing crew on a job", desc: "You answer the phone, run the schedule, and still turn wrenches. ZenPlumbing takes the office work off your plate so a crew of 2 to 5 plumbers can run like a much bigger shop." },
  { kicker: "Residential Service and Repair", title: "Residential Plumbing Service", img: "/images/ph10.png", alt: "Plumber on a residential service call", desc: "Handle drain clogs, leaks, water heater swaps, and emergency calls in one place. Show homeowners clear options, get the signature, and collect payment before you leave." },
  { kicker: "Plumbing and Heating Companies", title: "Plumbing and Heating Software", img: "/images/ph12.png", alt: "Plumbing and heating technician at work", desc: "Run plumbing and heating work from one app, with separate price books, crews, and recurring maintenance for each side of the business." },
];

export const caseStudy = {
  company: "Call First Plumbing",
  text: "Call First Plumbing grew its customer base by 25% in a single quarter by using ZenPlumbing to make better use of its crew, trucks and schedule.",
};

export const stats: Stat[] = [
  { value: "25", label: "more customers in one quarter" },
  { value: "30", label: "increase in revenue" },
  { value: "50", label: "more invoices sent" },
];

export const revenueBars = [
  { label: "Sep", value: "$70K", height: 31 },
  { label: "Oct", value: "$79K", height: 35 },
  { label: "Nov", value: "$108K", height: 48 },
  { label: "Dec", value: "$225K", height: 100 },
];

export const steps: Step[] = [
  { title: "Book a Demo", desc: "See ZenPlumbing on a quick call built around your shop, and get a clear price for your number of licenses." },
  { title: "We Set You Up", desc: "Our onboarding team moves your customers, job history, and price book into ZenPlumbing and connects QuickBooks for you." },
  { title: "Your Crew Goes Live", desc: "We train your office and your plumbers, and your account manager stays with you after launch." },
];

export const faqs: Faq[] = [
  { question: "What is plumbing software?", answer: "Plumbing software helps plumbing businesses run everything from one place: booking jobs, dispatching plumbers, quoting, invoicing, taking payments, and keeping customer records. It replaces paper work orders, whiteboards, and spreadsheets." },
  { question: "What is the best plumbing software for small businesses?", answer: "The best plumbing software for a small business is easy to learn, works on your plumbers’ phones, and doesn’t need a full-time office person to run. ZenPlumbing is built for small and growing shops, includes QuickBooks sync in every plan, and comes with hands-on setup help." },
  { question: "How much does plumbing software cost?", answer: "ZenPlumbing is priced per license, with different license types for owners, office staff, and plumbers. Most licenses fall around $50 to $70 per month, billed annually. Book a demo for an exact price for your team." },
  { question: "Does ZenPlumbing work with QuickBooks?", answer: "Yes. ZenPlumbing syncs invoices, payments, and customers with QuickBooks, and it’s included in every plan at no extra cost." },
  { question: "Is there a CRM for plumbers in ZenPlumbing?", answer: "Yes. ZenPlumbing includes a plumbing CRM that keeps every customer, address, past job, and quote in one record, with automatic follow-ups and reminders." },
  { question: "Can I create plumbing estimates on site?", answer: "Yes. Plumbers can build estimates from your flat-rate price book, show customers options, and get them signed right on their phone or tablet." },
  { question: "Does the ZenPlumbing app work without internet?", answer: "Yes. Plumbers can keep working with no signal, and everything syncs once they’re back online." },
  { question: "Does ZenPlumbing include plumbing scheduling and dispatch software?", answer: "Yes. Drag jobs onto your plumbers’ schedules, send them to their phones instantly, and let LISA, our AI assistant, plan the best route." },
  { question: "How long does it take to switch to ZenPlumbing?", answer: "Most plumbing teams are live within days. Our onboarding team moves your data and trains your office and plumbers, so you keep taking calls while you switch." },
];
