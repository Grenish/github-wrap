"use client";

import React, { useRef } from "react";
import { WrappedData, Theme } from "@/lib/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { Code } from "lucide-react";

gsap.registerPlugin(TextPlugin);

interface LanguageSlideProps {
  data: WrappedData;
  theme: Theme;
}

export const LanguageSlide: React.FC<LanguageSlideProps> = ({
  data,
  theme,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const topLanguage = data.languages[0]?.name.toUpperCase() || "CODE";

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".badge-anim", {
        scale: 0,
        rotation: -360,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      })
        .from(
          ".title-anim",
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.2",
        )
        .to(".hero-lang", {
          text: {
            value: topLanguage,
            delimiter: "",
          },
          duration: 0.8,
          ease: "none",
        })
        .fromTo(
          ".cursor",
          { opacity: 0 },
          { opacity: 1, repeat: 5, yoyo: true, duration: 0.1 },
          "<",
        );

      tl.from(
        ".lang-row",
        {
          rotationX: -45,
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "back.out(1.5)",
        },
        "-=0.4",
      );

      const bars = gsap.utils.toArray<HTMLElement>(".progress-bar");
      const numbers = gsap.utils.toArray<HTMLElement>(".percent-text");

      bars.forEach((bar, i) => {
        tl.from(
          bar,
          {
            scaleX: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.6)",
          },
          `-=${i === 0 ? 0.4 : 1.1}`,
        );

        const numTarget = numbers[i];
        const targetVal = data.languages[i].percent;
        const counter = { val: 0 };

        tl.to(
          counter,
          {
            val: targetVal,
            duration: 1,
            ease: "power2.out",
            onUpdate: () => {
              if (numTarget) {
                numTarget.innerText = Math.round(counter.val) + "%";
              }
            },
          },
          "<",
        );
      });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="h-full flex flex-col justify-center p-6 md:p-8 relative z-10 perspective-1000"
    >
      <div className="space-y-2 mb-8">
        <div className="badge-anim inline-block mb-2">
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
        </div>

        <h1 className="text-5xl font-bold text-white leading-tight">
          <span className="title-anim inline-block">You Speak</span> <br />
          <span
            className={`text-transparent bg-clip-text bg-linear-to-r ${theme.gradient}`}
          >
            <span className="hero-lang"></span>
            <span className="cursor text-white inline-block ml-1">|</span>
          </span>
        </h1>
      </div>

      <div className="space-y-5">
        {data.languages.slice(0, 5).map((lang) => (
          <div key={lang.name} className="lang-row group perspective-500">
            <div className="flex justify-between items-end mb-2">
              <span className="text-lg font-bold text-white group-hover:translate-x-1 transition-transform duration-300">
                {lang.name}
              </span>
              <span className={`percent-text text-sm font-mono ${theme.text}`}>
                0%
              </span>
            </div>

            <div className="h-4 w-full rounded-full bg-white/10 overflow-hidden backdrop-blur-sm">
              <div
                className={`progress-bar h-full rounded-full origin-left ${
                  theme.bg === "bg-[#000000]" ? "bg-white" : ""
                }`}
                style={{
                  width: `${lang.percent}%`,
                  backgroundColor:
                    theme.bg !== "bg-[#000000]" ? lang.color : undefined,
                  boxShadow: `0 0 10px ${lang.color}40`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
