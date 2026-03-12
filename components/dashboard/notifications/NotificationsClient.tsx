"use client";

import { NotificationPreferencesCard } from "./NotificationPreferencesCard";
import { NotificationFeed } from "./NotificationFeed";

export function NotificationsClient() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Notifications
        </h1>
        <p className="text-slate-500 font-medium mt-1.5">
          Stay on top of lead activity — configure how and when you get notified
        </p>
      </div>

      {/* Two-column on xl, stacked on mobile */}
      <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-5 items-start">
        <NotificationPreferencesCard />
        <NotificationFeed />
      </div>
    </div>
  );
}
