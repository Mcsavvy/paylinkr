import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const plans = [
  {
    name: "Personal",
    price: "Free",
    features: [
      "Unlimited PayTags",
      "No monthly fees",
      "Basic analytics",
      "P2P payments",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Merchant",
    price: "$9/mo",
    features: [
      "All Personal features",
      "API & webhooks",
      "E-commerce plugins",
      "Advanced analytics",
      "Priority support",
    ],
    cta: "Start 14-day Trial",
    highlight: true,
  },
];

export function LandingPricing() {
  return (
    <section className="w-full max-w-4xl mx-auto py-20 px-4 md:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[color:var(--foreground)] mb-2">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-[color:var(--muted-foreground)] max-w-2xl mx-auto">
          Choose the plan that fits your needs. No hidden fees, ever.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.7,
              delay: i * 0.15,
              ease: [0.4, 0, 0.2, 1],
            }}
            className={`rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-2 ${
              plan.highlight
                ? "border-[color:var(--primary)] bg-[color:var(--primary)]/5"
                : "border-[color:var(--border)] bg-[color:var(--card)]"
            }`}
          >
            <h3 className="text-2xl font-bold mb-2 text-[color:var(--foreground)]">
              {plan.name}
            </h3>
            <div className="text-3xl font-extrabold text-[color:var(--primary)] mb-4">
              {plan.price}
            </div>
            <ul className="mb-6 space-y-2">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-[color:var(--muted-foreground)] justify-center"
                >
                  <CheckCircle2 className="w-5 h-5 text-[color:var(--success-green)]" />{" "}
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`mt-auto px-6 py-2 rounded-full font-semibold transition-colors ${
                plan.highlight
                  ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:bg-[color:var(--primary)]/90"
                  : "bg-[color:var(--muted)] text-[color:var(--foreground)] hover:bg-[color:var(--muted)]/80"
              }`}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 text-center text-sm text-[color:var(--muted-foreground)]">
        <span className="font-semibold">Personal:</span> No fees for P2P.{" "}
        <span className="font-semibold">Merchant:</span> 0.5% per transaction
        after trial.
      </div>
    </section>
  );
}
