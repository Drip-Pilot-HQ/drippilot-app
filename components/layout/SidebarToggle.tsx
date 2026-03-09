import { PanelLeftClose } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarToggleProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export function SidebarToggle({ isOpen, onClick, className }: SidebarToggleProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-150 shrink-0",
        className,
      )}
      aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
    >
      <PanelLeftClose
        className={cn(
          "w-4 h-4 transition-transform duration-300",
          !isOpen && "rotate-180",
        )}
      />
    </button>
  );
}
