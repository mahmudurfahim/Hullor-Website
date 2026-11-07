"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useI18n } from "@/components/Providers";
import OrderView from "@/components/OrderView";

export default function TrackPage() {
  const { t } = useI18n();
  const [form, setForm] = useState({ number: "", phone: "" });
  const [order, setOrder] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const find = async (number, phone) => {
    setErr(""); setOrder(null);
    if (!number.trim() || !phone.trim()) { setErr(t("অর্ডার নম্বর ও মোবাইল নম্বর দিন।", "Enter your order number and mobile number.")); return; }
    setBusy(true);
    try {
      setOrder(await api(`/orders/track/?number=${encodeURIComponent(number.trim())}&phone=${encodeURIComponent(phone.trim())}`, { auth: false }));
    } catch (e) {
      setErr(e.status === 404 ? t("এই তথ্যে কোনো অর্ডার পাওয়া যায়নি। নম্বর দুটি আবার দেখুন।", "No order found with these details. Please check both numbers.") : e.message);
    } finally { setBusy(false); }
  };
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const number = q.get("number") || "", phone = q.get("phone") || "";
    if (number || phone) setForm({ number, phone });
    if (number && phone) find(number, phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container section">
      <h1 className="page-title">{t("অর্ডার ট্র্যাক করুন", "Track your order")}</h1>
      <form className="card track-form" onSubmit={(e) => { e.preventDefault(); find(form.number, form.phone); }}>
        <div className="form-grid">
          <div className="field"><label>{t("অর্ডার নম্বর", "Order number")}</label><input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value.toUpperCase() })} placeholder="HL-250101-1234" autoCapitalize="characters" /></div>
          <div className="field"><label>{t("অর্ডারের মোবাইল নম্বর", "Mobile number used for the order")}</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} inputMode="tel" placeholder="01XXXXXXXXX" /></div>
        </div>
        {err && <div className="alert alert-err">{err}</div>}
        <button className="btn" disabled={busy}>{busy ? t("খোঁজা হচ্ছে…", "Searching…") : t("অর্ডার দেখুন", "Find order")}</button>
      </form>
      {order && <div style={{ marginTop: 22 }}><OrderView o={order} /></div>}
    </div>
  );
}
