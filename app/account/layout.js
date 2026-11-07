"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth, useI18n } from "@/components/Providers";
import { IconBox, IconHeart, IconLogout, IconPin, IconShield, IconUser } from "@/components/Icons";

const NAV = [
  ["/account", "প্রোফাইল", "Profile", IconUser], ["/account/orders", "আমার অর্ডার", "My orders", IconBox],
  ["/account/addresses", "ঠিকানা", "Addresses", IconPin], ["/account/wishlist", "উইশলিস্ট", "Wishlist", IconHeart],
];

export default function AccountLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => { if (!loading && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`); }, [loading, user, pathname, router]);
  if (loading || !user) return <div className="container section"><p className="muted">{t("লোড হচ্ছে…", "Loading…")}</p></div>;
  return (
    <div className="container section">
      <div className="acc-layout">
        <aside className="acc-nav card">
          <div className="acc-user"><div className="avatar lg">{user.name.trim()[0]}</div><div><b>{user.name}</b><small>{user.phone}</small></div></div>
          {NAV.map(([href, bnL, enL, Icon]) => (
            <Link key={href} href={href} className={pathname === href || (href !== "/account" && pathname.startsWith(href)) ? "on" : ""}><Icon size={18} /> {t(bnL, enL)}</Link>
          ))}
          <button onClick={() => { logout(); router.push("/"); }}><IconLogout size={18} /> {t("লগআউট", "Log out")}</button>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
