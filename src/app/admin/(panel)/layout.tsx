import { redirect } from "next/navigation";
import { currentIdentity } from "@/lib/auth";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await currentIdentity())?.platformAdmin) redirect("/admin/login");
  return children;
}
