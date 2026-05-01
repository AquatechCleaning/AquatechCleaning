"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [callbackUrl, router, status]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    setLoading(false);

    if (!result?.ok || result.error) {
      setError("Invalid email or password.");
      return;
    }

    router.replace(result.url || callbackUrl);
    router.refresh();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--navy)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />
      <form
        onSubmit={submit}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 800,
            color: "var(--navy)",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block",
            }}
          />
          Aquatech Admin
        </div>

        {error && (
          <div
            style={{
              padding: "12px 14px",
              background: "#FEE2E2",
              border: "1px solid #FECACA",
              borderRadius: "8px",
              color: "#991b1b",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        <div className="ui-form-group">
          <label className="ui-label">Email</label>
          <input
            className="ui-input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="ui-form-group">
          <label className="ui-label">Password</label>
          <input
            className="ui-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button type="submit" className="ui-btn ui-btn-secondary" style={{ width: "100%", padding: "13px" }} disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <Link
          href="/"
          style={{
            display: "block",
            marginTop: "16px",
            fontSize: "13px",
            color: "var(--text-muted)",
            textDecoration: "none",
            textAlign: "center",
          }}
        >
          Back to site
        </Link>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
