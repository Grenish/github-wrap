import { Theme } from "./types";

export const THEMES: Theme[] = [
  {
    id: "graphite",
    bg: "bg-[#09090b]",
    text: "text-zinc-400",
    highlight: "text-zinc-50",
    accent: "text-white",
    gradient: "from-white via-zinc-400 to-zinc-600",
    blob1: "bg-zinc-100/5",
    blob2: "bg-white/5",
    border: "border-zinc-800",
  },
  {
    id: "terminal",
    bg: "bg-[#000000]",
    text: "text-green-400/80",
    highlight: "text-green-400",
    accent: "text-green-500",
    gradient: "from-green-400 to-emerald-600",
    blob1: "bg-green-500/10",
    blob2: "bg-emerald-500/10",
    border: "border-green-500/20",
  },
  {
    id: "ocean",
    bg: "bg-[#011627]",
    text: "text-blue-200/60",
    highlight: "text-blue-50",
    accent: "text-cyan-400",
    gradient: "from-cyan-400 via-sky-500 to-blue-600",
    blob1: "bg-cyan-500/10",
    blob2: "bg-blue-600/20",
    border: "border-slate-800",
  },
  {
    id: "ember",
    bg: "bg-[#1c1917]",
    text: "text-orange-200/60",
    highlight: "text-orange-50",
    accent: "text-amber-500",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    blob1: "bg-orange-500/15",
    blob2: "bg-red-500/10",
    border: "border-stone-800",
  },
  {
    id: "dracula",
    bg: "bg-[#282a36]",
    text: "text-purple-200/70",
    highlight: "text-white",
    accent: "text-pink-400",
    gradient: "from-purple-400 via-pink-400 to-red-400",
    blob1: "bg-purple-500/20",
    blob2: "bg-pink-500/20",
    border: "border-purple-500/20",
  },
  {
    id: "midnight",
    bg: "bg-[#050505]",
    text: "text-gray-400",
    highlight: "text-white",
    accent: "text-indigo-400",
    gradient: "from-white via-gray-200 to-gray-500",
    blob1: "bg-white/5",
    blob2: "bg-indigo-500/10",
    border: "border-neutral-800",
  },
  {
    id: "forest",
    bg: "bg-[#022c22]",
    text: "text-emerald-200/60",
    highlight: "text-emerald-50",
    accent: "text-emerald-400",
    gradient: "from-emerald-400 to-teal-500",
    blob1: "bg-emerald-500/15",
    blob2: "bg-teal-500/15",
    border: "border-emerald-900",
  },
  {
    id: "amethyst",
    bg: "bg-[#1e1b4b]",
    text: "text-indigo-200/60",
    highlight: "text-indigo-50",
    accent: "text-violet-400",
    gradient: "from-violet-400 via-purple-500 to-indigo-600",
    blob1: "bg-violet-600/20",
    blob2: "bg-indigo-600/20",
    border: "border-indigo-900/50",
  },
  {
    id: "nebula",
    bg: "bg-[#0f172a]",
    text: "text-slate-400",
    highlight: "text-white",
    accent: "text-cyan-400",
    gradient: "from-indigo-400 via-cyan-400 to-sky-400",
    blob1: "bg-indigo-500/20",
    blob2: "bg-cyan-500/10",
    border: "border-slate-800",
  },
  {
    id: "cyber",
    bg: "bg-[#090014]",
    text: "text-fuchsia-200/70",
    highlight: "text-white",
    accent: "text-fuchsia-500",
    gradient: "from-fuchsia-500 via-purple-600 to-blue-600",
    blob1: "bg-fuchsia-600/20",
    blob2: "bg-blue-600/20",
    border: "border-fuchsia-900/30",
  },
  {
    id: "aurora",
    bg: "bg-[#111827]",
    text: "text-teal-200/60",
    highlight: "text-white",
    accent: "text-teal-300",
    gradient: "from-teal-300 via-emerald-300 to-green-400",
    blob1: "bg-teal-500/15",
    blob2: "bg-emerald-500/15",
    border: "border-gray-800",
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
