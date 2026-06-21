import { Heart } from "lucide-react";
import { AccountShell, EmptyState } from "@/components/account-shell";

export default function FavoritesPage() { return <AccountShell title="Saved properties"><EmptyState icon={Heart} title="Save properties you like" copy="Tap the heart on any stay and compare your favorites here later." action="Browse properties" href="/search" /></AccountShell>; }
