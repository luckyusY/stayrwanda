import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata = { title: "Admin sign in" };

export default async function AdminLoginPage() {
  if (await isAdminAuthed()) redirect("/admin");
  return (
    <main className="grid min-h-screen place-items-center bg-[#073b74] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-2xl">
        <div className="text-center">
          <span className="text-2xl font-bold tracking-tight">
            StayRwanda<span className="text-[#f9b90f]">.</span>
          </span>
          <h1 className="mt-4 text-2xl font-extrabold">Admin sign in</h1>
          <p className="mt-2 text-sm text-[#667085]">
            Manage properties and reservations across Rwanda.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
