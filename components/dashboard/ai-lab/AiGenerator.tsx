"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, Mail, MessageSquare, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/branding/Button";
import { CustomSelect } from "@/components/common/CustomSelect";
import { TimeSelector } from "@/components/dashboard/campaigns/detail/steps/TimeSelector";
import {
  TimezoneSelector,
  getBrowserTimezone,
} from "@/components/dashboard/campaigns/detail/steps/TimezoneSelector";
import {
  useEmailAliasesQuery,
  usePhoneNumbersQuery,
} from "@/store/server/assets.queries";
import { useGenerateAiCampaignMutation } from "@/store/server/ai-campaign.queries";
import { CampaignChannel } from "@/types/ai-campaign";
import { formatNumber } from "@/lib/utils/format-number";

interface AiGeneratorProps {
  onJobStarted: (jobId: string) => void;
}

const SUGGESTED_PROMPTS = [
  "Nurture sequence for SaaS free trial users",
  "Win-back campaign for churned customers",
  "Welcome series for newsletter subscribers",
  "Cold outreach for enterprise IT directors",
];

export function AiGenerator({ onJobStarted }: AiGeneratorProps) {
  const [useCase, setUseCase] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<CampaignChannel>(
    CampaignChannel.EMAIL,
  );
  const [emailAliasId, setEmailAliasId] = useState("");
  const [phoneAliasId, setPhoneAliasId] = useState("");
  const [sendWindowStart, setSendWindowStart] = useState("");
  const [sendWindowEnd, setSendWindowEnd] = useState("");
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    setTimezone(getBrowserTimezone());
  }, []);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: emailAliases, isLoading: isLoadingEmail } =
    useEmailAliasesQuery();
  const { data: phoneNumbers, isLoading: isLoadingPhone } =
    usePhoneNumbersQuery();

  const generateMutation = useGenerateAiCampaignMutation();

  const isConfigValid =
    name.trim().length > 0 &&
    ((channel === CampaignChannel.EMAIL && !!emailAliasId) ||
      (channel === CampaignChannel.SMS && !!phoneAliasId) ||
      (channel === CampaignChannel.BOTH && !!emailAliasId && !!phoneAliasId));

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 250)}px`;
    }
  }, [useCase]);

  const handleSubmit = async () => {
    if (useCase.length < 10) {
      toast.error("Prompt must be at least 10 characters long.");
      return;
    }
    if (!isConfigValid) {
      toast.error("Please complete all required configuration settings.");
      setShowConfig(true);
      return;
    }

    try {
      const result = await generateMutation.mutateAsync({
        useCase,
        name,
        campaignChannel: channel,
        emailAliasId: emailAliasId || undefined,
        phoneAliasId: phoneAliasId || undefined,
        sendWindowStart: sendWindowStart || undefined,
        sendWindowEnd: sendWindowEnd || undefined,
        timezone: timezone || undefined,
      });
      toast.success("AI Campaign generation started!");
      onJobStarted(result.jobId);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to start generation",
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      {/* Central Magic Input Box */}
      <div
        className={cn(
          "w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-3 transition-all duration-300 relative",
          generateMutation.isPending &&
            "opacity-70 pointer-events-none ring-2 ring-indigo-500/50 ring-offset-2",
        )}
      >
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-10 -z-10 pointer-events-none" />

        <div className="flex flex-col">
          <textarea
            ref={textareaRef}
            value={useCase}
            onChange={(e) => setUseCase(e.target.value.slice(0, 1000))}
            onKeyDown={handleKeyDown}
            maxLength={1000}
            placeholder="e.g. Generate a 7-day drip sequence for cold B2B SaaS leads targeting CTOs. Focus on time-saving benefits..."
            className="w-full min-h-[100px] bg-transparent text-slate-800 placeholder:text-slate-400 p-4 text-md md:text-md !border-0 !ring-0 !outline-none focus:!border-0 focus:!ring-0 focus:!outline-none focus-visible:!ring-0 focus-visible:!outline-none overflow-y-auto scrollbar-thin shadow-none"
            style={{ boxShadow: "none" }}
            disabled={generateMutation.isPending}
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-2 pt-3 border-t border-slate-100 gap-3">
            <div className="flex items-center gap-2 px-2 justify-between sm:justify-start">
              <button
                onClick={() => setShowConfig(!showConfig)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm font-bold transition-colors border",
                  showConfig
                    ? "bg-slate-100 text-slate-900 border-slate-200"
                    : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50",
                )}
              >
                <Settings className="w-4 h-4" />
                <span className="truncate max-w-[120px] sm:max-w-none">
                  {name ? name : "Configuration"}
                </span>
                {(!name || !emailAliasId) && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse ml-1 shrink-0" />
                )}
              </button>

              <div className="flex items-center ml-2 space-x-1">
                {channel === CampaignChannel.EMAIL ||
                channel === CampaignChannel.BOTH ? (
                  <span
                    className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-indigo-50 text-indigo-600 tooltip"
                    title="Email Enabled"
                  >
                    <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </span>
                ) : null}
                {channel === CampaignChannel.SMS ||
                channel === CampaignChannel.BOTH ? (
                  <span
                    className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-50 text-emerald-600 tooltip"
                    title="SMS Enabled"
                  >
                    <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-4 justify-end">
              <span
                className={cn(
                  "text-[10px] md:text-xs font-light uppercase tracking-widest",
                  useCase.length > 950
                    ? "text-red-400"
                    : useCase.length > 800
                      ? "text-amber-400"
                      : "text-slate-300",
                )}
              >
                {useCase.length}/1000
              </span>

              <Button
                onClick={handleSubmit}
                disabled={
                  generateMutation.isPending ||
                  useCase.trim().length < 10 ||
                  useCase.length > 1000 ||
                  !isConfigValid
                }
                isLoading={generateMutation.isPending}
                className={cn(
                  "relative h-10 rounded-full font-light transition-all duration-300 w-full sm:w-auto",
                  useCase.trim().length >= 10 &&
                    useCase.length <= 1000 &&
                    isConfigValid
                    ? "bg-orange-400 hover:bg-orange-500 text-white backdrop-blur-md shadow-[0_8px_25px_rgba(251,146,60,0.35),inset_0_1px_2px_rgba(255,255,255,0.4)] border border-white/20 hover:scale-[1.02]"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200",
                )}
              >
                {!generateMutation.isPending && (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Panel - Slides down if open */}
      <div
        className={cn(
          "w-full bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/20 rounded-3xl p-4 md:p-6 transition-all duration-500",
          showConfig
            ? "opacity-100 max-h-[1200px] translate-y-0 overflow-visible"
            : "opacity-0 max-h-0 -translate-y-4 p-0 border-transparent shadow-none overflow-hidden",
        )}
      >
        <h3 className="text-base md:text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-500" />
          Generation Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              Campaign Name *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Winter Promo Sequence"
              className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-0 focus:border-slate-300 transition-all font-semibold text-slate-900 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              Channels *
            </label>
            <CustomSelect
              value={channel}
              onChange={(val) => setChannel(val as CampaignChannel)}
              options={[
                { value: CampaignChannel.EMAIL, label: "Email Only" },
                { value: CampaignChannel.SMS, label: "SMS Only" },
                {
                  value: CampaignChannel.BOTH,
                  label: "Omnichannel (Email + SMS)",
                },
              ]}
              placeholder="Select Channel"
            />
          </div>

          {(channel === CampaignChannel.EMAIL ||
            channel === CampaignChannel.BOTH) && (
            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex justify-between">
                Email Sender *
                {isLoadingEmail && (
                  <span className="animate-pulse">Loading...</span>
                )}
              </label>
              <CustomSelect
                value={emailAliasId}
                onChange={setEmailAliasId}
                placeholder="Select an Email Asset"
                options={
                  emailAliases?.map((a) => ({
                    value: a.id,
                    label: a.emailAlias,
                  })) || []
                }
                disabled={isLoadingEmail}
              />
            </div>
          )}

          {(channel === CampaignChannel.SMS ||
            channel === CampaignChannel.BOTH) && (
            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex justify-between">
                SMS Sender *
                {isLoadingPhone && (
                  <span className="animate-pulse">Loading...</span>
                )}
              </label>
              <CustomSelect
                value={phoneAliasId}
                onChange={setPhoneAliasId}
                placeholder="Select a Phone Number"
                options={
                  phoneNumbers?.map((p) => ({
                    value: p.id,
                    label: formatNumber(p.phoneNumber) || "",
                  })) || []
                }
                disabled={isLoadingPhone}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex justify-between">
              Send Window Start
            </label>
            <TimeSelector
              value={sendWindowStart}
              onChange={setSendWindowStart}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex justify-between">
              Send Window End
            </label>
            <TimeSelector value={sendWindowEnd} onChange={setSendWindowEnd} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex justify-between">
              Timezone
            </label>
            <TimezoneSelector value={timezone} onChange={setTimezone} />
          </div>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div
        className={cn(
          "w-full transition-all duration-500 delay-100",
          showConfig
            ? "opacity-0 translate-y-4 pointer-events-none"
            : "opacity-100 translate-y-0",
        )}
      >
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 text-center">
          Or try one of these
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setUseCase(prompt)}
              className="px-4 py-2 bg-white/50 hover:bg-white border border-slate-200/60 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 rounded-full text-sm font-medium text-slate-600 transition-all duration-300 hover:-translate-y-0.5"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
