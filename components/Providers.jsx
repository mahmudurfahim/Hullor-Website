"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api, tokens } from "@/lib/api";
import { COOKIE, makeI18n } from "@/lib/i18n";

/* ---------------------------------------------------------------- Toast */
const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

/* ---------------------------------------------------------------- Auth */
const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

/* ---------------------------------------------------------------- Cart */
const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

/* ---------------------------------------------------------------- Language (bn / en) */
const I18nCtx = createContext(makeI18n("bn"));
export const useI18n = () => useContext(I18nCtx);

/* ---------------------------------------------------------------- Wishlist */
const WishCtx = createContext(null);
export const useWishlist = () => useContext(WishCtx);

export default function Providers({ children, settings, lang = "bn" }) {
  /* language */
  const router = useRouter();
  const i18n = useMemo(() => {
    const base = makeI18n(lang);
    const setLang = (l) => {
      try { document.cookie = `${COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`; } catch {}
      router.refresh();
    };
    return { ...base, setLang };
  }, [lang, router]);
  const { t } = i18n;

  /* toasts */
  const [toasts, setToasts] = useState([]);
  const tid = useRef(0);
  const toast = useCallback((message, type = "ok") => {
    const id = ++tid.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  /* auth */
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    if (!tokens.get()) { setAuthLoading(false); return; }
    api("/auth/me/").then(setUser).catch(() => tokens.clear()).finally(() => setAuthLoading(false));
  }, []);
  const saveSession = useCallback((data) => {
    tokens.set({ access: data.access, refresh: data.refresh });
    setUser(data.user);
  }, []);
  const login = useCallback(async (identifier, password) => {
    const d = await api("/auth/login/", { method: "POST", body: { identifier, password }, auth: false });
    saveSession(d);
    return d.user;
  }, [saveSession]);
  const register = useCallback(async (payload) => {
    const d = await api("/auth/register/", { method: "POST", body: payload, auth: false });
    saveSession(d);
    return d.user;
  }, [saveSession]);
  const logout = useCallback(() => { tokens.clear(); setUser(null); setWishIds([]); }, []);

  /* cart */
  const [items, setItems] = useState([]);
  const [cartReady, setCartReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem("hl_cart") || "[]")); } catch {}
    setCartReady(true);
  }, []);
  useEffect(() => {
    if (cartReady) try { localStorage.setItem("hl_cart", JSON.stringify(items)); } catch {}
  }, [items, cartReady]);
  const addItem = useCallback((item, qty = 1, open = true) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.variant_id === item.variant_id);
      const max = Math.min(item.stock ?? 20, 20);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], ...item, quantity: Math.min(next[i].quantity + qty, max) };
        return next;
      }
      return [...prev, { ...item, quantity: Math.min(qty, max) }];
    });
    if (open) setDrawerOpen(true);
  }, []);
  const setQty = useCallback((variant_id, quantity) => {
    setItems((prev) => prev.map((x) => (x.variant_id === variant_id ? { ...x, quantity: Math.max(1, Math.min(quantity, Math.min(x.stock ?? 20, 20))) } : x)));
  }, []);
  const removeItem = useCallback((variant_id) => setItems((p) => p.filter((x) => x.variant_id !== variant_id)), []);
  const clearCart = useCallback(() => setItems([]), []);
  /** সার্ভার থেকে পাওয়া ফ্রেশ লাইন দিয়ে কার্ট সিঙ্ক */
  const syncLines = useCallback((lines) => {
    setItems((prev) => {
      const map = new Map(lines.map((l) => [l.variant_id, l]));
      return prev
        .filter((x) => map.get(x.variant_id)?.available)
        .map((x) => {
          const l = map.get(x.variant_id);
          return { ...x, price: l.price, old_price: l.old_price, name: l.name, image: l.image, stock: l.stock, quantity: Math.max(1, Math.min(x.quantity, l.stock || 1)) };
        });
    });
  }, []);
  const count = items.reduce((s, x) => s + x.quantity, 0);
  const subtotal = items.reduce((s, x) => s + x.price * x.quantity, 0);

  /* wishlist */
  const [wishIds, setWishIds] = useState([]);
  useEffect(() => {
    if (user) api("/wishlist/").then((d) => setWishIds(d.ids)).catch(() => {});
  }, [user]);
  const toggleWish = useCallback(async (productId) => {
    if (!user) { toast(t("উইশলিস্টে রাখতে আগে লগইন করুন", "Please log in to use your wishlist"), "info"); return "login"; }
    try {
      const d = await api("/wishlist/", { method: "POST", body: { product_id: productId } });
      setWishIds((ids) => (d.wishlisted ? [...ids, productId] : ids.filter((i) => i !== productId)));
      toast(d.wishlisted ? t("উইশলিস্টে যোগ হয়েছে", "Added to wishlist") : t("উইশলিস্ট থেকে সরানো হয়েছে", "Removed from wishlist"));
    } catch (e) { toast(e.message, "err"); }
  }, [user, toast, t]);

  const authValue = useMemo(() => ({ user, setUser, loading: authLoading, login, register, logout }), [user, authLoading, login, register, logout]);
  const cartValue = useMemo(() => ({ items, count, subtotal, addItem, setQty, removeItem, clearCart, syncLines, drawerOpen, setDrawerOpen, ready: cartReady }),
    [items, count, subtotal, addItem, setQty, removeItem, clearCart, syncLines, drawerOpen, cartReady]);
  const wishValue = useMemo(() => ({ ids: wishIds, toggle: toggleWish }), [wishIds, toggleWish]);

  return (
    <I18nCtx.Provider value={i18n}>
    <ToastCtx.Provider value={toast}>
      <AuthCtx.Provider value={authValue}>
        <CartCtx.Provider value={cartValue}>
          <WishCtx.Provider value={wishValue}>
            {children}
            <div className="toasts" aria-live="polite">
              {toasts.map((t) => <div key={t.id} className={`toast toast-${t.type}`}>{t.message}</div>)}
            </div>
          </WishCtx.Provider>
        </CartCtx.Provider>
      </AuthCtx.Provider>
    </ToastCtx.Provider>
    </I18nCtx.Provider>
  );
}
