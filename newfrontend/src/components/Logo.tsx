import { Sparkles } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7",
  };

  const containerSizes = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${containerSizes[size]} rounded-lg bg-primary`}>
        <Sparkles className={`${iconSizes[size]} text-primary-foreground`} />
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-semibold text-foreground tracking-tight`}>
          OnboardingAI
        </span>
      )}
    </div>
  );
}
