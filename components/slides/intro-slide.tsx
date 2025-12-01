"use client";

import React, { useRef } from "react";
import { WrappedData, Theme } from "@/lib/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

// Register the plugin
gsap.registerPlugin(TextPlugin);

interface IntroSlideProps {
  data: WrappedData;
  theme: Theme;
}

export const IntroSlide: React.FC<IntroSlideProps> = ({ data, theme }) => {
  const container = useRef<HTMLDivElement>(null);

  // Split username into array for individual letter animation
  const usernameChars = data.user.login.split("");

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // 1. Initial Setup (Hide elements to prevent flash)
      gsap.set(".char", { opacity: 0 });
      gsap.set(".badge", { scale: 0 });

      // 2. Avatar: "The Big Bang" Entrance
      // spins in from -720deg with a massive elastic wobble
      tl.from(".avatar-container", {
        scale: 0,
        rotation: -720,
        opacity: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
      })

        // 3. Welcome Text: "Terminal Typewriter"
        // Types out the text character by character
        .from(
          ".welcome-text",
          {
            text: {
              value: "",
              delimiter: "",
            },
            duration: 0.8,
            ease: "none",
          },
          "-=0.8",
        )

        // 4. Username: "Rain of Letters"
        // Letters fall from Y: -100 with random rotation, landing with a bounce
        .fromTo(
          ".char",
          {
            y: -150,
            opacity: 0,
            rotationX: () => gsap.utils.random(-360, 360),
            rotationY: () => gsap.utils.random(-360, 360),
            scale: 0.5,
          },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.05, // Domino effect
            ease: "elastic.out(1, 0.6)",
          },
          "-=0.4",
        )

        // 5. Badge: "Pop"
        .to(
          ".badge",
          {
            scale: 1,
            duration: 0.5,
            ease: "back.out(2)",
          },
          "-=0.8",
        )

        // 6. Idle Animation: "Levitation"
        // Keeps the avatar moving slightly so the slide feels alive
        .to(".avatar-container", {
          y: -10,
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
      className="h-full flex flex-col justify-center items-center text-center p-8 space-y-8 relative z-10 perspective-1000"
    >
      {/* Avatar Group */}
      <div className="avatar-container relative group cursor-pointer">
        {/* Glowing Aura */}
        <div
          className={`absolute inset-0 bg-linear-to-tr ${theme.gradient} rounded-full blur-2xl opacity-40 animate-pulse group-hover:opacity-60 transition-duration-500`}
        />

        {/* Profile Image */}
        <img
          src={data.user.avatar_url}
          alt="Profile"
          className="w-36 h-36 md:w-48 md:h-48 rounded-full border-4 border-white/10 relative z-10 shadow-2xl object-cover transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
        />

        {/* ID Badge */}
        <div className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-xs px-3 py-1 rounded-full z-20 group-hover:bg-white/20 transition-colors">
          #{data.user.id.toString().slice(0, 4)}
        </div>
      </div>

      <div className="space-y-4 max-w-full">
        {/* Typewriter Text */}
        <h2
          className={`welcome-text text-xl font-medium ${theme.text} tracking-widest uppercase min-h-7`}
        >
          Welcome back
        </h2>

        {/* 3D Staggered Username */}
        <h1
          className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-none wrap-break-words"
          style={{ transformStyle: "preserve-3d" }}
        >
          {usernameChars.map((char, index) => (
            <span
              key={index}
              className="char inline-block will-change-transform origin-center"
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Conditional Badge */}
        {!data.isExact && (
          <div className="badge transform origin-center">
            <div className="text-xs text-white/50 bg-white/5 inline-block px-3 py-1 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
              Public Data Mode
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
