"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DISTRICTS, districtName } from "@/lib/districts";
import { useAuth, useI18n, useToast } from "@/components/Providers";

const EMPTY = { label: "Home", name: "", phone: "", district: "Dhaka", address: "", is_default: false };

export default function Addresses() {
  const { user } = useAuth();
  const toast = useToast();
  const { t, en, lang, n: bn } = useI18n();
  const [list, setList] = useState(null);
  const [form, setForm] = useState(null);
  const load = () => api("/addresses/").then(setList).catch(() => setList([]));
  useEffect(() => { load(); }, []);
  const save = async (e) => {
    e.preventDefault();
    try {
      if (form.id) await api(`/addresses/${form.id}/`, { method: "PATCH", body: form });
      else await api("/addresses/", { method: "POST", body: form });
      setForm(null); load(); toast(t("ঠিকানা সেভ হয়েছে", "Address saved"));
    } catch (err) { toast(err.message, "err"); }
  };
  const del = async (id) => { if (confirm(t("ঠিকানাটি মুছবেন?", "Delete this address?"))) { await api(`/addresses/${id}/`, { method: "DELETE" }); load(); } };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <div className="card">
      <div className="od-head"><h3>{t("আমার ঠিকানা", "My addresses")}</h3>{!form && <button className="btn btn-sm" onClick={() => setForm({ ...EMPTY, name: user.name, phone: user.phone })}>{t("+ নতুন ঠিকানা", "+ New address")}</button>}</div>
      {form && (
        <form onSubmit={save} className="addr-form">
          <div className="form-grid">
            <div className="field"><label>{t("লেবেল", "Label")}</label><input value={form.label} onChange={set("label")} /></div>
            <div className="field"><label>{t("নাম", "Name")}</label><input required value={form.name} onChange={set("name")} /></div>
            <div className="field"><label>{t("মোবাইল", "Mobile")}</label><input required value={form.phone} onChange={set("phone")} /></div>
            <div className="field"><label>{t("জেলা", "District")}</label><select value={form.district} onChange={set("district")}>{DISTRICTS.map(([v, l]) => <option key={v} value={v}>{en ? v : l}</option>)}</select></div>
            <div className="field full"><label>{t("পূর্ণ ঠিকানা", "Full address")}</label><textarea required rows={2} value={form.address} onChange={set("address")} /></div>
          </div>
          <label className="check"><input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} /> {t("ডিফল্ট ঠিকানা", "Default address")}</label>
          <div className="row-gap"><button className="btn btn-sm">{t("সেভ", "Save")}</button><button type="button" className="btn btn-ghost btn-sm" onClick={() => setForm(null)}>{t("বাতিল", "Cancel")}</button></div>
        </form>
      )}
      {list === null ? <p className="muted">{t("লোড হচ্ছে…", "Loading…")}</p> : list.length === 0 && !form ? <p className="muted">{t("কোনো সেভ করা ঠিকানা নেই।", "No saved addresses.")}</p> : list.map((a) => (
        <div key={a.id} className="addr-row">
          <div><b>{a.label}</b> {a.is_default && <span className="pill pill-ok">{t("ডিফল্ট", "Default")}</span>}<br />{a.name} · {bn(a.phone)}<br /><span className="muted">{a.address}, {districtName(a.district, lang)}</span></div>
          <div className="row-gap"><button className="btn btn-ghost btn-sm" onClick={() => setForm(a)}>{t("এডিট", "Edit")}</button><button className="btn btn-ghost btn-sm" onClick={() => del(a.id)}>{t("মুছুন", "Delete")}</button></div>
        </div>
      ))}
    </div>
  );
}
