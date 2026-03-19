import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface Props {
  emoji: string;
  title: string;
  description: string;
  linkHref: string;
  linkLabel: string;
  Icon: LucideIcon;
}

export function GuideDoneBanner({
  emoji,
  title,
  description,
  linkHref,
  linkLabel,
  Icon,
}: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
      <div className="text-4xl mb-3">{emoji}</div>
      <h2 className="text-xl font-black text-slate-900 mb-2">{title}</h2>
      <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto mb-6">
        {description}
      </p>
      <Link
        href={linkHref}
        className="inline-flex items-center gap-2 rounded-xl h-10 px-6 text-sm font-black text-white bg-primary shadow-md shadow-primary/25 hover:brightness-110 transition-all"
      >
        <Icon className="w-4 h-4" />
        {linkLabel}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
