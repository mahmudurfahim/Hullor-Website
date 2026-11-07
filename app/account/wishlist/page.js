"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useI18n } from "@/components/Providers";

export default function Wishlist() {
  const { t } = useI18n();
  const [items, setItems] = useState(null);
  useEffect(() => { api("/wishlist/").then((d) => setItems(d.products)).catch(() => setItems([])); }, []);
  const shown = items;
  return (
    <div>
      <h3 className="page-title sm">{t("উইশলিস্ট", "Wishlist")}</h3>
      {shown === null ? <p className="muted">{t("লোড হচ্ছে…", "Loading…")}</p> : shown.length === 0 ? (
        <div className="card empty-box"><p className="muted">{t("উইশলিস্ট খালি। পছন্দের পণ্যে ♡ চাপুন।", "Your wishlist is empty. Tap ♡ on products you like.")}</p><Link href="/shop" className="btn">{t("শপে যান", "Go to shop")}</Link></div>
      ) : <div className="grid-products cols-3">{shown.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
    </div>
  );
}
