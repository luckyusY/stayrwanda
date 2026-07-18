import { AuthExperience } from "@/components/auth-experience";
import { clerkConfigured } from "@/lib/env";

export default function SignInPage() {
  return <AuthExperience mode="sign-in" clerkEnabled={clerkConfigured} />;
}
