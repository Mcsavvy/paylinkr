import Image from "next/image";
import { motion } from "framer-motion";
import { Code2, ShoppingCart } from "lucide-react";

const wallets = [
  {
    name: "Xverse",
    logo: "/xverse.svg",
  },
  {
    name: "Leather",
    logo: "/leather.svg",
  },
  {
    name: "Asigna",
    logo: "/asigna.svg",
  },
  {
    name: "Fordefi",
    logo: "/fordefi.svg",
  },
];

const plugins = [
  { name: "Shopify", logo: "/shopify.svg" },
  { name: "WooCommerce", logo: "/woocommerce.svg" },
  { name: "Custom API", logo: "/api.svg" },
];

const POST_API = `
POST /api/paytags
{
  amount: "0.01 sBTC",
  recipient: "paytag.btc.id",
  memo: "Invoice #123"
}`;

export function LandingIntegrationShowcase() {
  return (
    <section className="w-full max-w-6xl mx-auto py-20 px-4 md:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[color:var(--foreground)] mb-2">
          Integration Showcase
        </h2>
        <p className="text-lg text-[color:var(--muted-foreground)] max-w-2xl mx-auto">
          PayLinkr works seamlessly with leading wallets, e-commerce platforms,
          and developer APIs.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Wallets */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="bg-[color:var(--card)] rounded-xl shadow-lg p-8 flex flex-col items-center text-center border border-[color:var(--border)]"
        >
          <h3 className="text-xl font-semibold mb-4 text-[color:var(--foreground)]">
            Compatible Wallets
          </h3>
          <div className="flex gap-6 items-center justify-center">
            {wallets.map((w) => (
              <div key={w.name} className="flex flex-col items-center">
                <Image
                  src={w.logo}
                  alt={w.name}
                  width={48}
                  height={48}
                  className="rounded-lg mb-2"
                />
                <span className="text-sm text-[color:var(--muted-foreground)]">
                  {w.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
        {/* Plugins */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          className="bg-[color:var(--card)] rounded-xl shadow-lg p-8 flex flex-col items-center text-center border border-[color:var(--border)]"
        >
          <h3 className="text-xl font-semibold mb-4 text-[color:var(--foreground)]">
            E-commerce Plugins
          </h3>
          <div className="flex gap-6 items-center justify-center">
            {plugins.map((p) => (
              <div key={p.name} className="flex flex-col items-center">
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={48}
                  height={48}
                  className="rounded-lg mb-2"
                />
                <span className="text-sm text-[color:var(--muted-foreground)]">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
        {/* API Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="bg-[color:var(--card)] rounded-xl shadow-lg p-8 flex flex-col items-center text-center border border-[color:var(--border)]"
        >
          <h3 className="text-xl font-semibold mb-4 text-[color:var(--foreground)]">
            API Capabilities
          </h3>
          <Code2 className="w-8 h-8 text-[color:var(--primary)] mb-2" />
          <pre className="bg-[color:var(--muted)] rounded p-3 text-xs text-left mt-2 w-full overflow-x-auto text-[color:var(--muted-foreground)]">
            {POST_API}
          </pre>
        </motion.div>
      </div>
    </section>
  );
}
