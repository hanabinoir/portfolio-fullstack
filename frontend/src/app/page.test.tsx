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
});
