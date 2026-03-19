interface Props {
  emoji: string;
  title: string;
  description: string;
}

export function GuideSectionLabel({ emoji, title, description }: Props) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 text-2xl shrink-0">
        {emoji}
      </div>
      <div>
        <h2 className="text-lg font-black text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-slate-500 font-medium">{description}</p>
      </div>
    </div>
  );
}
