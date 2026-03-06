import React from "react";
import Link from "next/link";
import { Container } from "@/components/branding/Container";

const footerLinks = {
  Product: ["Features", "Pricing", "Integrations", "Templates"],
  Resources: ["Blog", "Help Center", "Sales Guides", "API Docs"],
  Company: ["About Us", "Careers", "Contact", "Privacy & Terms"],
};

export const Footer = () => {
  return (
    <footer className="bg-slate-50 pt-16 pb-8 border-t border-slate-200">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 mb-4"
            >
              <span className="text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
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
            <p className="text-slate-500 text-sm mb-6 max-w-xs">
              Automate your sales outreach and close more deals with the power
              of AI.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                </svg>
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"></path>
                </svg>
              </Link>
            </div>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-slate-900 mb-4">{category}</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 Drip Pilot Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
              Systems Operational
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
