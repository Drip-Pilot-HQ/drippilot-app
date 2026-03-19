const UPCOMING_GUIDES = [
  {
    emoji: "📊",
    title: "Reading Your Analytics",
    desc: "Understand open rates and replies",
  },
  {
    emoji: "👥",
    title: "Managing Your Team",
    desc: "Invite members and set permissions",
  },
];

export function MoreGuidesSection() {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
        More Guides Coming Soon
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {UPCOMING_GUIDES.map((g) => (
          <div
            key={g.title}
            className="flex items-start gap-3 bg-white border border-dashed border-slate-200 rounded-2xl p-4 opacity-50 cursor-not-allowed"
          >
            <span className="text-2xl leading-none shrink-0">{g.emoji}</span>
            <div>
              <p className="text-sm font-black text-slate-900">{g.title}</p>
              <p className="text-[11px] text-slate-500 font-medium">{g.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
