import { useState, useEffect } from "react";

const colors = [
  "hsl(var(--primary))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const AnimatedLogo = () => {
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-xl font-bold text-foreground tracking-wide">
      LUM
      <span className="relative inline-block">
        <span className="invisible">I</span>
        <span className="absolute inset-0 flex flex-col items-center">
          <span
            className="h-1.5 w-1.5 rounded-full transition-colors duration-300"
            style={{ backgroundColor: colors[colorIndex] }}
          />
          <span className="h-3.5 w-0.5 bg-foreground mt-0.5" />
        </span>
      </span>
      NA
    </span>
  );
};

export default AnimatedLogo;
