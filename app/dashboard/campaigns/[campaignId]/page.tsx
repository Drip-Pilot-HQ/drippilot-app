import { CampaignDetailClient } from "@/components/dashboard/campaigns/detail/CampaignDetailClient";

interface Props {
  params: Promise<{ campaignId: string }>;
}

export default async function CampaignDetailPage({ params }: Props) {
  const { campaignId } = await params;
  return <CampaignDetailClient campaignId={campaignId} />;
}
