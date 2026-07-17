import Link from "next/link";
import { CalendarCheck, Heart, Home, LogOut, Settings, UserRound } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export function AccountShell({ children, title }: { children: React.ReactNode; title: string }) {
  const links = [[UserRound,"Personal details","/account"],[CalendarCheck,"Bookings","/account/bookings"],[Heart,"Saved properties","/account/favorites"],[Settings,"Preferences","/account"],[LogOut,"Sign out","/sign-in"]] as const;
  return <main><SiteHeader compact /><div className="mx-auto max-w-6xl px-4 py-8 sm:px-6"><div className="mb-7 flex items-center gap-4"><span className="surface-3d grid size-14 place-items-center !rounded-full bg-[#f0f6ff] text-[#006ce4]"><UserRound size={28} /></span><div><h1 className="text-3xl font-extrabold">{title}</h1><p className="text-sm text-[#595959]">Manage your StayRwanda account</p></div></div><div className="grid gap-7 md:grid-cols-[230px_1fr]"><aside className="surface-3d h-fit overflow-hidden">{links.map(([Icon,label,href]) => <Link key={label} href={href} className="flex items-center gap-3 border-b border-[#eee] px-4 py-3 text-sm last:border-0 hover:bg-[#f0f6ff] hover:text-[#006ce4]"><Icon size={19} />{label}</Link>)}</aside><section>{children}</section></div></div><SiteFooter /></main>;
}

export function EmptyState({ icon: Icon = Home, title, copy, action, href }: { icon?: typeof Home; title: string; copy: string; action: string; href: string }) { return <div className="surface-3d p-10 text-center"><Icon className="mx-auto text-[#006ce4]" size={36} /><h2 className="mt-4 text-xl font-bold">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm text-[#595959]">{copy}</p><Link href={href} className="button-3d mt-5 inline-block bg-[#006ce4] px-5 py-3 text-sm font-bold text-white">{action}</Link></div>; }
