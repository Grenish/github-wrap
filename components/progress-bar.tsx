"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  total: number;
  current: number;
  active: boolean;
  duration?: number;
  onComplete?: () => void;
}

export const ProgressBar = ({
  total,
  current,
  active,
  duration = 6,
  onComplete,
}: Props) => {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Handle animation creation and updates when current changes
  useEffect(() => {
    // Kill any existing animation
    tweenRef.current?.kill();
    tweenRef.current = null;

    barsRef.current.forEach((bar, index) => {
      if (!bar) return;

      if (index < current) {
        // Completed segments - fully filled
        gsap.set(bar, { scaleX: 1 });
      } else if (index > current) {
        // Upcoming segments - empty
        gsap.set(bar, { scaleX: 0 });
      } else {
        // Current segment - animate from 0 to 1
        gsap.set(bar, { scaleX: 0 });
        tweenRef.current = gsap.to(bar, {
          scaleX: 1,
          duration,
          ease: "none",
          paused: !active,
          onComplete,
        });
      }
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [current, duration, onComplete, total]);

  // Handle pause/resume separately to avoid resetting animation
  useEffect(() => {
    if (active) {
      tweenRef.current?.play();
    } else {
      tweenRef.current?.pause();
    }
  }, [active]);

  return (
    <div className="absolute top-0 left-0 w-full px-4 pt-4 flex gap-2 z-50 pointer-events-none safe-area-top">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm"
        >
          <div
            ref={(el) => {
              barsRef.current[i] = el;
            }}
            className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] origin-left will-change-transform"
          />
        </div>
      ))}
    </div>
  );
};
