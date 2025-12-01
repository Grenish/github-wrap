"use client";

import React, { useRef } from "react";
import { WrappedData, Theme } from "@/lib/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { Sparkles, Quote } from "lucide-react";

// Register TextPlugin
gsap.registerPlugin(TextPlugin);

interface RemarksSlideProps {
  data: WrappedData;
  theme: Theme;
}

export const RemarksSlide: React.FC<RemarksSlideProps> = ({ data, theme }) => {
  const container = useRef<HTMLDivElement>(null);

  // Split title for 3D stagger effect
  const titleChars = data.analysis.title.split("");
  const remarksText = `"${data.analysis.remarks}"`;

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // --- 1. BADGE REVEAL ---
      tl.from(".ai-badge", {
        y: -20,
        opacity: 0,
        filter: "blur(5px)",
        duration: 0.8,
      });

      // --- 2. TITLE 3D STAGGER ---
      tl.from(
        ".title-char",
        {
          y: 50,
          rotationX: -90,
          opacity: 0,
          stagger: 0.03,
          duration: 0.8,
          ease: "back.out(1.2)",
        },
        "-=0.4",
      );

      // --- 3. QUOTE BOX EXPANSION ---
      // Expands width first, then fades in content
      tl.from(
        ".quote-box",
        {
          scaleX: 0.8,
          scaleY: 0.8,
          opacity: 0,
          filter: "blur(15px)",
          duration: 1,
          ease: "expo.out",
        },
        "-=0.4",
      );

      // --- 4. TYPEWRITER EFFECT ---
      tl.to(
        ".quote-text",
        {
          text: {
            value: remarksText,
            delimiter: "",
          },
          duration: 2.5, // Speed of typing
          ease: "none",
        },
        "-=0.5",
      );

      // --- 5. STATS REVEAL ---
      tl.from(
        ".stat-card",
        {
          y: 20,
          opacity: 0,
          filter: "blur(5px)",
          stagger: 0.15,
          duration: 0.8,
        },
        "-=2.0",
      ); // Start appearing while typing happens

      // --- 6. IDLE ANIMATIONS ---
      // Sparkle rotation
      gsap.to(".icon-sparkle", {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: "linear",
      });

      // Floating Quote Icon
      gsap.to(".bg-quote-icon", {
        y: -10,
        rotation: 5,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="h-full flex flex-col justify-center p-4 sm:p-6 md:p-8 relative z-10 perspective-1000"
    >
      <div className="w-full max-h-full flex flex-col justify-center max-w-2xl mx-auto">
        {/* Decorative Background Element */}
        <div className="bg-quote-icon absolute top-0 right-0 opacity-10 pointer-events-none select-none z-0">
          <Quote size={200} className="text-white fill-white" />
        </div>

        {/* AI Badge */}
        <div className="mb-6 relative z-10">
          <div className="ai-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
            <Sparkles size={14} className={`icon-sparkle ${theme.accent}`} />
            <span
              className={`text-[10px] font-bold ${theme.accent} uppercase tracking-wider`}
            >
              Verdict
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[0.95] md:leading-[0.9] mb-6 tracking-tight"
            style={{ transformStyle: "preserve-3d" }}
          >
            {titleChars.map((char, i) => (
              <span
                key={i}
                className="title-char inline-block will-change-transform origin-bottom"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>

          <div
            className={`quote-box p-6 md:p-8 rounded-3xl border ${theme.border} bg-white/5 backdrop-blur-xl shadow-2xl mb-8 relative overflow-hidden`}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

            <div className="relative z-10">
              <p className="quote-text text-lg sm:text-xl md:text-2xl text-zinc-200 font-light leading-snug italic min-h-20"></p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10">
          {/* Discipline Card */}
          <div
            className={`stat-card p-4 md:p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors`}
          >
            <div
              className={`text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1`}
            >
              Discipline
            </div>
            <div className="text-lg sm:text-xl font-bold text-white truncate">
              {data.analysis.disciplineLevel}
            </div>
          </div>

          {/* Vibe Card */}
          <div
            className={`stat-card p-4 md:p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors`}
          >
            <div
              className={`text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1`}
            >
              Vibe
            </div>
            <div className="text-lg sm:text-xl font-bold text-white truncate">
              {data.analysis.vibe}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
