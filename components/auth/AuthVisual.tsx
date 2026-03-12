"use client";

import Image from "next/image";

interface AuthVisualProps {
  type: "login" | "signup" | "forgot" | "reset";
}

export function AuthVisual({}: AuthVisualProps) {
  const bgImageUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCCn9CIRBkiOpi7kSWHE0LGJjD86dN9D6RQN8MWAA4EMFR8sD0ouKqSG3Z6isgcP8B0s5Hxz2DGlsxx3mkCwV0Ft2HgubGE8eDyduXTItajqhJlr6Ik0_3cYJNSvLOVT17r8_MXnY_NAdym7zkTQ8K0bK5-aSIROoX_cZW4EekzduVyAfQ3jfe6mcYxonoCcYpJpNxj0GvtftqgwY0LxJosFUCsdW4q4c6ETlWUK229Sj5Z3KHUkua7u5MBeS83yl9RMXK7ZkZQacs";

  return (
    <div
      className="hidden lg:flex flex-col items-center justify-center p-12 relative overflow-hidden h-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImageUrl})` }}
    >
      {/* Abstract Overlay (Subtle) */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />

      {/* Glassmorphism Card - Exactly as requested */}
      <div className="relative z-10 p-10 sm:p-14 max-w-lg w-full bg-white/30 backdrop-blur-xl rounded-[32px] border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] text-center flex flex-col items-center">
        {/* Logo Icon - No white background */}
        <div className="mb-8 flex items-center justify-center">
          <div className="relative group">
            <div className="absolute -inset-6 bg-primary/20 rounded-full blur-2xl opacity-20" />
            <Image
              src="/assets/logo-icon.png"
              alt="Drip Pilot"
              width={64}
              height={64}
              className="object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-800 leading-tight tracking-tight">
          Join 500+ teams <br /> scaling with AI
        </h2>

        {/* Separator - Centered */}
        <div className="w-16 h-1 bg-primary/20 rounded-full my-8 mx-auto" />

        <div className="grid grid-cols-3 gap-8 w-full">
          <div className="flex flex-col items-center space-y-1">
            <p className="text-2xl font-black text-slate-800 tracking-tighter">
              99.9%
            </p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Uptime
            </p>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <p className="text-2xl font-black text-slate-800 tracking-tighter">
              256-bit
            </p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Security
            </p>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <p className="text-2xl font-black text-slate-800 tracking-tighter">
              24/7
            </p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Support
            </p>
          </div>
        </div>
      </div>

      {/* Subtle Texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
