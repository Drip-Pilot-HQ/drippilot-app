import { MessagesClient } from "@/components/dashboard/messages/MessagesClient";

interface Props {
  params: Promise<{ outreachId: string }>;
}

export default async function MessagesThreadPage({ params }: Props) {
  const { outreachId } = await params;
  return <MessagesClient initialOutreachId={outreachId} />;
}
