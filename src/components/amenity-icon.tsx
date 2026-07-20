import type { LucideIcon } from "lucide-react";
import { createElement } from "react";
import {
  Armchair,
  CarFront,
  Coffee,
  CookingPot,
  Dumbbell,
  House,
  KeyRound,
  ShieldCheck,
  Snowflake,
  Sofa,
  Sparkles,
  Sun,
  Trees,
  WashingMachine,
  Waves,
  Wifi,
} from "lucide-react";

const ICON_RULES: Array<{ terms: string[]; Icon: LucideIcon }> = [
  { terms: ["furnished"], Icon: Sofa },
  { terms: ["kitchen", "cooking"], Icon: CookingPot },
  { terms: ["living", "lounge"], Icon: Armchair },
  { terms: ["parking", "garage"], Icon: CarFront },
  { terms: ["balcony", "terrace"], Icon: Sun },
  { terms: ["garden", "outdoor", "landscaped", "greenery"], Icon: Trees },
  { terms: ["gated", "secure", "security", "compound"], Icon: ShieldCheck },
  { terms: ["entrance", "access"], Icon: KeyRound },
  { terms: ["wifi", "wi-fi", "internet"], Icon: Wifi },
  { terms: ["air conditioning", "air-conditioned", "air con", "a/c"], Icon: Snowflake },
  { terms: ["pool", "swimming"], Icon: Waves },
  { terms: ["laundry", "washer", "washing"], Icon: WashingMachine },
  { terms: ["gym", "fitness"], Icon: Dumbbell },
  { terms: ["breakfast", "coffee"], Icon: Coffee },
  { terms: ["residential", "home", "house"], Icon: House },
];

export function amenityIconFor(name: string): LucideIcon {
  const normalized = name.toLowerCase();
  return ICON_RULES.find(({ terms }) => terms.some((term) => normalized.includes(term)))?.Icon || Sparkles;
}

export function AmenityIcon({ name, size = 18, className = "" }: { name: string; size?: number; className?: string }) {
  return createElement(amenityIconFor(name), { size, className, "aria-hidden": true });
}

export function AmenityPills({ amenities, limit = 2, className = "" }: { amenities: string[]; limit?: number; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Amenities">
      {amenities.slice(0, limit).map((amenity) => (
        <span key={amenity} className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--parchment)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink)]">
          <AmenityIcon name={amenity} size={13} className="shrink-0 text-[var(--gold-deep)]" />
          <span className="line-clamp-1">{amenity}</span>
        </span>
      ))}
    </div>
  );
}
