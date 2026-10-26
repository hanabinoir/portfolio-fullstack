"use client";

import { useEffect, useState } from "react";

import {
  createAdminExperience,
  deleteAdminExperience,
  listAdminExperiences,
  updateAdminExperience,
} from "@/lib/admin-api";
import type { AdminExperienceFormData, ExperienceResponse } from "@/types/api";

const emptyExperience: AdminExperienceFormData = {
  slug: "",
  role: "",
  title: "",
  overview: "",
  responsibilities: "",
  contributions: "",
  start_date: "2024-01-01",
  end_date: null,
  employer: "",
  client: null,
  is_published: true,
  order: 1,
  urls: [],
};

export default function AdminExperiencesPage() {
  const [items, setItems] = useState<ExperienceResponse[]>([]);
  const [form, setForm] = useState<AdminExperienceFormData>(emptyExperience);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const next = await listAdminExperiences();
      setItems(next);
    };

    void load();
  }, []);

  const handleField = (key: keyof AdminExperienceFormData, value: string | boolean | number | null) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSelect = (item: ExperienceResponse) => {
    setSelectedId(item.id);
    setForm({
      slug: item.slug,
      role: item.role,
      title: item.title,
      overview: item.overview,
      responsibilities: item.responsibilities,
      contributions: item.contributions ?? "",
      start_date: item.start_date,
      end_date: item.end_date,
      employer: item.employer,
      client: item.client,
      is_published: true,
      order: 1,
      urls: item.urls,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (selectedId) {
        const updated = await updateAdminExperience(selectedId, form);
        setItems((current) => current.map((item) => (item.id === selectedId ? updated : item)));
        setStatus("Experience updated.");
      } else {
        const created = await createAdminExperience(form);
        setItems((current) => [created, ...current]);
        setStatus("Experience created.");
      }

      setSelectedId(null);
      setForm(emptyExperience);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save experience.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminExperience(id);
      setItems((current) => current.filter((item) => item.id !== id));
      setStatus("Experience deleted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete experience.");
    }
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <header>
        <p style={{ margin: 0, color: "#93c5fd", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5 }}>
          Manage experiences
        </p>
        <h1 style={{ margin: "8px 0 0", fontSize: 32 }}>Experiences</h1>
      </header>

      <div style={{ display: "grid", gap: 20 }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16, padding: 24, borderRadius: 16, background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <label style={{ display: "grid", gap: 8 }}>
              <span>Role</span>
              <input value={form.role} onChange={(event) => handleField("role", event.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "grid", gap: 8 }}>
              <span>Title</span>
              <input value={form.title} onChange={(event) => handleField("title", event.target.value)} style={inputStyle} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <label style={{ display: "grid", gap: 8 }}>
              <span>Employer</span>
              <input value={form.employer} onChange={(event) => handleField("employer", event.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "grid", gap: 8 }}>
              <span>Client</span>
              <input value={form.client ?? ""} onChange={(event) => handleField("client", event.target.value || null)} style={inputStyle} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <label style={{ display: "grid", gap: 8 }}>
              <span>Start date</span>
              <input type="date" value={form.start_date} onChange={(event) => handleField("start_date", event.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "grid", gap: 8 }}>
              <span>End date</span>
              <input type="date" value={form.end_date ?? ""} onChange={(event) => handleField("end_date", event.target.value || null)} style={inputStyle} />
            </label>
          </div>

          <label style={{ display: "grid", gap: 8 }}>
            <span>Overview</span>
            <textarea rows={4} value={form.overview} onChange={(event) => handleField("overview", event.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
          </label>

          <label style={{ display: "grid", gap: 8 }}>
            <span>Responsibilities</span>
            <textarea rows={4} value={form.responsibilities} onChange={(event) => handleField("responsibilities", event.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
          </label>

          <label style={{ display: "grid", gap: 8 }}>
            <span>Contributions</span>
            <textarea rows={4} value={form.contributions ?? ""} onChange={(event) => handleField("contributions", event.target.value || "")} style={{ ...inputStyle, resize: "vertical" }} />
          </label>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" checked={form.is_published} onChange={(event) => handleField("is_published", event.target.checked)} />
            <span>Published</span>
          </label>

          {status ? <div role="status" style={{ color: "#bfdbfe" }}>{status}</div> : null}

          <button type="submit" style={buttonStyle}>{selectedId ? "Update experience" : "Create experience"}</button>
        </form>

        <div style={{ display: "grid", gap: 12 }}>
          {items.length === 0 ? (
            <div style={{ padding: 20, borderRadius: 12, background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
              No experiences available.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: 18, borderRadius: 12, background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{item.title || item.role}</div>
                  <div style={{ color: "#cbd5e1" }}>{item.employer}</div>
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
