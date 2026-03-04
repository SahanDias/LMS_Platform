import { GraduationCap, BookOpen, Award, User, ShoppingCart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import AnimatedLogo from "./AnimatedLogo";

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <AnimatedLogo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/">
            <Button
              variant={isActive("/") ? "secondary" : "ghost"}
              className="gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Courses
            </Button>
          </Link>
          <Link to="/my-courses">
            <Button
              variant={isActive("/my-courses") ? "secondary" : "ghost"}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              My Learning
            </Button>
          </Link>
          <Link to="/certificates">
            <Button
              variant={isActive("/certificates") ? "secondary" : "ghost"}
              className="gap-2"
            >
              <Award className="h-4 w-4" />
              Certificates
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              2
            </span>
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              3
            </span>
          </Button>
          <Button variant="outline" size="sm">
            Sign In
          </Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
