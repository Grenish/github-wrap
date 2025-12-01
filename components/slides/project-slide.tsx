"use client";

import React, { useRef } from "react";
import { WrappedData, Theme } from "@/lib/types";
import { formatNumber } from "@/lib/constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText"; // Import SplitText
import { FolderGit2, Star, GitFork, ArrowUpRight } from "lucide-react";

// Register SplitText
gsap.registerPlugin(SplitText);

interface ProjectSlideProps {
  data: WrappedData;
  theme: Theme;
}

export const ProjectSlide: React.FC<ProjectSlideProps> = ({ data, theme }) => {
  const container = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null); // Ref for the title

  // Safety check to ensure we have an array
  const repos = data.repos || [];
  const hasRepos = repos.length > 0;

  useGSAP(
    () => {
      // 1. Prepare SplitText for the title
      // We split into characters for the most expressive stagger effect
      let titleSplit: SplitText | null = null;
      if (titleRef.current) {
        titleSplit = new SplitText(titleRef.current, { type: "chars" });
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // --- HEADER SEQUENCE ---
      tl.from(".header-badge", {
        y: 20,
        opacity: 0,
        duration: 0.8,
      });

      // Staggered Character Reveal for Title
      if (titleSplit && titleSplit.chars.length > 0) {
        tl.from(
          titleSplit.chars,
          {
            y: 40,
            opacity: 0,
            rotationX: -90, // Flip in from below
            stagger: 0.03, // Tight stagger for character ripples
            duration: 0.8,
            ease: "back.out(1.5)", // Subtle bounce on arrival
          },
          "-=0.6",
        );
      } else {
        // Fallback if split fails
        tl.from(".header-title", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6");
      }

      if (hasRepos) {
        // --- SMOOTH 3D CARD REVEAL ---
        // Using fromTo for precise control over starting and ending physics
        tl.fromTo(
          ".repo-card",
          {
            opacity: 0,
            y: 50,
            rotationX: 15, // Slight 3D tilt back
            scale: 0.95,
            filter: "blur(10px)", // Cinematic blur start
            transformOrigin: "center bottom",
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            scale: 1,
            filter: "blur(0px)", // Focus sharpens
            stagger: 0.12, // Smooth cascade
            duration: 1.2, // Longer duration for luxury feel
            ease: "power4.out", // Ultra-smooth deceleration
          },
          "-=0.6", // Overlap slightly with title finish
        );

        // --- STAR COUNTING ---
        const starCounts = container.current?.querySelectorAll(".star-count");
        starCounts?.forEach((el, index) => {
          const target = repos[index]?.stargazerCount || 0;
          const counter = { val: 0 };

          gsap.to(counter, {
            val: target,
            duration: 2, // Slower counting for emphasis
            ease: "power3.out",
            delay: 0.6 + index * 0.1, // Wait for cards to settle slightly
            onUpdate: () => {
              el.textContent = formatNumber(Math.floor(counter.val));
            },
          });
        });

        // --- ICON POPS ---
        tl.from(
          ".star-icon",
          {
            scale: 0,
            rotation: -72,
            opacity: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: "back.out(2)",
          },
          "-=1.5", // Start popping while cards are still moving
        );
      } else {
        // Fallback animation if no repos
        tl.from(".no-repos-msg", { opacity: 0, y: 20, duration: 1 });
      }

      // Cleanup: Revert text splitting on unmount/update so React doesn't get confused
      return () => {
        if (titleSplit) titleSplit.revert();
      };
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="h-full flex flex-col justify-center p-6 md:p-8 relative z-10 perspective-1000"
    >
      <div className="mb-8 md:mb-10">
        <div className="header-badge inline-flex items-center gap-2 mb-3">
          <div className={`p-2 rounded-full bg-white/5 border ${theme.border}`}>
            <FolderGit2 size={16} className={theme.accent} />
          </div>
          <h2
            className={`text-sm font-bold ${theme.text} uppercase tracking-widest`}
          >
            Crown Jewels
          </h2>
        </div>
        {/* Added ref and 'will-change' for optimization */}
        <h1
          ref={titleRef}
          className="header-title text-4xl md:text-6xl font-black text-white leading-tight will-change-transform"
        >
          Top Projects
        </h1>
      </div>

      <div className="space-y-4">
        {hasRepos ? (
          repos.slice(0, 3).map((repo) => (
            <div
              key={repo.name}
              // Added 'will-change-transform' for smoother animation performance
              className={`repo-card group relative p-4 md:p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:border-white/20 will-change-transform`}
            >
              {/* Top Row: Name & Link */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-lg bg-white/5 text-zinc-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                    <FolderGit2 size={20} />
                  </div>
                  <span className="font-bold text-lg md:text-xl text-white truncate group-hover:tracking-wide transition-all duration-300">
                    {repo.name}
                  </span>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                  <ArrowUpRight size={20} className="text-white/50" />
                </div>
              </div>

              {/* Bottom Row: Stats & Lang */}
              <div className="flex items-center justify-between mt-4">
                {/* Language Dot */}
                <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-zinc-400 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                  <span
                    className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{
                      backgroundColor: repo.primaryLanguage?.color || "#fff",
                      color: repo.primaryLanguage?.color || "#fff",
                    }}
                  />
                  <span className="text-zinc-300">
                    {repo.primaryLanguage?.name || "Code"}
                  </span>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4">
                  {/* Stars */}
                  <div className={`flex items-center gap-1.5 ${theme.text}`}>
                    <span className="star-count font-bold text-lg tabular-nums text-white">
                      0
                    </span>
                    <Star
                      size={16}
                      className="star-icon text-yellow-400 fill-yellow-400/20"
                    />
                  </div>
                  {/* Forks */}
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <span className="text-sm font-medium">
                      {formatNumber(repo.forkCount || 0)}
                    </span>
                    <GitFork size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-repos-msg p-8 rounded-2xl border border-dashed border-white/10 bg-white/5 text-center">
            <p className="text-zinc-400 italic">
              No public repositories found for this year.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
