"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useI18n, useToast } from "@/components/Providers";

export default function ForgotPassword() {
  const router = useRouter();
  const toast = useToast();
  const { t, n: bn } = useI18n();
  const [step, setStep] = useState("phone");   // phone → reset
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [resend, setResend] = useState(0);
  useEffect(() => {
    if (step !== "reset" || resend <= 0) return;
    const id = setTimeout(() => setResend((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [step, resend]);
  const digits = (v) => String(v || "").replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d));

  const sendCode = async (e) => {
    e?.preventDefault(); setErr(""); setBusy(true);
    try {
      const r = await api("/otp/send/", { method: "POST", body: { phone, purpose: "reset" }, auth: false });
      setResend(r.resend_in || 60); setStep("reset");
    } catch (e2) {
      if (e2.data?.code === "otp_wait") { setResend(e2.data.retry_after || 60); setStep("reset"); }
      else setErr(e2.message);
    } finally { setBusy(false); }
  };

  const reset = async (e) => {
    e.preventDefault(); setErr("");
    const c = digits(code).trim();
    if (!/^\d{6}$/.test(c)) { setErr(t("৬ ডিজিটের কোড দিন", "Enter the 6-digit code")); return; }
    if (pw.length < 6) { setErr(t("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।", "Password must be at least 6 characters.")); return; }
    setBusy(true);
    try {
      await api("/auth/password/reset/", { method: "POST", body: { phone, code: c, new_password: pw }, auth: false });
      toast(t("পাসওয়ার্ড পরিবর্তন হয়েছে। এখন লগইন করুন।", "Password changed. Please log in."));
      router.replace("/login");
    } catch (e2) { setErr(e2.message); } finally { setBusy(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <img src="/images/logo.jpg" alt="" className="auth-logo" />
        <h1>{t("পাসওয়ার্ড রিসেট", "Reset your password")}</h1>
        {step === "phone" ? (
          <form onSubmit={sendCode}>
            <p className="muted">{t("অ্যাকাউন্টের মোবাইল নম্বর দিন। আমরা একটি কোড SMS করব।", "Enter your account's mobile number. We'll send you a code by SMS.")}</p>
            <div className="field"><label>{t("মোবাইল নম্বর", "Mobile number")}</label><input required value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="01XXXXXXXXX" autoComplete="tel" /></div>
            {err && <div className="alert alert-err">{err}</div>}
            <button className="btn btn-lg btn-block" disabled={busy}>{busy ? t("অপেক্ষা করুন…", "Please wait…") : t("কোড পাঠান", "Send code")}</button>
          </form>
        ) : (
          <form onSubmit={reset}>
            <p className="muted">{t(`${bn(phone)} নম্বরে কোড পাঠানো হয়েছে (নম্বরটি রেজিস্টার্ড থাকলে)। কোড ও নতুন পাসওয়ার্ড দিন।`, `If ${phone} is registered, a code was sent by SMS. Enter it with your new password.`)}</p>
            <div className="field"><input className="otp-input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} autoFocus placeholder="••••••" value={code} onChange={(e) => setCode(digits(e.target.value).replace(/\D/g, "").slice(0, 6))} /></div>
            <div className="field"><label>{t("নতুন পাসওয়ার্ড", "New password")}</label>
              <div className="pw"><input required minLength={6} type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" placeholder={t("কমপক্ষে ৬ অক্ষর", "At least 6 characters")} /><button type="button" onClick={() => setShow(!show)}>{show ? t("লুকান", "Hide") : t("দেখুন", "Show")}</button></div>
            </div>
            {err && <div className="alert alert-err">{err}</div>}
            <button className="btn btn-lg btn-block" disabled={busy}>{busy ? t("অপেক্ষা করুন…", "Please wait…") : t("পাসওয়ার্ড পরিবর্তন করুন", "Change password")}</button>
            <div className="otp-foot">
              <button type="button" disabled={resend > 0 || busy} onClick={sendCode}>{resend > 0 ? t(`${bn(resend)} সেকেন্ড পর আবার পাঠান`, `Resend in ${resend}s`) : t("আবার কোড পাঠান", "Resend code")}</button>
              <button type="button" disabled={busy} onClick={() => { setStep("phone"); setErr(""); }}>{t("নম্বর পরিবর্তন", "Change number")}</button>
            </div>
          </form>
        )}
        <p className="center muted"><Link className="u" href="/login">{t("← লগইনে ফিরে যান", "← Back to log in")}</Link></p>
      </div>
    </div>
  );
}
