import { Mail, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-6 border-t bg-blue-950 backdrop-blur-sm backdrop-saturate-150 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-white">
            © {new Date().getFullYear()} Aviroop. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="https://www.linkedin.com/in/avirooppaul/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
            >
              <Linkedin size={20} />
            </Link>
            <Link
              href="mailto:apaviroopppaul10@gmail.com"
              className="text-white hover:text-gray-300"
            >
              <Mail size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
