import { ThreadDetailRoute } from "@/components/dashboard/messages/ThreadDetailRoute";

interface Props {
  params: Promise<{ outreachId: string }>;
}

export default async function MessagesThreadPage({ params }: Props) {
  const { outreachId } = await params;
  return <ThreadDetailRoute outreachId={outreachId} />;
}
