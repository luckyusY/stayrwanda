import { describe, expect, it } from "vitest";
import { Armchair, CarFront, CookingPot, ShieldCheck, Sofa, Trees } from "lucide-react";
import { amenityIconFor } from "./amenity-icon";

describe("amenityIconFor", () => {
  it.each([
    ["Fully furnished", Sofa],
    ["Equipped kitchen", CookingPot],
    ["Private living area", Armchair],
    ["On-site parking", CarFront],
    ["Gated compound", ShieldCheck],
    ["Outdoor space", Trees],
  ])("maps %s to its visual symbol", (amenity, Icon) => {
    expect(amenityIconFor(amenity)).toBe(Icon);
  });
});
