import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Portfolio from "./portfolio";

const failed = { profile: false, experiences: false, skills: false };

describe("Portfolio", () => {
  it("renders the three sections and the active navigation state", () => {
    render(
      <Portfolio
        locale="en"
        activeSection="profile"
        profile={null}
        experiences={[]}
        skills={[]}
        failed={failed}
      />,
    );

    expect(screen.getByRole("heading", { name: "Profile" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Experience" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Technical skills" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /PROFILE/ }).getAttribute("aria-current")).toBe(
      "location",
    );
  });

  it("provides translated navigation and preserves the active section when changing locale", () => {
    render(
      <Portfolio
        locale="zh-Hant-TW"
        activeSection="experiences"
        profile={null}
        experiences={[]}
        skills={[]}
        failed={failed}
      />,
    );

    expect(screen.getByRole("link", { name: /EXPERIENCES/ }).textContent).toContain(
      "工作經歷",
    );
    expect(
      screen.getByRole("link", { name: "日本語" }).getAttribute("href"),
    ).toBe("?lang=ja&section=experiences#experiences");
    expect(screen.getByText("尚未新增工作經歷。")).toBeTruthy();
  });

  it("shows an explicit error when a section cannot be loaded", () => {
    const loadFailure = { ...failed, profile: true };
    render(
      <Portfolio
        locale="ko"
        activeSection="profile"
        profile={null}
        experiences={[]}
        skills={[]}
        failed={loadFailure}
      />,
    );

    expect(screen.getByRole("alert").textContent).toContain(
      "이 섹션을 불러올 수 없습니다.",
    );
  });

  it("identifies English fallback content for a localized skills request", () => {
    render(
      <Portfolio
        locale="ja"
        activeSection="skills"
        profile={null}
        experiences={[]}
        skills={[
          {
            id: "skill-1",
            name: "TypeScript",
            slug: "typescript",
            category: "language",
            display_name: "TypeScript",
            description: "",
            duration_months: 18,
            is_featured: true,
            order: 1,
            content_language: "en",
          },
        ]}
        failed={failed}
      />,
    );

    expect(screen.getByText(/英語のコンテンツ/)).toBeTruthy();
    expect(screen.getByText("1年 6か月")).toBeTruthy();
  });

  it("renders experience details as Markdown", () => {
    render(
      <Portfolio
        locale="en"
        activeSection="experiences"
        profile={null}
        experiences={[
          {
            id: "experience-1",
            slug: "platform-engineer",
            role: "Engineer",
            title: "Platform Engineer",
            overview: "**Built** a reliable platform.",
            responsibilities: "- Improved deployments\n- Added observability",
            contributions: "",
            start_date: "2024-01-01",
            end_date: null,
            employer: "Example",
            client: null,
            urls: [],
            skills: [],
            content_language: "en",
          },
        ]}
        skills={[]}
        failed={failed}
      />,
    );

    expect(screen.getByText("Built").tagName).toBe("STRONG");
    expect(screen.getByText("Improved deployments").tagName).toBe("LI");
    expect(screen.getByText("Added observability").tagName).toBe("LI");
  });

  it("renders single newlines in experience Markdown as line breaks", () => {
    const { container } = render(
      <Portfolio
        locale="en"
        activeSection="experiences"
        profile={null}
        experiences={[
          {
            id: "experience-1",
            slug: "platform-engineer",
            role: "Engineer",
            title: "Platform Engineer",
            overview: "First line\nSecond line",
            responsibilities: "",
            contributions: "",
            start_date: "2024-01-01",
            end_date: null,
            employer: "Example",
            client: null,
            urls: [],
            skills: [],
            content_language: "en",
          },
        ]}
        skills={[]}
        failed={failed}
      />,
    );

    expect(container.querySelector(".experience-markdown br")).not.toBeNull();
  });
});
