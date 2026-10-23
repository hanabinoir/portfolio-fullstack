"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { getAdminSessionStatus, loginAdmin } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const status = await getAdminSessionStatus();
        if (status.authenticated) {
          router.replace("/admin");
          return;
        }
      } catch {
        // allow user to sign in manually
      } finally {
        setIsChecking(false);
      }
    };

    void checkSession();
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Enter your admin username and password.");
      return;
    }

    try {
      const status = await loginAdmin(username, password);
      if (!status.authenticated) {
        setError("Your account is not authorized for admin access.");
        return;
      }

      router.replace("/admin");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    }
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
            disabled={isChecking}
            style={{
              padding: "12px 16px",
              border: 0,
              borderRadius: 10,
              background: "#2563eb",
              color: "#fff",
              fontWeight: 700,
              cursor: isChecking ? "wait" : "pointer",
              opacity: isChecking ? 0.65 : 1,
            }}
          >
            {isChecking ? "Checking session..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
