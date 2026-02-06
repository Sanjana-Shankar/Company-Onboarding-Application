import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { 
  Upload as UploadIcon, 
  FileText, 
  X, 
  ArrowRight,
  FileCheck,
  Briefcase,
  BookOpen,
  Heart,
  ClipboardList
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

const documentTypes = [
  { icon: Briefcase, label: "Job Description", hint: "Your role & responsibilities" },
  { icon: BookOpen, label: "Employee Handbook", hint: "Company policies & culture" },
  { icon: Heart, label: "Benefits Package", hint: "Healthcare, PTO, perks" },
  { icon: ClipboardList, label: "Onboarding Checklist", hint: "Tasks & deadlines" },
];

export default function Upload() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleContinue = () => {
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Logo size="md" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Progress indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="text-sm font-medium">Account</span>
            </div>
            <div className="flex-1 h-0.5 bg-primary" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="text-sm font-medium">Documents</span>
            </div>
            <div className="flex-1 h-0.5 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="text-sm text-muted-foreground">Ready</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-2">Upload your documents</h1>
          <p className="text-muted-foreground mb-8">
            Add your company documents so our AI can help answer your questions
          </p>

          {/* Document type hints */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {documentTypes.map(({ icon: Icon, label, hint }) => (
              <div key={label} className="p-4 rounded-xl border bg-card text-center">
                <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{hint}</p>
              </div>
            ))}
          </div>

          {/* Upload area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200
              ${isDragging 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50 hover:bg-muted/50"
              }
            `}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <UploadIcon className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-medium mb-2">
              Drag and drop your files here
            </p>
            <p className="text-muted-foreground mb-4">
              or click to browse from your computer
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
              accept=".pdf,.doc,.docx,.txt,.md"
            />
            <Button variant="outline" asChild>
              <label htmlFor="file-input" className="cursor-pointer">
                Browse Files
              </label>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Supported: PDF, DOC, DOCX, TXT, MD
            </p>
          </div>

          {/* Uploaded files list */}
          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-medium">Uploaded files ({files.length})</h3>
              {files.map(file => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-4 rounded-xl border bg-card"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <FileCheck className="w-5 h-5 text-accent" />
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Continue button */}
          <div className="mt-8 flex justify-end gap-4">
            <Button variant="ghost" onClick={() => navigate("/app")}>
              Skip for now
            </Button>
            <Button
              variant="gradient"
              onClick={handleContinue}
              disabled={files.length === 0}
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
