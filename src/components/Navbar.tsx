"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#technology", label: "Technology" },
  { href: "#products", label: "Products" },
  { href: "#mission", label: "Mission" },
  { href: "#team", label: "Team" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center py-2">
            <img
              src="/logo.svg"
              alt="Ezer Enterprises"
              className="h-16 w-auto object-contain object-center"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-heading text-[13px] font-medium text-brand-bg/70 hover:text-white transition-colors tracking-wide uppercase"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="rounded-full bg-brand-secondary px-7 py-2.5 text-[13px] font-heading font-semibold text-white hover:bg-brand-primary transition-colors tracking-wide"
            >
              Partner With Us
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden glass border-t border-white/10">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-heading text-base font-medium text-brand-bg/80 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="rounded-full bg-brand-secondary px-6 py-2.5 text-sm font-heading font-semibold text-white text-center hover:bg-brand-primary transition-colors"
            >
              Partner With Us
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
