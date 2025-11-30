"use client";

import { useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BadgeInfo,
  CircleHelp,
  Github,
  Key,
  UserIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";
import { CustomEase } from "gsap/CustomEase";

// Register Plugins
gsap.registerPlugin(TextPlugin, CustomEase);

// Create Advanced Custom Eases
CustomEase.create(
  "superElastic",
  "M0,0 C0.05,0.8 0.04,1.34 0.15,1.39 0.26,1.44 0.48,1.05 0.58,1.02 0.68,0.99 0.818,1.001 1,1",
);
CustomEase.create(
  "snapBack",
  "M0,0 C0.2,0 0.2,1.4 0.4,1.4 0.5,1.4 0.5,1 0.6,1 0.72,1 0.735,1.003 1,1",
);

interface LoginScreenProps {
  onGenerate: (username: string, token: string) => void;
  loading: boolean;
  error: string | null;
}

export const LoginScreen = ({
  onGenerate,
  loading,
  error,
}: LoginScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // State for inputs
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onGenerate(username, token);
    }
  };

  // Character arrays
  const titleChars = [
    "G",
    "i",
    "t",
    "H",
    "u",
    "b",
    "\u00A0",
    "W",
    "r",
    "a",
    "p",
  ];
  const yearChars = ["2", "0", "2", "5"];

  useGSAP(
    () => {
      const chars = gsap.utils.toArray(".title-char", containerRef.current);
      const yearSplit = gsap.utils.toArray(".year-char", containerRef.current);
      const icon = containerRef.current?.querySelector(".hero-icon");
      const formGroup = containerRef.current?.querySelector(".form-container");

      // Initial Setup
      gsap.set(chars, { opacity: 0 });
      gsap.set(yearSplit, { opacity: 0 });
      gsap.set(".input-anim", { opacity: 0, rotateX: -90 });
      gsap.set(".info-anim", { opacity: 0, y: 10 });
      gsap.set(".btn-anim", { scale: 0, opacity: 0 });
      gsap.set(".error-anim", { opacity: 0, y: -10 });

      const tl = gsap.timeline();

      // --- 1. ICON ENTRANCE ---
      if (icon) {
        tl.fromTo(
          icon,
          { scale: 0, rotation: -540, opacity: 0, filter: "blur(20px)" },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "superElastic",
          },
        ).to(
          icon,
          {
            rotation: 10,
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            ease: "sine.inOut",
          },
          "-=0.4",
        );
      }

      // --- 2. SUBTITLE ---
      tl.to(
        ".subtitle",
        {
          text: { value: "It's time for", delimiter: "" },
          duration: 0.8,
          ease: "none",
        },
        "-=0.8",
      );

      // --- 3. TITLE SEQUENCE ---
      if (chars[0]) {
        tl.fromTo(
          chars[0],
          { opacity: 0, scale: 5, z: 500, rotation: 360 },
          {
            opacity: 1,
            scale: 1,
            z: 0,
            rotation: 0,
            duration: 1,
            ease: "superElastic",
          },
          "-=0.4",
        );
      }

      const itHubChars = [
        chars[1],
        chars[2],
        chars[3],
        chars[4],
        chars[5],
      ].filter((c) => c);
      if (itHubChars.length > 0) {
        tl.fromTo(
          itHubChars,
          { opacity: 0, y: -100, rotationX: 180 },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            stagger: 0.05,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.7",
        );
      }

      // --- 4. THE "WRAP" GLITCH ---
      const wChar = chars[7];
      if (wChar) {
        const glitchTl = gsap.timeline();
        glitchTl
          .set(wChar, { opacity: 1 })
          .fromTo(
            wChar,
            { x: 5, scaleX: 1.5, color: "#ef4444" },
            { x: -5, scaleX: 0.8, color: "#3b82f6", duration: 0.04 },
          )
          .to(wChar, {
            x: 3,
            scaleX: 1.2,
            color: "#22c55e",
            skewX: 20,
            duration: 0.04,
          })
          .to(wChar, {
            x: -3,
            scaleX: 0.9,
            color: "#eab308",
            skewX: -10,
            duration: 0.04,
          })
          .to(wChar, {
            x: 0,
            scaleX: 1,
            color: "#ffffff",
            skewX: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
          });
        tl.add(glitchTl, "-=0.1");
      }

      const rapChars = [chars[8], chars[9], chars[10]].filter((c) => c);
      if (rapChars.length > 0) {
        tl.fromTo(
          rapChars,
          { opacity: 0, rotationY: -180, x: 50 },
          {
            opacity: 1,
            rotationY: 0,
            x: 0,
            stagger: 0.05,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "<0.1",
        );
      }

      // --- 5. YEAR SLOT MACHINE ---
      tl.fromTo(
        yearSplit,
        { opacity: 0, y: 50, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.1,
          duration: 0.8,
          ease: "snapBack",
        },
        "-=0.5",
      );

      // --- 6. FORM REVEAL ---
      if (formGroup) {
        tl.to(formGroup, { opacity: 1, duration: 0.1 }, "-=0.5");
      }

      tl.fromTo(
        ".input-anim",
        { y: 50, rotateX: -90, transformOrigin: "top center", opacity: 0 },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "superElastic",
        },
        "-=0.4",
      );

      tl.fromTo(
        ".info-anim",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.2",
      );

      tl.fromTo(
        ".btn-anim",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.6)" },
        "-=0.4",
      );

      // Error message animation (if present)
      if (error) {
        tl.fromTo(
          ".error-anim",
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.3 },
        );
      }
    },
    { scope: containerRef, dependencies: [error] }, // Re-run if error appears
  );

  return (
    <div
      ref={containerRef}
      className="min-h-svh flex flex-col items-center justify-center bg-black overflow-hidden perspective-1000 p-4 font-space"
    >
      <div>
        <div className="hero-icon inline-block mb-1">
          <Github className="text-white w-8 h-8 md:w-[30px] md:h-[30px]" />
        </div>

        <p className="subtitle text-white/70 text-xl md:text-2xl ml-0.5 tracking-tighter min-h-8"></p>

        <h2
          className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter"
          style={{ transformStyle: "preserve-3d" }}
        >
          {titleChars.map((char, i) => (
            <span
              key={i}
              className={`title-char inline-block will-change-transform ${char === "W" ? "text-white" : ""}`}
            >
              {char}
            </span>
          ))}
        </h2>

        <h2 className="year-text text-2xl md:text-3xl font-black text-white float-end mt-1 overflow-hidden flex justify-end">
          {yearChars.map((char, i) => (
            <span key={i} className="year-char inline-block">
              {char}
            </span>
          ))}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="form-container max-w-sm w-full mt-6 opacity-0 perspective-800"
      >
        <div className="input-anim flex items-center border-gray-700 border p-2.5 md:p-3 gap-2 rounded-xl bg-black focus-within:border-white/50 transition-colors">
          <UserIcon className="text-white/70 w-5 h-5 md:w-6 md:h-6" />
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="text-white outline-none text-lg md:text-xl w-full bg-transparent placeholder:text-white/40"
          />
        </div>

        <div className="input-anim flex items-center justify-between mt-4">
          <h2 className="font-semibold text-white leading-none tracking-tighter text-sm md:text-base">
            Access Token
          </h2>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <CircleHelp
                    className="text-white/70 hover:text-white transition-colors"
                    size={15}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm w-full text-balance text-center bg-zinc-900 border-zinc-800 text-zinc-300">
                This is optional, but using a PAT unlocks private stats and
                heatmap accuracy.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="input-anim flex items-center border-gray-700 border p-2.5 md:p-3 gap-2 rounded-xl mt-1 bg-black focus-within:border-white/50 transition-colors">
          <Key className="text-white/70 w-5 h-5 md:w-6 md:h-6" />
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_••••"
            className="text-white outline-none text-lg md:text-xl w-full bg-transparent placeholder:text-white/40"
          />
        </div>

        {/* Info Section */}
        <div className="info-anim flex items-center gap-1 mt-3 opacity-0">
          <BadgeInfo className="text-white/50" size={20} />
          <p className="text-xs text-white/50 leading-none tracking-tight">
            Don&apos;t worry, we won&apos;t save your PAT anywhere.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-anim flex items-center gap-2 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="btn-anim bg-white text-black p-3 w-full mt-5 rounded-xl font-bold tracking-tighter text-lg md:text-xl hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Wrapping...
            </>
          ) : (
            "Wrap Go"
          )}
        </button>
      </form>
    </div>
  );
};
