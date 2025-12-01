"use client";

import React, { useRef } from "react";
import { WrappedData, Theme } from "@/lib/types";
import { getHourLabel } from "@/lib/constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Moon, Sun, Clock } from "lucide-react";

interface TimingSlideProps {
  data: WrappedData;
  theme: Theme;
}

export const TimingSlide: React.FC<TimingSlideProps> = ({ data, theme }) => {
  const container = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  const peakHour = data.timing.peakHour;
  const isNight = peakHour < 6 || peakHour > 18;

  // SVG Circle Calculations for 24h clock
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (peakHour / 24) * circumference;

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // --- 1. HEADER ---
      tl.from(".header-fade", {
        y: -20,
        opacity: 0,
        duration: 0.8,
      });

      // --- 2. ORBITAL RING & ICON ---
      // Reveal the track
      tl.from(
        ".clock-track",
        {
          opacity: 0,
          scale: 0.9,
          duration: 0.5,
        },
        "-=0.4",
      );

      // Animate the progress stroke
      tl.to(
        ".clock-progress",
        {
          strokeDashoffset: offset,
          duration: 1.5,
          ease: "power2.inOut",
        },
        "<",
      ); // Sync with track

      // Reveal the Main Icon (Sun/Moon)
      tl.from(
        ".main-icon",
        {
          scale: 0,
          rotate: -90,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
        },
        "-=1.2",
      );

      // --- 3. DIGITAL TIME COUNTER ---
      const timeObj = { val: 0 };
      gsap.to(timeObj, {
        val: peakHour,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.2,
        onUpdate: () => {
          if (timeRef.current) {
            // Format as 00:00
            const hour = Math.floor(timeObj.val).toString().padStart(2, "0");
            timeRef.current.innerText = `${hour}:00`;
          }
        },
      });

      // Reveal the Time Container
      tl.from(
        ".time-display",
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          filter: "blur(10px)",
        },
        "-=1.0",
      );

      // --- 4. LABEL REVEAL ---
      tl.from(
        ".label-container",
        {
          scale: 0.9,
          opacity: 0,
          duration: 0.6,
          ease: "back.out(1.5)",
        },
        "-=0.4",
      );

      // --- 5. IDLE ANIMATIONS ---
      // Pulse the Glow
      gsap.to(".glow-bg", {
        opacity: isNight ? 0.3 : 0.6,
        scale: 1.2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Slow rotation of the icon
      gsap.to(".main-icon-inner", {
        rotate: 15,
        duration: 4,
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
      className="h-full flex flex-col justify-center items-center text-center p-6 md:p-8 relative z-10"
    >
      {/* Header */}
      <div className="header-fade mb-8 space-y-2">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5`}
        >
          <Clock size={14} className={theme.accent} />
          <span
            className={`text-xs font-bold ${theme.accent} uppercase tracking-wider`}
          >
            Chronotype
          </span>
        </div>
        <h2
          className={`text-xl font-bold ${theme.text} uppercase tracking-widest`}
        >
          Peak Productivity
        </h2>
      </div>

      {/* Hero Visual: 24h Clock Ring */}
      <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
        {/* Atmospheric Glow */}
        <div
          className={`glow-bg absolute inset-0 rounded-full blur-[50px] ${isNight ? "bg-indigo-500/20" : "bg-amber-500/20"}`}
        ></div>

        {/* SVG Clock Ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          viewBox="0 0 120 120"
        >
          {/* Track */}
          <circle
            className="clock-track text-white/5"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          {/* Progress */}
          <circle
            className={`clock-progress ${isNight ? "text-indigo-400" : "text-amber-400"}`}
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={circumference} // Starts empty, animated by GSAP
            strokeLinecap="round"
          />
        </svg>

        {/* Central Icon Container */}
        <div
          className={`main-icon relative z-10 p-8 rounded-full border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl shadow-2xl`}
        >
          <div className="main-icon-inner">
            {isNight ? (
              <Moon
                size={48}
                className="text-indigo-300 drop-shadow-[0_0_15px_rgba(165,180,252,0.6)]"
              />
            ) : (
              <Sun
                size={48}
                className="text-amber-300 drop-shadow-[0_0_15px_rgba(252,211,77,0.6)]"
              />
            )}
          </div>
        </div>
      </div>

      {/* Time Display */}
      <div className="time-display mb-6">
        <div
          ref={timeRef}
          className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none tabular-nums"
        >
          00:00
        </div>
      </div>

      {/* Label */}
      <div
        className={`label-container inline-block px-6 py-2 rounded-2xl border ${theme.border} bg-white/5`}
      >
        <span className={`text-lg md:text-xl ${theme.accent} font-medium`}>
          {getHourLabel(peakHour)}
        </span>
      </div>
    </div>
  );
};
