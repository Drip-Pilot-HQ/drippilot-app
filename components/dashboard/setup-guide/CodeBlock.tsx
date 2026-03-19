interface Props {
  code: string;
}

export function CodeBlock({ code }: Props) {
  return (
    <div className="mb-5 rounded-xl overflow-hidden border border-slate-200">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          JSON Payload
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
        </div>
      </div>
      <pre className="bg-slate-900 px-5 py-4 text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto custom-scrollbar">
        {code}
      </pre>
    </div>
  );
}
