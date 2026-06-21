import { AdminShell } from "@/components/admin-shell";
import { AdminProperties } from "@/components/admin-properties";
import { listProperties } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Properties" };

export default async function AdminPropertiesPage() {
  const properties = await listProperties();
  return (
    <AdminShell title="Properties" subtitle="Approve, publish and manage your listings">
      <AdminProperties properties={properties} />
    </AdminShell>
  );
}
