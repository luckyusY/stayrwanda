import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account-shell";
import { currentIdentity } from "@/lib/auth";

export default async function AccountPage() {
  const identity = await currentIdentity();
  if (!identity) redirect("/sign-in");
  const user = await currentUser();
  const details = [
    ["Name", user?.fullName || "Add your name"],
    ["Email", identity.email || "No email"],
    ["Phone", user?.primaryPhoneNumber?.phoneNumber || "Add your phone number"],
    ["Account ID", identity.userId],
  ];

  return (
    <AccountShell title="Your account">
      <div className="surface-3d p-6">
        <h2 className="text-xl font-bold">Personal details</h2>
        <p className="mt-2 text-sm text-[#595959]">Identity is secured and managed through your StayRwanda sign-in.</p>
        <div className="mt-6 divide-y divide-[#eee]">
          {details.map(([label, value]) => (
            <div key={label} className="grid gap-2 py-4 sm:grid-cols-[180px_1fr]">
              <strong className="text-sm">{label}</strong>
              <span className="break-all text-sm text-[#595959]">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </AccountShell>
  );
}
