"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth, useI18n, useToast } from "./Providers";

export default function AuthForm({ mode }) {
  const isReg = mode === "register";
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") && sp.get("next").startsWith("/") ? sp.get("next") : "/account";
  const { login, register, user, loading } = useAuth();
  const toast = useToast();
  const { t, n: bn } = useI18n();
  const [f, setF] = useState({ name: "", phone: "", email: "", identifier: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [step, setStep] = useState("form");   // রেজিস্টারে: form → otp
  const [code, setCode] = useState("");
  const [resend, setResend] = useState(0);
  useEffect(() => {
    if (step !== "otp" || resend <= 0) return;
    const id = setTimeout(() => setResend((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [step, resend]);
  useEffect(() => { if (!loading && user) router.replace(next); }, [loading, user, next, router]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const digits = (v) => String(v || "").replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d));
  const finish = (msg) => { toast(msg); router.replace(next); };

  // রেজিস্টার ধাপ ১: কোড পাঠানো
  const sendCode = async () => {
    setErr(""); setBusy(true);
    try {
      const r = await api("/otp/send/", { method: "POST", body: { phone: f.phone, purpose: "register" }, auth: false });
      setResend(r.resend_in || 60); setCode(""); setStep("otp");
    } catch (e2) {
      if (e2.data?.code === "otp_wait") { setResend(e2.data.retry_after || 60); setStep("otp"); }
      else if (e2.data?.code === "sms_unavailable" || e2.data?.code === "sms_failed") {
        // SMS সার্ভিস সমস্যায় থাকলে (এবং সার্ভারে OTP বাধ্যতামূলক না থাকলে) কোড ছাড়াই চেষ্টা
        try { await register({ name: f.name, phone: f.phone, email: f.email, password: f.password }); finish(t("অ্যাকাউন্ট তৈরি হয়েছে। স্বাগতম!", "Account created. Welcome!")); return; }
        catch { setErr(e2.message); }
      } else setErr(e2.message);
    } finally { setBusy(false); }
  };

  const submit = async (e) => {
    e.preventDefault(); setErr("");
    if (isReg && step === "form") {
      if (f.password.length < 6) { setErr(t("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।", "Password must be at least 6 characters.")); return; }
      await sendCode(); return;
    }
    setBusy(true);
    try {
      if (isReg) {
        const c = digits(code).trim();
        if (!/^\d{6}$/.test(c)) { setErr(t("৬ ডিজিটের কোড দিন", "Enter the 6-digit code")); setBusy(false); return; }
        await register({ name: f.name, phone: f.phone, email: f.email, password: f.password, code: c });
      } else await login(f.identifier, f.password);
      finish(isReg ? t("অ্যাকাউন্ট তৈরি হয়েছে। স্বাগতম!", "Account created. Welcome!") : t("লগইন সফল হয়েছে", "Logged in successfully"));
    } catch (e2) { setErr(e2.message); } finally { setBusy(false); }
  };
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <img src="/images/logo.jpg" alt="" className="auth-logo" />
        <h1>{isReg ? t("নতুন অ্যাকাউন্ট খুলুন", "Create an account") : t("আপনার অ্যাকাউন্টে লগইন", "Log in to your account")}</h1>
        <p className="muted">{isReg ? t("মাত্র কয়েক সেকেন্ডে অ্যাকাউন্ট খুলে অর্ডার করুন।", "Create an account in seconds and start ordering.") : t("অর্ডার করতে ও ট্র্যাক করতে লগইন করুন।", "Log in to place and track your orders.")}</p>
        <form onSubmit={submit}>
          {isReg && step === "otp" ? (
            <>
              <p className="muted">{t(`আমরা ${bn(f.phone)} নম্বরে ৬ ডিজিটের একটি কোড SMS করেছি। কোডটি দিয়ে অ্যাকাউন্ট তৈরি সম্পন্ন করুন।`, `We sent a 6-digit code by SMS to ${f.phone}. Enter it to finish creating your account.`)}</p>
              <div className="field"><input className="otp-input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} autoFocus placeholder="••••••" value={code} onChange={(e) => setCode(digits(e.target.value).replace(/\D/g, "").slice(0, 6))} /></div>
              <div className="otp-foot">
                <button type="button" disabled={resend > 0 || busy} onClick={sendCode}>{resend > 0 ? t(`${bn(resend)} সেকেন্ড পর আবার পাঠান`, `Resend in ${resend}s`) : t("আবার কোড পাঠান", "Resend code")}</button>
                <button type="button" disabled={busy} onClick={() => { setStep("form"); setErr(""); }}>{t("তথ্য/নম্বর পরিবর্তন", "Edit details")}</button>
              </div>
            </>
          ) : isReg ? (
            <>
              <div className="field"><label>{t("পূর্ণ নাম", "Full name")}</label><input required value={f.name} onChange={set("name")} autoComplete="name" /></div>
              <div className="field"><label>{t("মোবাইল নম্বর", "Mobile number")}</label><input required value={f.phone} onChange={set("phone")} inputMode="tel" placeholder="01XXXXXXXXX" autoComplete="tel" /></div>
              <div className="field"><label>{t("ইমেইল (ঐচ্ছিক)", "Email (optional)")}</label><input type="email" value={f.email} onChange={set("email")} autoComplete="email" /></div>
            </>
          ) : (
            <div className="field"><label>{t("মোবাইল নম্বর অথবা ইমেইল", "Mobile number or email")}</label><input required value={f.identifier} onChange={set("identifier")} autoComplete="username" placeholder="01XXXXXXXXX" /></div>
          )}
          {!(isReg && step === "otp") && <div className="field"><label>{t("পাসওয়ার্ড", "Password")}</label>
            <div className="pw"><input required minLength={isReg ? 6 : 1} type={show ? "text" : "password"} value={f.password} onChange={set("password")} autoComplete={isReg ? "new-password" : "current-password"} placeholder={isReg ? t("কমপক্ষে ৬ অক্ষর", "At least 6 characters") : ""} /><button type="button" onClick={() => setShow(!show)}>{show ? t("লুকান", "Hide") : t("দেখুন", "Show")}</button></div>
            {!isReg && <Link href="/forgot-password" className="u small forgot-link">{t("পাসওয়ার্ড ভুলে গেছেন?", "Forgot your password?")}</Link>}
          </div>}
          {err && <div className="alert alert-err">{err}</div>}
          <button className="btn btn-lg btn-block" disabled={busy}>{busy ? t("অপেক্ষা করুন…", "Please wait…") : isReg ? (step === "otp" ? t("যাচাই করে অ্যাকাউন্ট খুলুন", "Verify & create account") : t("কোড পাঠান ও এগিয়ে যান", "Send code & continue")) : t("লগইন করুন", "Log in")}</button>
        </form>
        <p className="center muted">{isReg ? t("আগে থেকেই অ্যাকাউন্ট আছে?", "Already have an account?") : t("নতুন কাস্টমার?", "New customer?")} <Link className="u" href={`${isReg ? "/login" : "/register"}?next=${encodeURIComponent(next)}`}>{isReg ? t("লগইন করুন", "Log in") : t("অ্যাকাউন্ট খুলুন", "Create account")}</Link></p>
      </div>
    </div>
  );
}
