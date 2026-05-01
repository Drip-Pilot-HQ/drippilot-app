"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, Mail, MessageSquare, Sparkles, Info } from "lucide-react";
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
import { INDUSTRY_PROMPTS } from "./ai-prompts";

interface AiGeneratorProps {
  onJobStarted: (jobId: string) => void;
}

export function AiGenerator({ onJobStarted }: AiGeneratorProps) {
  const [useCase, setUseCase] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [templateFolderName, setTemplateFolderName] = useState("");
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
        description: description || undefined,
        templateFolderName: templateFolderName || undefined,
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
          "w-full bg-white/90 backdrop-blur-xl rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-slate-200/80 p-2 sm:p-4 transition-all duration-500 relative group focus-within:shadow-[0_8px_40px_rgb(99,102,241,0.12)] focus-within:border-indigo-300/50",
          generateMutation.isPending &&
            "opacity-70 pointer-events-none ring-2 ring-indigo-500/50 ring-offset-2",
        )}
      >
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-[34px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 -z-10 pointer-events-none" />

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

          <div className="flex items-center justify-between mt-3 pt-4 border-t border-slate-100/80 px-1 sm:px-2">
            {/* Left Side: Config & Channels */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowConfig(!showConfig)}
                className={cn(
                  "relative flex items-center justify-center sm:justify-start gap-2 h-10 w-10 sm:w-auto sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all border shadow-sm hover:shadow",
                  showConfig
                    ? "bg-slate-100 text-slate-900 border-slate-200"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
                )}
                title={name ? name : "Configuration"}
              >
                <Settings className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline truncate max-w-[120px] sm:max-w-none">
                  {name ? name : "Configuration"}
                </span>
                {(!name || !emailAliasId) && (
                  <span className="absolute top-0 right-0 sm:static sm:ml-1 w-2.5 h-2.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 animate-pulse shrink-0 border-2 border-white sm:border-0" />
                )}
              </button>

              <div className="flex items-center space-x-1 sm:ml-2">
                {channel === CampaignChannel.EMAIL ||
                channel === CampaignChannel.BOTH ? (
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 tooltip"
                    title="Email Enabled"
                  >
                    <Mail className="w-4 h-4" />
                  </span>
                ) : null}
                {channel === CampaignChannel.SMS ||
                channel === CampaignChannel.BOTH ? (
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 tooltip"
                    title="SMS Enabled"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </span>
                ) : null}
              </div>
            </div>

            {/* Right Side: Char Count & Generate */}
            <div className="flex items-center gap-2 sm:gap-4">
              <span
                className={cn(
                  "text-[10px] md:text-xs font-medium px-1 sm:px-2",
                  useCase.length > 950
                    ? "text-rose-500"
                    : useCase.length > 800
                      ? "text-amber-500"
                      : "text-slate-400",
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
                  "relative h-10 w-10 sm:w-auto p-0 sm:px-6 rounded-full font-medium transition-all duration-300 shadow-sm flex items-center justify-center shrink-0",
                  useCase.trim().length >= 10 &&
                    useCase.length <= 1000 &&
                    isConfigValid
                    ? "bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white border-0 hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200 hover:translate-y-0 hover:shadow-none",
                )}
                title="Generate Campaign"
              >
                {!generateMutation.isPending && (
                  <>
                    <Sparkles className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Generate</span>
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
          "w-full bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-200/40 rounded-[32px] p-5 sm:p-8 transition-all duration-500",
          showConfig
            ? "opacity-100 max-h-[1200px] translate-y-0 overflow-visible"
            : "opacity-0 max-h-0 -translate-y-8 p-0 border-transparent shadow-none overflow-hidden",
        )}
      >
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Settings className="w-4 h-4 text-orange-500" />
          </div>
          Generation Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 px-1">
              Campaign Name <span className="text-rose-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Winter Promo Sequence"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 px-1 flex items-center gap-2">
              Description{" "}
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                Optional
              </span>
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Generated drip for cold leads"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 px-1 flex items-center gap-2">
              Template Folder{" "}
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                Optional
              </span>
            </label>
            <input
              value={templateFolderName}
              onChange={(e) => setTemplateFolderName(e.target.value)}
              placeholder="e.g. Winter Promo Templates"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 text-sm"
            />
            <p className="text-xs text-slate-500 px-1 leading-relaxed">
              We&apos;ll automatically create this folder or use an existing
              one.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 px-1">
              Channels <span className="text-rose-500">*</span>
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
              <label className="text-sm font-semibold text-slate-700 px-1 flex justify-between items-center">
                <span>
                  Email Sender <span className="text-rose-500">*</span>
                </span>
                {isLoadingEmail && (
                  <span className="animate-pulse text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Loading...
                  </span>
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
              <label className="text-sm font-semibold text-slate-700 px-1 flex justify-between items-center">
                <span>
                  SMS Sender <span className="text-rose-500">*</span>
                </span>
                {isLoadingPhone && (
                  <span className="animate-pulse text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Loading...
                  </span>
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
            <label className="text-sm font-semibold text-slate-700 px-1">
              Send Window Start
            </label>
            <TimeSelector
              value={sendWindowStart}
              onChange={setSendWindowStart}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 px-1">
              Send Window End
            </label>
            <TimeSelector value={sendWindowEnd} onChange={setSendWindowEnd} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 px-1">
              Timezone
            </label>
            <TimezoneSelector value={timezone} onChange={setTimezone} />
          </div>
        </div>
      </div>

      {/* Industry Starter Prompts */}
      <div
        className={cn(
          "w-full transition-all duration-500 delay-100 overflow-hidden",
          showConfig
            ? "opacity-0 translate-y-4 max-h-0 !mt-0 pointer-events-none"
            : "opacity-100 translate-y-0 max-h-[800px]",
        )}
      >
        <p className="text-sm font-semibold text-slate-500 mb-4 text-center">
          Industry Starter Prompts
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {INDUSTRY_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setUseCase(item.prompt)}
              className="px-4 py-2 bg-white/50 hover:bg-white border border-slate-200/60 hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/5 rounded-full text-sm font-medium text-slate-600 transition-all duration-300 hover:-translate-y-0.5"
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Variables Tip Section */}
        <div className="mt-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-5 h-5 text-orange-600" />
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-bold text-orange-900">
                  Quick Info: Variables to Swap
                </h4>
                <p className="text-[12px] text-orange-700 font-medium leading-relaxed mt-1">
                  If you&apos;re using a starter prompt, make sure to replace
                  the bracketed placeholders with your actual details:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                  <p className="text-[11px] text-orange-800 leading-tight">
                    <span className="font-bold">[Agent/Rep Name]</span> — Your
                    name
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                  <p className="text-[11px] text-orange-800 leading-tight">
                    <span className="font-bold">[Company/Agency]</span> — Your
                    company
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                  <p className="text-[11px] text-orange-800 leading-tight">
                    <span className="font-bold">[auto/home/life/health]</span> —
                    Coverage type
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                  <p className="text-[11px] text-orange-800 leading-tight">
                    <span className="font-bold">[plumbing/HVAC/etc]</span> —
                    Select trade
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-orange-100/50">
                <p className="text-[11px] text-orange-700 italic">
                  Tip: Use{" "}
                  <code className="bg-orange-100 px-1 rounded text-orange-900 font-bold not-italic">
                    {"{{ lead.firstName }}"}
                  </code>{" "}
                  to dynamically insert the lead&apos;s name.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
