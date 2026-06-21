import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { AdminPropertyForm } from "@/components/admin-property-form";

export const metadata = { title: "Add listing" };

export default function NewPropertyPage() {
  return (
    <AdminShell title="Add a listing" subtitle="Create a new property for StayRwanda">
      <Link
        href="/admin/properties"
        className="mb-5 inline-flex items-center gap-1 text-sm font-bold text-[#006ce4] hover:underline"
      >
        <ChevronLeft size={17} /> Back to properties
      </Link>
      <AdminPropertyForm />
    </AdminShell>
  );
}
