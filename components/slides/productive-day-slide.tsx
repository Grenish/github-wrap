"use client";

import React, { useRef } from "react";
import { WrappedData, Theme } from "@/lib/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Trophy, GitCommit } from "lucide-react";

interface ProductiveDaySlideProps {
  data: WrappedData;
  theme: Theme;
}

export const ProductiveDaySlide: React.FC<ProductiveDaySlideProps> = ({
  data,
  theme,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  const dateObj = new Date(data.mostProductiveDay.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // --- 1. SETUP ---
      // Randomize confetti positions initially
      gsap.set(".confetti-piece", {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 1,
      });

      // --- 2. TROPHY DROP ---
      tl.from(".trophy-container", {
        y: -300,
        scale: 0,
        opacity: 0,
        rotation: -45,
        duration: 1.2,
        ease: "bounce.out", // Heavy physical drop
      })

        // --- 3. CONFETTI EXPLOSION ---
        // Trigger right after trophy hits
        .to(
          ".confetti-piece",
          {
            x: (i) => Math.cos(i) * gsap.utils.random(100, 300), // Circular explosion
            y: (i) => Math.sin(i) * gsap.utils.random(100, 300),
            rotation: () => gsap.utils.random(0, 720),
            scale: () => gsap.utils.random(0.5, 1.2),
            opacity: 0,
            duration: 1.5,
            stagger: 0.01,
            ease: "power2.out",
          },
          "-=0.8",
        )

        // --- 4. TEXT REVEAL ---
        .from(
          ".prod-label",
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=1.0",
        )

        // --- 5. DATE "STAMP" EFFECT ---
        // Slams down from huge size
        .from(
          ".date-stamp",
          {
            scale: 3,
            opacity: 0,
            duration: 0.5,
            ease: "power4.in",
          },
          "-=0.5",
        )
        // Camera shake on impact
        .to(".content-wrapper", {
          y: 5,
          duration: 0.05,
          repeat: 3,
          yoyo: true,
        })

        // --- 6. DAY NAME REVEAL ---
        .from(
          ".day-name",
          {
            scaleX: 0,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.2",
        )

        // --- 7. COUNTER & PILL ---
        .from(
          ".stats-pill",
          {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.6)",
          },
          "-=0.4",
        );

      // Animate the number counting up
      const obj = { val: 0 };
      gsap.to(obj, {
        val: data.mostProductiveDay.count,
        duration: 1.5,
        ease: "power2.out",
        delay: 1.5, // Wait for pill to appear
        onUpdate: () => {
          if (countRef.current)
            countRef.current.innerText = Math.floor(obj.val).toString();
        },
      });

      // --- 8. IDLE ANIMATIONS ---
      // Float the trophy
      gsap.to(".trophy-container", {
        y: -15,
        rotation: 5,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.2,
      });
    },
    { scope: container },
  );

  // Generate confetti elements
  const confettiCount = 20;
  const confettiColors = [
    "#fbbf24",
    "#f472b6",
    "#60a5fa",
    "#34d399",
    "#a78bfa",
  ];

  return (
    <div
      ref={container}
      className="h-full flex flex-col justify-center items-center text-center p-6 md:p-8 relative z-10 perspective-1000"
    >
      <div className="content-wrapper flex flex-col items-center">
        {/* Confetti Layer (Behind Trophy) */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 z-0">
          {Array.from({ length: confettiCount }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece absolute w-3 h-3 rounded-sm"
              style={{
                backgroundColor: confettiColors[i % confettiColors.length],
                left: 0,
                top: 0,
              }}
            />
          ))}
        </div>

        {/* Trophy */}
        <div
          className={`trophy-container mb-8 p-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative z-10`}
        >
          <Trophy
            size={64}
            className="text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]"
          />
        </div>

        <h2
          className={`prod-label text-sm font-bold ${theme.text} uppercase tracking-[0.2em] mb-4`}
        >
          Most Productive Day
        </h2>

        {/* Date "Stamp" */}
        <div className="mb-8 space-y-2">
          <div className="date-stamp text-5xl md:text-7xl font-black text-white leading-none tracking-tight drop-shadow-xl">
            {formattedDate}
          </div>
          <div
            className={`day-name text-2xl md:text-3xl ${theme.accent} font-medium inline-block px-4 py-1 rounded-lg bg-white/5 border border-white/5`}
          >
            {dayName}
          </div>
        </div>

        {/* Stats Pill */}
        <div
          className={`stats-pill inline-flex items-center gap-3 px-6 py-3 rounded-2xl border ${theme.border} bg-white/5 hover:bg-white/10 transition-colors cursor-default`}
        >
          <GitCommit className="text-white" size={24} />
          <span
            ref={countRef}
            className="text-3xl font-bold text-white tabular-nums"
          >
            0
          </span>
          <span
            className={`text-xs font-bold ${theme.text} uppercase tracking-wider`}
          >
            Contributions
          </span>
        </div>
      </div>
    </div>
  );
};
