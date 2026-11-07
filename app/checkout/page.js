"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { DISTRICTS } from "@/lib/districts";
import { variantText } from "@/lib/format";
import useCartPricing from "@/lib/useCartPricing";
import { useAuth, useCart, useI18n, useToast } from "@/components/Providers";
import { Placeholder } from "@/components/ProductCard";
import { IconCash } from "@/components/Icons";

export default function CheckoutPage() {
  const router = useRouter();
  const toast = useToast();
  const { t, en, n: bn, taka, tm } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const { items, clearCart, ready } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", district: "Dhaka", address: "", note: "", save: true });
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState("");
  const { data, loading } = useCartPricing({ district: form.district, coupon: applied });
  const [otp, setOtp] = useState({ open: false, phone: "", code: "", token: "", error: "", dev: "", resend: 0, sending: false, verifying: false });

  useEffect(() => {
    if (!otp.open || otp.resend <= 0) return;
    const id = setTimeout(() => setOtp((o) => ({ ...o, resend: o.resend - 1 })), 1000);
    return () => clearTimeout(id);
  }, [otp.open, otp.resend]);

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({ ...f, name: f.name || user.name, phone: f.phone || user.phone, email: f.email || user.email || "" }));
    api("/addresses/").then((list) => {
      setAddresses(list);
      const def = list.find((a) => a.is_default) || list[0];
      if (def) pick(def);
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const pick = (a) => setForm((f) => ({ ...f, name: a.name, phone: a.phone, district: a.district, address: a.address, save: false, addressId: a.id }));
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = t("নাম লিখুন", "Enter your name");
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(form.phone.replace(/[\s-]/g, "").replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d)))) e.phone = t("সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)", "Enter a valid mobile number (01XXXXXXXXX)");
    if (form.address.trim().length < 8) e.address = t("পূর্ণ ঠিকানা লিখুন (বাসা/রোড/এলাকা/থানা)", "Enter your full address (house/road/area/thana)");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const digits = (v) => String(v || "").replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d));
  const normPhone = (v) => {
    let x = digits(v).replace(/[\s\-()]/g, "");
    if (x.startsWith("+88")) x = x.slice(3); else if (x.startsWith("88") && x.length === 13) x = x.slice(2);
    return x;
  };

  const startOtp = async () => {
    const phone = normPhone(form.phone);
    setOtp((o) => ({ ...o, open: true, phone, code: "", error: "", dev: "", sending: true }));
    try {
      const r = await api("/otp/send/", { method: "POST", body: { phone }, auth: false });
      setOtp((o) => ({ ...o, sending: false, resend: r.resend_in || 60, dev: r.dev_code || "" }));
    } catch (e) {
      if (e.data?.code === "otp_wait") setOtp((o) => ({ ...o, sending: false, resend: e.data.retry_after || 60 }));
      else setOtp((o) => ({ ...o, sending: false, error: e.message }));
    }
  };

  const placeOrder = async (token) => {
    setBusy(true); setServerError("");
    try {
      const order = await api("/orders/", {
        method: "POST",
        body: {
          items: items.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity })),
          coupon_code: applied, name: form.name.trim(), phone: form.phone, email: form.email.trim(),
          district: form.district, address: form.address.trim(), note: form.note.trim(),
          save_address: !!user && form.save && !form.addressId, otp_token: token || "",
        },
      });
      try { sessionStorage.setItem("hullor_last_order", JSON.stringify(order)); } catch {}
      clearCart();
      router.replace(`/order-success/${order.number}`);
    } catch (e) {
      if (e.data?.code === "otp_required") { await startOtp(); return; }
      setServerError(e.status === 401 ? t("লগইনের মেয়াদ শেষ হয়েছে। আবার অর্ডার করুন।", "Your login expired. Please place the order again.") : e.message);
    } finally { setBusy(false); }
  };

  const verifyOtp = async () => {
    const code = digits(otp.code).trim();
    if (!/^\d{6}$/.test(code)) { setOtp((o) => ({ ...o, error: t("৬ ডিজিটের কোড দিন", "Enter the 6-digit code") })); return; }
    setOtp((o) => ({ ...o, verifying: true, error: "" }));
    try {
      const r = await api("/otp/verify/", { method: "POST", body: { phone: otp.phone, code }, auth: false });
      setOtp((o) => ({ ...o, verifying: false, open: false, token: r.otp_token }));
      await placeOrder(r.otp_token);
    } catch (e) {
      setOtp((o) => ({ ...o, verifying: false, error: e.message }));
    }
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    if (!validate()) { toast(t("ফর্মের ভুলগুলো ঠিক করুন", "Please fix the errors in the form"), "err"); return; }
    if (data && !data.ok) { setServerError(t("কার্টের কিছু পণ্যের স্টক পরিবর্তন হয়েছে। কার্ট দেখে নিন।", "Stock changed for some items in your cart. Please review your cart.")); return; }
    // যাচাই করা নম্বর বদলালে আগের token আর চলবে না
    await placeOrder(otp.token && otp.phone === normPhone(form.phone) ? otp.token : "");
  };

  if (authLoading || !ready) return <div className="container section"><p className="muted">{t("লোড হচ্ছে…", "Loading…")}</p></div>;
  if (items.length === 0) {
    return <div className="container page-center"><h1>{t("কার্ট খালি", "Cart is empty")}</h1><p className="muted">{t("চেকআউটের জন্য আগে পণ্য যোগ করুন।", "Add products to your cart before checking out.")}</p><Link href="/shop" className="btn">{t("শপে যান", "Go to shop")}</Link></div>;
  }
  const shown = data?.lines?.length ? data.lines : items.map((i) => ({ ...i, ok: true, line_total: i.price * i.quantity }));

  return (
    <div className="container section">
      <h1 className="page-title">{t("চেকআউট", "Checkout")}</h1>
      {!user && <p className="muted guest-hint">{t(<>লগইন ছাড়াই অর্ডার করতে পারবেন। অ্যাকাউন্ট আছে? <Link href="/login?next=/checkout" className="u">লগইন করুন</Link></>, <>You can order without logging in. Have an account? <Link href="/login?next=/checkout" className="u">Log in</Link></>)}</p>}
      <form className="checkout-grid" onSubmit={submit} noValidate>
        <div className="stack">
          <section className="card">
            <h3>{t("১. ডেলিভারি ঠিকানা", "1. Delivery address")}</h3>
            {addresses.length > 0 && (
              <div className="addr-pick">
                {addresses.map((a) => (
                  <button type="button" key={a.id} className={`addr-chip ${form.addressId === a.id ? "on" : ""}`} onClick={() => pick(a)}>
                    <b>{a.label}</b><span>{a.address.slice(0, 40)}{a.address.length > 40 ? "…" : ""}</span>
                  </button>
                ))}
                <button type="button" className="addr-chip" onClick={() => setForm((f) => ({ ...f, addressId: undefined, address: "", save: true }))}><b>{t("+ নতুন ঠিকানা", "+ New address")}</b></button>
              </div>
            )}
            <div className="form-grid">
              <div className="field"><label>{t("পূর্ণ নাম *", "Full name *")}</label><input value={form.name} onChange={set("name")} autoComplete="name" />{errors.name && <span className="err-text">{errors.name}</span>}</div>
              <div className="field"><label>{t("মোবাইল নম্বর *", "Mobile number *")}</label><input value={form.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" />{errors.phone && <span className="err-text">{errors.phone}</span>}</div>
              <div className="field"><label>{t("জেলা *", "District *")}</label>
                <select value={form.district} onChange={set("district")}>{DISTRICTS.map(([v, l]) => <option key={v} value={v}>{en ? v : l}</option>)}</select>
              </div>
              <div className="field"><label>{t("ইমেইল (ঐচ্ছিক)", "Email (optional)")}</label><input type="email" value={form.email} onChange={set("email")} autoComplete="email" /></div>
              <div className="field full"><label>{t("পূর্ণ ঠিকানা *", "Full address *")}</label><textarea rows={3} value={form.address} onChange={set("address")} placeholder={t("বাসা/রোড নং, এলাকা, থানা", "House/road no., area, thana")} />{errors.address && <span className="err-text">{errors.address}</span>}</div>
              <div className="field full"><label>{t("অর্ডার নোট (ঐচ্ছিক)", "Order note (optional)")}</label><input value={form.note} onChange={set("note")} placeholder={t("যেমন: ডেলিভারির আগে কল করবেন", "e.g. Please call before delivery")} /></div>
            </div>
            {!form.addressId && <label className="check"><input type="checkbox" checked={form.save} onChange={(e) => setForm({ ...form, save: e.target.checked })} /> {t("এই ঠিকানা পরের বার ব্যবহারের জন্য সেভ করুন", "Save this address for next time")}</label>}
          </section>

          <section className="card">
            <h3>{t("২. পেমেন্ট পদ্ধতি", "2. Payment method")}</h3>
            <div className="pay-opt on"><IconCash /><div><b>{t("ক্যাশ অন ডেলিভারি", "Cash on delivery")}</b><span>{t("পণ্য হাতে পেয়ে ডেলিভারি ম্যানকে টাকা দিন। অগ্রিম কোনো পেমেন্ট লাগবে না।", "Pay the delivery person when you receive your order. No advance payment needed.")}</span></div></div>
          </section>
        </div>

        <aside className="card summary">
          <h3>{t("অর্ডার সামারি", "Order summary")}</h3>
          <div className="sum-items">
            {shown.map((l) => (
              <div key={l.variant_id} className={`sum-item ${l.ok === false ? "bad" : ""}`}>
                <div className="si-img">{l.image ? <img src={l.image} alt="" /> : <Placeholder />}<span>{bn(l.quantity)}</span></div>
                <div><b>{l.name}</b><small>{variantText(l.size, l.color, t)}</small>{l.error && <small className="err-text">{tm(l.error)}</small>}</div>
                <span>{taka(l.line_total ?? l.price * l.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="coupon">
            <input placeholder={t("কুপন কোড", "Coupon code")} value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} />
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setApplied(coupon.trim())}>{t("প্রয়োগ", "Apply")}</button>
          </div>
          {data?.coupon_error && <p className="err-text">{tm(data.coupon_error)}</p>}
          {data?.coupon && <p className="ok-text">{t(`কুপন “${data.coupon.code}” প্রয়োগ হয়েছে`, `Coupon “${data.coupon.code}” applied`)}</p>}
          <div className="sum-row"><span>{t("সাবটোটাল", "Subtotal")}</span><b>{taka(data?.subtotal ?? 0)}</b></div>
          {data?.discount > 0 && <div className="sum-row ok-text"><span>{t("ছাড়", "Discount")}</span><b>-{taka(data.discount)}</b></div>}
          <div className="sum-row"><span>{t("ডেলিভারি চার্জ", "Delivery charge")}</span><b>{data ? taka(data.delivery_charge) : "—"}</b></div>
          <div className="sum-row total"><span>{t("সর্বমোট (COD)", "Total (COD)")}</span><b>{taka(data?.total ?? 0)}</b></div>
          {serverError && <div className="alert alert-err">{serverError}</div>}
          <button className="btn btn-lg btn-block" disabled={busy || loading}>{busy ? t("অর্ডার হচ্ছে…", "Placing order…") : t("অর্ডার কনফার্ম করুন", "Place order")}</button>
          <p className="muted small center">{t(<>অর্ডার করার মাধ্যমে আপনি আমাদের <Link href="/policy" className="u">ডেলিভারি ও রিটার্ন নীতি</Link> মেনে নিচ্ছেন।</>, <>By placing an order you agree to our <Link href="/policy" className="u">delivery & return policy</Link>.</>)}</p>
        </aside>
      </form>

      {otp.open && (
        <div className="otp-back" role="dialog" aria-modal="true" onClick={() => !otp.verifying && setOtp((o) => ({ ...o, open: false }))}>
          <div className="otp-card" onClick={(e) => e.stopPropagation()}>
            <h3>{t("মোবাইল নম্বর যাচাই করুন", "Verify your mobile number")}</h3>
            <p className="muted">{otp.sending ? t("কোড পাঠানো হচ্ছে…", "Sending code…") : t(`আমরা ${bn(otp.phone)} নম্বরে ৬ ডিজিটের একটি কোড SMS করেছি।`, `We sent a 6-digit code by SMS to ${otp.phone}.`)}</p>
            <input className="otp-input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} autoFocus placeholder="••••••"
              value={otp.code} onChange={(e) => setOtp((o) => ({ ...o, code: digits(e.target.value).replace(/\D/g, "").slice(0, 6), error: "" }))}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); verifyOtp(); } }} />
            {otp.dev && <p className="muted small">Dev code: {otp.dev}</p>}
            {otp.error && <span className="err-text">{otp.error}</span>}
            <button type="button" className="btn btn-lg btn-block" disabled={otp.verifying || otp.sending || otp.code.length !== 6} onClick={verifyOtp}>
              {otp.verifying ? t("যাচাই হচ্ছে…", "Verifying…") : t("যাচাই করে অর্ডার করুন", "Verify & place order")}
            </button>
            <div className="otp-foot">
              <button type="button" disabled={otp.resend > 0 || otp.sending} onClick={startOtp}>
                {otp.resend > 0 ? t(`${bn(otp.resend)} সেকেন্ড পর আবার পাঠান`, `Resend in ${otp.resend}s`) : t("আবার কোড পাঠান", "Resend code")}
              </button>
              <button type="button" disabled={otp.verifying} onClick={() => setOtp((o) => ({ ...o, open: false }))}>{t("নম্বর পরিবর্তন", "Change number")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
