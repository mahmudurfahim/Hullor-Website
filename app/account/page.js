"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth, useI18n, useToast } from "@/components/Providers";

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const { t, date: dateBn } = useI18n();
  const [f, setF] = useState({ name: user.name, email: user.email || "" });
  const [pw, setPw] = useState({ old_password: "", new_password: "" });
  const [busy, setBusy] = useState(false);
  const save = async (e) => {
    e.preventDefault(); setBusy(true);
    try { setUser(await api("/auth/me/", { method: "PATCH", body: f })); toast(t("প্রোফাইল আপডেট হয়েছে", "Profile updated")); }
    catch (err) { toast(err.message, "err"); } finally { setBusy(false); }
  };
  const changePw = async (e) => {
    e.preventDefault();
    try { await api("/auth/change-password/", { method: "POST", body: pw }); setPw({ old_password: "", new_password: "" }); toast(t("পাসওয়ার্ড পরিবর্তন হয়েছে", "Password changed")); }
    catch (err) { toast(err.message, "err"); }
  };
  return (
    <div className="stack">
      <form className="card" onSubmit={save}>
        <h3>{t("প্রোফাইল", "Profile")}</h3>
        <div className="form-grid">
          <div className="field"><label>{t("নাম", "Name")}</label><input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div className="field"><label>{t("মোবাইল (পরিবর্তনযোগ্য নয়)", "Mobile (cannot be changed)")}</label><input value={user.phone} disabled /></div>
          <div className="field full"><label>{t("ইমেইল", "Email")}</label><input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        </div>
        <p className="muted small">{t("সদস্য হয়েছেন", "Member since")}: {dateBn(user.date_joined)}</p>
        <button className="btn" disabled={busy}>{t("সেভ করুন", "Save")}</button>
      </form>
      <form className="card" onSubmit={changePw}>
        <h3>{t("পাসওয়ার্ড পরিবর্তন", "Change password")}</h3>
        <div className="form-grid">
          <div className="field"><label>{t("বর্তমান পাসওয়ার্ড", "Current password")}</label><input type="password" required value={pw.old_password} onChange={(e) => setPw({ ...pw, old_password: e.target.value })} /></div>
          <div className="field"><label>{t("নতুন পাসওয়ার্ড", "New password")}</label><input type="password" required minLength={6} value={pw.new_password} onChange={(e) => setPw({ ...pw, new_password: e.target.value })} /></div>
        </div>
        <button className="btn btn-outline">{t("পরিবর্তন করুন", "Change")}</button>
      </form>
    </div>
  );
}
