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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function handleUpload() {
    if (!file) {
      setError("Please choose a file first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${API_BASE}/chatbot/upload`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || `Upload failed (${res.status})`);
      }

      const sessionId: string = data.session_id;
      localStorage.setItem("chatbot_session_id", sessionId);

      // Navigate to chat page
      navigate("/chat", { state: { sessionId } });
    } catch (e: any) {
      setError(e?.message ?? "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Upload a document</h1>

      <input
        type="file"
        accept=".pdf,.txt,.doc,.docx"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <div style={{ marginTop: 12 }}>
        <button onClick={handleUpload} disabled={!file || loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}
