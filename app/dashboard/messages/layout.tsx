import { MessagesShell } from "@/components/dashboard/messages/MessagesShell";

/*
 * The shell (header + thread list) lives in the layout so it persists across
 * thread navigation — only the detail pane (children) changes per route.
 */
export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MessagesShell>{children}</MessagesShell>;
}
