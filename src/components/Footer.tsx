import Link from "next/link";

export default function Footer() {
  return (
    <footer className="gradient-dark text-white/70">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <img src="/logo.svg" alt="Ezer Enterprises" className="h-12 w-auto object-contain object-center mb-6" />
            <p className="font-body text-sm leading-relaxed max-w-sm text-white/40">
              To create wearable systems that deliver life saving medications in
              life threatening situations.
            </p>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-3" />

          {/* Products */}
          <div className="md:col-span-2">
            <h4 className="font-heading font-semibold text-white/60 text-xs uppercase tracking-[0.15em] mb-5">
              Products
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products/ezerguard-od"
                  className="text-sm text-white/40 hover:text-brand-secondary transition-colors"
                >
                  EzerGuard-OD
                </Link>
              </li>
              <li>
                <Link
                  href="/products/ezerguard-military"
                  className="text-sm text-white/40 hover:text-brand-secondary transition-colors"
                >
                  EzerGuard-Military
                </Link>
              </li>
              <li>
                <Link
                  href="/products/ezerguard-cd"
                  className="text-sm text-white/40 hover:text-brand-secondary transition-colors"
                >
                  EzerGuard-CD
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h4 className="font-heading font-semibold text-white/60 text-xs uppercase tracking-[0.15em] mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#mission" className="text-sm text-white/40 hover:text-brand-secondary transition-colors">
                  Our Mission
                </a>
              </li>
              <li>
                <a href="#technology" className="text-sm text-white/40 hover:text-brand-secondary transition-colors">
                  Technology
                </a>
              </li>
              <li>
                <a href="#team" className="text-sm text-white/40 hover:text-brand-secondary transition-colors">
                  Team
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-white/40 hover:text-brand-secondary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} Ezer Enterprises. All rights reserved.
          </p>
          <p className="text-xs text-white/25">
            Patented Technology &middot; Made in the USA
          </p>
        </div>
      </div>
    </footer>
  );
}
