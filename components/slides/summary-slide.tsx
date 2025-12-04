"use client";

import React, { useRef } from "react";
import { WrappedData, Theme } from "@/lib/types";
import { formatNumber } from "@/lib/constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Github, Zap, Share2, Download } from "lucide-react";
import { snapdom } from "@zumer/snapdom";

interface SummarySlideProps {
  data: WrappedData;
  theme: Theme;
  onRestart?: () => void;
}

export const SummarySlide: React.FC<SummarySlideProps> = ({
  data,
  theme,
  onRestart,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(cardRef.current, {
        scale: 0,
        rotationY: 180,
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.7)",
      })

        .from(
          ".summary-item",
          {
            y: 20,
            opacity: 0,
            stagger: 0.05,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.8",
        );

      tl.fromTo(
        ".action-btn",
        {
          y: 30,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: "back.out(1.5)",
        },
        "-=0.4",
      );

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          backgroundPosition: "200% 0",
          duration: 1.5,
          ease: "power2.inOut",
        });
      }
    },
    { scope: container },
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / rect.height) * -15;
    const rotateY = ((x - rect.width / 2) / rect.width) * 15;

    gsap.to(cardRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1000,
    });

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, transparent 80%)`,
        duration: 0.3,
      });
    }
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, transparent 100%)`,
        duration: 0.5,
      });
    }
  };

  return (
    <div
      ref={container}
      className="h-full flex flex-col items-center justify-center p-4 md:p-6 space-y-6 w-full relative z-10 perspective-1000"
    >
      <div
        id="summary-card"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`w-full max-w-[340px] md:max-w-sm rounded-[2.5rem] border-4 ${theme.border} p-1 shadow-2xl relative bg-[#0a0a0a] cursor-default z-10`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative rounded-[2.2rem] overflow-hidden bg-[#0a0a0a] p-6 md:p-7 h-full pointer-events-auto">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none z-0 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
            }}
          ></div>

          <div
            className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-30 ${theme.blob1} -translate-y-1/2 translate-x-1/2 pointer-events-none`}
          />
          <div
            className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[80px] opacity-30 ${theme.blob2} translate-y-1/2 -translate-x-1/2 pointer-events-none`}
          />

          <div
            ref={glowRef}
            className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
          />

          <div className="summary-item flex items-center gap-4 mb-6 relative z-10">
            <div className="relative shrink-0">
              <div
                className={`absolute inset-0 bg-gradient-to-tr ${theme.gradient} blur-lg opacity-50`}
              ></div>
              <img
                src={data.user.avatar_url}
                className={`w-14 h-14 rounded-2xl border-2 ${theme.border} object-cover shadow-lg relative z-10`}
                alt="Avatar"
              />
            </div>
            <div className="overflow-hidden min-w-0">
              <h2 className="font-bold text-2xl text-white truncate tracking-tight">
                {data.user.login}
              </h2>
              <div
                className={`bg-linear-to-r ${theme.gradient} bg-clip-text text-transparent text-xs font-black uppercase tracking-widest mt-0.5`}
              >
                {data.analysis.title}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-6 relative z-10">
            <div className="summary-item p-3.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-colors">
              <div className="text-lg md:text-xl font-bold text-white tabular-nums">
                {formatNumber(data.stats.commits)}
              </div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1 group-hover:text-white/70 transition-colors">
                Commits
              </div>
            </div>
            <div className="summary-item p-3.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-colors">
              <div className="text-lg md:text-xl font-bold text-white tabular-nums">
                {data.streaks.longest}d
              </div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1 group-hover:text-white/70 transition-colors">
                Streak
              </div>
            </div>
            <div className="summary-item p-3.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-colors">
              <div className="text-lg md:text-xl font-bold text-white tabular-nums">
                {data.timing.peakHour}:00
              </div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1 group-hover:text-white/70 transition-colors">
                Peak Hour
              </div>
            </div>
            <div className="summary-item p-3.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-colors">
              <div className="text-lg md:text-xl font-bold text-white truncate">
                {data.languages[0]?.name || "Code"}
              </div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1 group-hover:text-white/70 transition-colors">
                Top Lang
              </div>
            </div>
          </div>

          <div className="summary-item p-3.5 rounded-2xl border border-white/10 bg-linear-to-br from-white/10 to-transparent mb-4 relative z-10">
            <p className="text-zinc-300 text-xs leading-relaxed italic text-center">
              &quot;{data.analysis.remarks}&quot;
            </p>
          </div>

          <div className="summary-item flex justify-between items-end border-t border-white/10 pt-3 relative z-10">
            <div className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1">
              <Github size={10} />
              github-wrapped-25
            </div>
            <div className="text-zinc-600 text-[9px] font-mono">
              #{data.user.id.toString().slice(0, 4)}
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex gap-3 w-full max-w-[340px] md:max-w-sm relative z-50 pointer-events-none"
        style={{ transform: "translateZ(20px)" }}
      >
        <button
          onClick={onRestart}
          className="action-btn flex-1 bg-white text-black py-3.5 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer pointer-events-auto"
        >
          <Zap size={18} className="group-hover:fill-black transition-colors" />
          Replay
        </button>

        <button
          className="action-btn flex-1 bg-black/50 backdrop-blur-md text-white border border-white/10 py-3.5 rounded-2xl font-bold hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer pointer-events-auto"
          onClick={async () => {
            if (!cardRef.current) return;
            gsap.set(cardRef.current, { rotateX: 0, rotateY: 0 });
            const rect = cardRef.current.getBoundingClientRect();
            await snapdom.download(cardRef.current, {
              filename: `${data.user.login}-github-wrapped-25`,
              quality: 1,
              scale: 2,
              width: rect.width * 2,
              height: rect.height * 2,
              embedFonts: true,
              backgroundColor: "#0a0a0a",
              dpr: window.devicePixelRatio,
            });
          }}
        >
          <Download
            size={18}
            className="group-hover:translate-y-0.5 transition-transform"
          />
          Save
        </button>

        <button
          className="action-btn w-14 bg-black/50 backdrop-blur-md text-white border border-white/10 rounded-2xl font-bold hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center cursor-pointer pointer-events-auto"
          onClick={() => {
            const message = `Check out my GitHub Wrapped 2025! "${data.analysis.title}" by ${data.user.login} #GitHubWrapped https://github-wrap25.vercel.app`;
            window.open(
              `https://x.com/intent/tweet?text=${encodeURIComponent(message)}`,
              "_blank",
            );
          }}
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
};
