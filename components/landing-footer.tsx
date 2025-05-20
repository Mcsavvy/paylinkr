import { Github } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="w-full container mx-auto py-8 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-800 mt-16">
      <div>
        &copy; {new Date().getFullYear()} PayLinkr. All rights reserved.
      </div>
      <ul className="flex gap-6 items-center">
        <li>
          <a href="#" className="hover:text-indigo-500 transition-colors">
            Privacy
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-indigo-500 transition-colors">
            Terms
          </a>
        </li>
        <li>
          <a
            href="https://github.com/paylinkr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-indigo-500 transition-colors"
          >
            <Github className="w-4 h-4" /> GitHub
          </a>
        </li>
      </ul>
    </footer>
  );
}
