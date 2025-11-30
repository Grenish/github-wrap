import { Theme } from "@/lib/types";

export const Background = ({ theme }: { theme: Theme }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none transition-colors duration-1000 ease-in-out">
    <div
      className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-40 animate-pulse-slow ${theme.blob1}`}
    />
    <div
      className={`absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-40 animate-pulse-slow ${theme.blob2}`}
      style={{ animationDelay: "2s" }}
    />
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none"></div>
  </div>
);
