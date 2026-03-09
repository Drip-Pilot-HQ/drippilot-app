import Link from "next/link";
import { Container } from "@/components/branding/Container";
import { Button } from "@/components/branding/Button";
import { AnnouncementBar } from "./AnnouncementBar";
import { MobileMenu } from "./MobileMenu";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export const Header = () => {
  const navLinks = [
    { href: "/pricing", label: "Pricing" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <div className="fixed top-0 w-full z-50">
      <AnnouncementBar />

      <header className="w-full backdrop-blur-xl transition-all duration-300">
        <Container>
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <Link
                href="/"
                className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2 group"
              >
                <Image
                  src="/assets/logo.png"
                  alt="Drip Pilot Logo"
                  width={100}
                  height={100}
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-5 py-2 text-md font-semibold text-slate-600 hover:text-primary rounded-full hover:bg-primary/5 transition-all duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA & Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link
                href="/auth/login"
                className="text-md font-bold text-slate-600 hover:text-primary transition-colors px-2"
              >
                Log in
              </Link>
              <Link href="/auth/signup">
                <Button
                  variant="primary"
                  size="md"
                  className="shadow-lg shadow-primary/20 hover:shadow-primary/30 group"
                >
                  Join the Beta{" "}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu (Client Component) */}
            <MobileMenu links={navLinks} />
          </div>
        </Container>
      </header>
    </div>
  );
};
