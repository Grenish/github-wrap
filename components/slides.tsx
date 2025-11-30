"use client";

import React, { useRef } from "react";
import { WrappedData, Theme } from "@/lib/types";
import { formatNumber, getHourLabel } from "@/lib/constants";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  GitCommit,
  Code,
  FolderGit2,
  Briefcase,
  Coffee,
  Flame,
  PauseCircle,
  Moon,
  Sun,
  Zap,
  Share2,
  Github,
  Star,
} from "lucide-react";

interface SlideProps {
  data: WrappedData;
  theme: Theme;
  onRestart?: () => void;
}

// --- 1. INTRO SLIDE ---
export const IntroSlide = ({ data, theme }: SlideProps) => {
  const container = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Avatar pop with elastic ease
      tl.from(".avatar-group", {
        scale: 0,
        opacity: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
      })
        // Text sliding up smoothly
        .from(
          ".intro-text",
          {
            y: 30,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.8",
        );
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="h-full flex flex-col justify-center items-center text-center p-8 space-y-8 relative z-10"
    >
      <div className="avatar-group relative group">
        <div
          className={`absolute inset-0 bg-linear-to-tr ${theme.gradient} rounded-full blur-2xl opacity-40 animate-pulse group-hover:opacity-60 transition-duration-500`}
        ></div>
        <img
          src={data.user.avatar_url}
          alt="Profile"
          className="w-36 h-36 md:w-48 md:h-48 rounded-full border-4 border-white/10 relative z-10 shadow-2xl object-cover transform transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-xs px-3 py-1 rounded-full z-20">
          #{data.user.id.toString().slice(0, 4)}
        </div>
      </div>

      <div className="space-y-4 max-w-full">
        <h2
          className={`intro-text text-xl font-medium ${theme.text} tracking-widest uppercase`}
        >
          Welcome back
        </h2>
        <h1 className="intro-text text-5xl md:text-7xl font-bold text-white tracking-tighter leading-none break-words">
          {data.user.login}
        </h1>
        {!data.isExact && (
          <div className="intro-text">
            <div className="text-xs text-white/50 bg-white/5 inline-block px-3 py-1 rounded-lg border border-white/5">
              Public Data Mode
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 2. STATS SLIDE ---
export const StatsSlide = ({ data, theme }: SlideProps) => {
  const container = useRef(null);
  // Refs for number counters
  const commitsRef = useRef<HTMLDivElement>(null);
  const daysRef = useRef<HTMLDivElement>(null);
  const prsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".title-anim", {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }).from(
        ".stat-card",
        {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "back.out(1.2)",
        },
        "-=0.4",
      );

      // Counter Animations
      const animateCount = (
        ref: React.RefObject<HTMLDivElement | null>,
        val: number,
      ) => {
        if (!ref.current) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: val,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            if (ref.current)
              ref.current.innerText = formatNumber(Math.floor(obj.val));
          },
        });
      };

      animateCount(commitsRef, data.stats.commits);
      animateCount(daysRef, data.stats.last90Days);
      animateCount(prsRef, data.stats.prs);
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="h-full flex flex-col justify-center p-6 md:p-8 relative z-10"
    >
      <h2 className="title-anim text-4xl md:text-6xl font-black text-white mb-10 leading-[0.9] tracking-tight">
        THE{" "}
        <span
          className={`text-transparent bg-clip-text bg-linear-to-r ${theme.gradient}`}
        >
          GRIND
        </span>
        <br />
        BY NUMBERS.
      </h2>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div
          className={`stat-card col-span-2 p-6 rounded-3xl border ${theme.border} bg-white/5 backdrop-blur-md flex items-center justify-between`}
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
          <GitCommit size={48} className={`${theme.accent} opacity-80`} />
        </div>

        <div
          className={`stat-card p-5 rounded-3xl border ${theme.border} bg-white/5 backdrop-blur-md`}
        >
          <div
            ref={daysRef}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            0
          </div>
          <div
            className={`text-[10px] md:text-xs font-bold ${theme.text} uppercase mt-2`}
          >
            Last 90 Days
          </div>
        </div>

        <div
          className={`stat-card p-5 rounded-3xl border ${theme.border} bg-white/5 backdrop-blur-md`}
        >
          <div
            ref={prsRef}
            className="text-3xl md:text-4xl font-bold text-white"
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

// --- 3. LANGUAGES SLIDE ---
export const LanguageSlide = ({ data, theme }: SlideProps) => {
  const container = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".header-anim", { opacity: 0, y: 20, duration: 0.6 })
        .from(
          ".lang-row",
          {
            x: -20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.2",
        )
        // Animate the bars growing
        .from(
          ".progress-bar",
          {
            width: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.inOut",
          },
          "<",
        );
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="h-full flex flex-col justify-center p-6 md:p-8 relative z-10"
    >
      <div className="header-anim space-y-2 mb-8">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${theme.border} bg-white/5`}
        >
          <Code size={14} className={theme.accent} />
          <span
            className={`text-xs font-bold ${theme.accent} uppercase tracking-wider`}
          >
            Syntax DNA
          </span>
        </div>
        <h1 className="text-5xl font-bold text-white leading-tight">
          You Speak <br />
          <span
            className={`text-transparent bg-clip-text bg-linear-to-r ${theme.gradient}`}
          >
            {data.languages[0]?.name.toUpperCase() || "CODE"}
          </span>
        </h1>
      </div>

      <div className="space-y-4">
        {data.languages.slice(0, 5).map((lang) => (
          <div key={lang.name} className="lang-row">
            <div className="flex justify-between items-end mb-2">
              <span className="text-lg font-bold text-white">{lang.name}</span>
              <span className={`text-sm font-mono ${theme.text}`}>
                {lang.percent}%
              </span>
            </div>
            <div
              className={`h-3 w-full rounded-full bg-white/10 overflow-hidden`}
            >
              <div
                className={`progress-bar h-full rounded-full ${theme.bg === "bg-[#000000]" ? "bg-white" : ""}`}
                style={{
                  width: `${lang.percent}%`,
                  backgroundColor:
                    theme.bg !== "bg-[#000000]" ? lang.color : undefined,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 4. PROJECTS SLIDE ---
export const ProjectSlide = ({ data, theme }: SlideProps) => {
  const container = useRef(null);

  useGSAP(
    () => {
      gsap.from(".header-anim", { opacity: 0, y: -20, duration: 0.6 });
      gsap.from(".repo-card", {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "back.out(1.5)", // slight bounce
        delay: 0.2,
      });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="h-full flex flex-col justify-center p-6 md:p-8 relative z-10"
    >
      <div className="header-anim mb-8">
        <h2
          className={`text-xl font-bold ${theme.text} uppercase tracking-widest mb-2`}
        >
          Crown Jewels
        </h2>
        <h1 className="text-4xl md:text-5xl font-black text-white">
          Top Projects
        </h1>
      </div>

      <div className="space-y-4">
        {data.repos.slice(0, 3).map((repo) => (
          <div
            key={repo.name}
            className={`repo-card p-5 rounded-2xl border ${theme.border} bg-white/5 hover:bg-white/10 transition-colors`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <FolderGit2 size={20} className={theme.accent} />
                <span className="font-bold text-lg text-white truncate max-w-[180px]">
                  {repo.name}
                </span>
              </div>
              <div
                className={`text-xs px-2 py-1 rounded bg-white/10 flex items-center gap-2 ${theme.text}`}
              >
                {formatNumber(repo.stargazerCount || 0)} <Star size={15} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`w-2 h-2 rounded-full`}
                style={{ background: repo.primaryLanguage?.color || "#fff" }}
              ></span>
              <span className={theme.text}>
                {repo.primaryLanguage?.name || "Code"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 5. ACTIVITY SLIDE ---
export const ActivitySlide = ({ data, theme }: SlideProps) => {
  const container = useRef(null);
  const streakRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Scale up the big number
      tl.from(streakRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 1,
        ease: "elastic.out(1, 0.6)",
      }).from(
        ".activity-card",
        {
          x: (i) => (i % 2 === 0 ? -30 : 30), // slide in from sides
          opacity: 0,
          stagger: 0.2,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.6",
      );

      // Counter effect
      const obj = { val: 0 };
      gsap.to(obj, {
        val: data.streaks.longest,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
          if (streakRef.current)
            streakRef.current.innerText = Math.floor(obj.val).toString();
        },
      });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="h-full flex flex-col justify-center p-6 md:p-8 relative z-10"
    >
      <div className="space-y-8 w-full">
        <div className="space-y-2">
          <h2
            className={`text-2xl font-bold ${theme.text} opacity-0 animate-[fadeIn_0.5s_forwards]`}
          >
            Longest Streak
          </h2>
          <div className="flex items-baseline gap-3">
            <h1
              ref={streakRef}
              className="text-7xl md:text-9xl font-bold text-white tracking-tighter leading-none"
            >
              0
            </h1>
            <span className={`text-xl md:text-3xl font-medium ${theme.text}`}>
              DAYS
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`activity-card p-5 rounded-3xl border ${theme.border} bg-white/5 backdrop-blur-sm`}
          >
            <div className={`flex items-center gap-2 mb-2 ${theme.accent}`}>
              <Flame size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Current
              </span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white">
              {data.streaks.current} Days
            </div>
          </div>
          <div
            className={`activity-card p-5 rounded-3xl border ${theme.border} bg-white/5 backdrop-blur-sm`}
          >
            <div className={`flex items-center gap-2 mb-2 ${theme.text}`}>
              <PauseCircle size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Break
              </span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white">
              {data.streaks.longestBreak || 0} Days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 6. WORK STYLE SLIDE ---
export const WorkStyleSlide = ({ data, theme }: SlideProps) => {
  const container = useRef(null);
  const weekend = data.workStyle.weekend;
  const weekday = data.workStyle.weekday;
  const total = weekend + weekday;
  const weekendPercent = total > 0 ? Math.round((weekend / total) * 100) : 0;

  useGSAP(
    () => {
      // Animate bars growing upwards
      gsap.from(".bar-fill", {
        height: "0%",
        duration: 1.5,
        ease: "power3.inOut",
        stagger: 0.2,
      });

      gsap.from(".bar-icon", {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        delay: 1, // wait for bars
        ease: "back.out(2)",
      });

      gsap.from(".style-text", {
        opacity: 0,
        y: 20,
        delay: 1.2,
        duration: 0.8,
      });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="h-full flex flex-col justify-center items-center p-6 md:p-8 relative z-10 text-center"
    >
      <h2
        className={`text-xl font-bold ${theme.text} uppercase tracking-widest mb-10`}
      >
        Work Style
      </h2>

      <div className="flex items-end gap-8 mb-12 h-64 w-full max-w-xs justify-center">
        {/* Weekday Bar */}
        <div className="flex flex-col items-center gap-4 w-1/2 group">
          <div
            className={`text-2xl font-bold ${theme.text} opacity-50 group-hover:opacity-100 transition-opacity`}
          >
            M-F
          </div>
          <div className="relative w-full bg-white/5 rounded-t-3xl border-x border-t border-white/10 overflow-hidden h-48 flex items-end">
            <div
              className={`bar-fill w-full bg-white`}
              style={{ height: `${100 - weekendPercent}%`, opacity: 0.8 }}
            ></div>
          </div>
          <div className="bar-icon flex items-center gap-2 font-bold text-white">
            <Briefcase size={16} /> {100 - weekendPercent}%
          </div>
        </div>

        {/* Weekend Bar */}
        <div className="flex flex-col items-center gap-4 w-1/2 group">
          <div
            className={`text-2xl font-bold ${theme.text} opacity-50 group-hover:opacity-100 transition-opacity`}
          >
            Sat-Sun
          </div>
          <div className="relative w-full bg-white/5 rounded-t-3xl border-x border-t border-white/10 overflow-hidden h-48 flex items-end">
            <div
              className={`bar-fill w-full ${theme.bg === "bg-[#000000]" ? "bg-indigo-500" : "bg-emerald-400"}`}
              style={{ height: `${weekendPercent}%` }}
            ></div>
          </div>
          <div className="bar-icon flex items-center gap-2 font-bold text-white">
            <Coffee size={16} /> {weekendPercent}%
          </div>
        </div>
      </div>

      <p className={`style-text text-lg ${theme.text} max-w-xs`}>
        {weekendPercent > 30
          ? "You don't believe in weekends. The grind never stops."
          : "You keep it professional. Weekends are for touching grass."}
      </p>
    </div>
  );
};

// --- 7. TIMING SLIDE ---
export const TimingSlide = ({ data, theme }: SlideProps) => {
  const container = useRef(null);
  const peakHour = data.timing.peakHour;
  const isNight = peakHour < 6 || peakHour > 20;

  useGSAP(
    () => {
      // Rotate and pop the icon
      gsap.from(".icon-container", {
        rotation: -180,
        scale: 0,
        opacity: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.7)",
      });

      // Slide up text
      gsap.from(".timing-text", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        delay: 0.4,
      });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="h-full flex flex-col justify-center items-center text-center p-6 md:p-8 relative z-10"
    >
      <div
        className={`icon-container mb-10 p-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl`}
      >
        {isNight ? (
          <Moon
            size={64}
            className="text-indigo-300 drop-shadow-[0_0_15px_rgba(165,180,252,0.5)]"
          />
        ) : (
          <Sun
            size={64}
            className="text-amber-300 drop-shadow-[0_0_15px_rgba(252,211,77,0.5)]"
          />
        )}
      </div>
      <h2
        className={`timing-text text-sm font-bold ${theme.text} uppercase tracking-[0.2em] mb-4`}
      >
        Peak Productivity
      </h2>
      <div className="timing-text text-7xl md:text-9xl font-bold text-white mb-4 tracking-tighter">
        {peakHour}:00
      </div>
      <div
        className={`timing-text inline-block px-6 py-2 rounded-full border ${theme.border} bg-white/5 mb-12`}
      >
        <span className={`text-lg md:text-xl ${theme.accent} font-medium`}>
          {getHourLabel(peakHour)}
        </span>
      </div>
    </div>
  );
};

// --- 8. REMARKS SLIDE ---
// --- 8. REMARKS SLIDE (Responsive) ---
export const RemarksSlide = ({ data, theme }: SlideProps) => {
  const container = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".badge-anim", {
        scale: 0,
        opacity: 0,
        ease: "back.out(1.7)",
        duration: 0.5,
      })
        .from(".title-anim", { opacity: 0, x: -20, duration: 0.8 })
        .from(
          ".box-anim",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4",
        )
        .from(
          ".stat-anim",
          {
            scale: 0.9,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
          },
          "-=0.2",
        );
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="h-full flex flex-col justify-center p-4 sm:p-6 md:p-8 relative z-10"
    >
      <div className="w-full max-h-full flex flex-col justify-center">
        {/* Label */}
        <div>
          <h1
            className={`title-anim text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[0.95] md:leading-[0.9] mb-4 sm:mb-6 tracking-tight wrap-break-words`}
          >
            {data.analysis.title}
          </h1>

          {/* Responsive Quote Box */}
          <div
            className={`box-anim p-5 sm:p-6 md:p-4 rounded-[1.2rem] sm:rounded-3xl border ${theme.border} bg-white/5 backdrop-blur-xl shadow-2xl mb-4 sm:mb-6`}
          >
            <p
              className={`text-base sm:text-xl md:text-2xl text-zinc-200 font-light leading-snug italic`}
            >
              &quot;{data.analysis.remarks}&quot;
            </p>
          </div>
        </div>

        {/* Responsive Stats Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div
            className={`stat-anim p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${theme.border} bg-white/5 backdrop-blur-md`}
          >
            <div
              className={`text-[9px] sm:text-[10px] font-bold ${theme.text} uppercase tracking-widest mb-0.5 sm:mb-1`}
            >
              Discipline
            </div>
            <div className="text-base sm:text-xl font-bold text-white truncate">
              {data.analysis.disciplineLevel}
            </div>
          </div>
          <div
            className={`stat-anim p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${theme.border} bg-white/5 backdrop-blur-md`}
          >
            <div
              className={`text-[9px] sm:text-[10px] font-bold ${theme.text} uppercase tracking-widest mb-0.5 sm:mb-1`}
            >
              Vibe
            </div>
            <div className="text-base sm:text-xl font-bold text-white truncate">
              {data.analysis.vibe}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 9. SUMMARY SLIDE ---
export const SummarySlide = ({ data, onRestart, theme }: SlideProps) => {
  const container = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Card tilt/pop in
      tl.from("#summary-card", {
        y: 50,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
        // Buttons sliding up
        .from(
          ".action-btn",
          {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "back.out(1.5)",
          },
          "-=0.2",
        );
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="h-full flex flex-col items-center justify-center p-6 space-y-6 w-full relative z-10"
    >
      <div
        id="summary-card"
        className={`w-full max-w-[340px] md:max-w-sm rounded-[2.5rem] border-4 ${theme.border} p-8 shadow-2xl relative overflow-hidden bg-[#0a0a0a] group hover:scale-[1.02] transition-transform duration-500`}
      >
        <div
          className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] opacity-40 ${theme.blob1} -translate-y-1/2 translate-x-1/2`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-40 h-40 rounded-full blur-[60px] opacity-40 ${theme.blob2} translate-y-1/2 -translate-x-1/2`}
        ></div>

        <div className="flex items-center gap-5 mb-8 relative z-10">
          <img
            src={data.user.avatar_url}
            className={`w-16 h-16 rounded-2xl border-2 ${theme.border} object-cover shadow-lg`}
            alt="Avatar"
          />
          <div className="overflow-hidden">
            <h2 className="font-bold text-2xl text-white truncate tracking-tight">
              {data.user.login}
            </h2>
            <div
              className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent text-xs font-black uppercase tracking-widest mt-1`}
            >
              {data.analysis.title}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8 relative z-10">
          <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
            <div className="text-xl font-bold text-white">
              {formatNumber(data.stats.commits)}
            </div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
              Commits
            </div>
          </div>
          <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
            <div className="text-xl font-bold text-white">
              {data.streaks.longest}d
            </div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
              Streak
            </div>
          </div>
          <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
            <div className="text-xl font-bold text-white">
              {data.timing.peakHour}:00
            </div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
              Peak Hour
            </div>
          </div>
          <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
            <div className="text-xl font-bold text-white truncate">
              {data.languages[0]?.name || "Code"}
            </div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
              Top Lang
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-white/5 bg-white/5 mb-6 relative z-10">
          <p className="text-zinc-400 text-xs leading-relaxed italic">
            &quot;{data.analysis.remarks}&quot;
          </p>
        </div>

        <div className="flex justify-between items-end border-t border-white/10 pt-4 relative z-10">
          <div className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            github-wrapped-25
          </div>
          <Github className="text-zinc-700" size={20} />
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-[340px] md:max-w-sm">
        <button
          onClick={onRestart}
          className="action-btn flex-1 bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
        >
          <Zap size={18} /> Replay
        </button>
        <button
          className="action-btn flex-1 bg-white/10 backdrop-blur-md text-white border border-white/10 py-4 rounded-2xl font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
          onClick={() => alert("Screenshot to share!")}
        >
          <Share2 size={18} /> Share
        </button>
      </div>
    </div>
  );
};
