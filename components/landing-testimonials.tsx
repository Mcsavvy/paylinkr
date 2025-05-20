import { motion } from "framer-motion";
import { User } from "lucide-react";

const testimonials = [
  {
    quote:
      "PayLinkr made splitting rent with my roommates effortless. The payment was instant and I could track everything on-chain!",
    name: "Alex Kim",
    role: "Student, P2P User",
    avatar: null,
    metrics: ["<2s settlement", "Zero setup"],
  },
  {
    quote:
      "We integrated PayLinkr into our online store in minutes. Our customers love the one-click sBTC checkout!",
    name: "Samantha Lee",
    role: "E-commerce Owner",
    avatar: null,
    metrics: ["1-click checkout", "100% uptime"],
  },
];

export function LandingTestimonials() {
  return (
    <section className="w-full max-w-4xl mx-auto py-20 px-4 md:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[color:var(--foreground)] mb-2">
          Loved by Users & Merchants
        </h2>
        <p className="text-lg text-[color:var(--muted-foreground)] max-w-2xl mx-auto">
          Real stories from people and businesses using PayLinkr for fast,
          secure, and simple sBTC payments.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.7,
              delay: i * 0.15,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="bg-[color:var(--card)] rounded-xl shadow-lg p-8 flex flex-col items-center text-center border border-[color:var(--border)]"
          >
            <div className="mb-4">
              {t.avatar ? (
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-14 h-14 rounded-full mx-auto"
                />
              ) : (
                <User className="w-14 h-14 text-[color:var(--primary)] mx-auto" />
              )}
            </div>
            <blockquote className="text-lg italic text-[color:var(--foreground)] mb-4">
              “{t.quote}”
            </blockquote>
            <div className="flex gap-2 mb-2 justify-center">
              {t.metrics.map((m) => (
                <span
                  key={m}
                  className="inline-block bg-[color:var(--primary)]/10 text-[color:var(--primary)] rounded-full px-3 py-1 text-xs font-medium"
                >
                  {m}
                </span>
              ))}
            </div>
            <div className="text-sm text-[color:var(--muted-foreground)] font-semibold">
              {t.name}
            </div>
            <div className="text-xs text-[color:var(--muted-foreground)]">
              {t.role}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
