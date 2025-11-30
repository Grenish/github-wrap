interface Props {
  total: number;
  current: number;
  active: boolean;
}

export const ProgressBar = ({ total, current, active }: Props) => (
  <div className="absolute top-0 left-0 w-full px-4 pt-4 flex gap-2 z-50 pointer-events-none safe-area-top">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm"
      >
        <div
          className={`h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 ease-linear ${
            i < current
              ? "w-full"
              : i === current
                ? "w-full origin-left animate-progress"
                : "w-0"
          }`}
          style={
            i === current && active
              ? { animationDuration: "6s", animationName: "progress" }
              : {}
          }
        />
      </div>
    ))}
    <style jsx>{`
      @keyframes progress {
        from {
          transform: scaleX(0);
        }
        to {
          transform: scaleX(1);
        }
      }
      .animate-progress {
        animation-timing-function: linear;
        animation-fill-mode: forwards;
      }
    `}</style>
  </div>
);
