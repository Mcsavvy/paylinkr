import { ShieldCheck, Lock, Eye } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: ShieldCheck,
    title: "Blockchain Security",
    desc: "Built on the Stacks blockchain for robust, decentralized protection of every transaction.",
  },
  {
    icon: Lock,
    title: "Non-custodial by Design",
    desc: "You always control your funds. PayLinkr never holds your sBTC—ever.",
  },
  {
    icon: Eye,
    title: "Transparent Transactions",
    desc: "Every payment is verifiable and auditable on-chain for full transparency.",
  },
];

export function LandingTrustSecurity() {
  return (
    <section className="w-full container mx-auto py-20 px-4 md:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[color:var(--foreground)] mb-2">
          Trust & Security
        </h2>
        <p className="text-lg text-[color:var(--muted-foreground)] max-w-2xl mx-auto">
          PayLinkr is built for peace of mind. Your payments are protected by
          blockchain technology, always non-custodial, and fully transparent.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
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
            <f.icon className="w-10 h-10 text-[color:var(--foreground)] mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-[color:var(--foreground)]">
              {f.title}
            </h3>
            <p className="text-[color:var(--muted-foreground)] text-base">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
