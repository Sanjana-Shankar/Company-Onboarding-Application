import { 
  Briefcase, 
  Calendar, 
  Users, 
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  Building
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function DashboardTab() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome section */}
      <div className="card-elevated p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome to your new role! 🎉</h2>
            <p className="text-muted-foreground">
              Here's a summary of key information from your onboarding documents
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Onboarding Progress</p>
            <p className="text-2xl font-bold text-primary">35%</p>
          </div>
        </div>
        <Progress value={35} className="mt-4 h-2" />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          label="Start Date"
          value="Jan 15, 2024"
          color="primary"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="PTO Balance"
          value="15 days"
          color="accent"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Team Size"
          value="8 members"
          color="primary"
        />
        <StatCard
          icon={<Target className="w-5 h-5" />}
          label="90-Day Goals"
          value="5 items"
          color="accent"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Role Overview */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Role Overview</h3>
              <p className="text-sm text-muted-foreground">From your job description</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <InfoRow label="Title" value="Senior Product Manager" />
            <InfoRow label="Department" value="Product & Engineering" />
            <InfoRow label="Reports To" value="VP of Product" />
            <InfoRow label="Location" value="Remote (US)" />
          </div>
        </div>

        {/* Key Contacts */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">Key Contacts</h3>
              <p className="text-sm text-muted-foreground">People to know</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <ContactRow name="Sarah Chen" role="Your Manager" />
            <ContactRow name="Mike Johnson" role="HR Partner" />
            <ContactRow name="Lisa Wong" role="IT Support" />
            <ContactRow name="Alex Rivera" role="Mentor" />
          </div>
        </div>

        {/* Onboarding Checklist */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Onboarding Checklist</h3>
              <p className="text-sm text-muted-foreground">Tasks for your first week</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <ChecklistItem text="Complete new hire paperwork" done />
            <ChecklistItem text="Set up workstation & tools" done />
            <ChecklistItem text="Review employee handbook" />
            <ChecklistItem text="Meet with your manager" />
            <ChecklistItem text="Complete compliance training" />
          </div>
        </div>

        {/* Benefits Summary */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">Benefits Highlights</h3>
              <p className="text-sm text-muted-foreground">Your compensation package</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <BenefitItem icon={<FileText className="w-4 h-4" />} text="Medical, Dental & Vision" />
            <BenefitItem icon={<TrendingUp className="w-4 h-4" />} text="401(k) with 4% match" />
            <BenefitItem icon={<Calendar className="w-4 h-4" />} text="15 days PTO + holidays" />
            <BenefitItem icon={<Building className="w-4 h-4" />} text="Remote work flexibility" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: "primary" | "accent" }) {
  return (
    <div className="card-elevated p-4">
      <div className={`w-10 h-10 rounded-xl ${color === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ContactRow({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
        {name.split(" ").map(n => n[0]).join("")}
      </div>
      <div>
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}

function ChecklistItem({ text, done = false }: { text: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-1">
      {done ? (
        <CheckCircle2 className="w-5 h-5 text-accent" />
      ) : (
        <AlertCircle className="w-5 h-5 text-muted-foreground" />
      )}
      <span className={done ? "text-muted-foreground line-through" : ""}>{text}</span>
    </div>
  );
}

function BenefitItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="text-primary">{icon}</div>
      <span>{text}</span>
    </div>
  );
}
