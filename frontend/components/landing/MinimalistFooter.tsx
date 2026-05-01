import Link from "next/link";
import { FiTwitter, FiGithub, FiLinkedin } from "react-icons/fi";

export default function MinimalistFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#030712] pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-8">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-[#227dff]" />
              <span className="text-xl font-bold text-white tracking-tight">EchoHire</span>
            </Link>
            <p className="text-[#7f92be] max-w-sm leading-relaxed">
              The AI-native technical interviewing platform designed to scale your engineering team with precision and unbiased insights.
            </p>
            
            <form className="max-w-md mt-6" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="newsletter" className="sr-only">Subscribe to newsletter</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  id="newsletter"
                  placeholder="Enter your email"
                  required
                  className="min-h-[44px] w-full rounded-xl border border-white/10 bg-[#070d1a] px-4 py-2 text-white placeholder-[#5c667f] transition-colors focus:border-[#227dff] focus:outline-none focus:ring-1 focus:ring-[#227dff]"
                />
                <button
                  type="submit"
                  className="min-h-[44px] shrink-0 rounded-xl bg-[#227dff] px-6 py-2 font-medium text-white transition-colors hover:bg-[#1a68d4] focus:outline-none focus:ring-2 focus:ring-[#227dff] focus:ring-offset-2 focus:ring-offset-[#030712] flex items-center justify-center gap-2"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            <div>
              <h3 className="mb-6 text-sm font-semibold text-white tracking-wider uppercase">Product</h3>
              <ul className="space-y-4">
                {["Features", "Interviews", "Pricing", "Enterprise", "Security"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-[#7f92be] transition-colors hover:text-[#dbe7ff]">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-6 text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
              <ul className="space-y-4">
                {["About", "Customers", "Careers", "Blog", "Contact"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-[#7f92be] transition-colors hover:text-[#dbe7ff]">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-6 text-sm font-semibold text-white tracking-wider uppercase">Legal</h3>
              <ul className="space-y-4">
                {["Terms of Service", "Privacy Policy", "Cookie Policy", "Data Processing"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-[#7f92be] transition-colors hover:text-[#dbe7ff]">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center justify-between border-t border-white/5 pt-8 md:flex-row gap-4">
          <p className="text-sm text-[#5c667f]">
            © {new Date().getFullYear()} EchoHire Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[#5c667f]">
            <a href="#" className="hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <FiTwitter className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <FiLinkedin className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <FiGithub className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
