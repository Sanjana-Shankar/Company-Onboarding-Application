import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OnboardingAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
