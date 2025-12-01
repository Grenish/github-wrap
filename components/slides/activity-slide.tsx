"use client";

import React, { useRef } from "react";
import { WrappedData, Theme } from "@/lib/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flame, PauseCircle, CalendarDays } from "lucide-react";

interface ActivitySlideProps {
  data: WrappedData;
  theme: Theme;
}

export const ActivitySlide: React.FC<ActivitySlideProps> = ({
  data,
  theme,
}) => {
  const container = useRef<HTMLDivElement>(null);

  // Refs for numbers to animate
  const longestRef = useRef<HTMLHeadingElement>(null);
  const currentRef = useRef<HTMLDivElement>(null);
  const breakRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // --- 1. HEADER SEQUENCE ---
      tl.from(".header-badge", {
        y: -20,
        opacity: 0,
        duration: 0.8,
      }).from(
        ".header-label",
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.6",
      );

      // --- 2. HERO NUMBER (Longest Streak) ---
      // Scale down effect + Counter
      tl.from(
        ".hero-number-container",
        {
          scale: 1.5,
          opacity: 0,
          filter: "blur(10px)",
          duration: 1.2,
          ease: "expo.out",
        },
        "-=0.6",
      );

      // Animate Main Counter
      const longestObj = { val: 0 };
      gsap.to(longestObj, {
        val: data.streaks.longest,
        duration: 2,
        ease: "expo.out",
        onUpdate: () => {
          if (longestRef.current)
            longestRef.current.innerText = Math.floor(
              longestObj.val,
            ).toString();
        },
      });

      tl.from(
        ".hero-unit",
        {
          x: -20,
          opacity: 0,
          duration: 0.8,
        },
        "-=1.5",
      );

      // --- 3. CARDS REVEAL ---
      tl.from(
        ".activity-card",
        {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "back.out(1.5)",
        },
        "-=1.0",
      );

      // --- 4. SUB-COUNTERS ---
      const animateCount = (
        ref: React.RefObject<HTMLDivElement | null>,
        val: number,
        delay: number,
      ) => {
        if (!ref.current) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: val,
          duration: 1.5,
          ease: "power2.out",
          delay: delay,
          onUpdate: () => {
            if (ref.current)
              ref.current.innerText = `${Math.floor(obj.val)} Days`;
          },
        });
      };

      animateCount(currentRef, data.streaks.current, 0.8);
      animateCount(breakRef, data.streaks.longestBreak || 0, 1.0);

      // --- 5. LIVE ICON ANIMATIONS ---

      // Flame Flicker
      gsap.to(".icon-flame", {
        opacity: 0.6,
        scale: 0.9,
        duration: 0.1,
        repeat: -1,
        yoyo: true,
        ease: "rough({ template: none.out, strength: 1, points: 20, taper: none, randomize: true, clamp: false})",
      });

      // Break Breathe
      gsap.to(".icon-pause", {
        rotate: 15,
        scale: 1.1,
        duration: 2,
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
      className="h-full flex flex-col justify-center p-6 md:p-8 relative z-10"
    >
      <div className="space-y-8 w-full max-w-lg mx-auto">
        {/* Header Section */}
        <div className="space-y-2 text-center md:text-left">
          <div className="header-badge inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <CalendarDays size={14} className={theme.accent} />
            <span
              className={`text-xs font-bold ${theme.accent} uppercase tracking-wider`}
            >
              Consistency
            </span>
          </div>

          <h2 className={`header-label text-2xl font-bold ${theme.text}`}>
            Longest Streak
          </h2>

          <div className="hero-number-container flex items-baseline justify-center md:justify-start gap-3">
            <h1
              ref={longestRef}
              className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none tabular-nums"
            >
              0
            </h1>
            <span
              className={`hero-unit text-xl md:text-3xl font-medium ${theme.text}`}
            >
              DAYS
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Current Streak Card */}
          <div
            className={`activity-card group p-5 rounded-3xl border ${theme.border} bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors`}
          >
            <div className={`flex items-center gap-2 mb-2 ${theme.accent}`}>
              <div className="icon-flame p-1.5 rounded-full bg-orange-500/10">
                <Flame size={18} className="text-orange-500" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                Active Fire
              </span>
            </div>
            <div
              ref={currentRef}
              className="text-2xl md:text-3xl font-bold text-white tabular-nums"
            >
              0 Days
            </div>
          </div>

          {/* Break Card */}
          <div
            className={`activity-card p-5 rounded-3xl border ${theme.border} bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors`}
          >
            <div className={`flex items-center gap-2 mb-2 ${theme.text}`}>
              <div className="icon-pause p-1.5 rounded-full bg-white/5">
                <PauseCircle size={18} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                Longest Break
              </span>
            </div>
            <div
              ref={breakRef}
              className="text-2xl md:text-3xl font-bold text-white tabular-nums"
            >
              0 Days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
