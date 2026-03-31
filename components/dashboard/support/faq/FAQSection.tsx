"use client";

import { useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  Rocket,
  Workflow,
  Users,
  Wallet,
  Webhook,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQArticle } from "./FAQArticle";
import { FAQ_ARTICLES } from "./faq-data";
import type { FAQCategory } from "@/types/support";

const CATEGORIES: { label: FAQCategory; icon: React.ElementType }[] = [
  { label: "Getting Started", icon: Rocket },
  { label: "Campaigns", icon: Workflow },
  { label: "Leads", icon: Users },
  { label: "Billing", icon: Wallet },
  { label: "Integrations", icon: Webhook },
  { label: "Account", icon: Settings },
];

export function FAQSection() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FAQCategory | null>(
    null,
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return FAQ_ARTICLES.filter((a) => {
      const matchesCategory = !activeCategory || a.category === activeCategory;
      const matchesQuery =
        !q ||
        a.question.toLowerCase().includes(q) ||
        a.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search help articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
        <CategoryCard
          label="All"
          icon={BookOpen}
          count={FAQ_ARTICLES.length}
          active={!activeCategory}
          onClick={() => setActiveCategory(null)}
        />
        {CATEGORIES.map(({ label, icon }) => (
          <CategoryCard
            key={label}
            label={label === "Getting Started" ? "Get Started" : label}
            icon={icon}
            count={FAQ_ARTICLES.filter((a) => a.category === label).length}
            active={activeCategory === label}
            onClick={() =>
              setActiveCategory(activeCategory === label ? null : label)
            }
          />
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
          {filtered.map((article) => (
            <FAQArticle key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-6 text-center bg-white border border-slate-100 rounded-[28px] shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-5">
            <Search className="w-7 h-7 text-slate-300" />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-1">
            No articles found
          </h3>
          <p className="text-slate-500 font-medium text-sm max-w-xs">
            Try a different search or switch to Live Chat for direct help.
          </p>
        </div>
      )}
    </div>
  );
}

function CategoryCard({
  label,
  icon: Icon,
  count,
  active,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 px-2 py-3 rounded-2xl border text-center transition-all duration-200",
        active
          ? "bg-primary/10 border-primary/20 shadow-sm"
          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50",
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center",
          active ? "bg-primary/15" : "bg-slate-100",
        )}
      >
        <Icon
          className={cn("w-4 h-4", active ? "text-primary" : "text-slate-400")}
        />
      </div>
      <span
        className={cn(
          "text-[10px] font-black leading-tight",
          active ? "text-primary" : "text-slate-600",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-[9px] font-semibold",
          active ? "text-primary/70" : "text-slate-400",
        )}
      >
        {count}
      </span>
    </button>
  );
}
