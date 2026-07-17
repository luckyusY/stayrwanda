/* eslint-disable react-hooks/set-state-in-effect, @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SlotCounter } from "@/components/slot-counter";
import { TiltCard } from "@/components/tilt-card";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GripVertical,
  ImagePlus,
  Loader2,
  Trash2,
  Home,
  Building,
  Hotel,
} from "lucide-react";

const steps = [
  "Organization",
  "Basics",
  "Location",
  "Capacity",
  "Amenities",
  "Photos",
  "Pricing",
  "Profile",
  "Review",
];

type Draft = {
  organizationId: string;
  organizationName: string;
  name: string;
  category: string;
  address: string;
  neighborhood: string;
  city: string;
  lat: string;
  lng: string;
  guests: string;
  bedrooms: string;
  beds: string;
  baths: string;
  amenities: string;
  policies: string;
  images: string[];
  price: string;
  quantity: string;
  minStay: string;
  template: string;
  description: string;
};

const empty: Draft = {
  organizationId: "",
  organizationName: "",
  name: "",
  category: "residence",
  address: "",
  neighborhood: "",
  city: "Kigali",
  lat: "",
  lng: "",
  guests: "2",
  bedrooms: "1",
  beds: "1",
  baths: "1",
  amenities: "WiFi, Equipped kitchen, On-site parking",
  policies: "Check-in from 15:00. Check-out by 11:00.",
  images: [],
  price: "85000",
  quantity: "1",
  minStay: "1",
  template: "classic",
  description: "",
};

const stepVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    z: dir > 0 ? 80 : -80,
    scale: dir > 0 ? 0.96 : 1.04,
    filter: "blur(4px)",
  }),
  center: {
    opacity: 1,
    z: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: (dir: number) => ({
    opacity: 0,
    z: dir > 0 ? -80 : 80,
    scale: dir > 0 ? 1.04 : 0.96,
    filter: "blur(4px)",
    transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] as const },
  }),
};

export function ListingWizard({
  existingOrganizationId = "",
}: {
  existingOrganizationId?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(existingOrganizationId ? 1 : 0);
  const [direction, setDirection] = useState(1);
  const [draft, setDraft] = useState<Draft>({
    ...empty,
    organizationId: existingOrganizationId,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const drag = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("stayrwanda-listing-draft");
    if (saved) {
      try {
        setDraft((current) => ({
          ...current,
          ...JSON.parse(saved),
          organizationId: existingOrganizationId || JSON.parse(saved).organizationId,
        }));
      } catch {}
    }
  }, [existingOrganizationId]);

  useEffect(() => {
    localStorage.setItem("stayrwanda-listing-draft", JSON.stringify(draft));
  }, [draft]);

  const set = (key: keyof Draft, value: string | string[]) =>
    setDraft((old) => ({ ...old, [key]: value }));

  async function ensureOrganization() {
    if (draft.organizationId) return draft.organizationId;
    const slug = draft.organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const res = await fetch("/api/organizations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: draft.organizationName, slug }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return "";
    }
    set("organizationId", data.organizationId);
    return String(data.organizationId);
  }

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    const organizationId = await ensureOrganization();
    if (!organizationId) return;
    setBusy(true);
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append("organizationId", organizationId);
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (res.ok) {
        setDraft((old) => ({ ...old, images: [...old.images, data.url] }));
      } else {
        setError(data.error);
      }
    }
    setBusy(false);
  }

  function reorder(from: number, to: number) {
    setDraft((old) => {
      const images = [...old.images];
      const [item] = images.splice(from, 1);
      images.splice(to, 0, item);
      return { ...old, images };
    });
  }

  async function next() {
    setError("");
    if (step === 0 && !(await ensureOrganization())) return;
    if (step === 1 && draft.name.length < 3) return setError("Add a property name.");
    if (step === 2 && !draft.neighborhood) return setError("Add a neighbourhood.");
    if (step === 5 && !draft.images.length) return setError("Upload at least one property photo.");
    if (step === 7 && draft.description.length < 40) {
      return setError("Add a description of at least 40 characters.");
    }
    setDirection(1);
    setStep((value) => Math.min(8, value + 1));
  }

  function prev() {
    setDirection(-1);
    setStep((value) => Math.max(0, value - 1));
  }

  async function submit() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        organizationId: draft.organizationId,
        title: draft.name,
        location: `${draft.city}, Rwanda`,
        address: draft.address,
        lat: draft.lat ? Number(draft.lat) : undefined,
        lng: draft.lng ? Number(draft.lng) : undefined,
        neighborhood: draft.neighborhood,
        type: draft.category,
        description: draft.description,
        price: Number(draft.price),
        quantity: Number(draft.quantity),
        minStay: Number(draft.minStay),
        template: draft.template,
        guests: Number(draft.guests),
        bedrooms: Number(draft.bedrooms),
        beds: Number(draft.beds),
        baths: Number(draft.baths),
        images: draft.images,
        amenities: draft
          .amenities
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        host: draft.organizationName || "StayRwanda Partner",
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setBusy(false);
      return;
    }
    localStorage.removeItem("stayrwanda-listing-draft");
    router.push("/host/hotels");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-[var(--gold-deep)]">
          New hospitality profile
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-[var(--ink)]">
          List your property
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Draft changes save automatically on this device.
        </p>
      </div>

      <div className="grid gap-7 lg:grid-cols-[220px_1fr]">
        {/* Step progress sidebar */}
        <ol className="surface-3d h-fit p-3">
          {steps.map((label, index) => {
            const isActive = index === step;
            const isCompleted = index < step;
            return (
              <li
                key={label}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-all rounded-md ${
                  isActive
                    ? "translate-x-1 bg-[var(--cream)] font-semibold text-[var(--ink)] shadow-[inset_3px_0_var(--gold),0_4px_12px_rgba(20,34,58,.06)]"
                    : isCompleted
                    ? "text-[#287b45]"
                    : "text-[var(--muted)]"
                }`}
              >
                <span
                  className={`grid size-6 place-items-center rounded-full text-xs shadow-sm transition-colors ${
                    isActive || isCompleted
                      ? "bg-[var(--gold)] text-white"
                      : "bg-[#eee] text-[var(--muted)]"
                  }`}
                >
                  {isCompleted ? <Check size={13} /> : index + 1}
                </span>
                {label}
              </li>
            );
          })}
        </ol>

        {/* 3D step content with Z-transitions */}
        <div className="perspective-lg preserve-3d relative min-h-[500px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.section
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="surface-3d p-6 sm:p-8 bg-white"
            >
              <h2 className="font-serif text-3xl font-semibold text-[var(--ink)]">
                {steps[step]}
              </h2>

              <div className="mt-6 space-y-5">
                {/* Step 0: Organization */}
                {step === 0 && (
                  <Field
                    label="Organization or hotel group name"
                    value={draft.organizationName}
                    onChange={(v) => set("organizationName", v)}
                  />
                )}

                {/* Step 1: Basics (Redesigned Category Cards) */}
                {step === 1 && (
                  <>
                    <Field
                      label="Property name"
                      value={draft.name}
                      onChange={(v) => set("name", v)}
                    />
                    <div className="block text-sm font-semibold text-[var(--ink)]">
                      Property category
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                        {[
                          { id: "residence", label: "Residence", icon: Home },
                          { id: "hotel", label: "Hotel", icon: Hotel },
                          { id: "guesthouse", label: "Guesthouse", icon: Building },
                        ].map((cat) => {
                          const Icon = cat.icon;
                          const isSelected = draft.category === cat.id;
                          return (
                            <TiltCard key={cat.id} strength={6} className="w-full">
                              <button
                                type="button"
                                onClick={() => set("category", cat.id)}
                                className={`flex flex-col items-center justify-center p-5 w-full min-h-32 border rounded-lg transition-all ${
                                  isSelected
                                    ? "border-[var(--gold)] bg-[var(--parchment)] shadow-gold scale-[1.02]"
                                    : "border-[var(--line)] bg-white hover:border-[var(--gold)]"
                                }`}
                              >
                                <Icon
                                  size={24}
                                  className={
                                    isSelected ? "text-[var(--gold-deep)]" : "text-[var(--muted)]"
                                  }
                                />
                                <span className="mt-2 text-sm font-medium text-[var(--ink)]">
                                  {cat.label}
                                </span>
                              </button>
                            </TiltCard>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Location */}
                {step === 2 && (
                  <>
                    <Field
                      label="Street address"
                      value={draft.address}
                      onChange={(v) => set("address", v)}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Neighbourhood"
                        value={draft.neighborhood}
                        onChange={(v) => set("neighborhood", v)}
                      />
                      <Field label="City" value={draft.city} onChange={(v) => set("city", v)} />
                      <Field
                        label="Latitude (optional)"
                        value={draft.lat}
                        onChange={(v) => set("lat", v)}
                        type="number"
                      />
                      <Field
                        label="Longitude (optional)"
                        value={draft.lng}
                        onChange={(v) => set("lng", v)}
                        type="number"
                      />
                    </div>
                  </>
                )}

                {/* Step 3: Capacity (Redesigned Counters) */}
                {step === 3 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <CounterWidget
                      label="Guests"
                      value={Number(draft.guests)}
                      min={1}
                      onChange={(v) => set("guests", String(v))}
                    />
                    <CounterWidget
                      label="Bedrooms"
                      value={Number(draft.bedrooms)}
                      min={0}
                      onChange={(v) => set("bedrooms", String(v))}
                    />
                    <CounterWidget
                      label="Beds"
                      value={Number(draft.beds)}
                      min={1}
                      onChange={(v) => set("beds", String(v))}
                    />
                    <CounterWidget
                      label="Bathrooms"
                      value={Number(draft.baths)}
                      min={0}
                      onChange={(v) => set("baths", String(v))}
                    />
                  </div>
                )}

                {/* Step 4: Amenities */}
                {step === 4 && (
                  <>
                    <Area
                      label="Amenities (comma separated)"
                      value={draft.amenities}
                      onChange={(v) => set("amenities", v)}
                    />
                    <Area
                      label="Policies"
                      value={draft.policies}
                      onChange={(v) => set("policies", v)}
                    />
                  </>
                )}

                {/* Step 5: Photos */}
                {step === 5 && (
                  <>
                    <label className="surface-3d surface-3d-lift flex cursor-pointer flex-col items-center border-2 border-dashed !border-[#c6b89e] bg-[var(--cream)] p-10 text-sm text-[var(--muted)]">
                      {busy ? (
                        <Loader2 className="animate-spin text-[var(--gold-deep)]" />
                      ) : (
                        <ImagePlus className="text-[var(--gold-deep)] size-8" />
                      )}
                      <span className="mt-2 font-medium text-[var(--ink)]">
                        Upload JPG, PNG or WebP images
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => upload(e.target.files)}
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {draft.images.map((image, index) => (
                        <div
                          key={image}
                          draggable
                          onDragStart={() => (drag.current = index)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => drag.current !== null && reorder(drag.current, index)}
                          className="surface-3d surface-3d-lift relative aspect-square overflow-hidden bg-[#eee]"
                        >
                          <img src={image} alt="" className="h-full w-full object-cover" />
                          <GripVertical className="absolute left-1.5 top-1.5 bg-white/80 rounded p-0.5 cursor-grab text-[var(--ink)] size-6" />
                          <button
                            onClick={() => set("images", draft.images.filter((x) => x !== image))}
                            className="absolute right-1.5 top-1.5 bg-white/90 p-1.5 text-red-700 shadow-md rounded hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-1.5 left-1.5 bg-[var(--ink)] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white rounded">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Step 6: Pricing (Large scale input display) */}
                {step === 6 && (
                  <div className="grid gap-5 sm:grid-cols-3">
                    <Field
                      label="Nightly rate (RWF)"
                      value={draft.price}
                      onChange={(v) => set("price", v)}
                      type="number"
                    />
                    <Field
                      label="Available units"
                      value={draft.quantity}
                      onChange={(v) => set("quantity", v)}
                      type="number"
                    />
                    <Field
                      label="Minimum stay"
                      value={draft.minStay}
                      onChange={(v) => set("minStay", v)}
                      type="number"
                    />
                  </div>
                )}

                {/* Step 7: Profile */}
                {step === 7 && (
                  <>
                    <Select
                      label="Profile template"
                      value={draft.template}
                      onChange={(v) => set("template", v)}
                      options={[
                        ["classic", "Classic Hospitality"],
                        ["editorial", "Editorial Residence"],
                        ["modern", "Modern Urban"],
                      ]}
                    />
                    <Area
                      label="Property story"
                      value={draft.description}
                      onChange={(v) => set("description", v)}
                    />
                  </>
                )}

                {/* Step 8: Review & Submit (3D rotating preview) */}
                {step === 8 && (
                  <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
                    <TiltCard strength={12} className="w-full">
                      <div className="surface-3d relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[var(--parchment)] shadow-lg">
                        {draft.images.length > 0 ? (
                          <img
                            src={draft.images[0]}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-[var(--cream)] text-[var(--muted)]">
                            No images uploaded
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-5 text-white">
                          <span className="bg-[var(--gold)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white rounded">
                            {draft.category}
                          </span>
                          <h3 className="font-serif text-2xl font-semibold mt-1">
                            {draft.name || "Unnamed Stay"}
                          </h3>
                          <p className="text-xs text-white/80">
                            {draft.neighborhood
                              ? `${draft.neighborhood}, ${draft.city}`
                              : draft.city}
                          </p>
                          <p className="mt-2 text-sm font-semibold text-[var(--gold-light)]">
                            RWF {Number(draft.price || 0).toLocaleString()} / night
                          </p>
                        </div>
                      </div>
                    </TiltCard>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Summary label="Organization" value={draft.organizationName || "Current organization"} />
                      <Summary label="Property" value={`${draft.name || "Draft Stay"} · ${draft.category}`} />
                      <Summary label="Location" value={`${draft.neighborhood || "Kigali"}, ${draft.city}`} />
                      <Summary label="Capacity" value={`${draft.guests} guests · ${draft.bedrooms} bedrooms`} />
                      <Summary label="Inventory" value={`${draft.quantity} units · RWF ${Number(draft.price).toLocaleString()}/night`} />
                      <Summary value={`${draft.images.length} photographs · ${draft.template} template`} label="Media" />
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <p className="mt-5 border border-[#e3b4ae] bg-[#fbefed] p-3 text-sm text-[#a33] shadow-sm rounded-md">
                  {error}
                </p>
              )}

              {/* Navigation Actions */}
              <div className="mt-8 flex justify-between border-t border-[#eee] pt-5">
                <button
                  disabled={step === 0}
                  onClick={prev}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold disabled:opacity-30 hover:-translate-x-0.5 transition-transform"
                >
                  <ArrowLeft size={17} />
                  Back
                </button>
                {step < 8 ? (
                  <button
                    onClick={next}
                    className="button-3d flex items-center gap-2 bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white"
                  >
                    Continue
                    <ArrowRight size={17} />
                  </button>
                ) : (
                  <button
                    disabled={busy}
                    onClick={submit}
                    className="button-3d flex items-center gap-2 bg-[var(--gold)] px-6 py-3 text-sm font-semibold text-white"
                  >
                    {busy && <Loader2 size={16} className="animate-spin" />}
                    Submit for review
                  </button>
                )}
              </div>
            </motion.section>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="float-field">
      <input
        type={type}
        value={value}
        min={type === "number" ? 0 : undefined}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
      />
      <label>{label}</label>
    </div>
  );
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="float-field">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder=" "
      />
      <label>{label}</label>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[][];
}) {
  return (
    <label className="block text-sm font-semibold text-[var(--ink)]">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field-3d mt-2 min-h-12 w-full px-3 font-normal outline-none focus:border-[var(--gold)] focus:shadow-gold"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-3d surface-3d-lift bg-[var(--cream)] p-4 rounded-lg">
      <span className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
        {label}
      </span>
      <strong className="mt-2 block text-[var(--ink)] font-semibold">
        {value}
      </strong>
    </div>
  );
}

function CounterWidget({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-between p-4 bg-white border border-[var(--line)] rounded-lg shadow-sm">
      <span className="text-sm font-medium text-[var(--ink)] mb-3">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="interactive-3d flex items-center justify-center size-8 !border-[var(--gold)] text-[var(--gold-deep)] disabled:border-[#ccc] disabled:text-[#ccc] disabled:shadow-none transition-colors"
        >
          -
        </button>
        <SlotCounter value={value} />
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="interactive-3d flex items-center justify-center size-8 !border-[var(--gold)] text-[var(--gold-deep)] transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
