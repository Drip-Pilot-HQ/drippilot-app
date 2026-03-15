import { PanelLeftOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="lg:hidden flex items-center justify-between h-14 px-4 bg-white border-b border-slate-100 sticky top-0 z-40">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        aria-label="Open navigation"
      >
        <PanelLeftOpen className="w-5 h-5" />
      </button>
      <Link href="/">
        <Image
          src="/assets/logo-icon.png"
          alt="Drip Pilot"
          width={32}
          height={32}
          className="object-contain"
        />
      </Link>
    </header>
  );
}
