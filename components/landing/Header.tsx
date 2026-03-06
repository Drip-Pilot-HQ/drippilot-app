import React from "react";
import Link from "next/link";
import { Container } from "@/components/branding/Container";
import { Button } from "@/components/branding/Button";

export const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
      <Container>
        <div className="flex justify-between items-center h-20">
          <div className="shrink-0 flex items-center">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2"
            >
              <span className="text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              Drip Pilot
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link
              href="#features"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#solutions"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Solutions
            </Link>
            <Link
              href="#metrics"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Success Data
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="#"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Log in
            </Link>
            <Button variant="primary" size="md">
              Sign up
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
};
