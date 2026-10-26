// ZenHVAC page copy, verbatim from the "ZenHVAC" design export.
import { featureLinks } from "@/lib/links";
import type { Benefit, Faq, ProductTab, Shop, Stat, Step } from "./types";

export const tabs: ProductTab[] = [
  { label: "Service Agreements", title: "Sell More Maintenance Agreements and Never Miss a Visit", img: "/images/f-inspections.jpg", link: { label: "Explore service agreement features", href: featureLinks.inspections }, points: ["Create, renew and track HVAC service agreements in a few clicks", "Add custom tasks like filter changes, coil cleaning or refrigerant checks to any plan", "Visits book themselves on schedule, with automatic reminders to customers and techs", "See which agreements are up for renewal this month so revenue doesn’t slip away"] },
  { label: "QuickBooks Integration", title: "Sync With QuickBooks and Stop Typing Things Twice", img: "/images/f-invoice.jpg", link: { label: "See all integrations", href: "/integrations" }, points: ["Invoices, payments and customers sync straight to QuickBooks", "No double entry for your office manager at the end of the month", "Included in every ZenHVAC plan, no upgrade needed", "Your books stay matched to what happened in the field"] },
  { label: "Scheduling and Dispatch", title: "Drag-and-Drop HVAC Scheduling and Dispatch", img: "/images/f-scheduler.jpg", link: { label: "Explore scheduling and dispatch", href: featureLinks.scheduling }, points: ["See every tech, every job and every open slot on one board", "Drag a job to a tech and they get it on their phone instantly", "Send the closest qualified tech when an emergency no-heat call comes in", "Customers get an on-the-way text, so your office gets fewer “where’s my tech?” calls"] },
  { label: "Estimates and Quotes", title: "Build HVAC Estimates on Site and Win the Job Before You Leave", img: "/images/f-estimates.jpg", link: { label: "Explore estimates and quotes", href: featureLinks.estimates }, points: ["Create good, better, best options for repairs and system replacements", "Pull prices from your own flat-rate price book, so every tech quotes the same way", "Customers can approve and sign right on the tech’s phone or tablet", "Turn an approved estimate into a job or invoice with one tap"] },
  { label: "Invoicing and Payments", title: "Send the Invoice Before the Truck Leaves the Driveway", img: "/images/app-invoice.png", link: { label: "Explore invoicing and payments", href: featureLinks.payments }, points: ["Create invoices on the job site from the work order your tech already filled out", "Take card payments in the field or send a pay-by-link text or email", "Offer customer financing on bigger tickets like new system installs", "Track who’s paid, who’s late and what’s still open in real time"] },
  { label: "Real-Time Dashboard", title: "Know How Your HVAC Business Is Doing Today, Not Next Month", img: "/images/f-dashboard.png", link: { label: "Explore reports and dashboards", href: featureLinks.all }, points: ["See revenue, open jobs and unpaid invoices the moment you log in", "Track tech performance, job times and callbacks", "Spot your busiest days and plan staffing around peak season", "Pull reports in seconds instead of building spreadsheets"] },
];

export const benefits: Benefit[] = [
  { big: "70%", unit: "Admin automated", title: "Get Your Evenings Back", desc: "Stop finishing paperwork at the kitchen table. ZenHVAC automates up to 70% of admin work and builds reports up to 100x faster than doing them by hand." },
  { big: "25%", unit: "Lower costs", title: "Make More on Every Job", desc: "Cut wasted drive time and missed upsells. Contractors using ZenHVAC lower costs by up to 25% and raise team productivity by up to 20%." },
  { big: "15%", unit: "Tech efficiency", title: "Fix It Right the First Time", desc: "Techs see the full equipment and service history before they knock on the door. That means up to 15% better tech efficiency and fewer callbacks." },
  { big: "★", unit: "Customer loyalty", title: "Keep Customers Coming Back", desc: "Automatic reminders, on-the-way texts and easy online payments make you the HVAC company customers call again, and recommend to their neighbors." },
];

export const testimonial = {
  quote: "Before ZenHVAC, scheduling was a whiteboard and a lot of phone calls. Now my techs see their day on their phone, invoices go out from the job site, and I’m not chasing paperwork at night.",
  name: "Hector",
  company: "ABQ Temperature",
  img: "/images/ph3.png",
};

export const shops: Shop[] = [
  { kicker: "Small HVAC Shops", title: "HVAC Software for Small Businesses", img: "/images/ph1.png", alt: "Small HVAC team on a service call", desc: "You’re the owner, the dispatcher and sometimes the tech. ZenHVAC takes the office work off your plate so a team of 2 to 5 techs can run like a bigger company, without hiring more office staff." },
  { kicker: "Residential Service and Replacement", title: "Residential HVAC Service and Installs", img: "/images/ph5.png", alt: "Residential HVAC service technician", desc: "Handle tune-ups, emergency no-heat and no-cool calls, and full system replacements in one place. Show homeowners clear options, offer financing and get the signature on site." },
  { kicker: "Commercial HVAC", title: "Commercial HVAC Service Software", img: "/images/ph9.png", alt: "Commercial HVAC equipment service", desc: "Manage multi-site customers, rooftop units and recurring maintenance contracts. Keep equipment records for every building and send property managers clean service reports after every visit." },
];

export const stats: Stat[] = [
  { prefix: "Up to", value: "70", label: "of admin tasks automated" },
  { prefix: "Up to", value: "25", label: "lower operating costs" },
  { prefix: "Up to", value: "20", label: "higher team productivity" },
];

export const chartValues = [28, 34, 30, 38, 33, 36, 62, 70, 66, 82, 78, 95];

export const steps: Step[] = [
  { title: "Book a Demo", desc: "See ZenHVAC on a quick call built around your shop. We’ll show you the features that matter to your team and give you a clear price for your number of licenses." },
  { title: "We Set You Up", desc: "Our onboarding team moves your customers, equipment records and price book into ZenHVAC and connects QuickBooks for you." },
  { title: "Your Team Goes Live", desc: "We train your office and your techs, and your dedicated account manager stays with you through your first busy season." },
];

export const faqs: Faq[] = [
  { question: "What is HVAC software?", answer: "HVAC software is a tool that helps heating and cooling contractors run their business from one place. It covers scheduling, dispatching techs, estimates, invoicing, payments, customer records and maintenance agreements, so you can drop the paper forms and spreadsheets." },
  { question: "What is the best HVAC software for small businesses?", answer: "The best HVAC software for a small business is one that’s easy to learn, works on a tech’s phone and doesn’t need a full-time office person to run. ZenHVAC is built for shops with a handful of techs, includes QuickBooks sync in every plan and comes with a dedicated account manager to help you set up." },
  { question: "How much does HVAC software cost?", answer: "ZenHVAC is priced per license, with different license types for owners, office staff and technicians. Most licenses fall around $50 to $70 per month, billed annually. Book a demo and we’ll give you an exact price for your team size." },
  { question: "Does ZenHVAC work with QuickBooks?", answer: "Yes. ZenHVAC syncs invoices, payments and customers with QuickBooks, and the integration is included in every plan at no extra cost." },
  { question: "Can ZenHVAC handle HVAC maintenance agreements?", answer: "Yes. You can create and renew service agreements, add custom tasks to each plan, and let ZenHVAC book recurring visits and send reminders automatically." },
  { question: "Does the ZenHVAC app work without internet?", answer: "Yes. Techs can keep working with no signal, and everything syncs once they’re back online." },
  { question: "Is ZenHVAC good for commercial HVAC companies?", answer: "Yes. ZenHVAC handles multi-site customers, equipment records for every unit and recurring maintenance contracts, along with residential service and installs." },
  { question: "How long does it take to switch to ZenHVAC?", answer: "Most HVAC teams are live within days. Our onboarding team moves your data over and trains your office and techs, so you don’t have to stop taking calls while you switch." },
  { question: "Does ZenHVAC include HVAC scheduling and dispatch software?", answer: "Yes. Scheduling and dispatch are built in. Drag jobs onto your techs’ calendars, send them to their phones instantly and let LISA, our AI assistant, plan the best route." },
];
