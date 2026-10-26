"use client";

import { useEffect, useState } from "react";

import {
  createAdminSkill,
  deleteAdminSkill,
  listAdminSkills,
  updateAdminSkill,
} from "@/lib/admin-api";
import type { AdminSkillFormData, SkillResponse } from "@/types/api";

const emptySkill: AdminSkillFormData = {
  name: "",
  slug: "",
  category: "language",
  display_name: "",
  description: "",
  duration_months: 0,
  is_featured: false,
  order: 1,
};

export default function AdminSkillsPage() {
  const [items, setItems] = useState<SkillResponse[]>([]);
  const [form, setForm] = useState<AdminSkillFormData>(emptySkill);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const next = await listAdminSkills();
      setItems(next);
    };

    void load();
  }, []);

  const handleField = (key: keyof AdminSkillFormData, value: string | boolean | number) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSelect = (item: SkillResponse) => {
    setSelectedId(item.id);
    setForm({
      name: item.name,
      slug: item.slug,
      category: item.category,
      display_name: item.display_name,
      description: item.description,
      duration_months: item.duration_months ?? 0,
      is_featured: item.is_featured,
      order: item.order,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (selectedId) {
        const updated = await updateAdminSkill(selectedId, form);
        setItems((current) => current.map((item) => (item.id === selectedId ? updated : item)));
        setStatus("Skill updated.");
      } else {
        const created = await createAdminSkill(form);
        setItems((current) => [created, ...current]);
        setStatus("Skill created.");
      }

      setSelectedId(null);
      setForm(emptySkill);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save skill.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminSkill(id);
      setItems((current) => current.filter((item) => item.id !== id));
      setStatus("Skill deleted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete skill.");
    }
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <header>
        <p style={{ margin: 0, color: "#93c5fd", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5 }}>
          Manage skills
        </p>
        <h1 style={{ margin: "8px 0 0", fontSize: 32 }}>Skills</h1>
      </header>

      <div style={{ display: "grid", gap: 20 }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16, padding: 24, borderRadius: 16, background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <label style={{ display: "grid", gap: 8 }}>
              <span>Name</span>
              <input value={form.name} onChange={(event) => handleField("name", event.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "grid", gap: 8 }}>
              <span>Display name</span>
              <input value={form.display_name} onChange={(event) => handleField("display_name", event.target.value)} style={inputStyle} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <label style={{ display: "grid", gap: 8 }}>
              <span>Slug</span>
              <input value={form.slug} onChange={(event) => handleField("slug", event.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "grid", gap: 8 }}>
              <span>Category</span>
              <select value={form.category} onChange={(event) => handleField("category", event.target.value)} style={inputStyle}>
                <option value="language">Language</option>
                <option value="framework">Framework</option>
                <option value="tool">Tool</option>
                <option value="os">Operating system</option>
                <option value="cloud">Cloud</option>
                <option value="database">Database</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          <label style={{ display: "grid", gap: 8 }}>
            <span>Description</span>
            <textarea rows={4} value={form.description} onChange={(event) => handleField("description", event.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            <label style={{ display: "grid", gap: 8 }}>
              <span>Duration months</span>
              <input type="number" value={form.duration_months ?? 0} onChange={(event) => handleField("duration_months", Number(event.target.value) || 0)} style={inputStyle} />
            </label>
            <label style={{ display: "grid", gap: 8 }}>
              <span>Order</span>
              <input type="number" value={form.order} onChange={(event) => handleField("order", Number(event.target.value) || 1)} style={inputStyle} />
            </label>
          </div>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" checked={form.is_featured} onChange={(event) => handleField("is_featured", event.target.checked)} />
            <span>Featured</span>
          </label>

          {status ? <div role="status" style={{ color: "#bfdbfe" }}>{status}</div> : null}

          <button type="submit" style={buttonStyle}>{selectedId ? "Update skill" : "Create skill"}</button>
        </form>

        <div style={{ display: "grid", gap: 12 }}>
          {items.length === 0 ? (
            <div style={{ padding: 20, borderRadius: 12, background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
              No skills available.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: 18, borderRadius: 12, background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{item.display_name || item.name}</div>
                  <div style={{ color: "#cbd5e1" }}>{item.category}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => handleSelect(item)} style={secondaryButtonStyle}>Edit</button>
                  <button type="button" onClick={() => void handleDelete(item.id)} style={dangerButtonStyle}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(148, 163, 184, 0.3)",
  background: "#0f172a",
  color: "#f8fafc",
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  width: "fit-content",
  padding: "12px 16px",
  border: 0,
  borderRadius: 10,
  background: "#2563eb",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid rgba(148, 163, 184, 0.3)",
  background: "transparent",
  color: "#e2e8f0",
  cursor: "pointer",
};

const dangerButtonStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 10,
  border: 0,
  background: "#dc2626",
  color: "#fff",
  cursor: "pointer",
};
