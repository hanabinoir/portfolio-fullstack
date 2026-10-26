import Link from "next/link";

const cards = [
  { href: "/admin/profile", title: "Profile", summary: "Manage the public profile and contact links." },
  { href: "/admin/experiences", title: "Experiences", summary: "Create, edit, and remove work history entries." },
  { href: "/admin/skills", title: "Skills", summary: "Update skill categories and featured expertise." },
] as const;

export default function AdminDashboardPage() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <header>
        <p style={{ margin: 0, color: "#93c5fd", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5 }}>
          Content management
        </p>
        <h1 style={{ margin: "8px 0 0", fontSize: 36 }}>Dashboard</h1>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{
              display: "block",
              padding: 20,
              borderRadius: 16,
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              color: "#e2e8f0",
              textDecoration: "none",
            }}
          >
            <div style={{ fontSize: 12, color: "#93c5fd", textTransform: "uppercase", letterSpacing: 1.4 }}>
              Admin
            </div>
            <h2 style={{ margin: "12px 0 8px", fontSize: 24 }}>{card.title}</h2>
            <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.6 }}>{card.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
