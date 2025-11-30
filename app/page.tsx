"use client";

import React, { useState, useEffect } from "react";
import { PauseCircle, PlayCircle } from "lucide-react";
import { THEMES } from "@/lib/constants";
import { WrappedData } from "@/lib/types";
import { fetchGitHubData } from "@/lib/github";

import { Background } from "@/components/background";
import { ProgressBar } from "@/components/progress-bar";
import { LoginScreen } from "@/components/login-screen";
import {
  ActivitySlide,
  IntroSlide,
  LanguageSlide,
  ProjectSlide,
  RemarksSlide,
  StatsSlide,
  SummarySlide,
  TimingSlide,
  WorkStyleSlide,
} from "@/components/slides";

// Main Slides Array
const SLIDES_CONFIG = [
  { id: "intro", component: IntroSlide, themeId: "aurora" },
  { id: "stats", component: StatsSlide, themeId: "velvet" },
  { id: "languages", component: LanguageSlide, themeId: "midnight" },
  { id: "projects", component: ProjectSlide, themeId: "royal" },
  { id: "activity", component: ActivitySlide, themeId: "aurora" },
  { id: "workstyle", component: WorkStyleSlide, themeId: "midnight" },
  { id: "timing", component: TimingSlide, themeId: "dawn" },
  { id: "remarks", component: RemarksSlide, themeId: "aurora" },
  { id: "summary", component: SummarySlide, themeId: "velvet" },
];

export default function Home() {
  const [view, setView] = useState<"login" | "story">("login");
  const [data, setData] = useState<WrappedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fonts loader
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleGenerate = async (username: string, token: string) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Get Data from GitHub
      const gitData = await fetchGitHubData(username, token);

      // 2. Get AI Analysis from our Next.js API Route
      const aiResponse = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          stats: gitData.stats,
          timing: gitData.timing,
          streaks: gitData.streaks,
          languages: gitData.languages,
        }),
      });

      if (!aiResponse.ok) throw new Error("AI analysis failed");
      const analysis = await aiResponse.json();

      setData({ ...gitData, analysis });
      setSlideIndex(0);
      setView("story");
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Auto-advance logic
  useEffect(() => {
    if (view !== "story" || isPaused || slideIndex >= SLIDES_CONFIG.length - 1)
      return;
    const timer = setTimeout(() => setSlideIndex((prev) => prev + 1), 7000);
    return () => clearTimeout(timer);
  }, [slideIndex, view, isPaused]);

  // Render
  if (view === "login" || !data) {
    return (
      <LoginScreen
        onGenerate={handleGenerate}
        loading={loading}
        error={error}
      />
    );
  }

  const CurrentSlide = SLIDES_CONFIG[slideIndex].component;
  const currentTheme =
    THEMES.find((t) => t.id === SLIDES_CONFIG[slideIndex].themeId) || THEMES[0];

  return (
    <div
      className={`fixed inset-0 overflow-hidden font-space transition-colors duration-1000 ease-in-out ${currentTheme.bg}`}
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <style jsx global>{`
        .font-space {
          font-family: "Space Grotesk", sans-serif;
        }
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-right {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.6;
          }
        }
        .animate-fade-up {
          animation: fade-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
        }
        .animate-slide-right {
          animation: slide-right 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
        }
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s infinite ease-in-out;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>

      <Background theme={currentTheme} />

      <ProgressBar
        total={SLIDES_CONFIG.length}
        current={slideIndex}
        active={!isPaused}
      />

      {/* Pause Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsPaused(!isPaused);
        }}
        className="absolute top-8 right-6 z-50 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all text-white border border-white/10"
      >
        {isPaused ? <PlayCircle size={20} /> : <PauseCircle size={20} />}
      </button>

      {/* Navigation Touch Areas */}
      <div
        className="absolute inset-y-0 left-0 w-1/3 z-40"
        onClick={() => slideIndex > 0 && setSlideIndex((i) => i - 1)}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/3 z-40"
        onClick={() =>
          slideIndex < SLIDES_CONFIG.length - 1 && setSlideIndex((i) => i + 1)
        }
      />

      <div className="h-full w-full max-w-md mx-auto relative z-30 pointer-events-none flex items-center justify-center">
        <div
          className={`h-full w-full ${slideIndex === SLIDES_CONFIG.length - 1 ? "pointer-events-auto" : ""}`}
        >
          <CurrentSlide
            data={data}
            theme={currentTheme}
            onRestart={() => setView("login")}
          />
        </div>
      </div>
    </div>
  );
}
