"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Tag,
  Filter,
  Rocket,
  ChevronRight,
  Search,
  Check,
  ChevronDown,
} from "lucide-react";
import { SourceRule, SourceRuleCondition } from "@/types/lead-source";
import { LeadStatus } from "@/types/lead";
import { Campaign } from "@/types/campaign";
import { cn } from "@/lib/utils";

const LEAD_STATUSES: {
  value: LeadStatus;
  label: string;
  activeClass: string;
}[] = [
  {
    value: LeadStatus.HOT,
    label: "Hot 🔥",
    activeClass: "bg-rose-50 text-rose-600 border-rose-200",
  },
  {
    value: LeadStatus.WARM,
    label: "Warm",
    activeClass: "bg-amber-50 text-amber-600 border-amber-200",
  },
  {
    value: LeadStatus.COLD,
    label: "Cold",
    activeClass: "bg-sky-50 text-sky-600 border-sky-200",
  },
  {
    value: LeadStatus.CONVERTED,
    label: "Converted",
    activeClass: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
];

function makeEmptyRule(): SourceRule {
  return {
    condition: { matchMode: "AND", tags: [], leadStatus: undefined },
    action: { campaignIds: [] },
  };
}

// ── Portal Campaign Selector ─────────────────────────────────────────────────

interface CampaignSelectorProps {
  selectedIds: string[];
  campaigns: Campaign[];
  isLoading?: boolean;
  onToggle: (id: string) => void;
}

function CampaignSelector({
  selectedIds,
  campaigns,
  isLoading,
  onToggle,
}: CampaignSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatePos = () => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.left, width: r.width });
    }
  };

  const handleOpen = () => {
    updatePos();
    setOpen((v) => !v);
    setSearch("");
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      )
        return;
      setOpen(false);
    };
    const onScroll = () => updatePos();
    document.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  const filtered = campaigns.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );
  const selected = campaigns.filter((c) => selectedIds.includes(c.id));

  return (
    <div className="space-y-2">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-primary text-white rounded-xl text-xs font-bold shadow-sm"
            >
              <Rocket className="w-3 h-3 shrink-0" />
              {c.name}
              <button
                type="button"
                onClick={() => onToggle(c.id)}
                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-white/25 transition-colors font-black text-sm leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        disabled={isLoading}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium",
          open
            ? "border-primary bg-primary/5 text-primary"
            : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50",
          isLoading && "opacity-50 cursor-wait",
        )}
      >
        <div className="flex items-center gap-2.5">
          <Rocket
            className={cn(
              "w-4 h-4 shrink-0",
              open ? "text-primary" : "text-slate-400",
            )}
          />
          <span>
            {isLoading
              ? "Loading campaigns…"
              : selected.length === 0
                ? "Choose campaigns to enroll leads into"
                : `${selected.length} campaign${selected.length !== 1 ? "s" : ""} selected`}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 shrink-0 transition-transform text-slate-400",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Portal dropdown */}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: pos.width,
              zIndex: 9999,
            }}
            className="bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search */}
            <div className="p-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search campaigns…"
                  className="flex-1 text-sm bg-transparent focus:outline-none text-slate-700 placeholder:text-slate-400"
                  autoFocus
                />
              </div>
            </div>

            {/* Campaign list */}
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-center text-sm text-slate-400 font-medium py-5">
                  {search ? "No campaigns match" : "No campaigns available"}
                </p>
              ) : (
                filtered.map((c) => {
                  const isSel = selectedIds.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onToggle(c.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                        isSel ? "bg-primary/5" : "hover:bg-slate-50",
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                          isSel
                            ? "bg-primary border-primary"
                            : "border-slate-300",
                        )}
                      >
                        {isSel && (
                          <Check
                            className="w-3 h-3 text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm font-semibold truncate",
                            isSel ? "text-primary" : "text-slate-800",
                          )}
                        >
                          {c.name}
                        </p>
                        {c.description && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {c.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={cn(
                          "shrink-0 text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                          c.status === "active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400",
                        )}
                      >
                        {c.status}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {selected.length > 0 && (
              <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-600">
                  {selected.length} campaign{selected.length !== 1 ? "s" : ""}{" "}
                  will receive matching leads
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-xs font-black text-primary hover:text-primary/70 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}

// ── Rules Builder ────────────────────────────────────────────────────────────

interface RulesBuilderProps {
  rules: SourceRule[];
  onChange: (rules: SourceRule[]) => void;
  campaigns: Campaign[];
  isLoadingCampaigns?: boolean;
}

export function RulesBuilder({
  rules,
  onChange,
  campaigns,
  isLoadingCampaigns,
}: RulesBuilderProps) {
  const update = (i: number, r: SourceRule) => {
    const next = [...rules];
    next[i] = r;
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {rules.map((rule, i) => (
        <RuleRow
          key={i}
          rule={rule}
          index={i}
          campaigns={campaigns}
          isLoadingCampaigns={isLoadingCampaigns}
          onChange={(r) => update(i, r)}
          onRemove={() => onChange(rules.filter((_, idx) => idx !== i))}
          canRemove={rules.length > 1}
        />
      ))}

      <button
        type="button"
        onClick={() => onChange([...rules, makeEmptyRule()])}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-slate-200 text-sm font-bold text-slate-400 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
      >
        <Plus className="w-4 h-4" />
        Add Another Rule
      </button>
    </div>
  );
}

// ── Rule Row ─────────────────────────────────────────────────────────────────

interface RuleRowProps {
  rule: SourceRule;
  index: number;
  campaigns: Campaign[];
  isLoadingCampaigns?: boolean;
  onChange: (rule: SourceRule) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function RuleRow({
  rule,
  index,
  campaigns,
  isLoadingCampaigns,
  onChange,
  onRemove,
  canRemove,
}: RuleRowProps) {
  const [tagInput, setTagInput] = useState("");

  const setCondition = (patch: Partial<SourceRuleCondition>) =>
    onChange({ ...rule, condition: { ...rule.condition, ...patch } });

  const addTag = () => {
    const val = tagInput.trim().toLowerCase();
    if (!val) return;
    const tags = rule.condition.tags || [];
    if (!tags.includes(val)) setCondition({ tags: [...tags, val] });
    setTagInput("");
  };

  const removeTag = (t: string) =>
    setCondition({ tags: (rule.condition.tags || []).filter((x) => x !== t) });

  const toggleCampaign = (id: string) => {
    const ids = rule.action.campaignIds;
    onChange({
      ...rule,
      action: {
        campaignIds: ids.includes(id)
          ? ids.filter((x) => x !== id)
          : [...ids, id],
      },
    });
  };

  return (
    <div className="border-2 border-slate-200 rounded-2xl overflow-hidden">
      {/* Row header */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b-2 border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-[10px] font-black text-primary">
              {index + 1}
            </span>
          </div>
          <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
            Rule {index + 1}
          </span>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        )}
      </div>

      <div className="p-5 space-y-4 bg-white">
        {/* ── When (Condition) ── */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            When a lead matches…
          </div>

          {/* Tags condition */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 min-h-[44px] bg-white border-2 border-slate-200 rounded-xl px-3 py-2">
              <span className="text-xs font-black text-slate-500 uppercase">
                If
              </span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                Tags
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase">
                contains
              </span>
              {(rule.condition.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-secondary/10 text-secondary rounded-xl text-xs font-bold border border-secondary/20"
                >
                  <Tag className="w-3 h-3 shrink-0" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-rose-500 transition-colors w-4 h-4 flex items-center justify-center rounded hover:bg-rose-50 font-black text-sm leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
              {(rule.condition.tags || []).length === 0 && (
                <span className="text-xs text-slate-400 italic">any tag</span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Type a tag name and press Enter…"
                className="flex-1 h-10 px-4 text-sm bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={addTag}
                className="h-10 px-4 text-xs font-black text-primary bg-primary/5 border-2 border-primary/20 rounded-xl hover:bg-primary/10 hover:border-primary/30 transition-all uppercase tracking-wide shrink-0"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* AND / OR toggle */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <div className="flex p-1 bg-slate-200 rounded-xl text-xs font-black gap-0.5">
              {(["AND", "OR"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setCondition({ matchMode: mode })}
                  className={cn(
                    "px-4 py-1.5 rounded-lg transition-all font-black text-xs",
                    rule.condition.matchMode === mode
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-500 hover:text-slate-700",
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Lead Status condition */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 min-h-[44px] bg-white border-2 border-slate-200 rounded-xl px-3 py-2">
              <span className="text-xs font-black text-slate-500 uppercase">
                If
              </span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                Lead Status
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase">
                is
              </span>
              {rule.condition.leadStatus ? (
                <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-xl text-xs font-bold border border-primary/20 capitalize">
                  {rule.condition.leadStatus}
                </span>
              ) : (
                <span className="text-xs text-slate-400 italic">
                  any status
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {LEAD_STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() =>
                    setCondition({
                      leadStatus:
                        rule.condition.leadStatus === s.value
                          ? undefined
                          : s.value,
                    })
                  }
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all",
                    rule.condition.leadStatus === s.value
                      ? s.activeClass
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Then (Action) ── */}
        <div className="bg-primary/5 border-2 border-primary/15 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-wider">
            <Rocket className="w-3.5 h-3.5" />
            Then — Enroll in Campaign
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <CampaignSelector
            selectedIds={rule.action.campaignIds}
            campaigns={campaigns}
            isLoading={isLoadingCampaigns}
            onToggle={toggleCampaign}
          />
        </div>
      </div>
    </div>
  );
}
