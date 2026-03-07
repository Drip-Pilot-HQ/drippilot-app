"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/branding/Container";
import { PRIVACY_SECTIONS } from "@/constants/privacyData";
import { Lightbulb, ShieldCheck, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export const PrivacyContent = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section that covers the observer center
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        threshold: 0,
        rootMargin: "-20% 0px -70% 0px", // Detects when section hits the upper middle
      },
    );

    PRIVACY_SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="flex flex-col lg:flex-row gap-16 relative">
          {/* Sticky Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-32">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 px-4">
                Contents
              </h4>
              <nav className="space-y-1 border-l-2 border-slate-100">
                {PRIVACY_SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={cn(
                      "block px-5 py-2.5 text-sm font-semibold transition-all duration-200 border-l-2 -ml-[2px]",
                      activeSection === section.id
                        ? "text-primary border-primary bg-primary/5"
                        : "text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-50",
                    )}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="grow max-w-4xl">
            {PRIVACY_SECTIONS.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="mb-24 scroll-mt-32"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 font-serif tracking-tight border-b border-slate-100 pb-6">
                  {section.title}
                </h2>

                {/* Main Content Text */}
                {Array.isArray(section.content) ? (
                  section.content.map((p, i) => (
                    <p
                      key={i}
                      className="text-lg text-slate-600 leading-relaxed mb-6 font-medium"
                    >
                      {p}
                    </p>
                  ))
                ) : (
                  <p className="text-lg text-slate-600 leading-relaxed mb-6 font-medium">
                    {section.content}
                  </p>
                )}

                {/* Subsections */}
                {section.subsections?.map((sub, i) => (
                  <div key={i} className="mt-10 mb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">
                      {sub.title}
                    </h3>
                    <ul className="space-y-4">
                      {sub.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-4">
                          <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span className="text-lg text-slate-600 leading-relaxed font-medium">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Callout Box */}
                {section.callout && (
                  <div className="mt-10 p-8 rounded-2xl bg-secondary/5 border border-secondary/10 flex gap-6 items-start">
                    <div className="p-3 rounded-xl bg-white shadow-sm border border-secondary/20">
                      {section.callout.icon === "Lightbulb" ? (
                        <Lightbulb className="w-6 h-6 text-secondary" />
                      ) : (
                        <ShieldCheck className="w-6 h-6 text-secondary" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-secondary uppercase tracking-widest mb-2 font-sans">
                        {section.callout.title}
                      </h4>
                      <p className="text-slate-600 leading-relaxed font-medium">
                        {section.callout.text}
                      </p>
                    </div>
                  </div>
                )}

                {/* Special handling for Contact Us section footer */}
                {section.id === "contact" && (
                  <div className="grid gap-6 mt-10">
                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 grid md:grid-cols-2 gap-8">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                          <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Email Us
                          </p>
                          <a
                            href="mailto:support@drippilot.com"
                            className="text-lg font-bold text-slate-900 hover:text-primary transition-colors"
                          >
                            support@drippilot.com
                          </a>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Our Office
                          </p>
                          <p className="text-lg font-bold text-slate-900 leading-tight">
                            100 Innovation Drive, Suite 400, <br /> San
                            Francisco, CA 94105
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
