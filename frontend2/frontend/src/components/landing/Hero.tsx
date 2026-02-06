import { ArrowRight, FileText, MessageSquare, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AI-Powered Onboarding Assistant
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up">
            Start your new role with{" "}
            <span className="gradient-text">confidence</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Upload your company documents and let AI guide you through everything you need to know about your new position, benefits, and policies.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button variant="hero" asChild>
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button variant="hero-outline" asChild>
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              title="Upload Documents"
              description="Job descriptions, handbooks, benefits packages"
            />
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6" />}
              title="Ask Questions"
              description="Get instant answers from your documents"
            />
            <FeatureCard
              icon={<LayoutDashboard className="w-6 h-6" />}
              title="View Dashboard"
              description="Key insights about your role at a glance"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card-interactive p-6 text-left">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
