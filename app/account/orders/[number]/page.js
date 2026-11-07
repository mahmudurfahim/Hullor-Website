"use client";
import { use, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useI18n, useToast } from "@/components/Providers";
import OrderView from "@/components/OrderView";

export default function OrderDetail({ params }) {
  const { number } = use(params);
  const toast = useToast();
  const { t } = useI18n();
  const [o, setO] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => { api(`/orders/${number}/`).then(setO).catch((e) => setErr(e.message)); }, [number]);
  const cancel = async () => {
    if (!confirm(t("অর্ডারটি বাতিল করতে চান?", "Cancel this order?"))) return;
    try { setO(await api(`/orders/${number}/cancel/`, { method: "POST" })); toast(t("অর্ডার বাতিল হয়েছে", "Order cancelled")); } catch (e) { toast(e.message, "err"); }
  };
  if (err) return <div className="alert alert-err">{err}</div>;
  if (!o) return <p className="muted">{t("লোড হচ্ছে…", "Loading…")}</p>;
  return <OrderView o={o} onCancel={cancel} back={{ href: "/account/orders", label: t("← সব অর্ডার", "← All orders") }} />;
}
