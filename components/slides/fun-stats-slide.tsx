"use client";

import React, { useRef } from "react";
import { WrappedData, Theme } from "@/lib/types";
import { formatNumber } from "@/lib/constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TrendingUp, TrendingDown } from "lucide-react";

interface FunStatsSlideProps {
  data: WrappedData;
  theme: Theme;
}

export const FunStatsSlide: React.FC<FunStatsSlideProps> = ({
  data,
  theme,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const additions = data.codeStats.additions || 12500;
  const deletions = data.codeStats.deletions || 4300;
  const ratio = (additions / (additions + deletions)) * 100;

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.from(".fun-header", { y: -20, opacity: 0, duration: 0.6 })
        .from(".stat-bar-container", {
          scaleX: 0,
          opacity: 0,
          duration: 1,
          ease: "power3.inOut",
        })
        .from(
          ".stat-item",
          {
            y: 20,
            opacity: 0,
            stagger: 0.2,
            duration: 0.6,
            ease: "back.out(1.5)",
          },
          "-=0.5",
        );
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="h-full flex flex-col justify-center p-6 md:p-8 relative z-10"
    >
      <div className="fun-header mb-12 text-center">
        <h2
          className={`text-xl font-bold ${theme.text} uppercase tracking-widest mb-2`}
        >
          Impact Check
        </h2>
        <h1 className="text-4xl md:text-5xl font-black text-white">
          Lines of Code
        </h1>
      </div>

      <div className="space-y-12">
        <div className="stat-bar-container w-full h-8 bg-zinc-800 rounded-full overflow-hidden flex relative shadow-inner">
          <div
            className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            style={{ width: `${ratio}%` }}
          />
          <div
            className="h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            style={{ width: `${100 - ratio}%` }}
          />
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/50 transform -translate-x-1/2" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="stat-item flex flex-col items-center p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md">
            <TrendingUp size={32} className="text-emerald-400 mb-4" />
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              +{formatNumber(additions)}
            </div>
            <div className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
              Lines Added
            </div>
          </div>
          <div className="stat-item flex flex-col items-center p-6 rounded-3xl border border-red-500/20 bg-red-500/5 backdrop-blur-md">
            <TrendingDown size={32} className="text-red-400 mb-4" />
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              -{formatNumber(deletions)}
            </div>
            <div className="text-xs font-bold text-red-200 uppercase tracking-wider">
              Lines Deleted
            </div>
          </div>
        </div>

        <p
          className={`stat-item text-center text-sm ${theme.text} opacity-70 italic`}
        >
          {additions > deletions * 3
            ? "You're building an empire!"
            : "Perfectly balanced, as all things should be."}
        </p>
      </div>
    </div>
  );
};
