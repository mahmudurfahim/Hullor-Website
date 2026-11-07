"use client";
import Link from "next/link";
import { useEffect } from "react";
import { variantText } from "@/lib/format";
import { useCart, useI18n } from "./Providers";
import { IconBag, IconClose, IconMinus, IconPlus, IconTrash } from "./Icons";
import { Placeholder } from "./ProductCard";

export function CartLine({ it, compact }) {
  const { setQty, removeItem } = useCart();
  const { t, n: bn, taka } = useI18n();
  return (
    <div className={`cline ${compact ? "compact" : ""}`}>
      <Link href={`/product/${it.slug}`} className="cline-img">
        {it.image ? <img src={it.image} alt={it.name} /> : <Placeholder />}
      </Link>
      <div className="cline-info">
        <Link href={`/product/${it.slug}`} className="cline-name">{it.name}</Link>
        <div className="cline-meta">{[variantText(it.size, it.color, t), `${t("কোড", "Code")}: ${it.code}`].filter(Boolean).join(" · ")}</div>
        <div className="cline-row">
          <div className="qty">
            <button aria-label={t("কমান", "Decrease")} onClick={() => setQty(it.variant_id, it.quantity - 1)}><IconMinus size={14} /></button>
            <span>{bn(it.quantity)}</span>
            <button aria-label={t("বাড়ান", "Increase")} onClick={() => setQty(it.variant_id, it.quantity + 1)} disabled={it.quantity >= Math.min(it.stock ?? 20, 20)}><IconPlus size={14} /></button>
          </div>
          <b>{taka(it.price * it.quantity)}</b>
        </div>
      </div>
      <button className="cline-del" aria-label={t("মুছুন", "Remove")} onClick={() => removeItem(it.variant_id)}><IconTrash size={17} /></button>
    </div>
  );
}

export default function CartDrawer() {
  const { items, subtotal, count, drawerOpen, setDrawerOpen } = useCart();
  const { t, n: bn, taka } = useI18n();
  useEffect(() => {
    document.body.classList.toggle("scroll-lock", drawerOpen);
    const esc = (e) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [drawerOpen, setDrawerOpen]);
  const close = () => setDrawerOpen(false);
  return (
    <div className={`drawer-wrap ${drawerOpen ? "open" : ""}`} aria-hidden={!drawerOpen}>
      <div className="drawer-backdrop" onClick={close} />
      <aside className="drawer" aria-label={t("শপিং কার্ট", "Shopping cart")}>
        <div className="drawer-head">
          <h3>{t("আপনার কার্ট", "Your cart")} {count > 0 && <small>({t(`${bn(count)}টি পণ্য`, `${count} ${count === 1 ? "item" : "items"}`)})</small>}</h3>
          <button className="icon-btn" onClick={close} aria-label={t("বন্ধ করুন", "Close")}><IconClose /></button>
        </div>
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="empty">
              <IconBag size={42} />
              <p>{t("আপনার কার্ট এখন খালি", "Your cart is empty")}</p>
              <Link href="/shop" className="btn" onClick={close}>{t("কেনাকাটা শুরু করুন", "Start shopping")}</Link>
            </div>
          ) : items.map((it) => <CartLine key={it.variant_id} it={it} compact />)}
        </div>
        {items.length > 0 && (
          <div className="drawer-foot">
            <div className="sum-row"><span>{t("সাবটোটাল", "Subtotal")}</span><b>{taka(subtotal)}</b></div>
            <p className="muted small">{t("ডেলিভারি চার্জ ও কুপন চেকআউটে হিসাব হবে। পেমেন্ট: ক্যাশ অন ডেলিভারি।", "Delivery charge and coupon are applied at checkout. Payment: cash on delivery.")}</p>
            <Link href="/checkout" className="btn btn-block" onClick={close}>{t("চেকআউট করুন", "Checkout")}</Link>
            <Link href="/cart" className="btn btn-ghost btn-block" onClick={close}>{t("কার্ট দেখুন", "View cart")}</Link>
          </div>
        )}
      </aside>
    </div>
  );
}
