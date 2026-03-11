import { Metadata } from "next";
import Link from "next/link";
import { Home, LifeBuoy } from "lucide-react";
import { Container } from "@/components/branding/Container";
import { Button } from "@/components/branding/Button";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <Container className="relative z-10 text-center">
        <div className="flex flex-col items-center">
          {/* Animated 404 Illustration */}
          <div className="relative mb-32 group">
            <div className="text-[12rem] md:text-[20rem] font-black leading-none text-slate-100 select-none transition-all duration-700 group-hover:text-slate-200/50">
              404
            </div>
          </div>

          {/* Text Content */}
          <div className="max-w-2xl mx-auto -mt-12 md:-mt-20">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-serif tracking-tight">
              Oops! You&apos;ve drifted <br />
              <span className="text-gradient">off-course</span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed font-light">
              The page you&apos;re looking for has either been moved, deleted,
              or never existed in this dimension. Don&apos;t worry, we&apos;ll
              help you get back to mission control.
            </p>

            {/* Navigation Options */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="primary"
                size="md"
                className="rounded-full shadow-2xl shadow-primary/20"
              >
                <Link href="https://drippilot.com" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Back to Drippilot
                </Link>
              </Button>
              <Button
                variant="outline"
                size="md"
                className="rounded-full group"
              >
                <Link
                  href="mailto:support@drippilot.com"
                  className="flex items-center gap-2"
                >
                  <LifeBuoy className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  Get Support
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Links */}
        <div className="mt-20 flex items-center justify-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-10">
          <Link
            href="/privacy-policy"
            className="hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="w-1 h-1 bg-slate-200 rounded-full" />
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </div>
      </Container>
    </main>
  );
}
