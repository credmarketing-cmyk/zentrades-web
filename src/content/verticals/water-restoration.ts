// Water damage restoration page copy, verbatim from the "Water Damage Restoration" design export.
import { featureLinks } from "@/lib/links";
import type { Benefit, Faq, Feature, ProductTab } from "./types";

const explore = { label: "Explore features", href: featureLinks.all };

export const tabs: ProductTab[] = [
  { label: "Restoration Invoicing", title: "Get paid faster on every restoration job", img: "/images/app-invoice.png", link: explore, points: ["Automate estimates, invoices, and payments in one place.", "Stay accurate by syncing with your accounting systems.", "Technicians send automated invoices in real time.", "Process payments instantly from the field."] },
  { label: "Mobile App", title: "Everything your crew needs on site", img: "/images/f-map-framed.png", link: explore, points: ["Job details, directions, and history in one tap.", "Capture moisture readings, photos, and notes on site.", "Collect customer signatures before leaving.", "Works offline and syncs when you’re back online."] },
  { label: "CRM", title: "Every customer, property, and claim in one record", img: "/images/f-tickets.jpeg", link: explore, points: ["Full service history for every property.", "Automated reminders and follow-ups.", "Track jobs from first call to final invoice.", "Turn one-time jobs into repeat business."] },
  { label: "Jobs Scheduling", title: "Dispatch the right crew the moment the call comes in", img: "/images/f-scheduler.jpg", link: explore, points: ["Drag-and-drop jobs onto a live calendar and map.", "Assign crews by skill, location, and availability.", "Push job details straight to technicians’ phones.", "Reschedule in seconds when emergencies hit."] },
];

export const benefits: Benefit[] = [
  { big: "01", unit: "Customers", title: "Cordial customer relationships", desc: "Personalized experiences with reminders, accessible service histories, and automated appointments." },
  { big: "02", unit: "Jobs", title: "Better job management", desc: "Oversee your field team from one place: track progress, dispatch, and manage recurring jobs effortlessly." },
  { big: "03", unit: "Communication", title: "Improved communication", desc: "The mobile app keeps field technicians and back-office staff aligned and accessible at all times." },
  { big: "04", unit: "Efficiency", title: "Perfect efficiency", desc: "Centralized control boosts efficiency while reducing costs, maximizing productivity." },
];

export const features: (Feature & { img: string })[] = [
  { title: "Automated invoices", desc: "Send real-time invoices and process payments instantly.", img: "/images/app-invoice.png" },
  { title: "Mobile-ready tools", desc: "Capture photos, create notes, and manage jobs on the go.", img: "/images/f-map-framed.png" },
  { title: "Advanced CRM", desc: "Tailor customer experiences to boost satisfaction.", img: "/images/f-tickets.jpeg" },
  { title: "Effortless scheduling", desc: "Drag-and-drop functionality for smooth job allocation.", img: "/images/f-scheduler.jpg" },
  { title: "Real-time GPS tracking", desc: "Monitor technician locations and job progress.", img: "/images/f-dashboard.png" },
  { title: "Seamless communication", desc: "Connect field and office staff instantly.", img: "/images/f-timecard.jpg" },
  { title: "Recurring processes", desc: "Automate workflows for repeat tasks.", img: "/images/f-inspections.jpg" },
  { title: "Efficiency booster", desc: "Reduce overheads while scaling productivity.", img: "/images/f-reports.jpg" },
];

export const faqs: Faq[] = [
  { question: "What is ZenTrades water damage restoration software?", answer: "A field service platform built for restoration contractors. It brings scheduling, dispatch, estimates, invoicing, payments, and customer management into one system." },
  { question: "Can my crew document jobs from the field?", answer: "Yes. Technicians capture photos, notes, and signatures on site from the mobile app." },
  { question: "How fast can we dispatch emergency jobs?", answer: "Drag a new job onto the live calendar and it’s pushed to the assigned technician’s phone instantly." },
  { question: "Does it work offline?", answer: "Yes. Crews keep working without signal, and everything syncs once they’re back online." },
  { question: "Does ZenTrades integrate with QuickBooks?", answer: "Yes. Invoices, payments, and customers sync with QuickBooks in real time." },
  { question: "How long does setup take?", answer: "Most restoration teams are up and running within days, with guided onboarding from our team." },
];
