"use client";

import React, { useState, useEffect, useRef } from "react";
import { PauseCircle, PlayCircle } from "lucide-react";
import { Space_Grotesk } from "next/font/google";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { THEMES } from "@/lib/constants";
import { WrappedData } from "@/lib/types";
import { fetchGitHubData } from "@/lib/github";

import { Background } from "@/components/background";
import { ProgressBar } from "@/components/progress-bar";
import { LoginScreen } from "@/components/login-screen";

import { IntroSlide } from "@/components/slides/intro-slide";
import { StatsSlide } from "@/components/slides/stats-slide";
import { LanguageSlide } from "@/components/slides/language-slide";
import { ProductiveDaySlide } from "@/components/slides/productive-day-slide";
import { FunStatsSlide } from "@/components/slides/fun-stats-slide";
import { ProjectSlide } from "@/components/slides/project-slide";
import { ActivitySlide } from "@/components/slides/activity-slide";
import { WorkStyleSlide } from "@/components/slides/work-style-slide";
import { TimingSlide } from "@/components/slides/timing-slide";
import { RemarksSlide } from "@/components/slides/remarks-slide";
import { SummarySlide } from "@/components/slides/summary-slide";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-space",
});

const SLIDES_CONFIG = [
  { id: "intro", component: IntroSlide, themeId: "graphite" },
  { id: "stats", component: StatsSlide, themeId: "terminal" },
  { id: "languages", component: LanguageSlide, themeId: "ocean" },
  { id: "productive-day", component: ProductiveDaySlide, themeId: "ember" },
  { id: "fun-stats", component: FunStatsSlide, themeId: "dracula" },
  { id: "projects", component: ProjectSlide, themeId: "midnight" },
  { id: "activity", component: ActivitySlide, themeId: "forest" },
  { id: "workstyle", component: WorkStyleSlide, themeId: "amethyst" },
  { id: "timing", component: TimingSlide, themeId: "nebula" },
  { id: "remarks", component: RemarksSlide, themeId: "cyber" },
  { id: "summary", component: SummarySlide, themeId: "aurora" },
];

export default function Home() {
  const [view, setView] = useState<"login" | "story">("login");
  const [data, setData] = useState<WrappedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideContainerRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (username: string, token: string) => {
    setLoading(true);
    setError(null);

    try {
      const gitData = await fetchGitHubData(username, token);

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view !== "story" || isPaused || slideIndex >= SLIDES_CONFIG.length - 1)
      return;
    const timer = setTimeout(() => setSlideIndex((prev) => prev + 1), 7000);
    return () => clearTimeout(timer);
  }, [slideIndex, view, isPaused]);

  useGSAP(() => {
    if (view === "story" && slideContainerRef.current) {
      gsap.fromTo(
        slideContainerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" },
      );
    }
  }, [slideIndex, view]);

  if (view === "login" || !data) {
    return (
      <main className={`${spaceGrotesk.variable} font-sans`}>
        <LoginScreen
          onGenerate={handleGenerate}
          loading={loading}
          error={error}
        />
      </main>
    );
  }

  const CurrentSlide = SLIDES_CONFIG[slideIndex].component;
  const currentTheme =
    THEMES.find((t) => t.id === SLIDES_CONFIG[slideIndex].themeId) || THEMES[0];

  return (
    <main
      className={`fixed inset-0 overflow-hidden ${spaceGrotesk.variable} font-sans transition-colors duration-1000 ease-in-out ${currentTheme.bg}`}
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <Background theme={currentTheme} />

      <ProgressBar
        total={SLIDES_CONFIG.length}
        current={slideIndex}
        active={!isPaused}
      />

      <button
        type="button"
        aria-label={isPaused ? "Play" : "Pause"}
        onClick={(e) => {
          e.stopPropagation();
          setIsPaused(!isPaused);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        className="absolute top-8 right-6 z-50 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all text-white border border-white/10 cursor-pointer"
      >
        {isPaused ? <PlayCircle size={20} /> : <PauseCircle size={20} />}
      </button>

      {/* Prev Slide Touch Area */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Previous Slide"
        className="absolute inset-y-0 left-0 w-1/3 z-40 outline-none"
        onClick={() => {
          if (slideIndex > 0) setSlideIndex((i) => i - 1);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            if (slideIndex > 0) setSlideIndex((i) => i - 1);
          }
        }}
      />

      {/* Next Slide Touch Area */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Next Slide"
        className="absolute inset-y-0 right-0 w-1/3 z-40 outline-none"
        onClick={() => {
          if (slideIndex < SLIDES_CONFIG.length - 1)
            setSlideIndex((i) => i + 1);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            if (slideIndex < SLIDES_CONFIG.length - 1)
              setSlideIndex((i) => i + 1);
          }
        }}
      />

      <div className="h-full w-full max-w-md mx-auto relative z-30 pointer-events-none flex items-center justify-center">
        <div
          ref={slideContainerRef}
          className={`h-full w-full ${
            slideIndex === SLIDES_CONFIG.length - 1 ? "pointer-events-auto" : ""
          }`}
        >
          <CurrentSlide
            data={data}
            theme={currentTheme}
            onRestart={() => setView("login")}
          />
        </div>
      </div>
    </main>
  );
}
