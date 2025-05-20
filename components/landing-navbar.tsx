import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function LandingNavbar() {
  return (
    <nav className="w-full container mx-auto flex items-center justify-between py-6 px-4 md:px-8 relative z-20">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="PayLinkr Logo"
          width={36}
          height={36}
          className="rounded-full"
        />
        <span className="font-heading font-bold text-xl text-[color:var(--foreground)] tracking-tight">
          PayLinkr
        </span>
      </div>
      {/* Nav Links */}
      <ul className="hidden md:flex gap-8 text-[color:var(--muted-foreground)] font-medium text-base">
        <li>
          <a
            href="#about"
            className="hover:text-[color:var(--primary)] transition-colors"
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#features"
            className="hover:text-[color:var(--primary)] transition-colors"
          >
            Features
          </a>
        </li>
        <li>
          <a
            href="#api"
            className="hover:text-[color:var(--primary)] transition-colors"
          >
            API
          </a>
        </li>
        <li>
          <a
            href="#dashboard"
            className="hover:text-[color:var(--primary)] transition-colors"
          >
            Dashboard
          </a>
        </li>
        <li>
          <a
            href="#contact"
            className="hover:text-[color:var(--primary)] transition-colors"
          >
            Contact
          </a>
        </li>
      </ul>
      {/* Contact Button */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="bg-[color:var(--background)] text-[color:var(--foreground)] border border-[color:var(--border)] shadow-sm hover:bg-[color:var(--muted)] dark:hover:bg-[color:var(--muted)] px-4 py-2 rounded-md"
        >
          <Mail className="w-4 h-4 mr-1" /> Contact us
        </Button>
      </div>
    </nav>
  );
}
