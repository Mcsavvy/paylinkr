import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I create my first PayTag?",
    a: "Just sign up, enter an amount and description, and your PayTag link or QR code is ready to share!",
  },
  {
    q: "Do I need a special wallet?",
    a: "Nope! PayLinkr works with popular wallets like Xverse and Hiro right out of the box.",
  },
  {
    q: "Is PayLinkr custodial?",
    a: "No. You always control your funds. PayLinkr never holds your sBTC.",
  },
  {
    q: "Can I use PayLinkr for my business?",
    a: "Yes! We offer merchant features like invoicing, plugins, and API access for e-commerce.",
  },
  {
    q: "How fast are payments?",
    a: "Most payments settle in seconds, thanks to the Stacks blockchain.",
  },
  {
    q: "Is there an API?",
    a: "Yes, our API lets you automate PayTag creation, payment tracking, and more.",
  },
];

export function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="w-full max-w-3xl mx-auto py-20 px-4 md:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[color:var(--foreground)] mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-[color:var(--muted-foreground)] max-w-2xl mx-auto">
          Everything you need to know about PayLinkr, from setup to security.
        </p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={faq.q}
            className="bg-[color:var(--card)] rounded-xl shadow p-5 border border-[color:var(--border)]"
          >
            <button
              className="flex items-center w-full text-left gap-3 focus:outline-none"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              aria-controls={`faq-${i}`}
            >
              <HelpCircle className="w-5 h-5 text-[color:var(--primary)] shrink-0" />
              <span className="font-medium text-[color:var(--foreground)] flex-1">
                {faq.q}
              </span>
              <ChevronDown
                className={`w-5 h-5 ml-2 transition-transform ${
                  open === i ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  id={`faq-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 text-[color:var(--muted-foreground)] text-base">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
