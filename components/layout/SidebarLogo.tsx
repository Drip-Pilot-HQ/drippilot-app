import Image from "next/image";
import { cn } from "@/lib/utils";

interface SidebarLogoProps {
  collapsed?: boolean;
}

export function SidebarLogo({ collapsed }: SidebarLogoProps) {
  return (
    <div className={cn("flex items-center shrink-0", collapsed && "justify-center")}>
      <Image
        src="/assets/logo-icon.png"
        alt="Drip Pilot"
        width={collapsed ? 34 : 38}
        height={collapsed ? 34 : 38}
        className="object-contain transition-all duration-300"
      />
    </div>
  );
}
