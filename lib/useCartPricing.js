"use client";
import { useEffect, useState } from "react";
import { api } from "./api";
import { useCart } from "@/components/Providers";

/** কার্ট আইটেম সার্ভারে পাঠিয়ে আসল দাম/স্টক/ডেলিভারি/কুপন হিসাব আনে */
export default function useCartPricing({ district = "", coupon = "" } = {}) {
  const { items, syncLines, ready } = useCart();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const key = JSON.stringify(items.map((i) => [i.variant_id, i.quantity]));

  useEffect(() => {
    if (!ready) return;
    if (items.length === 0) { setData(null); return; }
    let alive = true;
    setLoading(true);
    const t = setTimeout(() => {
      api("/cart/validate/", {
        method: "POST", auth: false,
        body: { items: items.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity })), coupon_code: coupon, district },
      }).then((d) => { if (alive) { setData(d); syncLines(d.lines); } })
        .catch(() => {}).finally(() => alive && setLoading(false));
    }, 250);
    return () => { alive = false; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, district, coupon, ready]);

  return { data, loading };
}
