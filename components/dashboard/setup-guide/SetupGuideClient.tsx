"use client";

import { Workflow, BrainCircuit, Link2 } from "lucide-react";
import { GUIDE_STEPS } from "./guideSteps";
import { KB_GUIDE_STEPS } from "./knowledgeBaseSteps";
import { CRM_GUIDE_STEPS } from "./crmIntegrationSteps";
import { GuidePageHeader } from "./GuidePageHeader";
import { GuideAccordion } from "./GuideAccordion";
import { GuideSectionLabel } from "./GuideSectionLabel";
import { GuideDoneBanner } from "./GuideDoneBanner";
import { MoreGuidesSection } from "./MoreGuidesSection";

export function SetupGuideClient() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <GuidePageHeader />

      <div className="space-y-4">
        <GuideSectionLabel
          emoji="🚀"
          title="Launch Your First Campaign"
          description="Set up aliases, templates, and your first automated outreach sequence."
        />
        <GuideAccordion steps={GUIDE_STEPS} defaultOpen={1} />
        <GuideDoneBanner
          emoji="🎉"
          title="You're all set!"
          description="Once you enroll leads your campaign starts automatically. Sit back and watch the replies roll in."
          linkHref="/dashboard/campaigns"
          linkLabel="Create My First Campaign"
          Icon={Workflow}
        />
      </div>

      <div className="border-t border-slate-100" />

      <div className="space-y-4">
        <GuideSectionLabel
          emoji="🧠"
          title="Set Up Your AI & Knowledge Base"
          description="Train your AI with business knowledge and let it reply to leads automatically."
        />
        <GuideAccordion steps={KB_GUIDE_STEPS} defaultOpen={0} />
        <GuideDoneBanner
          emoji="🤖"
          title="Your AI is ready!"
          description="Drip Pilot will now respond to leads using your business knowledge — even if you haven't added any yet."
          linkHref="/dashboard/knowledge-base"
          linkLabel="Open Knowledge Base"
          Icon={BrainCircuit}
        />
      </div>

      <div className="border-t border-slate-100" />

      <div className="space-y-4">
        <GuideSectionLabel
          emoji="🔗"
          title="Connect Your CRM & Route Leads"
          description="Push leads from HubSpot (or any CRM) into Drip Pilot via Make.com and auto-enroll them into campaigns using routing rules."
        />
        <GuideAccordion steps={CRM_GUIDE_STEPS} defaultOpen={0} />
        <GuideDoneBanner
          emoji="🎊"
          title="Your CRM pipeline is live!"
          description="Leads from your CRM now flow into Drip Pilot automatically and get routed into the right campaigns without any manual work."
          linkHref="/dashboard/integrations"
          linkLabel="Open Integrations"
          Icon={Link2}
        />
      </div>

      <MoreGuidesSection />
    </div>
  );
}
