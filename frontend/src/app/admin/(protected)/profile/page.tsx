"use client";

import { useEffect, useState } from "react";

import { getAdminPrivateProfile, saveAdminPrivateProfile } from "@/lib/admin-api";
import type { AdminPrivateProfileResponse, AdminProfileFormData } from "@/types/api";

const emptyForm: AdminProfileFormData = {
  profile_picture_url: "",
  is_active: true,
  display_name: "Your Name",
  headline: "Senior product engineer",
  summary: "I build reliable software for product teams and design systems.",
  links: [
    { link_type: "github", label: "GitHub", url: "https://github.com/yourname", order: 1 },
    { link_type: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/yourname", order: 2 },
  ],
  spoken_languages: [
    { language_name: "English", proficiency_level: "native", order: 1 },
    { language_name: "Japanese", proficiency_level: "business", order: 2 },
  ],
};

export default function AdminProfilePage() {
  const [form, setForm] = useState<AdminProfileFormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getAdminPrivateProfile();
        setForm((current) => ({
          ...current,
          profile_picture_url: current.profile_picture_url || "",
          display_name: profile?.address ? current.display_name : current.display_name,
          address: profile?.address ?? "",
          phone_number: profile?.phone_number ?? "",
          citizenship: profile?.citizenship ?? "",
          visa_type: profile?.visa_type ?? "",
          visa_expiry_date: profile?.visa_expiry_date ?? null,
        }));
      } catch {
        setForm(emptyForm);
      }
    };

    void load();
  }, []);

  const handleField = (key: keyof AdminProfileFormData, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus("");

    try {
      const payload: Partial<AdminPrivateProfileResponse> = {
        address: form.address ?? "",
        phone_number: form.phone_number ?? "",
        citizenship: form.citizenship ?? "",
        visa_type: form.visa_type ?? "",
        visa_expiry_date: form.visa_expiry_date ?? null,
      };

      await saveAdminPrivateProfile(payload);
      setStatus("Profile saved successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <header>
        <p style={{ margin: 0, color: "#93c5fd", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5 }}>
          Manage profile
        </p>
        <h1 style={{ margin: "8px 0 0", fontSize: 32 }}>Profile</h1>
      </header>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 24, background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: 16, padding: 24 }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <label style={{ display: "grid", gap: 8 }}>
            <span>Display name</span>
            <input
              value={form.display_name}
              onChange={(event) => handleField("display_name", event.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={{ display: "grid", gap: 8 }}>
            <span>Profile picture URL</span>
            <input
              value={form.profile_picture_url ?? ""}
              onChange={(event) => handleField("profile_picture_url", event.target.value)}
              style={inputStyle}
            />
          </label>
        </div>

        <label style={{ display: "grid", gap: 8 }}>
          <span>Headline</span>
          <input
            value={form.headline}
            onChange={(event) => handleField("headline", event.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={{ display: "grid", gap: 8 }}>
          <span>Summary</span>
          <textarea
            rows={6}
            value={form.summary}
            onChange={(event) => handleField("summary", event.target.value)}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </label>

        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ fontWeight: 600 }}>Links</div>
          {form.links.map((link, index) => (
            <div key={`${link.label}-${index}`} style={{ display: "grid", gridTemplateColumns: "minmax(120px, 1fr) minmax(180px, 1.4fr) minmax(180px, 1.5fr)", gap: 12 }}>
              <input
                value={link.label}
                onChange={(event) => {
                  const next = [...form.links];
                  next[index] = { ...next[index], label: event.target.value };
                  setForm((current) => ({ ...current, links: next }));
                }}
                style={inputStyle}
              />
              <select
                value={link.link_type}
                onChange={(event) => {
                  const next = [...form.links];
                  next[index] = { ...next[index], link_type: event.target.value as typeof link.link_type };
                  setForm((current) => ({ ...current, links: next }));
                }}
                style={inputStyle}
              >
                <option value="website">Website</option>
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
                <option value="portfolio">Portfolio</option>
                <option value="other">Other</option>
              </select>
              <input
                value={link.url}
                onChange={(event) => {
                  const next = [...form.links];
                  next[index] = { ...next[index], url: event.target.value };
                  setForm((current) => ({ ...current, links: next }));
                }}
                style={inputStyle}
              />
            </div>
          ))}
        </div>

        <label style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(event) => handleField("is_active", event.target.checked)}
          />
          <span>Profile is active</span>
        </label>

        {status ? (
          <div role="status" style={{ color: "#bfdbfe" }}>
            {status}
          </div>
        ) : null}

        <button type="submit" disabled={isSaving} style={{ ...buttonStyle, opacity: isSaving ? 0.7 : 1 }}>
          {isSaving ? "Saving..." : "Save profile"}
        </button>
      </form>
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
  padding: "12px 16px",
  border: 0,
  borderRadius: 10,
  background: "#2563eb",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};
