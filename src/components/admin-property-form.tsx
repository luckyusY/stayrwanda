"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/components/toast";

const TYPES = ["Furnished apartment", "Serviced apartment", "Furnished home", "Guesthouse", "Villa"];

export function AdminPropertyForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: "",
    neighborhood: "",
    location: "Kigali, Rwanda",
    type: TYPES[0],
    price: "",
    guests: "2",
    bedrooms: "1",
    beds: "1",
    baths: "1",
    host: "StayRwanda Partner",
    amenities: "Fully furnished, Equipped kitchen, On-site parking",
    description: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError("");
    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.url) {
        setImages((prev) => [...prev, json.url]);
      } else {
        setError(json.error || "An image failed to upload.");
      }
    }
    setUploading(false);
    event.target.value = "";
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!form.title.trim() || !form.neighborhood.trim() || !Number(form.price)) {
      setError("Title, neighbourhood and a valid nightly price are required.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        guests: Number(form.guests),
        bedrooms: Number(form.bedrooms),
        beds: Number(form.beds),
        baths: Number(form.baths),
        amenities: form.amenities.split(",").map((item) => item.trim()).filter(Boolean),
        images,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      toast.success("Listing Published", `${form.title} is now live.`);
      router.push("/admin/properties");
      router.refresh();
      return;
    }
    const errMsg = json.error || "Unable to save listing.";
    toast.error("Publish Failed", errMsg);
    setError(errMsg);
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <Card title="Listing details">
          <Field label="Property name" value={form.title} onChange={(v) => update("title", v)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Neighbourhood" value={form.neighborhood} onChange={(v) => update("neighborhood", v)} />
            <Field label="Location" value={form.location} onChange={(v) => update("location", v)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-semibold">
              Property type
              <select
                value={form.type}
                onChange={(event) => update("type", event.target.value)}
                className="field-3d mt-1.5 min-h-11 w-full px-3 font-normal outline-none focus:!border-[var(--gold)]"
              >
                {TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <Field label="Nightly price (RWF)" type="number" value={form.price} onChange={(v) => update("price", v)} />
          </div>
        </Card>

        <Card title="Capacity">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="Guests" type="number" value={form.guests} onChange={(v) => update("guests", v)} />
            <Field label="Bedrooms" type="number" value={form.bedrooms} onChange={(v) => update("bedrooms", v)} />
            <Field label="Beds" type="number" value={form.beds} onChange={(v) => update("beds", v)} />
            <Field label="Bathrooms" type="number" value={form.baths} onChange={(v) => update("baths", v)} />
          </div>
        </Card>

        <Card title="About this place">
          <Field label="Host name" value={form.host} onChange={(v) => update("host", v)} />
          <div className="float-field">
            <input
              value={form.amenities}
              onChange={(event) => update("amenities", event.target.value)}
              placeholder=" "
            />
            <label>Amenities (comma separated)</label>
          </div>
          <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-semibold">
            Description
            <textarea
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              className="field-3d mt-1.5 min-h-28 w-full p-3 font-normal outline-none focus:!border-[var(--gold)]"
              placeholder="Describe the stay, the area and what makes it special."
            />
          </label>
        </Card>
      </div>

      <aside className="space-y-5">
        <Card title="Photos">
          <label className="surface-3d surface-3d-lift flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed !border-[var(--gold)] bg-[var(--parchment)] px-4 py-8 text-center text-sm text-[var(--muted)] hover:bg-[var(--cream)] transition-all rounded-xl shadow-sm">
            {uploading ? <Loader2 className="animate-spin text-[var(--gold-deep)]" /> : <ImagePlus className="text-[var(--gold-deep)]" />}
            {uploading ? "Uploading…" : "Click to upload images"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={onUpload} disabled={uploading} />
          </label>
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((url) => (
                <div key={url} className="group relative aspect-square overflow-hidden rounded-lg">
                  <Image src={url} alt="" fill className="object-cover" sizes="120px" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((item) => item !== url))}
                    className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                    aria-label="Remove"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-[var(--muted)]">The first photo becomes the cover image.</p>
        </Card>

        {error && (
          <p className="surface-3d-error rounded-[var(--radius-control)] border px-3 py-2 text-sm font-semibold text-[#c00]">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving || uploading}
          className="button-3d flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--ink)] font-semibold uppercase tracking-wider text-white hover:bg-[var(--ink-2)] disabled:opacity-60 transition-colors"
        >
          {saving && <Loader2 size={18} className="animate-spin" />}
          {saving ? "Publishing…" : "Publish listing"}
        </button>
        <p className="text-center text-xs text-[var(--muted)]">
          Published listings go live on the site immediately.
        </p>
      </aside>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="surface-3d p-6 bg-white border border-[var(--line)] rounded-xl shadow-sm">
      <h2 className="mb-4 font-serif text-xl font-semibold text-[var(--ink)]">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder = " ",
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="float-field">
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={type === "number" ? 0 : undefined}
      />
      <label>{label}</label>
    </div>
  );
}
