import { useState, useEffect } from "react";

const colors = [
  "hsl(var(--primary))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const HeroLogo = () => {
  const [colorIndex, setColorIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`flex flex-col items-center justify-center transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="relative">
        {/* Glow effect behind logo */}
        <div 
          className="absolute inset-0 blur-3xl opacity-30 transition-colors duration-500 rounded-full scale-150"
          style={{ backgroundColor: colors[colorIndex] }}
        />
        
        {/* Main logo text */}
        <div className="relative flex items-baseline text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight">
          <span 
            className="text-secondary-foreground animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            L
          </span>
          <span 
            className="text-secondary-foreground animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            U
          </span>
          <span 
            className="text-secondary-foreground animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            M
          </span>
          
          {/* Animated I with color-changing dot */}
          <span 
            className="relative inline-flex flex-col items-center animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <span 
              className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-full transition-all duration-300 animate-pulse"
              style={{ 
                backgroundColor: colors[colorIndex],
                boxShadow: `0 0 20px ${colors[colorIndex]}, 0 0 40px ${colors[colorIndex]}50`
              }}
            />
            <span className="w-1.5 md:w-2 lg:w-2.5 h-10 md:h-12 lg:h-16 xl:h-20 bg-secondary-foreground mt-1 md:mt-1.5 rounded-sm" />
          </span>
          
          <span 
            className="text-secondary-foreground animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            N
          </span>
          <span 
            className="text-secondary-foreground animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            A
          </span>
        </div>
      </div>
      
      {/* Tagline */}
      <p 
        className="mt-6 text-lg md:text-xl lg:text-2xl text-secondary-foreground/70 font-light tracking-widest uppercase animate-fade-in"
        style={{ animationDelay: "0.8s" }}
      >
        Illuminate Your Learning
      </p>
      
      {/* Decorative line */}
      <div 
        className="mt-4 h-1 w-24 md:w-32 rounded-full transition-colors duration-500 animate-fade-in"
        style={{ 
          backgroundColor: colors[colorIndex],
          animationDelay: "1s"
        }}
      />
    </div>
  );
};

export default HeroLogo;
