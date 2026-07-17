import { redirect } from "next/navigation";
import { currentIdentity } from "@/lib/auth";
import { clerkConfigured } from "@/lib/env";

export default async function AdminLogin() {
  if ((await currentIdentity())?.platformAdmin) redirect("/admin");
  if (clerkConfigured) redirect("/sign-in?redirect_url=/admin");
  return <main className="grid min-h-screen place-items-center bg-[#f2f4f7] p-6"><div className="max-w-md rounded-xl bg-white p-8 text-center shadow"><h1 className="text-2xl font-bold">Authentication setup required</h1><p className="mt-3 text-sm text-[#667085]">Add Clerk keys to the environment. The insecure shared admin password has been removed.</p></div></main>;
}
