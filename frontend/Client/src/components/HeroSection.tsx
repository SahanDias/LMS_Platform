import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import HeroLogo from "./HeroLogo";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/90 to-secondary/80" />
      
      <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left side - Animated Logo */}
          <div className="order-1 lg:order-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <span className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
              Start Learning Today
            </span>
            <h1 className="mb-6 text-3xl font-bold leading-tight text-secondary-foreground md:text-4xl lg:text-5xl">
              Unlock Your Potential with Expert-Led Courses
            </h1>
            <p className="mb-8 text-base text-secondary-foreground/80 md:text-lg">
              Join thousands of learners mastering new skills. Get certified and advance your career with our comprehensive learning platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2 group">
                Browse Courses
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 border-secondary-foreground/30 bg-secondary-foreground/10 text-secondary-foreground hover:bg-secondary-foreground/20 backdrop-blur-sm"
              >
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 md:gap-8">
              <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <div className="text-2xl md:text-3xl font-bold text-secondary-foreground">500+</div>
                <div className="text-sm text-secondary-foreground/70">Courses</div>
              </div>
              <div className="h-10 w-px bg-secondary-foreground/20" />
              <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <div className="text-2xl md:text-3xl font-bold text-secondary-foreground">50k+</div>
                <div className="text-sm text-secondary-foreground/70">Students</div>
              </div>
              <div className="h-10 w-px bg-secondary-foreground/20" />
              <div className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
                <div className="text-2xl md:text-3xl font-bold text-secondary-foreground">95%</div>
                <div className="text-sm text-secondary-foreground/70">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex items-center justify-center order-2 lg:order-1">
            <HeroLogo />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
