// Elevator page copy, verbatim from the "Elevator" design export.
import { featureLinks } from "@/lib/links";
import type { Benefit, Feature, ProductTab } from "./types";

const explore = { label: "Explore features", href: featureLinks.all };

export const tabs: ProductTab[] = [
  { label: "Scheduling", title: "Drag-and-drop scheduling for every technician", img: "/images/f-scheduler.jpg", link: explore, points: ["Effortlessly manage technician schedules with drag-and-drop.", "Assign elevator maintenance jobs based on location.", "Factor in work history and priority for every job.", "Keep tasks moving with efficient, real-time management."] },
  { label: "Equipment Tracking", title: "Every elevator, part, and warranty on record", img: "/images/f-inventory.jpg", link: explore, points: ["Track elevator parts and components in one place.", "Keep full service histories for every unit.", "Store warranties alongside equipment records.", "Give technicians the history before they arrive."] },
  { label: "Invoicing and Estimation", title: "Quote and invoice right from the job site", img: "/images/f-estimates.jpg", link: explore, points: ["Build estimates in minutes from your price book.", "Convert estimates into invoices with one tap.", "Accept payments directly at the service location.", "Sync invoices and payments with your accounting."] },
  { label: "Mobile App", title: "A powerful app for technicians in the field", img: "/images/f-map-framed.png", link: explore, points: ["Update job statuses from the elevator shaft.", "Access customer details and service history on site.", "Capture photos, notes, and signatures.", "Keep building managers informed automatically."] },
];

export const benefits: Benefit[] = [
  { big: "01", unit: "Customers", title: "Enhanced customer satisfaction", desc: "Deliver prompt and reliable elevator maintenance services with instant access to detailed repair and inspection records." },
  { big: "02", unit: "Transparency", title: "Real-time updates", desc: "Notify clients about job progress, inspection schedules, and parts availability, improving transparency." },
  { big: "03", unit: "Operations", title: "Streamlined operations", desc: "Automate workflows, reduce paperwork, and increase technician efficiency to handle more elevator service calls." },
  { big: "04", unit: "Digital", title: "Modern digital solutions", desc: "Leverage a cloud-based platform for paperless management and enhanced operational efficiency." },
];

export const features: (Feature & { img: string })[] = [
  { title: "Simplified scheduling", desc: "Easily assign maintenance and repair tasks with real-time job updates.", img: "/images/f-scheduler.jpg" },
  { title: "Comprehensive equipment records", desc: "Track elevator parts, service histories, and warranties in one centralized platform.", img: "/images/f-inventory.jpg" },
  { title: "On-the-go invoicing", desc: "Convert estimates into invoices and accept payments directly at the service location.", img: "/images/app-invoice.png" },
  { title: "Mobile-friendly tools", desc: "Equip technicians with a powerful app to update job statuses and access customer details on site.", img: "/images/f-map-framed.png" },
  { title: "Customer-centric service", desc: "Increase client trust with detailed service reports and automated communication.", img: "/images/f-tickets.jpeg" },
  { title: "Automated notifications", desc: "Keep building managers informed with instant alerts on inspections, repairs, and updates.", img: "/images/f-inspections.jpg" },
  { title: "Paperless management", desc: "Digitize workflows to reduce inefficiencies and improve accuracy in elevator service records.", img: "/images/f-projects.webp" },
  { title: "Cloud-based access", desc: "Access your business tools anytime, anywhere, for seamless management of elevator operations.", img: "/images/f-reports.jpg" },
];
