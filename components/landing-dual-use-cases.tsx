import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Briefcase } from "lucide-react";

const personal = [
  {
    title: "P2P Payments",
    desc: "Send and receive sBTC directly between friends and family.",
  },
  {
    title: "Splits",
    desc: "Easily split bills, group expenses, or shared costs.",
  },
  {
    title: "Donations",
    desc: "Accept donations for causes, creators, or community projects.",
  },
];
const business = [
  {
    title: "E-commerce",
    desc: "Accept sBTC payments in your online store or POS.",
  },
  {
    title: "Invoicing",
    desc: "Send professional invoices and get paid in sBTC.",
  },
  {
    title: "Recurring Payments",
    desc: "Automate subscriptions and regular billing with PayTags.",
  },
];

export function LandingDualUseCases() {
  const [tab, setTab] = useState("personal");
  const data = tab === "personal" ? personal : business;
  return (
    <section className="w-full container mx-auto py-20 px-4 md:px-8">
      <h2 className="text-3xl font-bold text-center mb-10 text-[color:var(--foreground)]">
        Dual Use Cases
      </h2>
      <div className="flex justify-center mb-8 gap-4">
        <button
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-colors border ${
            tab === "personal"
              ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
              : "bg-[color:var(--background)] text-[color:var(--muted-foreground)] border-[color:var(--border)]"
          }`}
          onClick={() => setTab("personal")}
        >
          <Users className="w-4 h-4" /> Personal
        </button>
        <button
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-colors border ${
            tab === "business"
              ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
              : "bg-[color:var(--background)] text-[color:var(--muted-foreground)] border-[color:var(--border)]"
          }`}
          onClick={() => setTab("business")}
        >
          <Briefcase className="w-4 h-4" /> Business
        </button>
      </div>
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-3 gap-8"
      >
        {data.map((item) => (
          <div
            key={item.title}
            className="bg-[color:var(--card)] rounded-xl shadow p-6 text-center"
          >
            <h3 className="font-semibold text-lg mb-2 text-[color:var(--foreground)]">
              {item.title}
            </h3>
            <p className="text-[color:var(--muted-foreground)]">{item.desc}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
