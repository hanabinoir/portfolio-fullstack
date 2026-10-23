"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { getAdminSessionStatus, logoutAdmin } from "@/lib/admin-api";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/experiences", label: "Experiences" },
  { href: "/admin/skills", label: "Skills" },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getAdminSessionStatus();
        if (!session.authenticated) {
          router.replace("/admin/login");
          return;
        }
      } catch {
        router.replace("/admin/login");
        return;
      }

      setIsReady(true);
    };

    void checkAuth();
  }, [router]);

  const activePath = useMemo(() => {
    if (pathname === "/admin" || pathname === "/admin/") return "/admin";
    return pathname;
  }, [pathname]);

  const signOut = async () => {
    try {
      await logoutAdmin();
    } catch {
      // ignore logout errors and redirect to the login screen
    }

    router.replace("/admin/login");
  };

  if (!isReady) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0b1020",
          color: "#e5eefb",
          fontFamily: "sans-serif",
        }}
      >
        Checking access…
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "240px minmax(0, 1fr)",
        background: "#0b1020",
        color: "#e5eefb",
        fontFamily: "sans-serif",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid rgba(148, 163, 184, 0.2)",
          background: "rgba(15, 23, 42, 0.95)",
          padding: "24px 20px",
        }}
      >
        <div style={{ marginBottom: 32, fontWeight: 700, fontSize: 20 }}>
          Portfolio Admin
        </div>

        <nav aria-label="Admin navigation" style={{ display: "grid", gap: 8 }}>
          {navItems.map((item) => {
            const isActive = activePath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: "none",
                  display: "block",
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: isActive ? "#1d4ed8" : "transparent",
                  color: isActive ? "#ffffff" : "#cbd5e1",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => void signOut()}
          style={{
            marginTop: 28,
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(148, 163, 184, 0.3)",
            background: "transparent",
            color: "#e2e8f0",
            cursor: "pointer",
          }}
        >
          Log out
        </button>
      </aside>

      <main style={{ padding: 32 }}>{children}</main>
    </div>
  );
}
