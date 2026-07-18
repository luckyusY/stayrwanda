import { AuthExperience } from "@/components/auth-experience";
import { clerkConfigured } from "@/lib/env";

export default function RegisterPage() {
  return <AuthExperience mode="sign-up" clerkEnabled={clerkConfigured} />;
}
