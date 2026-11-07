"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart, useI18n } from "@/components/Providers";
import { CartLine } from "@/components/CartDrawer";
import useCartPricing from "@/lib/useCartPricing";
import { IconBag } from "@/components/Icons";

export default function CartPage() {
  const { items, subtotal } = useCart();
  const { t, n: bn, taka, tm } = useI18n();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState("");
  const { data, loading } = useCartPricing({ coupon: applied });

  if (items.length === 0) {
    return (
      <div className="container page-center">
        <IconBag size={56} />
        <h1>{t("আপনার কার্ট খালি", "Your cart is empty")}</h1>
        <p className="muted">{t("পছন্দের পণ্য কার্টে যোগ করুন।", "Add products you like to your cart.")}</p>
        <Link href="/shop" className="btn">{t("কেনাকাটা শুরু করুন", "Start shopping")}</Link>
      </div>
    );
  }
  const issues = data?.lines.filter((l) => !l.ok) || [];
  return (
    <div className="container section">
      <h1 className="page-title">{t("শপিং কার্ট", "Shopping cart")} <small>({t(`${bn(items.length)}টি আইটেম`, `${items.length} ${items.length === 1 ? "item" : "items"}`)})</small></h1>
      <div className="checkout-grid">
        <div className="card">
          {items.map((it) => <CartLine key={it.variant_id} it={it} />)}
          {issues.map((l) => <div key={l.variant_id} className="alert alert-err">{l.name}: {tm(l.error)}</div>)}
        </div>
        <aside className="card summary">
          <h3>{t("অর্ডার সামারি", "Order summary")}</h3>
          <div className="coupon">
            <input placeholder={t("কুপন কোড", "Coupon code")} value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} />
            <button className="btn btn-outline btn-sm" onClick={() => setApplied(coupon.trim())}>{t("প্রয়োগ", "Apply")}</button>
          </div>
          {data?.coupon_error && <p className="err-text">{tm(data.coupon_error)}</p>}
          {data?.coupon && <p className="ok-text">{t(`কুপন “${data.coupon.code}” প্রয়োগ হয়েছে`, `Coupon “${data.coupon.code}” applied`)}</p>}
          <div className="sum-row"><span>{t("সাবটোটাল", "Subtotal")}</span><b>{taka(data?.subtotal ?? subtotal)}</b></div>
          {data?.discount > 0 && <div className="sum-row ok-text"><span>{t("ছাড়", "Discount")}</span><b>-{taka(data.discount)}</b></div>}
          <div className="sum-row"><span>{t("ডেলিভারি চার্জ", "Delivery charge")}</span><b>{data ? taka(data.delivery_charge) : "—"}</b></div>
          <div className="sum-row total"><span>{t("সর্বমোট", "Total")}</span><b>{taka(data?.total ?? subtotal)}</b></div>
          <p className="muted small">{t("পেমেন্ট: ক্যাশ অন ডেলিভারি। ডেলিভারি চার্জ ঠিকানা অনুযায়ী চেকআউটে চূড়ান্ত হবে।", "Payment: cash on delivery. Delivery charge is finalised at checkout based on your address.")}</p>
          <Link href="/checkout" className={`btn btn-lg btn-block ${issues.length || loading ? "disabled" : ""}`} aria-disabled={issues.length > 0}>{t("চেকআউটে যান", "Proceed to checkout")}</Link>
          <Link href="/shop" className="btn btn-ghost btn-block">{t("আরও কেনাকাটা করুন", "Continue shopping")}</Link>
        </aside>
      </div>
    </div>
  );
}
