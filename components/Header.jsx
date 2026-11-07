"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth, useCart, useI18n } from "./Providers";
import { IconBag, IconClose, IconHeart, IconLogout, IconMenu, IconPhone, IconSearch, IconUser, IconBox, IconTruck } from "./Icons";

const LINKS = [
  { href: "/", bn: "হোম", en: "Home" },
  { href: "/shop", bn: "শপ", en: "Shop" },
  { href: "/about", bn: "আমাদের সম্পর্কে", en: "About us" },
  { href: "/contact", bn: "যোগাযোগ", en: "Contact" },
];

export default function Header({ settings, categories = [] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t, n: bn, en, setLang, catName } = useI18n();
  const { count, setDrawerOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [dd, setDd] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const ddRef = useRef(null);

  useEffect(() => { setMenu(false); setSearch(false); setDd(false); }, [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    const click = (e) => { if (ddRef.current && !ddRef.current.contains(e.target)) setDd(false); };
    document.addEventListener("click", click);
    return () => { window.removeEventListener("scroll", on); document.removeEventListener("click", click); };
  }, []);
  useEffect(() => { document.body.classList.toggle("scroll-lock", menu); }, [menu]);
  useEffect(() => {
    if (!menu) return;
    const esc = (e) => { if (e.key === "Escape") setMenu(false); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [menu]);

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) router.push(`/shop?search=${encodeURIComponent(q.trim())}`);
  };
  const active = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      {settings?.announcement ? (
        <div className="topbar">
          <div className="container topbar-in">
            <span><IconTruck size={15} /> {settings.announcement}</span>
            {settings.phone && <a href={`tel:${settings.phone}`} className="hide-sm"><IconPhone size={14} /> {bn(settings.phone)}</a>}
          </div>
        </div>
      ) : null}
      <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="container nav-in">
          <button className="icon-btn only-mobile" aria-label={t("মেনু", "Menu")} onClick={() => setMenu(true)}><IconMenu /></button>
          <Link href="/" className="brand" aria-label={t("HULLOR হোম", "HULLOR home")}>
            <img src="/images/logo.jpg" alt="" />
            <span>hullor</span>
          </Link>
          <nav className="nav-links">
            {LINKS.map((l) => <Link key={l.href} href={l.href} className={active(l.href) ? "active" : ""}>{t(l.bn, l.en)}</Link>)}
          </nav>
          <div className="nav-actions">
            <button className="lang-btn hide-sm" onClick={() => setLang(en ? "bn" : "en")} aria-label={t("Switch to English", "বাংলায় দেখুন")} title={t("Switch to English", "বাংলায় দেখুন")}>{en ? "বাংলা" : "EN"}</button>
            <button className="icon-btn" aria-label={t("সার্চ", "Search")} onClick={() => setSearch((s) => !s)}><IconSearch /></button>
            <Link href="/account/wishlist" className="icon-btn hide-sm" aria-label={t("উইশলিস্ট", "Wishlist")}><IconHeart /></Link>
            <div className="dd" ref={ddRef}>
              {user ? (
                <button className="icon-btn avatar" aria-label={t("অ্যাকাউন্ট", "Account")} onClick={() => setDd((d) => !d)}>{(user.name || "U").trim()[0]}</button>
              ) : (
                <Link href="/login" className="icon-btn" aria-label={t("লগইন", "Log in")}><IconUser /></Link>
              )}
              {dd && user && (
                <div className="dd-menu">
                  <div className="dd-head"><b>{user.name}</b><small>{bn(user.phone)}</small></div>
                  <Link href="/account"><IconUser size={16} /> {t("আমার অ্যাকাউন্ট", "My account")}</Link>
                  <Link href="/account/orders"><IconBox size={16} /> {t("আমার অর্ডার", "My orders")}</Link>
                  <Link href="/account/wishlist"><IconHeart size={16} /> {t("উইশলিস্ট", "Wishlist")}</Link>
                  <button onClick={() => { logout(); router.push("/"); }}><IconLogout size={16} /> {t("লগআউট", "Log out")}</button>
                </div>
              )}
            </div>
            <button className="icon-btn cart-btn" aria-label={t("কার্ট", "Cart")} onClick={() => setDrawerOpen(true)}>
              <IconBag />
              {count > 0 && <span className="cart-count">{bn(count)}</span>}
            </button>
          </div>
        </div>
        {search && (
          <form className="search-bar" onSubmit={submit}>
            <div className="container">
              <IconSearch size={18} />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("পণ্যের নাম বা কোড লিখে সার্চ করুন…", "Search by product name or code…")} />
              <button type="submit" className="btn btn-sm">{t("খুঁজুন", "Search")}</button>
            </div>
          </form>
        )}
      </header>

      <div className={`mobile-menu ${menu ? "open" : ""}`}>
        <div className="mm-backdrop" onClick={() => setMenu(false)} />
        <aside>
          <div className="mm-head">
            <span className="brand"><img src="/images/logo.jpg" alt="" /><span>hullor</span></span>
            <button className="icon-btn" aria-label={t("বন্ধ", "Close")} onClick={() => setMenu(false)}><IconClose /></button>
          </div>
          <nav>
            {user && (
              <div className="mm-user">
                <span className="avatar lg">{(user.name || "U").trim()[0]}</span>
                <div><b>{user.name}</b><small>{bn(user.phone)}</small></div>
              </div>
            )}
            {LINKS.map((l) => <Link key={l.href} href={l.href} className={active(l.href) ? "active" : ""}>{t(l.bn, l.en)}</Link>)}
            {categories.length > 0 && <div className="mm-label">{t("ক্যাটাগরি", "Categories")}</div>}
            {categories.map((c) => <Link key={c.id} href={`/shop?category=${c.slug}`}>{catName(c)}</Link>)}
            <div className="mm-label">{t("ভাষা", "Language")}</div>
            <div className="mm-lang" role="group" aria-label={t("ভাষা", "Language")}>
              <button type="button" className={!en ? "on" : ""} aria-pressed={!en} onClick={() => { if (en) setLang("bn"); }}>বাংলা</button>
              <button type="button" className={en ? "on" : ""} aria-pressed={en} onClick={() => { if (!en) setLang("en"); }}>English</button>
            </div>
            <div className="mm-label">{t("অ্যাকাউন্ট", "Account")}</div>
            {user ? (
              <>
                <Link href="/account/orders">{t("আমার অর্ডার", "My orders")}</Link>
                <Link href="/account/wishlist">{t("উইশলিস্ট", "Wishlist")}</Link>
                <button onClick={() => { logout(); setMenu(false); router.push("/"); }}>{t("লগআউট", "Log out")}</button>
              </>
            ) : (
              <>
                <Link href="/login">{t("লগইন", "Log in")}</Link>
                <Link href="/register">{t("রেজিস্টার", "Register")}</Link>
              </>
            )}
          </nav>
          {settings?.phone && (
            <a href={`tel:${settings.phone}`} className="mm-foot"><IconPhone size={16} /> {bn(settings.phone)}</a>
          )}
        </aside>
      </div>
    </>
  );
}
