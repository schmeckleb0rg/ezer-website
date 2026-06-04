"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#mission", label: "Mission" },
  { href: "#technology", label: "Technology" },
  { href: "#products", label: "Products" },
  { href: "#team", label: "Team" },
];

const LIGHT_SECTIONS = ["mission", "products", "team"];
const NAV_HEIGHT = 96;
const SCROLL_OFFSET = NAV_HEIGHT + 1;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const check = () => {
      const onLight = LIGHT_SECTIONS.some((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const { top, bottom } = el.getBoundingClientRect();
        return top < NAV_HEIGHT && bottom > 0;
      });
      setIsLight(onLight);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("mobile-menu-open");
    } else {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("mobile-menu-open");
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("mobile-menu-open");
    };
  }, [open]);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleDesktopClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollTo(href);
  };

  const handleMobileClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollTo(href), 50);
  };


  return (
    <>
      {/* ── Nav bar ─────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-24 items-center justify-between">
            {/* Logo — filter adapts to background and menu state */}
            <Link href="/" className="flex items-center">
              <img
                src="/logo.svg"
                alt="Ezer Enterprises"
                className="h-24 w-auto object-contain object-center"
                style={{ transform: "translateY(10%)" }}
              />
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleDesktopClick(e, link.href)}
                  className={`font-heading text-[13px] font-medium tracking-wide uppercase transition-colors duration-300 ${
                    isLight
                      ? "text-brand-dark hover:text-brand-primary"
                      : "text-brand-bg/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleDesktopClick(e, "#contact")}
                className="rounded-full bg-brand-secondary px-7 py-2.5 text-[13px] font-heading font-semibold text-white hover:bg-brand-primary transition-colors tracking-wide"
              >
                Partner With Us
              </a>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              className={`md:hidden p-2 -mr-2 transition-colors duration-300 ${
                isLight && !open ? "text-brand-dark" : "text-white"
              }`}
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Feather fade — hidden when menu is open */}
        {!open && (
          <div
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: `${NAV_HEIGHT}px`,
              height: "80px",
              background:
                "linear-gradient(to bottom, rgba(30,76,73,0.45) 0%, rgba(30,76,73,0.15) 45%, transparent 100%)",
            }}
          />
        )}
      </nav>

      {/* ── Mobile menu drawer + overlay ────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Invisible click-outside overlay */}
            <motion.div
              key="overlay"
              className="fixed inset-0 z-40 md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Drawer — clips open downward from the nav bar bottom */}
            <motion.div
              key="panel"
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              exit={{ clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="fixed left-0 right-0 z-50 md:hidden border-b border-white/10 overflow-hidden"
              style={{
                top: `${NAV_HEIGHT}px`,
                background: "rgba(10, 32, 30, 0.97)",
              }}
            >
              <div className="px-6 pt-5 pb-8 flex flex-col">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleMobileClick(e, link.href)}
                    className="flex items-center justify-between py-4 border-b border-white/10 font-heading text-[17px] font-medium text-white/80 hover:text-white transition-colors group"
                  >
                    <span>{link.label}</span>
                    <span className="text-white/25 group-hover:text-brand-secondary transition-colors text-lg leading-none">
                      ›
                    </span>
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={(e) => handleMobileClick(e, "#contact")}
                  className="mt-7 rounded-full bg-brand-secondary px-6 py-3.5 font-heading font-semibold text-white text-center hover:bg-brand-primary transition-colors tracking-wide"
                >
                  Partner With Us
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
