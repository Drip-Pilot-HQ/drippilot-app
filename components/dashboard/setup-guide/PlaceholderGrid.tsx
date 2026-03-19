const PLACEHOLDERS = [
  { token: "{{ lead.firstName }}", desc: "First name" },
  { token: "{{ lead.lastName }}", desc: "Last name" },
  { token: "{{ lead.email }}", desc: "Email address" },
  { token: "{{ lead.phone }}", desc: "Phone number" },
  { token: "{{ lead.company }}", desc: "Company name" },
];

export function PlaceholderGrid() {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-5">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
        Available Placeholders
      </p>
      <div className="flex flex-wrap gap-2">
        {PLACEHOLDERS.map((p) => (
          <div
            key={p.token}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-secondary/20 rounded-lg"
          >
            <code className="text-xs font-mono font-semibold text-secondary">
              {p.token}
            </code>
            <span className="text-[10px] font-bold text-slate-400">
              — {p.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
