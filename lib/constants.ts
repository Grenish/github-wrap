import { Theme } from "./types";

export const THEMES: Theme[] = [
  {
    id: "obsidian",
    bg: "bg-[#09090b]", // Zinc 950
    text: "text-zinc-400",
    highlight: "text-zinc-100",
    accent: "text-white",
    gradient: "from-white via-zinc-400 to-zinc-600",
    blob1: "bg-zinc-100/10",
    blob2: "bg-white/5",
    border: "border-zinc-800",
  },
  {
    id: "tokyo",
    bg: "bg-[#0f0c29]",
    text: "text-purple-200",
    highlight: "text-white",
    accent: "text-fuchsia-400",
    gradient: "from-fuchsia-500 via-purple-500 to-cyan-500",
    blob1: "bg-fuchsia-600/20",
    blob2: "bg-cyan-600/20",
    border: "border-white/10",
  },
  {
    id: "emerald",
    bg: "bg-[#022c22]", // Rich deep green
    text: "text-emerald-100/70",
    highlight: "text-emerald-50",
    accent: "text-emerald-400",
    gradient: "from-emerald-400 to-teal-400",
    blob1: "bg-emerald-500/20",
    blob2: "bg-teal-500/20",
    border: "border-emerald-800/50",
  },
  // 4. Warm, sunset gradient (Instagram/Linear gradient style)
  {
    id: "sunset",
    bg: "bg-[#1c1917]", // Stone 950
    text: "text-stone-400",
    highlight: "text-stone-100",
    accent: "text-orange-400",
    gradient: "from-orange-400 via-rose-400 to-purple-500",
    blob1: "bg-orange-500/20",
    blob2: "bg-rose-500/20",
    border: "border-stone-800",
  },
  {
    id: "abyss",
    bg: "bg-[#0B1120]", // Custom Navy
    text: "text-slate-400",
    highlight: "text-white",
    accent: "text-sky-400",
    gradient: "from-sky-400 to-blue-600",
    blob1: "bg-sky-500/20",
    blob2: "bg-blue-600/20",
    border: "border-slate-800",
  },
  {
    id: "gilded",
    bg: "bg-[#000000]",
    text: "text-neutral-400",
    highlight: "text-white",
    accent: "text-amber-300",
    gradient: "from-amber-200 via-yellow-400 to-amber-500",
    blob1: "bg-amber-500/15",
    blob2: "bg-yellow-500/10",
    border: "border-neutral-800",
  },
];

export const formatNumber = (num: number | string) => {
  if (num === "???") return "???";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(Number(num) || 0);
};

export const getHourLabel = (hour: number) => {
  if (hour < 5) return "Late Night Owl";
  if (hour < 12) return "Morning Bird";
  if (hour < 18) return "Day Hustler";
  return "Evening Hacker";
};
