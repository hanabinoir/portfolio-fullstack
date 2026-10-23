"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const ADMIN_SESSION_KEY = "portfolio-admin-session";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem(ADMIN_SESSION_KEY) === "active"
    ) {
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Enter your admin username and password.");
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(ADMIN_SESSION_KEY, "active");
    }

    router.replace("/admin");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #020817, #0f172a)",
        color: "#e2e8f0",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "min(440px, calc(100vw - 32px))",
          padding: 32,
          borderRadius: 16,
          border: "1px solid rgba(148, 163, 184, 0.15)",
          background: "rgba(15, 23, 42, 0.92)",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.45)",
        }}
      >
        <h1 style={{ margin: "0 0 8px", fontSize: 30 }}>Portfolio Admin</h1>
        <p style={{ margin: "0 0 24px", color: "#cbd5e1" }}>
          Sign in to manage your portfolio content.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          <label style={{ display: "grid", gap: 8 }}>
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(148, 163, 184, 0.3)",
                background: "#0f172a",
                color: "#f8fafc",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 8 }}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(148, 163, 184, 0.3)",
                background: "#0f172a",
                color: "#f8fafc",
              }}
            />
          </label>

          {error ? (
            <div role="alert" style={{ color: "#fca5a5", fontSize: 14 }}>
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            style={{
              padding: "12px 16px",
              border: 0,
              borderRadius: 10,
              background: "#2563eb",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
