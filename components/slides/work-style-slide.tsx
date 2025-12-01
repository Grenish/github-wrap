"use client";

import React, { useRef } from "react";
import { WrappedData, Theme } from "@/lib/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Briefcase, Coffee, Scale } from "lucide-react";

interface WorkStyleSlideProps {
  data: WrappedData;
  theme: Theme;
}

export const WorkStyleSlide: React.FC<WorkStyleSlideProps> = ({
  data,
  theme,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const weekdayRef = useRef<HTMLDivElement>(null);
  const weekendRef = useRef<HTMLDivElement>(null);

  const weekend = data.workStyle.weekend;
  const weekday = data.workStyle.weekday;
  const total = weekend + weekday;

  // Safe calculation
  const weekendPercent = total > 0 ? Math.round((weekend / total) * 100) : 0;
  const weekdayPercent = 100 - weekendPercent;

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // --- 1. HEADER ---
      tl.from(".header-content", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
      });

      // --- 2. CHART BASE LINE ---
      tl.from(
        ".chart-line",
        {
          scaleX: 0,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
        },
        "-=0.4",
      );

      // --- 3. BARS GROW ---
      // We animate scaleY from bottom so it grows up naturally
      tl.from(
        ".bar-visual",
        {
          scaleY: 0,
          transformOrigin: "bottom",
          duration: 1.2,
          stagger: 0.2,
          ease: "expo.out",
        },
        "-=0.8",
      );

      // --- 4. DATA LABELS ---
      tl.from(
        ".percentage-label",
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
        },
        "-=1.0",
      );

      // --- 5. ICONS & BOTTOM LABELS ---
      tl.from(
        ".icon-label",
        {
          y: 10,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
        },
        "-=0.6",
      );

      // --- 6. NUMBER COUNTING ---
      const animateCount = (
        ref: React.RefObject<HTMLDivElement | null>,
        val: number,
      ) => {
        if (!ref.current) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: val,
          duration: 1.5,
          ease: "power2.out",
          delay: 0.2,
          onUpdate: () => {
            if (ref.current) ref.current.innerText = `${Math.floor(obj.val)}%`;
          },
        });
      };
      animateCount(weekdayRef, weekdayPercent);
      animateCount(weekendRef, weekendPercent);

      // --- 7. VERDICT FADE ---
      tl.from(
        ".verdict-text",
        {
          opacity: 0,
          y: 10,
          duration: 1,
        },
        "-=0.2",
      );
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="h-full flex flex-col justify-center items-center p-6 md:p-8 relative z-10"
    >
      {/* Header */}
      <div className="mb-12 text-center space-y-2">
        <div className="header-content inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5">
          <Scale size={14} className={theme.accent} />
          <span
            className={`text-xs font-bold ${theme.accent} uppercase tracking-wider`}
          >
            Rhythm
          </span>
        </div>
        <h1 className="header-content text-4xl md:text-5xl font-black text-white tracking-tight">
          Work Style
        </h1>
      </div>

      {/* Main Chart Area */}
      <div className="w-full max-w-lg mx-auto mb-12">
        {/* The Grid Layout: 3 Columns [Weekday - Spacer - Weekend] */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-end h-64 relative">
          {/* --- LEFT: WEEKDAY --- */}
          <div className="flex flex-col items-center gap-3 w-full group">
            <div
              ref={weekdayRef}
              className="percentage-label text-3xl md:text-4xl font-bold text-white tabular-nums"
            >
              0%
            </div>
            {/* Bar Container (Full height to align bottom) */}
            <div className="w-full max-w-[80px] h-40 flex items-end relative">
              <div
                className="bar-visual w-full bg-white/90 rounded-t-lg backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.15)] relative z-10"
                style={{ height: `${weekdayPercent}%`, minHeight: "4px" }}
              />
              {/* Reflection/Shine for clean glass look */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none rounded-t-lg mix-blend-overlay"></div>
            </div>
          </div>

          {/* --- CENTER: SEPARATOR --- */}
          <div className="h-40 flex items-center justify-center px-2 relative">
            {/* Center line */}
            <div className="w-px h-full bg-white/5 absolute top-0"></div>
            {/* VS Badge */}
            <div className="w-8 h-8 rounded-full bg-[#0a0a0a] border border-white/20 flex items-center justify-center z-20 relative">
              <span className="text-[10px] font-bold text-zinc-500">VS</span>
            </div>
          </div>

          {/* --- RIGHT: WEEKEND --- */}
          <div className="flex flex-col items-center gap-3 w-full group">
            <div
              ref={weekendRef}
              className="percentage-label text-3xl md:text-4xl font-bold text-white tabular-nums"
            >
              0%
            </div>
            {/* Bar Container */}
            <div className="w-full max-w-[80px] h-40 flex items-end relative">
              <div
                className={`bar-visual w-full rounded-t-lg backdrop-blur-sm shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)] relative z-10`}
                style={{
                  height: `${weekendPercent}%`,
                  minHeight: "4px",
                  background:
                    theme.bg === "bg-[#000000]"
                      ? "#6366f1" // Indigo for dark theme
                      : "#10b981", // Emerald for others
                }}
              />
            </div>
          </div>

          {/* Floor Line (Spans entire grid) */}
          <div className="chart-line col-span-3 h-px bg-white/20 w-full mt-[-1px]"></div>
        </div>

        {/* Labels below the floor line */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mt-6">
          {/* Weekday Label */}
          <div className="icon-label flex flex-col items-center gap-2 opacity-80">
            <Briefcase size={20} className="text-zinc-300" />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Weekdays
            </span>
          </div>
          <div className="w-8"></div> {/* Spacer */}
          {/* Weekend Label */}
          <div className="icon-label flex flex-col items-center gap-2 opacity-80">
            <Coffee size={20} className="text-zinc-300" />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Weekends
            </span>
          </div>
        </div>
      </div>

      {/* Verdict */}
      <div className="verdict-text text-center max-w-sm mx-auto">
        <p
          className={`text-base md:text-lg ${theme.text} leading-snug font-medium opacity-90`}
        >
          {weekendPercent > 30
            ? "The Grindset is real. You treat weekends like weekdays."
            : "Professional balance. You know exactly when to unplug."}
        </p>
      </div>
    </div>
  );
};
