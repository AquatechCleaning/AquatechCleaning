"use client";

import { useState } from "react";

export function CompleteJobButton({ jobId }: { jobId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const complete = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/jobs/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || "Unable to complete job.");
      window.location.reload();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to complete job.");
    }
  };

  return (
    <div style={{ display: "grid", gap: "4px" }}>
      <button
        type="button"
        onClick={complete}
        disabled={status === "loading"}
        style={{
          background: "#16a34a",
          border: "none",
          borderRadius: "6px",
          color: "#fff",
          cursor: "pointer",
          fontSize: "11px",
          fontWeight: 700,
          padding: "6px 10px",
          whiteSpace: "nowrap",
        }}
      >
        {status === "loading" ? "Completing..." : "Complete"}
      </button>
      {message ? <p style={{ color: "#991b1b", fontSize: "11px" }}>{message}</p> : null}
    </div>
  );
}
