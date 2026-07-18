import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account-shell";
import { currentIdentity, clerkConfigured } from "@/lib/auth";

export default async function AccountPage() {
  try {
    const identity = await currentIdentity();
    if (!identity) redirect("/sign-in");

    let name = "Add your name";
    let phone = "Add your phone number";

    // Only call Clerk user APIs when Clerk is actually configured
    if (clerkConfigured) {
      try {
        const { currentUser } = await import("@clerk/nextjs/server");
        const user = await currentUser();
        name = user?.fullName || name;
        phone = user?.primaryPhoneNumber?.phoneNumber || phone;
      } catch (error) {
        console.error("Unable to load Clerk profile for account page.", {
          message: error instanceof Error ? error.message : "Unknown Clerk error",
        });
      }
    }

    const details = [
      ["Name", name],
      ["Email", identity.email || "No email"],
      ["Phone", phone],
      ["Account ID", identity.userId],
    ];

    return (
      <AccountShell title="Your account">
        <div className="surface-3d p-6">
          <h2 className="text-xl font-bold text-[var(--ink)]">Personal details</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Identity is secured and managed through your StayRwanda sign-in.
          </p>
          <div className="mt-6 divide-y divide-[var(--line)]">
            {details.map(([label, value]) => (
              <div key={label} className="grid gap-2 py-4 sm:grid-cols-[180px_1fr]">
                <strong className="text-sm text-[var(--ink)]">{label}</strong>
                <span className="break-all text-sm text-[var(--muted)]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </AccountShell>
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof (error as { digest?: unknown }).digest === "string" &&
      String((error as { digest: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    console.error("Account page failed.", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    redirect("/sign-in");
  }
}
