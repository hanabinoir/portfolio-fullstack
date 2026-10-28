import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AdminExperiencesPage from "./page";

vi.mock("@/lib/admin-api", () => ({
  createAdminExperience: vi.fn(),
  deleteAdminExperience: vi.fn(),
  listAdminExperiences: vi.fn().mockResolvedValue([]),
  updateAdminExperience: vi.fn(),
}));

describe("AdminExperiencesPage", () => {
  it("previews Markdown while keeping the source editable as plain text", async () => {
    render(<AdminExperiencesPage />);
    await screen.findByText("No experiences available.");

    const source = screen.getByLabelText("Overview Markdown source");
    fireEvent.change(source, {
      target: { value: "**Improved** reliability\nStill reliable" },
    });

    const preview = screen.getByLabelText("Overview Markdown preview");
    expect(preview.querySelector("strong")?.textContent).toBe("Improved");
    expect(preview.querySelector("br")).not.toBeNull();
    expect((source as HTMLTextAreaElement).value).toBe(
      "**Improved** reliability\nStill reliable",
    );
  });
});
