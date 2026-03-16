"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

interface CompletionModalProps {
  onClose: () => void;
}

const PARTICLES = [
  { color: "#fb923c", x: -32, y: -28, size: 5, rot: 20, delay: "0s" },
  { color: "#f472b6", x: 28, y: -34, size: 4, rot: -35, delay: "0.07s" },
  { color: "#22d3ee", x: -8, y: -40, size: 5, rot: 45, delay: "0.04s" },
  { color: "#a78bfa", x: 40, y: -20, size: 4, rot: -15, delay: "0.11s" },
  { color: "#fb923c", x: 18, y: -44, size: 3, rot: 60, delay: "0.15s" },
  { color: "#34d399", x: -40, y: -16, size: 4, rot: -45, delay: "0.06s" },
  { color: "#f472b6", x: -18, y: -46, size: 3, rot: 30, delay: "0.09s" },
  { color: "#22d3ee", x: 44, y: -10, size: 5, rot: -60, delay: "0.13s" },
];

export function CompletionModal({ onClose }: CompletionModalProps) {
  const router = useRouter();

  const handleCta = () => {
    onClose();
    router.push("/dashboard/campaigns");
  };

  return (
    <>
      <style>{`
        @keyframes ob-confetti {
          0%   { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translate(var(--cx), 80px) rotate(480deg) scale(0.4); opacity: 0; }
        }
        @keyframes ob-check-in {
          0%   { transform: scale(0.5); opacity: 0; }
          65%  { transform: scale(1.08); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes ob-complete-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ob-confetti-p {
          position: absolute;
          border-radius: 2px;
          animation: ob-confetti 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        .ob-check-in { animation: ob-check-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both; }
        .ob-complete-in { animation: ob-complete-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-9998 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card */}
        <div className="ob-complete-in relative w-full max-w-[380px] bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Top accent line */}
          <div className="h-[3px] w-full bg-primary" />

          <div className="px-8 pt-8 pb-8 text-center">
            {/* Icon + confetti burst */}
            <div className="relative flex justify-center mb-5">
              <div className="relative">
                {PARTICLES.map((p, i) => (
                  <div
                    key={i}
                    className="ob-confetti-p"
                    style={{
                      backgroundColor: p.color,
                      top: "50%",
                      left: "50%",
                      marginLeft: p.x,
                      marginTop: p.y,
                      width: p.size,
                      height: p.size,
                      animationDelay: p.delay,
                      // @ts-expect-error custom prop
                      "--cx": `${p.x * 1.6}px`,
                    }}
                  />
                ))}

                <div className="ob-check-in w-16 h-16 rounded-full bg-orange-50 border-2 border-primary/20 flex items-center justify-center">
                  <CheckCircle2
                    className="w-8 h-8 text-primary"
                    strokeWidth={2}
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Tour Complete
            </p>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">
              You&apos;re all set!
            </h2>
            <p className="text-slate-500 text-[13.5px] leading-relaxed mb-7">
              You know the terrain. Now let&apos;s put it to work — create your
              first campaign and start converting leads on autopilot.
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleCta}
                className="w-full h-11 rounded-xl bg-primary text-white font-bold text-[14px] hover:bg-orange-600 transition-colors active:scale-[0.98]"
              >
                Create My First Campaign
              </button>
              <button
                onClick={onClose}
                className="w-full h-9 rounded-xl text-slate-400 text-[13px] font-medium hover:text-slate-600 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
