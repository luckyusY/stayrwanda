import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("premium depth design contract", () => {
  it("defines all four elevation levels and accessibility fallbacks", () => {
    const css = source("src/app/globals.css");
    for (const token of ["--depth-control", "--depth-soft", "--depth-raised", "--depth-floating"]) {
      expect(css).toContain(token);
    }
    expect(css).toContain("@media (hover: hover) and (pointer: fine)");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("input:-webkit-autofill");
  });

  it("keeps shared controls backward compatible while adding tactile states", () => {
    expect(source("src/components/ui/button.tsx")).toContain("button-3d");
    expect(source("src/components/ui/field.tsx")).toContain("field-3d");
    expect(source("src/components/ui/field.tsx")).toContain("field-3d-error");
  });

  it("scopes the operational treatment to both protected workspaces", () => {
    expect(source("src/components/host-shell.tsx")).toContain("workspace-3d");
    expect(source("src/components/admin-shell.tsx")).toContain("workspace-3d");
  });

  it("does not revive styling for the removed shared-password experience", () => {
    const legacy = source("src/components/admin-login-form.tsx");
    expect(legacy).not.toContain("field-3d");
    expect(legacy).not.toContain("button-3d");
  });
});
