import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";

export const metadata = { title: "Admin" };

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  return children;
}
