import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SidebarLogoProps {
  collapsed?: boolean;
}

export function SidebarLogo({ collapsed }: SidebarLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center shrink-0",
        collapsed && "justify-center",
      )}
    >
      <Image
        src="/assets/logo-dark.png"
        alt="Drip Pilot"
        width={68}
        height={68}
        className="object-contain transition-all duration-300"
      />
    </Link>
  );
}
