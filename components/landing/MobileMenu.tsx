"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/branding/Button";

interface MobileMenuProps {
  links: { href: string; label: string }[];
}

export const MobileMenu = ({ links }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Prevent scrolling when menu is open
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
  };

  return (
    <div className="lg:hidden">
      {/* Toggle Button */}
      <button
        onClick={toggleMenu}
        className="p-2 text-slate-600 hover:text-slate-900 transition-colors relative z-70"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Full Screen Overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        className={cn(
          "fixed top-0 left-0 w-screen h-screen z-65 bg-slate-950 transition-all duration-500 flex flex-col items-center justify-center p-8",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none",
        )}
      >
        <h2 id="mobile-menu-title" className="sr-only">
          Navigation Menu
        </h2>
        {/* Decorative Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]"></div>

        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>

        <nav className="relative z-10 w-full flex flex-col items-center gap-6 py-10">
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={cn(
                "text-4xl font-bold text-white hover:text-primary transition-all duration-300 transform",
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0",
              )}
              style={{ transitionDelay: `${i * 75 + 100}ms` }}
            >
              {link.label}
            </Link>
          ))}

          <div
            className={cn(
              "w-20 h-1 bg-primary/30 my-6 rounded-full transition-all duration-700 delay-400",
              isOpen ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0",
            )}
          ></div>

          <div
            className={cn(
              "flex flex-col gap-5 w-full max-w-xs transition-all duration-700 delay-500",
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            <Link
              href="/login"
              onClick={closeMenu}
              className="text-center text-xl font-semibold text-slate-400 hover:text-white transition-colors py-2"
            >
              Log in
            </Link>
            <Button
              variant="primary"
              size="xl"
              className="w-full text-lg shadow-2xl shadow-primary/20"
            >
              Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </nav>

        {/* Footer info in menu */}
        <div
          className={cn(
            "absolute bottom-10 left-0 right-0 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest transition-all duration-700 delay-600",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        >
          © 2026 Drip Pilot &middot; Built for conversion.
        </div>
      </div>
    </div>
  );
};
