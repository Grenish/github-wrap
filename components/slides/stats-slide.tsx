"use client";

import React, { useRef } from "react";
import { WrappedData, Theme } from "@/lib/types";
import { formatNumber } from "@/lib/constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { GitCommit } from "lucide-react";
import { TextPlugin } from "gsap/TextPlugin";

// Register TextPlugin
gsap.registerPlugin(TextPlugin);

interface StatsSlideProps {
  data: WrappedData;
  theme: Theme;
}

export const StatsSlide: React.FC<StatsSlideProps> = ({ data, theme }) => {
  const container = useRef<HTMLDivElement>(null);

  // Refs for counter targets
  const commitsRef = useRef<HTMLDivElement>(null);
  const daysRef = useRef<HTMLDivElement>(null);
  const prsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // --- 1. TITLE SEQUENCE ---

      // "THE" - Pop in
      tl.from(".word-the", {
        scale: 0,
        opacity: 0,
        rotation: -20,
        duration: 0.5,
        ease: "back.out(2)",
      })

        // "GRIND" - Heavy Slam + Shake
        .from(".word-grind", {
          scale: 4,
          opacity: 0,
          filter: "blur(20px)",
          duration: 0.6,
          ease: "power4.in",
        })
        // The Shake effect (impact)
        .to(".word-grind", {
          x: -5,
          duration: 0.05,
          repeat: 5,
          yoyo: true,
          ease: "sine.inOut",
        })

        // "BY NUMBERS" - Typewriter
        .from(
          ".text-subtitle",
          {
            text: { value: "", delimiter: "" },
            duration: 0.6,
            ease: "none",
          },
          "-=0.2",
        );

      // --- 2. CARDS "DEALING" ANIMATION ---

      tl.from(
        ".stat-card",
        {
          y: 100,
          z: -100,
          rotationX: 45, // Tilted back like cards falling
          opacity: 0,
          scale: 0.8,
          stagger: 0.15,
          duration: 0.8,
          ease: "back.out(1.2)", // Bouncy landing
        },
        "-=0.4",
      );

      // --- 3. NUMBER COUNTING ---

      // Helper to animate numbers
      const animateCount = (
        ref: React.RefObject<HTMLDivElement | null>,
        val: number,
        delay: string,
      ) => {
        if (!ref.current) return;
        const obj = { val: 0 };

        // Use a separate tween for counters so they run parallel
        gsap.to(obj, {
          val,
          duration: 2,
          ease: "power2.out",
          delay: parseFloat(delay), // Start after cards appear
          onUpdate: () => {
            if (ref.current)
              ref.current.innerText = formatNumber(Math.floor(obj.val));
          },
          onComplete: () => {
            // Little pop when finished counting
            gsap.to(ref.current, {
              scale: 1.2,
              duration: 0.1,
              yoyo: true,
              repeat: 1,
            });
          },
        });
      };

      // Trigger counting slightly after cards start appearing
      animateCount(commitsRef, data.stats.commits, "1.5");
      animateCount(daysRef, data.stats.last90Days, "1.7");
      animateCount(prsRef, data.stats.prs, "1.9");

      // --- 4. IDLE ANIMATION ---
      // Icon breathing
      gsap.to(".commit-icon", {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: "linear",
      });

      gsap.to(".commit-icon", {
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
      className="h-full flex flex-col justify-center p-6 md:p-8 relative z-10 perspective-1000"
    >
      <div className="mb-10 leading-[0.9] tracking-tight">
        <span className="word-the inline-block text-4xl md:text-6xl font-black text-white mr-3">
          THE
        </span>
        <span
          className={`word-grind inline-block text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r ${theme.gradient}`}
        >
          GRIND
        </span>
        <br />
        <span className="text-subtitle text-4xl md:text-6xl font-black text-white">
          BY NUMBERS.
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Main Card */}
        <div
          className={`stat-card col-span-2 p-6 rounded-3xl border ${theme.border} bg-white/5 backdrop-blur-md flex items-center justify-between group hover:bg-white/10 transition-colors`}
        >
          <div>
            <div
              ref={commitsRef}
              className="text-5xl md:text-7xl font-bold text-white tabular-nums tracking-tighter"
            >
              0
            </div>
            <div
              className={`text-xs md:text-sm font-bold ${theme.text} uppercase tracking-widest mt-1`}
            >
              {data.isExact ? "Total Commits" : "Public Commits"}
            </div>
          </div>
          {/* Animated Icon */}
          <div className="commit-icon">
            <GitCommit size={48} className={`${theme.accent} opacity-80`} />
          </div>
        </div>

        {/* Secondary Card 1 */}
        <div
          className={`stat-card p-5 rounded-3xl border ${theme.border} bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors`}
        >
          <div
            ref={daysRef}
            className="text-3xl md:text-4xl font-bold text-white tabular-nums"
          >
            0
          </div>
          <div
            className={`text-[10px] md:text-xs font-bold ${theme.text} uppercase mt-2`}
          >
            Last 90 Days
          </div>
        </div>

        {/* Secondary Card 2 */}
        <div
          className={`stat-card p-5 rounded-3xl border ${theme.border} bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors`}
        >
          <div
            ref={prsRef}
            className="text-3xl md:text-4xl font-bold text-white tabular-nums"
          >
            0
          </div>
          <div
            className={`text-[10px] md:text-xs font-bold ${theme.text} uppercase mt-2`}
          >
            Pull Requests
          </div>
        </div>
      </div>
    </div>
  );
};
